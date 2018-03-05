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
function domList (tree, options = {}) {
  const {
    type = 'ol',
    className = 'simpletoc',
    getId = defaultGetId,
    getAnchor = defaultGetAnchor
  } = options;

  const list = document.createElement(type);

  list.classList.add(className);

  return tree.reduce((acc, [el, children]) => {
    const li = document.createElement('li');

    // Required override of eslint-config-airbnb for DOM manipulation.
    // See: https://github.com/airbnb/javascript/issues/766
    // eslint-disable-next-line no-param-reassign
    el.id = getId(el, children);

    li.appendChild(getAnchor(el, children));

    if (children) li.appendChild(domList(children, options));

    acc.appendChild(li);

    return acc
  }, list)
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
function defaultGetId (el) {
  return el.id ? el.id : el.textContent.toLowerCase().replace(/\s+/g, '-')
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
function defaultGetAnchor (el) {
  const a = document.createElement('a');

  a.href = `#${el.id}`;
  a.textContent = el.textContent;

  return a
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
function takeWhile (fn, arr, i = 0) {
  return i < arr.length && fn(arr[i], i, arr)
    ? takeWhile(fn, arr, i + 1)
    : arr.slice(0, i)
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
function tree ([current, ...rest], fn) {
  const children = takeWhile_1(fn.bind(null, current), rest);
  const result = children.length ? [current, tree(children, fn)] : [current];

  return rest.length - children.length
    ? [result, ...tree(rest.slice(children.length), fn)]
    : [result]
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
function domToc (options = {}) {
  const {
    compare = (current, next) => next.tagName > current.tagName,
    root = 'body',
    selector = 'h1,h2,h3,h4,h5,h6',
    target = '[simpletoc]'
  } = options;

  return removeChildren(document.querySelector(target)).appendChild(domList_1(
    tree_1(
      Array.from(document.querySelector(root).querySelectorAll(selector)),
      compare
    ),
    options
  ))
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
function removeChildren (el) {
  while (el.lastChild) el.removeChild(el.lastChild);
  return el
}

var simpletocDom = {
  domList: domList_1,
  domToc: domToc_1,
  tree: tree_1
};
var simpletocDom_1 = simpletocDom.domList;
var simpletocDom_2 = simpletocDom.domToc;
var simpletocDom_3 = simpletocDom.tree;

export default simpletocDom;
export { simpletocDom_1 as domList, simpletocDom_2 as domToc, simpletocDom_3 as tree };
