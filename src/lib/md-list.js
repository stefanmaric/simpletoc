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
function defaultGetText(line) {
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
function defaultGetRef(text) {
  // This pretty much matches how github generates its headings references
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s/g, '-')
}

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
function mdList(tree, options = {}, depth = 0) {
  const {
    getRef = defaultGetRef,
    getText = defaultGetText,
    type = 'ol',
  } = options

  return tree
    .reduce((acc, [el, children], i) => {
      if (!el) return acc

      const pad = ' '.repeat(depth * 4)
      const bullet = type === 'ol' ? `${i + 1}.` : '*'
      const text = getText(el)
      const link = getRef(text)
      const line = `${pad}${bullet} [${text}](#${link})`

      acc.push(line)

      if (children) acc.push(mdList(children, options, depth + 1))

      return acc
    }, [])
    .join('\n')
}

export default mdList
