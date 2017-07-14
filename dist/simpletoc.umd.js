var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.simpletoc = factory();
})(this, function () {
  'use strict';

  var domList_1 = domList;

  function domList(tree) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$type = options.type,
        type = _options$type === undefined ? 'ol' : _options$type,
        _options$className = options.className,
        className = _options$className === undefined ? 'simpletoc' : _options$className,
        _options$getId = options.getId,
        getId = _options$getId === undefined ? _getId : _options$getId,
        _options$getAnchor = options.getAnchor,
        getAnchor = _options$getAnchor === undefined ? _getAnchor : _options$getAnchor;


    var list = document.createElement(type);

    list.classList.add(className);

    return tree.reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          el = _ref2[0],
          children = _ref2[1];

      var li = document.createElement('li');

      el.id = getId(el, children);

      li.appendChild(getAnchor(el, children));

      if (children) li.appendChild(domList(children, options));

      acc.appendChild(li);

      return acc;
    }, list);
  }

  function _getId(el) {
    return el.id ? el.id : el.textContent.toLowerCase().replace(/\s+/g, '-');
  }

  function _getAnchor(el) {
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

    return i < arr.length && fn(arr[i], i, arr) ? takeWhile(fn, arr, ++i) : arr.slice(0, i);
  }

  var tree_1 = tree;

  /**
   * Creates a tree of nested arrays based on `arr` data and `fn` criteria.
   * Elements are compared against their left neighbour using `fn` which is
   * invoked with these arguments: (current, next). If the invocation returns
   * truthy `next`, will be nested into `current`, `next` will be placed at the
   * same level of`current` otherwise.
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


    removeChildren(document.querySelector(target)).appendChild(domList_1(tree_1(Array.from(document.querySelector(root).querySelectorAll(selector)), compare), options));
  }

  function removeChildren(el) {
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }return el;
  }

  var mdList_1 = mdList;

  function mdList(tree) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var _options$getRef = options.getRef,
        getRef = _options$getRef === undefined ? _getRef : _options$getRef,
        _options$getText = options.getText,
        getText = _options$getText === undefined ? _getText : _options$getText,
        _options$type2 = options.type,
        type = _options$type2 === undefined ? 'ol' : _options$type2;


    return tree.reduce(function (acc, _ref5, i) {
      var _ref6 = _slicedToArray(_ref5, 2),
          el = _ref6[0],
          children = _ref6[1];

      if (!el) return acc;

      var pad = ' '.repeat(depth * 4);
      var bullet = type === 'ol' ? i + 1 + '.' : '*';
      var text = getText(el);
      var link = getRef(text);
      var line = '' + pad + bullet + ' [' + text + '](#' + link + ')';

      acc.push(line);

      if (children) acc.push(mdList(children, options, depth + 1));

      return acc;
    }, []).join('\n');
  }

  function _getText(line) {
    // Strip away the heading markup,
    // and also strip away any link markup because nested links are not possible
    return line.replace(/^#+ +/, '').replace(/\[(.+?)\]\(.+?\)/, '$1');
  }

  function _getRef(text) {
    // This pretty much matches how github generates its headings references
    return text.trim().toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s/g, '-');
  }

  var mdToc_1 = mdToc;

  function mdToc(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$compare2 = options.compare,
        compare = _options$compare2 === undefined ? _compare : _options$compare2,
        _options$extract = options.extract,
        extract = _options$extract === undefined ? _extract : _options$extract,
        _options$target2 = options.target,
        target = _options$target2 === undefined ? /^TOC$/m : _options$target2;

    return text.replace(target, mdList_1(tree_1(extract(text), compare), options));
  }

  function _extract(text) {
    var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /^#+ .*$/gm;

    // Strip code blocks away,
    // because bash-style comments can be treated as headings
    return text.replace(/```[\S\s]+?```/g, '').match(pattern) || [];
  }

  function _compare(current, next) {
    var pattern = /^#+/;
    return next.match(pattern)[0] > current.match(pattern)[0];
  }

  var simpletoc = {
    domList: domList_1,
    domToc: domToc_1,
    mdList: mdList_1,
    mdToc: mdToc_1,
    tree: tree_1
  };

  return simpletoc;
});

