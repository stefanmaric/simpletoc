var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.simpletoc = {});
})(this, function (exports) {
  'use strict';

  var domList_1 = domList;

  /**
   * Given a tree of DOM elements, creates a new list of anchors which point to
   * the DOM elements.
   *
   * @static
   * @param {Array} tree Array of nested arrays representing a tree.
   * @param {Object} [options] Options object.
   * @param {string} [options.type='ol'] Type of DOM element to use.
   * @param {string|Array} [options.className='simpletoc'] Class(es) for the list.
   * @param {Function} [options.getId] Function to generate an id.
   * @param {Function} [options.getAnchor] Function to generate an anchor DOM
   * element.
   * @returns {HTMLElement} A new HTMLUListElement.
   * @example
   *
   * function createHeading (level, text, id) {
   *   return document
   *     .createRange()
   *     .createContextualFragment(`<h${level} id="${id}">${text}</h${level}>`)
   *     .firstElementChild
   * }
   *
   * const tree = [
   *   [createHeading(1, 'First', '1'), [
   *     [createHeading(2, 'Second', '2')]
   *   ]],
   *   [createHeading(1, 'Third', '3')]
   * ]
   *
   * domList(tree)
   * // => <ol class="simpletoc">
   * //      <li><a href="#1">First</a>
   * //        <ol class="simpletoc">
   * //          <li><a href="#2">Second</a></li>
   * //        </ol>
   * //      </li>
   * //      <li><a href="#3">Third</a></li>
   * //    </ol>
   */
  function domList(tree) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$type = options.type,
        type = _options$type === undefined ? 'ol' : _options$type,
        _options$className = options.className,
        className = _options$className === undefined ? 'simpletoc' : _options$className,
        _options$getId = options.getId,
        getId = _options$getId === undefined ? defaultGetId : _options$getId,
        _options$getAnchor = options.getAnchor,
        getAnchor = _options$getAnchor === undefined ? defaultGetAnchor : _options$getAnchor;


    var list = document.createElement(type);

    list.classList.add(className);

    return tree.reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          el = _ref2[0],
          children = _ref2[1];

      var li = document.createElement('li');

      // Required override of eslint-config-airbnb for DOM manipulation.
      // See: https://github.com/airbnb/javascript/issues/766
      // eslint-disable-next-line no-param-reassign
      el.id = getId(el, children);

      li.appendChild(getAnchor(el, children));

      if (children) li.appendChild(domList(children, options));

      acc.appendChild(li);

      return acc;
    }, list);
  }

  /**
   * Given an DOM element, returns its id or generates one based on its
   * textContent.
   *
   * @static
   * @protected
   * @memberof domList
   * @param {HTMLElement} el The DOM element.
   * @returns {string} An id.
   * @example
   *
   * const heading = document
   *   .createRange()
   *   .createContextualFragment('<h1>This is a Heading</h1>')
   *   .firstElementChild
   *
   * defaultGetId(heading)
   * //=> "this-is-a-heading"
   *
   * heading.id = 'custom-id'
   *
   * defaultGetId(heading)
   * // => "custom-id"
   */
  function defaultGetId(el) {
    return el.id ? el.id : el.textContent.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Given an DOM element, returns a new anchor element that points to `el`'s id.
   *
   * @static
   * @protected
   * @memberof domList
   * @param {HTMLElement} el The DOM element.
   * @returns {HTMLElement} A new anchor element.
   * @example
   *
   * const heading = document
   *   .createRange()
   *   .createContextualFragment('<h1 id="custom-id">This is a Heading</h1>')
   *   .firstElementChild
   *
   * defaultGetAnchor(heading)
   * // => <a href="#custom-id">This is a Heading</a>
   */
  function defaultGetAnchor(el) {
    var a = document.createElement('a');

    a.href = '#' + el.id;
    a.textContent = el.textContent;

    return a;
  }

  var takeWhile_1 = takeWhile;

  /**
   * Creates a slice of `arr` with elements taken from the beginning. Elements are
   * taken until `predicate` returns falsey. The predicate is invoked with three
   * arguments: (value, index, arr).
   *
   * @static
   * @private
   * @param {Function} fn The function invoked per iteration.
   * @param {Array} arr The array to query.
   * @returns {Array} Returns the slice of `arr`.
   * @example
   *
   * const users = [
   *   { user: 'john', active: false },
   *   { user: 'mike', active: false },
   *   { user: 'berto', active: true }
   * ]
   *
   * takeWhile(u => !u.active, users)
   * // => [{ user: 'john', active: false }, { user: 'mike', active: false }]
   */
  function takeWhile(fn, arr) {
    var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return i < arr.length && fn(arr[i], i, arr) ? takeWhile(fn, arr, i + 1) : arr.slice(0, i);
  }

  var tree_1 = tree;

  /**
   * Creates a tree of nested arrays based on `arr` data and `fn` criteria.
   * Elements are compared against their left neighbour using `fn` which is
   * invoked with these arguments: (current, next). If the invocation returns
   * truthy, `next` will be nested into `current`, `next` will be placed at the
   * same level of `current` otherwise.
   *
   * @static
   * @param {Array} arr The array to structure as tree.
   * @param {Function} fn The function invoked per item in the array.
   * @returns {Array} Returns an array of arrays representing the tree.
   * @example
   *
   * const levels = [
   *   5,
   *   3,
   *   2,
   *   5,
   *   4
   * ]
   *
   * function comparator (current, next) {
   *   return next < current
   * }
   *
   * tree(levels, comparator)
   * // => [ [ 5, [ [ 3, [ [ 2 ] ] ] ] ], [ 5, [ [ 4 ] ] ] ]
   */
  function tree(_ref3, fn) {
    var _ref4 = _toArray(_ref3),
        current = _ref4[0],
        rest = _ref4.slice(1);

    var children = takeWhile_1(fn.bind(null, current), rest);
    var result = children.length ? [current, tree(children, fn)] : [current];

    return rest.length - children.length ? [result].concat(_toConsumableArray(tree(rest.slice(children.length), fn))) : [result];
  }

  var domToc_1 = domToc;

  /**
   * Handy function to automagically generate a table of contents based on the
   * document and (optional) CSS selectors, and attach it somewhere in the DOM
   * (by default to an element with the "simpletoc" attribute).
   *
   * @static
   * @param {Object} [options] Options object.
   * @param {Function} [options.compare] Function used to compare hierarchy of
   * heading elements.
   * @param {string} [options.root='body'] CSS selector to scope the search of
   * headings.
   * @param {string} [options.selector='h1,h2,h3,h4,h5,h6'] CSS selector to search
   * for headings.
   * @param {string} [options.target='[simpletoc]'] CSS selector to seach for the
   * element where the TOC is going to be attached.
   * @returns {HTMLElement} A new HTMLUListElement generated by {@link #domlist}.
   * @example
   *
   * domToc()
   * // => <ol class="simpletoc">
   * //      <li><a href="#1">First</a>
   * //        <ol class="simpletoc">
   * //          <li><a href="#2">Second</a></li>
   * //        </ol>
   * //      </li>
   * //      <li><a href="#3">Third</a></li>
   * //    </ol>
   */
  function domToc() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$compare = options.compare,
        compare = _options$compare === undefined ? function (current, next) {
      return next.tagName > current.tagName;
    } : _options$compare,
        _options$root = options.root,
        root = _options$root === undefined ? 'body' : _options$root,
        _options$selector = options.selector,
        selector = _options$selector === undefined ? 'h1,h2,h3,h4,h5,h6' : _options$selector,
        _options$target = options.target,
        target = _options$target === undefined ? '[simpletoc]' : _options$target;


    return removeChildren(document.querySelector(target)).appendChild(domList_1(tree_1(Array.from(document.querySelector(root).querySelectorAll(selector)), compare), options));
  }

  /**
   * Remove all children of `el` and return it.
   *
   * @static
   * @private
   * @memberof domToc
   * @param {HTMLElement} el The DOM element.
   * @return {HTMLElement} The input DOM element without children.
   */
  function removeChildren(el) {
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }return el;
  }

  var simpletocDom = {
    domList: domList_1,
    domToc: domToc_1,
    tree: tree_1
  };
  var simpletocDom_1 = simpletocDom.domList;
  var simpletocDom_2 = simpletocDom.domToc;
  var simpletocDom_3 = simpletocDom.tree;

  exports.default = simpletocDom;
  exports.domList = simpletocDom_1;
  exports.domToc = simpletocDom_2;
  exports.tree = simpletocDom_3;

  Object.defineProperty(exports, '__esModule', { value: true });
});

