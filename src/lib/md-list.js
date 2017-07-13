'use strict'

module.exports = mdList

function mdList (tree, options = {}, depth = 0) {
  const { getRef = _getRef, getText = _getText, type = 'ol' } = options

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

function _getText (line) {
  // Strip away the heading markup,
  // and also strip away any link markup because nested links are not possible
  return line.replace(/^#+ +/, '').replace(/\[(.+?)\]\(.+?\)/, '$1')
}

function _getRef (text) {
  // This pretty much matches how github generates its headings references
  return text.trim().toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s/g, '-')
}
