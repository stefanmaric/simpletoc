import mdList from './md-list'
import tree from './tree'

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
  } = options

  return text.replace(target, mdList(tree(extract(text), compare), options))
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
  const pattern = /^#+/
  return next.match(pattern)[0] > current.match(pattern)[0]
}

export default mdToc
