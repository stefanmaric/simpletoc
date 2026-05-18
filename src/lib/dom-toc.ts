import type { DomListOptions } from './dom-list.ts'
import type { TocItem } from './toc-item.ts'
import type { Compare } from './tree.ts'

import { domList } from './dom-list.ts'
import { itemsFromTree } from './toc-item.ts'
import { tree } from './tree.ts'

export type DomRoot = string | Element
export type DomTarget = string | Element
export type DomHeadingsInput = string | Iterable<Element>

export type DomItemsOptions = {
  compare?: Compare<Element>
  root?: DomRoot
  headings?: DomHeadingsInput
  text?: (element: Element) => string
  id?: (text: string, element: Element) => string
}

export type DomTocOptions = DomItemsOptions &
  DomListOptions & {
    target?: DomTarget
  }

/**
 * Extract TOC items from headings in the DOM.
 *
 * @param options Options object.
 * @param options.compare Function used to compare hierarchy of heading
 * elements.
 * @param options.root Root element or selector used to query headings.
 * @param options.headings Heading selector or iterable of heading elements.
 * @param options.text Function used to generate the visible heading text.
 * @param options.id Function used to generate the heading id.
 * @returns TOC items generated from the headings.
 */
export function domItems(options: DomItemsOptions = {}): TocItem<Element>[] {
  const {
    compare = (current, next) => next.tagName > current.tagName,
    root = 'body',
    headings = 'h1,h2,h3,h4,h5,h6',
    text = (element) => element.textContent ?? '',
    id = (headingText, element) => element.id || headingText.toLowerCase().replace(/\s+/g, '-'),
  } = options

  const rootElement = typeof root === 'string' ? document.querySelector(root) : root

  if (!rootElement) {
    throw new Error(`Invalid root`)
  }

  const headingElements =
    typeof headings === 'string' ? rootElement.querySelectorAll(headings) : headings

  return itemsFromTree(tree(headingElements, compare), (element, children) => {
    const itemText = text(element)
    const itemId = id(itemText, element)

    element.id = itemId

    return {
      level: +element.tagName[1]!,
      text: itemText,
      id: itemId,
      href: `#${itemId}`,
      source: element,
      children,
    }
  })
}

/**
 * Handy function to automagically generate a table of contents based on the
 * document and optional heading inputs, and attach it somewhere in the DOM.
 *
 * @param options Options object.
 * @param options.root Root element or selector used to query headings.
 * @param options.headings Heading selector or iterable of heading elements.
 * @param options.target Target element or selector where the TOC will be
 * attached.
 * @param options.render Custom renderer forwarded to `domList`.
 * @returns The generated list element attached to the target.
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
export function domToc(options: DomTocOptions = {}): Element {
  const { target = '[simpletoc]' } = options
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target

  if (!targetElement) throw new Error('Invalid target')

  const toc = domList(domItems(options), options)
  targetElement.replaceChildren(toc)
  return toc
}
