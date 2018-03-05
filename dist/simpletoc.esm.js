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

var mdList_1 = mdList;

/**
 * Given a tree of markdown headings, creates a markdown list of references that
 * point to those headings.
 *
 * @static
 * @param {Array} tree Array of nested arrays representing a tree.
 * @param {Object} [options] Options object.
 * @param {string} [options.type='ol'] Type of list to use, ordered or
 * unordered.
 * @param {Function} [options.getRef] Function to generate a markdown reference.
 * @param {Function} [options.getText] Function to generate the display text of
 * the reference.
 * @param {number} [depth=0] Initial level of indentation.
 * @returns {string} A new markdown list.
 * @example
 *
 * const tree = [
 *   ['# First', [
 *     ['## Second', [
 *       ['### Third']
 *     ]]
 *   ]],
 *   ['# Fourth', [
 *     ['## Fifth']
 *   ]]
 * ]
 *
 * mdList(tree)
 * // => "1. [First](#first)
 * //         1. [Second](#second)
 * //             1. [Third](#third)
 * //     2. [Fourth](#fourth)
 * //         1. [Fifth](#fifth)"
 *
 * mdList(tree, { type: 'ul' })
 * // => "* [First](#first)
 * //         * [Second](#second)
 * //             * [Third](#third)
 * //     * [Fourth](#fourth)
 * //         * [Fifth](#fifth)"
 */
function mdList (tree, options = {}, depth = 0) {
  const {
    getRef = defaultGetRef,
    getText = defaultGetText,
    type = 'ol'
  } = options;

  return tree
    .reduce((acc, [el, children], i) => {
      if (!el) return acc

      const pad = ' '.repeat(depth * 4);
      const bullet = type === 'ol' ? `${i + 1}.` : '*';
      const text = getText(el);
      const link = getRef(text);
      const line = `${pad}${bullet} [${text}](#${link})`;

      acc.push(line);

      if (children) acc.push(mdList(children, options, depth + 1));

      return acc
    }, [])
    .join('\n')
}

/**
 * Given a line representing a markdown heading, returns its text ready for use
 * as a reference text.
 *
 * @static
 * @memberof mdList
 * @param {string} line Markdown heading.
 * @return {string} Heading's text ready to be used as ref text.
 * @example
 *
 * defaultGetText('## This is a heading')
 * // => "This is a heading"
 *
 * defaultGetText('## This is [a link](http://example.com) inside a heading')
 * // => "This is a link inside a heading"
 */
function defaultGetText (line) {
  // Strip away the heading markup,
  // and also strip away any link markup because nested links are not possible
  return line.replace(/^#+ +/, '').replace(/\[(.+?)\]\(.+?\)/, '$1')
}

/**
 * Given a Markdown heading's text, returns a reference as generated by the
 * Github Flavored Markdown.
 *
 * @static
 * @memberof mdList
 * @param {string} text Heading text to parse.
 * @return {string} A markdown reference.
 * @example
 *
 * defaultGetRef('This is a heading text')
 * // => "this-is-a-heading-text"
 *
 * defaultGetRef('This is a heading text with $ sign and ! mark.')
 * // => "this-is-a-heading-text-with--sign-and--mark"
 */
function defaultGetRef (text) {
  // This pretty much matches how github generates its headings references
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s/g, '-')
}

var mdToc_1 = mdToc;

/**
 * Handy function to automagically generate a table of contents for a markdown
 * document.
 *
 * @static
 * @param {Object} [options] Options object.
 * @param {Function} [options.compare] Function used to compare hierarchy of
 * headings.
 * @param {Funtion} [options.extract] Function used to extract headings from the
 * `text`.
 * @param {RegExp} [options.target] Regex to seach for text to be replaced with
 * the table of contents.
 * @returns {string} The input `text` with a new markdown list generated by
 * {@link #mdlist} attached on `target`.
 * @example
 *
 * const mdText = `
 *
 * TOC
 *
 * # First
 *
 * Bla bla Bla.
 *
 * ## Second
 *
 * Bla.
 *
 * # Third
 *
 * End.
 * `
 *
 * mdToc(mdText)
 * // => "
 * //
 * // 1. [First](#first)
 * //     1. [Second](#second)
 * // 2. [Third](#third)
 * //
 * // # First
 * //
 * // Bla bla Bla.
 * //
 * // ## Second
 * //
 * // Bla.
 * //
 * // # Third
 * //
 * // End.
 * // "
 */
function mdToc (text, options = {}) {
  const {
    compare = defaultCompare,
    extract = defaultExtract,
    target = /^TOC$/m
  } = options;

  return text.replace(target, mdList_1(tree_1(extract(text), compare), options))
}

/**
 * Extract headings from a markdown text.
 *
 * @static
 * @memberof mdToc
 * @param {string} text Markdown text.
 * @param {RegExp} [pattern] Regex to search for headings.
 * @return {Array} Array of headings found in `text`.
 * @example
 *
 * const mdText = `
 * # First
 *
 * Bla bla Bla.
 *
 * ## Second
 *
 * Bla.
 *
 * # Third
 *
 * End.
 * `
 *
 * defaultExtract(mdText)
 * // => [ "# First", "## Second", "# Third" ]
 *
 * defaultExtract(mdText, /^##+ .*$/gm)
 * // => [ "## Second" ]
 */
function defaultExtract (text, pattern = /^#+ .*$/gm) {
  // Strip code blocks away,
  // because bash-style comments can be treated as headings
  return text.replace(/```[\S\s]+?```/g, '').match(pattern) || []
}

/**
 * Compare two markdown headings.
 *
 * @static
 * @memberof mdToc
 * @param {string} current First markdown heading
 * @param {string} next Second markdown heading
 * @return {boolean} true if `next` has lower hierarchy than `current`, false
 * otherwise.
 * @example
 *
 * defaultCompare('# Heading 1', '## Heading 2')
 * // => true
 *
 * defaultCompare('### Heading 1', '# Heading 2')
 * // => false
 */
function defaultCompare (current, next) {
  const pattern = /^#+/;
  return next.match(pattern)[0] > current.match(pattern)[0]
}

var simpletoc = {
  domList: domList_1,
  domToc: domToc_1,
  mdList: mdList_1,
  mdToc: mdToc_1,
  tree: tree_1
};
var simpletoc_1 = simpletoc.domList;
var simpletoc_2 = simpletoc.domToc;
var simpletoc_3 = simpletoc.mdList;
var simpletoc_4 = simpletoc.mdToc;
var simpletoc_5 = simpletoc.tree;

export default simpletoc;
export { simpletoc_1 as domList, simpletoc_2 as domToc, simpletoc_3 as mdList, simpletoc_4 as mdToc, simpletoc_5 as tree };
