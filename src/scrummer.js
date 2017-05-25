const STORY_POINTS_REGEXP = /\[(\?|\d+\.?,?\d*)\]/m;

let debounceTimeout;

const debounce = (func, wait, immediate) => {
  return function () {
    let context = this, args = arguments;
    const later = () => {
      debounceTimeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !debounceTimeout;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const containsNodeWithClass = (nodeList, className) => {
  for (let i = 0; i < nodeList.length; i++) {
    if (nodeList[i].classList && nodeList[i].classList.contains(className)) {
      return true;
    }
  }
}

const calculatePointsForBoardDebounced = () => {
  debounce(calculatePointsForBoard, 100)();
}

let listChangeObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {

    // if the mutation was triggered by us adding or removing badges, do not recalculate
    if (
      (mutation.addedNodes.length === 1 && containsNodeWithClass(mutation.addedNodes, 'scrummer-points')) ||
      (mutation.addedNodes.length === 1 && containsNodeWithClass(mutation.addedNodes, 'scrummer-post-points')) ||
      (mutation.addedNodes.length === 1 && containsNodeWithClass(mutation.addedNodes, 'scrummer-card-id')) ||
      (mutation.removedNodes.length === 1 && containsNodeWithClass(mutation.removedNodes, 'scrummer-points')) ||
      (mutation.removedNodes.length === 1 && containsNodeWithClass(mutation.removedNodes, 'scrummer-post-points'))
    ) return;

    // If the list was modified, recalculate
    if (mutation.target.classList.contains('ghx-wrap-issue') ||
        mutation.target.classList.contains('ghx-subtask-group') ||
        mutation.target.classList.contains('ui-sortable')) {
      setTimeout(calculatePointsForBoardDebounced);
      return;
    }

    // If a single card's content is mutated
    if (mutation.target.classList.contains('ghx-issue')) {
      mutation.target.setAttribute('data-mutated', 1);

      setTimeout(calculatePointsForBoardDebounced);
    }
  });
});

const calculateStoryPointsForTitle = (title) => {
  if (!settings.showStoryPoints) return;
  let matches = title.match(STORY_POINTS_REGEXP);
  if (matches) {
    let points = matches[1];
    if (points === '?') return '?';
    return parseFloat(points.replace(',','.'));
  }
}

const removeIfExists = (parent, className) => {
  let element = parent.querySelector('.' + className);
  if (element) {
    element.parentNode.removeChild(element);
  }
}

const sanitizePoints = (points) => {
  if (points === '?') return 0;
  if (!points) return 0;
  return points;
}

const calculatePointsForCard = (card) => {
  let contentMutated = false;

  let cardNameElement = card.querySelector('.ghx-summary');
  if (!cardNameElement) {
    return 0;
  }

  let originalTitle = card.getAttribute('data-original-title');

  let cardShortId = card.querySelector('.ghx-issuekey-number');
  if (settings.showCardNumbers && !cardShortId.classList.contains('scrummer-card-id')) {
    cardShortId.classList.add('scrummer-card-id');
  }

  if (!originalTitle || cardNameElement.getAttribute('data-mutated') == 1) {
    originalTitle = cardNameElement.lastChild.textContent;
    cardNameElement.setAttribute('data-mutated', 0);
    card.setAttribute('data-original-title', originalTitle);
    contentMutated = true;
  }

  // if Jira sometimes drops our badge, we need to redraw
  if (card.getAttribute('data-calculated-points') !== null && !card.querySelector('.scrummer-points')) {
    contentMutated = true;
  }
  if (card.getAttribute('data-calculated-post-points') !== null && !card.querySelector('.scrummer-post-points')) {
    contentMutated = true;
  }

  if (!originalTitle) {
    return 0;
  }

  let calculatedPoints = calculateStoryPointsForTitle(originalTitle);

  if (
    !contentMutated &&
    card.getAttribute('data-calculated-points') == calculatedPoints
  ) {
    return calculatedPoints || 0;
  }

  if (calculatedPoints !== undefined) {
    let badgeElement = findOrInsertSpan(cardNameElement, 'scrummer-points', cardNameElement.lastChild);
    badgeElement.textContent = formatPoints(calculatedPoints);
    card.setAttribute('data-calculated-points', calculatedPoints);
  } else {
    removeIfExists(cardNameElement, 'scrummer-points');
  }

  let cleanedTitle = originalTitle;
  if (settings.showStoryPoints) cleanedTitle = cleanedTitle.replace(STORY_POINTS_REGEXP, '');
  cardNameElement.lastChild.textContent = cleanedTitle.trim();

  return sanitizePoints(calculatedPoints);
}

const calculatePointsForSubList = (subList) => {
  listChangeObserver.observe(subList, {
    childList: true,
    characterData: false,
    attributes: false,
    subtree: true
  });

  // Array.slice can convert a NodeList to an array
  let listPoints = Array.prototype.slice.call(subList.querySelectorAll('.ghx-issue'))
  .reduce((listPoints, card) => {
    let cardPoints = calculatePointsForCard(card);
    listPoints += cardPoints;
    return listPoints;
  }, 0);

  return listPoints;
}

const calculatePointsForSubLists = (subLists) => {
  let subListsPoints = new Array(subLists.childElementCount);

  // Array.slice can convert a NodeList to an array
  Array.prototype.slice.call(subLists.querySelectorAll('.ghx-column'))
  .forEach((subList, index) => {
    subListsPoints[index] = calculatePointsForSubList(subList);
  });

  return subListsPoints;
}

const calculatePointsForLists = () => {
  let listsHeaders = document.querySelector('.ghx-column-headers');

  // Array.slice can convert a NodeList to an array
  let listsPoints = Array.prototype.slice.call(document.querySelectorAll('.ghx-columns'))
  .reduce((listsPoints, subLists) => {
    let subListsPoints = calculatePointsForSubLists(subLists);
    return subListsPoints.map((listPoints, index) => {
      return listPoints + listsPoints[index];
    });
  }, new Array(listsHeaders.childElementCount).fill(0) );

  let listHeader = null;
  listsPoints.forEach((listPoints, index) => {
    if (settings.showColumnTotals && (listHeader = listsHeaders.children[index])) {
      // Add or update points badges
      if (settings.showStoryPoints) {
        let badge = findOrInsertSpan(listHeader, 'scrummer-list-points', listHeader.querySelector('h2'));
        badge.textContent = formatPoints(listPoints);
      }
    }
  });
  
  listChangeObserver.observe(document.querySelector('.ghx-work'), {
    childList: true,
    characterData: false,
    attributes: false
  });

  return listsPoints;
}

const findOrInsertSpan = (parent, className, insertBeforeElement) => {
  let span = parent.querySelector('.' + className);
  if (!span) {
    span = document.createElement('span');
    span.className = className;
    parent.insertBefore(span, insertBeforeElement);
  }
  return span;
}

const formatPoints = (points) => {
  if (points === '?') return '?';
  return Math.round(points * 10) / 10;
}

const calculatePointsForBoard = () => {
  let boardPoints = calculatePointsForLists().reduce((boardPoints, pointsForList) => {
    boardPoints += pointsForList;
    return boardPoints;
  }, 0);

  let boardHeader = null;
  if (settings.showBoardTotals && (boardHeader = document.querySelector('#ghx-view-selector>h1'))) {
    // Add or update points badges
    if (settings.showStoryPoints) {
      let badge = findOrInsertSpan(boardHeader, 'scrummer-board-points', boardHeader.querySelector('#ghx-board-name'));
      badge.textContent = formatPoints(boardPoints);
    }
  }
}

const checkForLists = () => {
  if (document.querySelectorAll('.ghx-columns').length > 0) {
    calculatePointsForBoard();
  } else {
    setTimeout(checkForLists, 300);
  }
}

let settings = {};

export default () => {
  chrome.storage.sync.get(null, (_settings) => {
    ['showCardNumbers', 'showStoryPoints', 'showColumnTotals', 'showBoardTotals']
    .forEach((option) => {
      if (_settings[option] === undefined) _settings[option] = true;
    });
    settings = _settings;

    // Launch the plugin by checking at a certain interval if any lists have been loaded.
    // Wait 1 second because some DOM rebuilding may happen late.
    setTimeout(checkForLists, 1000);
  });
};
