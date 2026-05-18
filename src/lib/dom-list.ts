import type { TocItem } from './toc-item.ts'

export type DomListOptions = {
  type?: 'ol' | 'ul'
  render?: (items: TocItem<Element>[], context: DomListRenderContext) => Element
}

export type DomListRenderContext = {
  document: Document
  createLink: (item: TocItem<Element>) => HTMLAnchorElement
  renderList: (items: TocItem<Element>[]) => HTMLOListElement | HTMLUListElement
}

/**
 * Given a TOC item, returns a new anchor element that points to the item's id.
 *
 * @param item The TOC item.
 * @returns A new anchor element.
 * @example
 *
 * const item = {
 *   level: 1,
 *   text: 'This is a Heading',
 *   id: 'custom-id',
 *   href: '#custom-id',
 *   source: document.createElement('h1'),
 *   children: [],
 * }
 *
 * defaultCreateLink(item)
 * // => <a href="#custom-id">This is a Heading</a>
 */
function defaultCreateLink(item: TocItem<Element>): HTMLAnchorElement {
  const anchor = document.createElement('a')

  anchor.href = item.href
  anchor.textContent = item.text

  return anchor
}

function renderList(
  items: TocItem<Element>[],
  type: 'ol' | 'ul',
): HTMLOListElement | HTMLUListElement {
  const list = document.createElement(type)

  for (const item of items) {
    const listItem = document.createElement('li')

    listItem.appendChild(defaultCreateLink(item))

    if (item.children.length) listItem.appendChild(renderList(item.children, type))

    list.appendChild(listItem)
  }

  return list
}

function createRenderContext(type: 'ol' | 'ul'): DomListRenderContext {
  return {
    document,
    createLink: defaultCreateLink,
    renderList: (items) => renderList(items, type),
  }
}

/**
 * Given TOC items extracted from DOM headings, creates a new list of anchors
 * that point to those headings.
 *
 * @param items Array of nested TOC items.
 * @param options Options object.
 * @param options.type Type of DOM element to use.
 * @param options.render Custom renderer for the full TOC output.
 * @returns A new list element.
 * @example
 *
 * const items = [
 *   {
 *     level: 1,
 *     text: 'First',
 *     id: '1',
 *     href: '#1',
 *     source: document.createElement('h1'),
 *     children: [
 *       {
 *         level: 2,
 *         text: 'Second',
 *         id: '2',
 *         href: '#2',
 *         source: document.createElement('h2'),
 *         children: [],
 *       },
 *     ],
 *   },
 *   {
 *     level: 1,
 *     text: 'Third',
 *     id: '3',
 *     href: '#3',
 *     source: document.createElement('h1'),
 *     children: [],
 *   },
 * ]
 *
 * domList(items)
 * // => <ol class="simpletoc">
 * //      <li><a href="#1">First</a>
 * //        <ol class="simpletoc">
 * //          <li><a href="#2">Second</a></li>
 * //        </ol>
 * //      </li>
 * //      <li><a href="#3">Third</a></li>
 * //    </ol>
 */
export function domList(items: TocItem<Element>[], options: DomListOptions = {}): Element {
  const type = options.type ?? 'ol'

  if (!options.render) return renderList(items, type)

  return options.render(items, createRenderContext(type))
}
