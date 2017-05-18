const POINTS_SCALE = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];
const STORY_POINTS_REGEXP = /\((\?|\d+\.?,?\d*)\)/m;
const POST_POINTS_REGEXP = /\[(\?|\d+\.?,?\d*)\]/m;

const calculatePointsForList = (list) => {
  /*listChangeObserver.observe(list, {
    childList: true,
    characterData: false,
    attributes: false,
    subtree: true
  });
  listChangeObserver.observe(list.querySelector('.list-header-num-cards'), {
    attributes: true
  });*/

  // Array.slice can convert a NodeList to an array
  let listPoints = Array.prototype.slice.call(list.querySelectorAll('.ghx-issue'))
  .reduce((listPoints, list) => {
    let cardPoints = 1; //calculatePointsForCard(list);
    listPoints += cardPoints;
    return listPoints;
  }, 0);

  /*let listHeader = null;
  if (settings.showColumnTotals && (listHeader = list.querySelector('.js-list-header'))) {
    // Add or update points badges
    if (settings.showStoryPoints) {
      let badge = findOrInsertSpan(listHeader, 'scrummer-list-points', listHeader.querySelector('.js-list-name-input'));
      badge.textContent = formatPoints(listPoints.story);
    }
    if (settings.showPostPoints) {
      let badge = findOrInsertSpan(listHeader, 'scrummer-list-post-points', listHeader.querySelector('.js-list-name-input'));
      badge.textContent = formatPoints(listPoints.post);
    }
  }*/

  return listPoints;
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
  // Array.slice can convert a NodeList to an array
  let boardPoints = Array.prototype.slice.call(document.querySelectorAll('.ghx-column'))
  .reduce((boardPoints, list) => {
    let listPoints = calculatePointsForList(list);
    boardPoints += listPoints;
    return boardPoints;
  }, 0 );

  let boardHeader = null;
  if (settings.showBoardTotals && (boardHeader = document.querySelector('#ghx-view-selector>h1'))) {
    // Add or update points badges
    if (settings.showStoryPoints) {
      let badge = findOrInsertSpan(boardHeader, 'scrummer-board-points', boardHeader.querySelector('#ghx-board-name'));
      badge.textContent = formatPoints(boardPoints);
    }
  }

  /* listChangeObserver.observe(document.querySelector('.js-list-sortable'), {
    childList: true,
    characterData: false,
    attributes: false
  });*/ 
}

const checkForLists = () => {
  if (document.querySelectorAll('.ghx-columns').length > 0) {
    calculatePointsForBoard();
  } else {
    setTimeout(checkForLists, 300);
  }
}

let settings = {};
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