/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!*************************!*\
  !*** ./inject/index.js ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar POINTS_SCALE = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];\nvar STORY_POINTS_REGEXP = /\\((\\?|\\d+\\.?,?\\d*)\\)/m;\nvar POST_POINTS_REGEXP = /\\[(\\?|\\d+\\.?,?\\d*)\\]/m;\n\nvar calculatePointsForList = function calculatePointsForList(list) {\n  /*listChangeObserver.observe(list, {\n    childList: true,\n    characterData: false,\n    attributes: false,\n    subtree: true\n  });\n  listChangeObserver.observe(list.querySelector('.list-header-num-cards'), {\n    attributes: true\n  });*/\n\n  // Array.slice can convert a NodeList to an array\n  var listPoints = Array.prototype.slice.call(list.querySelectorAll('.ghx-issue')).reduce(function (listPoints, list) {\n    var cardPoints = 1; //calculatePointsForCard(list);\n    listPoints += cardPoints;\n    return listPoints;\n  }, 0);\n\n  /*let listHeader = null;\n  if (settings.showColumnTotals && (listHeader = list.querySelector('.js-list-header'))) {\n    // Add or update points badges\n    if (settings.showStoryPoints) {\n      let badge = findOrInsertSpan(listHeader, 'scrummer-list-points', listHeader.querySelector('.js-list-name-input'));\n      badge.textContent = formatPoints(listPoints.story);\n    }\n    if (settings.showPostPoints) {\n      let badge = findOrInsertSpan(listHeader, 'scrummer-list-post-points', listHeader.querySelector('.js-list-name-input'));\n      badge.textContent = formatPoints(listPoints.post);\n    }\n  }*/\n\n  return listPoints;\n};\n\nvar findOrInsertSpan = function findOrInsertSpan(parent, className, insertBeforeElement) {\n  var span = parent.querySelector('.' + className);\n  if (!span) {\n    span = document.createElement('span');\n    span.className = className;\n    parent.insertBefore(span, insertBeforeElement);\n  }\n  return span;\n};\n\nvar formatPoints = function formatPoints(points) {\n  if (points === '?') return '?';\n  return Math.round(points * 10) / 10;\n};\n\nvar calculatePointsForBoard = function calculatePointsForBoard() {\n  // Array.slice can convert a NodeList to an array\n  var boardPoints = Array.prototype.slice.call(document.querySelectorAll('.ghx-column')).reduce(function (boardPoints, list) {\n    var listPoints = calculatePointsForList(list);\n    boardPoints += listPoints;\n    return boardPoints;\n  }, 0);\n\n  var boardHeader = null;\n  if (settings.showBoardTotals && (boardHeader = document.querySelector('#ghx-view-selector>h1'))) {\n    // Add or update points badges\n    if (settings.showStoryPoints) {\n      var badge = findOrInsertSpan(boardHeader, 'scrummer-board-points', boardHeader.querySelector('#ghx-board-name'));\n      badge.textContent = formatPoints(boardPoints);\n    }\n  }\n\n  /* listChangeObserver.observe(document.querySelector('.js-list-sortable'), {\n    childList: true,\n    characterData: false,\n    attributes: false\n  });*/\n};\n\nvar checkForLists = function checkForLists() {\n  if (document.querySelectorAll('.ghx-columns').length > 0) {\n    calculatePointsForBoard();\n  } else {\n    setTimeout(checkForLists, 300);\n  }\n};\n\nvar settings = {};\nchrome.storage.sync.get(null, function (_settings) {\n  ['showCardNumbers', 'showStoryPoints', 'showColumnTotals', 'showBoardTotals'].forEach(function (option) {\n    if (_settings[option] === undefined) _settings[option] = true;\n  });\n  settings = _settings;\n\n  // Launch the plugin by checking at a certain interval if any lists have been loaded.\n  // Wait 1 second because some DOM rebuilding may happen late.\n  setTimeout(checkForLists, 1000);\n});//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9pbmplY3QvaW5kZXguanM/ZTViNCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQT0lOVFNfU0NBTEUgPSBbMCwgMC41LCAxLCAyLCAzLCA1LCA4LCAxMywgMjAsIDQwLCAxMDBdO1xuY29uc3QgU1RPUllfUE9JTlRTX1JFR0VYUCA9IC9cXCgoXFw/fFxcZCtcXC4/LD9cXGQqKVxcKS9tO1xuY29uc3QgUE9TVF9QT0lOVFNfUkVHRVhQID0gL1xcWyhcXD98XFxkK1xcLj8sP1xcZCopXFxdL207XG5cbmNvbnN0IGNhbGN1bGF0ZVBvaW50c0Zvckxpc3QgPSAobGlzdCkgPT4ge1xuICAvKmxpc3RDaGFuZ2VPYnNlcnZlci5vYnNlcnZlKGxpc3QsIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgY2hhcmFjdGVyRGF0YTogZmFsc2UsXG4gICAgYXR0cmlidXRlczogZmFsc2UsXG4gICAgc3VidHJlZTogdHJ1ZVxuICB9KTtcbiAgbGlzdENoYW5nZU9ic2VydmVyLm9ic2VydmUobGlzdC5xdWVyeVNlbGVjdG9yKCcubGlzdC1oZWFkZXItbnVtLWNhcmRzJyksIHtcbiAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gIH0pOyovXG5cbiAgLy8gQXJyYXkuc2xpY2UgY2FuIGNvbnZlcnQgYSBOb2RlTGlzdCB0byBhbiBhcnJheVxuICBsZXQgbGlzdFBvaW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmdoeC1pc3N1ZScpKVxuICAucmVkdWNlKChsaXN0UG9pbnRzLCBsaXN0KSA9PiB7XG4gICAgbGV0IGNhcmRQb2ludHMgPSAxOyAvL2NhbGN1bGF0ZVBvaW50c0ZvckNhcmQobGlzdCk7XG4gICAgbGlzdFBvaW50cyArPSBjYXJkUG9pbnRzO1xuICAgIHJldHVybiBsaXN0UG9pbnRzO1xuICB9LCAwKTtcblxuICAvKmxldCBsaXN0SGVhZGVyID0gbnVsbDtcbiAgaWYgKHNldHRpbmdzLnNob3dDb2x1bW5Ub3RhbHMgJiYgKGxpc3RIZWFkZXIgPSBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5qcy1saXN0LWhlYWRlcicpKSkge1xuICAgIC8vIEFkZCBvciB1cGRhdGUgcG9pbnRzIGJhZGdlc1xuICAgIGlmIChzZXR0aW5ncy5zaG93U3RvcnlQb2ludHMpIHtcbiAgICAgIGxldCBiYWRnZSA9IGZpbmRPckluc2VydFNwYW4obGlzdEhlYWRlciwgJ3NjcnVtbWVyLWxpc3QtcG9pbnRzJywgbGlzdEhlYWRlci5xdWVyeVNlbGVjdG9yKCcuanMtbGlzdC1uYW1lLWlucHV0JykpO1xuICAgICAgYmFkZ2UudGV4dENvbnRlbnQgPSBmb3JtYXRQb2ludHMobGlzdFBvaW50cy5zdG9yeSk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5zaG93UG9zdFBvaW50cykge1xuICAgICAgbGV0IGJhZGdlID0gZmluZE9ySW5zZXJ0U3BhbihsaXN0SGVhZGVyLCAnc2NydW1tZXItbGlzdC1wb3N0LXBvaW50cycsIGxpc3RIZWFkZXIucXVlcnlTZWxlY3RvcignLmpzLWxpc3QtbmFtZS1pbnB1dCcpKTtcbiAgICAgIGJhZGdlLnRleHRDb250ZW50ID0gZm9ybWF0UG9pbnRzKGxpc3RQb2ludHMucG9zdCk7XG4gICAgfVxuICB9Ki9cblxuICByZXR1cm4gbGlzdFBvaW50cztcbn1cblxuY29uc3QgZmluZE9ySW5zZXJ0U3BhbiA9IChwYXJlbnQsIGNsYXNzTmFtZSwgaW5zZXJ0QmVmb3JlRWxlbWVudCkgPT4ge1xuICBsZXQgc3BhbiA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuJyArIGNsYXNzTmFtZSk7XG4gIGlmICghc3Bhbikge1xuICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc3Bhbi5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShzcGFuLCBpbnNlcnRCZWZvcmVFbGVtZW50KTtcbiAgfVxuICByZXR1cm4gc3Bhbjtcbn1cblxuY29uc3QgZm9ybWF0UG9pbnRzID0gKHBvaW50cykgPT4ge1xuICBpZiAocG9pbnRzID09PSAnPycpIHJldHVybiAnPyc7XG4gIHJldHVybiBNYXRoLnJvdW5kKHBvaW50cyAqIDEwKSAvIDEwO1xufVxuXG5jb25zdCBjYWxjdWxhdGVQb2ludHNGb3JCb2FyZCA9ICgpID0+IHtcbiAgLy8gQXJyYXkuc2xpY2UgY2FuIGNvbnZlcnQgYSBOb2RlTGlzdCB0byBhbiBhcnJheVxuICBsZXQgYm9hcmRQb2ludHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ2h4LWNvbHVtbicpKVxuICAucmVkdWNlKChib2FyZFBvaW50cywgbGlzdCkgPT4ge1xuICAgIGxldCBsaXN0UG9pbnRzID0gY2FsY3VsYXRlUG9pbnRzRm9yTGlzdChsaXN0KTtcbiAgICBib2FyZFBvaW50cyArPSBsaXN0UG9pbnRzO1xuICAgIHJldHVybiBib2FyZFBvaW50cztcbiAgfSwgMCApO1xuXG4gIGxldCBib2FyZEhlYWRlciA9IG51bGw7XG4gIGlmIChzZXR0aW5ncy5zaG93Qm9hcmRUb3RhbHMgJiYgKGJvYXJkSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2doeC12aWV3LXNlbGVjdG9yPmgxJykpKSB7XG4gICAgLy8gQWRkIG9yIHVwZGF0ZSBwb2ludHMgYmFkZ2VzXG4gICAgaWYgKHNldHRpbmdzLnNob3dTdG9yeVBvaW50cykge1xuICAgICAgbGV0IGJhZGdlID0gZmluZE9ySW5zZXJ0U3Bhbihib2FyZEhlYWRlciwgJ3NjcnVtbWVyLWJvYXJkLXBvaW50cycsIGJvYXJkSGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJyNnaHgtYm9hcmQtbmFtZScpKTtcbiAgICAgIGJhZGdlLnRleHRDb250ZW50ID0gZm9ybWF0UG9pbnRzKGJvYXJkUG9pbnRzKTtcbiAgICB9XG4gIH1cblxuICAvKiBsaXN0Q2hhbmdlT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbGlzdC1zb3J0YWJsZScpLCB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIGNoYXJhY3RlckRhdGE6IGZhbHNlLFxuICAgIGF0dHJpYnV0ZXM6IGZhbHNlXG4gIH0pOyovIFxufVxuXG5jb25zdCBjaGVja0Zvckxpc3RzID0gKCkgPT4ge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdoeC1jb2x1bW5zJykubGVuZ3RoID4gMCkge1xuICAgIGNhbGN1bGF0ZVBvaW50c0ZvckJvYXJkKCk7XG4gIH0gZWxzZSB7XG4gICAgc2V0VGltZW91dChjaGVja0Zvckxpc3RzLCAzMDApO1xuICB9XG59XG5cbmxldCBzZXR0aW5ncyA9IHt9O1xuY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQobnVsbCwgKF9zZXR0aW5ncykgPT4ge1xuICBbJ3Nob3dDYXJkTnVtYmVycycsICdzaG93U3RvcnlQb2ludHMnLCAnc2hvd0NvbHVtblRvdGFscycsICdzaG93Qm9hcmRUb3RhbHMnXVxuICAuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgaWYgKF9zZXR0aW5nc1tvcHRpb25dID09PSB1bmRlZmluZWQpIF9zZXR0aW5nc1tvcHRpb25dID0gdHJ1ZTtcbiAgfSk7XG4gIHNldHRpbmdzID0gX3NldHRpbmdzO1xuXG4gIC8vIExhdW5jaCB0aGUgcGx1Z2luIGJ5IGNoZWNraW5nIGF0IGEgY2VydGFpbiBpbnRlcnZhbCBpZiBhbnkgbGlzdHMgaGF2ZSBiZWVuIGxvYWRlZC5cbiAgLy8gV2FpdCAxIHNlY29uZCBiZWNhdXNlIHNvbWUgRE9NIHJlYnVpbGRpbmcgbWF5IGhhcHBlbiBsYXRlLlxuICBzZXRUaW1lb3V0KGNoZWNrRm9yTGlzdHMsIDEwMDApO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGluamVjdC9pbmRleC5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUFVQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ })
/******/ ]);