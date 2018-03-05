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

var simpletocMd = {
  mdList: mdList_1,
  mdToc: mdToc_1,
  tree: tree_1
};
var simpletocMd_1 = simpletocMd.mdList;
var simpletocMd_2 = simpletocMd.mdToc;
var simpletocMd_3 = simpletocMd.tree;

export default simpletocMd;
export { simpletocMd_1 as mdList, simpletocMd_2 as mdToc, simpletocMd_3 as tree };
