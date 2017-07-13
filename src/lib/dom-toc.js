'use strict'

const tree = require('./tree.js')
const domList = require('./dom-list.js')

module.exports = domToc

function domToc (options = {}) {
  const {
    compare = (current, next) => next.tagName > current.tagName,
    root = 'body',
    selector = 'h1,h2,h3,h4,h5,h6',
    target = '[simpletoc]'
  } = options

  removeChildren(document.querySelector(target)).appendChild(
    domList(
      tree(
        Array.from(document.querySelector(root).querySelectorAll(selector)),
        compare
      ),
      options
    )
  )
}

function removeChildren (el) {
  while (el.lastChild) el.removeChild(el.lastChild)
  return el
}
