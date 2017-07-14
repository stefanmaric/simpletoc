var domList_1 = domList;

function domList (tree, options = {}) {
  const {
    type = 'ol',
    className = 'simpletoc',
    getId = _getId,
    getAnchor = _getAnchor
  } = options;

  const list = document.createElement(type);

  list.classList.add(className);

  return tree.reduce((acc, [el, children]) => {
    const li = document.createElement('li');

    el.id = getId(el, children);

    li.appendChild(getAnchor(el, children));

    if (children) li.appendChild(domList(children, options));

    acc.appendChild(li);

    return acc
  }, list)
}

function _getId (el) {
  return el.id ? el.id : el.textContent.toLowerCase().replace(/\s+/g, '-')
}

function _getAnchor (el) {
  const a = document.createElement('a');

  a.href = '#' + el.id;
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
    ? takeWhile(fn, arr, ++i)
    : arr.slice(0, i)
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
function tree ([current, ...rest], fn) {
  const children = takeWhile_1(fn.bind(null, current), rest);
  const result = children.length ? [current, tree(children, fn)] : [current];

  return rest.length - children.length
    ? [result, ...tree(rest.slice(children.length), fn)]
    : [result]
}

var domToc_1 = domToc;

function domToc (options = {}) {
  const {
    compare = (current, next) => next.tagName > current.tagName,
    root = 'body',
    selector = 'h1,h2,h3,h4,h5,h6',
    target = '[simpletoc]'
  } = options;

  removeChildren(document.querySelector(target)).appendChild(
    domList_1(
      tree_1(
        Array.from(document.querySelector(root).querySelectorAll(selector)),
        compare
      ),
      options
    )
  );
}

function removeChildren (el) {
  while (el.lastChild) el.removeChild(el.lastChild);
  return el
}

var simpletocDom = {
  domList: domList_1,
  domToc: domToc_1,
  tree: tree_1
};

export default simpletocDom;
