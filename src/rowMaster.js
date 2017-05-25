const BASE_TOGGLE_CLASSNAME = "scrummer-row-toggle";
const ACTIVE_TOGGLE_CLASSNAME = BASE_TOGGLE_CLASSNAME + " active";

const toggleRow = (index) => {
  let rows = Array.prototype.slice.call(document.querySelectorAll('.ghx-swimlane'))
  .forEach((row, rowIndex) => {
    if (rowIndex === index) {
      row.style.display = "flex";
    } else {
      row.style.display = "none";
    }
  });
  let toggles = Array.prototype.slice.call(document.querySelectorAll('.'+BASE_TOGGLE_CLASSNAME))
  .forEach((toggle, toggleIndex) => {
    if (toggleIndex === index) {
    toggle.className = ACTIVE_TOGGLE_CLASSNAME;
    } else {
    toggle.className = BASE_TOGGLE_CLASSNAME;
    }
  });
}

const findOrInsertToggle = (parent, id, index) => {
  let toggle = parent.querySelector('#' + id);
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = id;
    toggle.className = BASE_TOGGLE_CLASSNAME;
    toggle.innerText = id;
    toggle.onclick = () => toggleRow(index);
    parent.appendChild(toggle);
  }
  return toggle;
}

const displayRowToggles = () => {
  let quickFiltersWrapper = document.querySelector('#js-work-quickfilters');

  // Array.slice can convert a NodeList to an array
  let rowsHeaders = Array.prototype.slice.call(document.querySelectorAll('.ghx-heading'))
  .forEach((rowHeader, index) => {
    let id = rowHeader.querySelector('span').innerText;
    findOrInsertToggle(quickFiltersWrapper, id, index);
  });

  toggleRow(0);
};

const checkForRows = () => {
  if (document.querySelectorAll('.ghx-heading').length > 0) {
    displayRowToggles();
  } else {
    toggleRow(0);
  }
}

let settings = {};

export default () => {
  chrome.storage.sync.get(null, (_settings) => {
    ['showLists']
    .forEach((option) => {
      if (_settings[option] === undefined) _settings[option] = true;
    });
    settings = _settings;

    // Launch the plugin by checking at a certain interval if any lists have been loaded.
    // Wait 1 second because some DOM rebuilding may happen late.
    setTimeout(checkForRows, 1000);
  });
};