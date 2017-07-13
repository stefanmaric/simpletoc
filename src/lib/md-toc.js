'use strict'

const mdList = require('./md-list.js')
const tree = require('./tree.js')

module.exports = mdToc

function mdToc (text, options = {}) {
  const { compare = _compare, extract = _extract, target = /^TOC$/m } = options
  return text.replace(target, mdList(tree(extract(text), compare), options))
}

function _extract (text, pattern = /^#+ .*$/gm) {
  // Strip code blocks away,
  // because bash-style comments can be treated as headings
  return text.replace(/```[\S\s]+?```/g, '').match(pattern) || []
}

function _compare (current, next) {
  const pattern = /^#+/
  return next.match(pattern)[0] > current.match(pattern)[0]
}
