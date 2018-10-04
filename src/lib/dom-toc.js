import tree from './tree'
import domList from './dom-list'

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
function domToc(options = {}) {
  const {
    compare = (current, next) => next.tagName > current.tagName,
    root = 'body',
    selector = 'h1,h2,h3,h4,h5,h6',
    target = '[simpletoc]',
  } = options

  return removeChildren(document.querySelector(target)).appendChild(
    domList(
      tree(
        Array.from(document.querySelector(root).querySelectorAll(selector)),
        compare
      ),
      options
    )
  )
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
function removeChildren(el) {
  while (el.lastChild) el.removeChild(el.lastChild)
  return el
}

export default domToc
