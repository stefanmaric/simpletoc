'use strict'

module.exports = domList

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
 * @param {Function} [options.getAnchor] Function to generate an anchor DOM element.
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
 * _getId(heading)
 * //=> "this-is-a-heading"
 *
 * heading.id = 'custom-id'
 *
 * _getId(heading)
 * // => "custom-id"
 */
function _getId (el) {
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
 * _getAnchor(heading)
 * // => <a href="#custom-id">This is a Heading</a>
 */
function _getAnchor (el) {
  const a = document.createElement('a')

  a.href = '#' + el.id
  a.textContent = el.textContent

  return a
}
