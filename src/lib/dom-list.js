'use strict'

module.exports = domList

function domList (tree, options = {}) {
  const {
    type = 'ol',
    className = 'simpletoc',
    getId = _getId,
    getAnchor = _getAnchor
  } = options

  const list = document.createElement(type)

  list.classList.add(className)

  return tree.reduce((acc, [el, children]) => {
    const li = document.createElement('li')

    el.id = getId(el, children)

    li.appendChild(getAnchor(el, children))

    if (children) li.appendChild(domList(children, options))

    acc.appendChild(li)

    return acc
  }, list)
}

function _getId (el) {
  return el.id ? el.id : el.textContent.toLowerCase().replace(/\s+/g, '-')
}

function _getAnchor (el) {
  const a = document.createElement('a')

  a.href = '#' + el.id
  a.textContent = el.textContent

  return a
}
