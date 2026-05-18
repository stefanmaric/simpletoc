import { JSDOM } from 'jsdom'
import { afterEach, beforeEach, expect, it } from 'vitest'

import type { TocItem } from '../src/lib/toc-item.ts'

import { domList } from '../src/lib/dom-list.ts'

let dom: JSDOM

beforeEach(() => {
  dom = new JSDOM()
  Object.assign(globalThis, {
    document: dom.window.document,
    window: dom.window,
  })
})

afterEach(() => {
  dom.window.close()
  Reflect.deleteProperty(globalThis, 'document')
  Reflect.deleteProperty(globalThis, 'window')
})

function createFragment(html: string): Element {
  const child = document.createRange().createContextualFragment(html).firstElementChild
  if (!child) {
    throw new TypeError('Invalid html input')
  }
  return child
}

function createItem(
  level: number,
  text: string,
  id: string,
  children: TocItem<Element>[] = [],
): TocItem<Element> {
  return {
    level,
    text,
    id,
    href: `#${id}`,
    source: createFragment(`<h${level} id="${id}">${text}</h${level}>`),
    children,
  }
}

it('domList should convert TOC items into an HTML ordered list', () => {
  const items = [
    createItem(1, 'First', '1', [createItem(2, 'Second', '2')]),
    createItem(1, 'Third', '3'),
  ]

  const expected =
    '<ol><li><a href="#1">First</a><ol><li><a href="#2">Second</a></li></ol></li><li><a href="#3">Third</a></li></ol>'

  expect(domList(items).outerHTML).toBe(expected)
})

it('domList should forward render for full custom rendering', () => {
  const items = [createItem(1, 'First', '1')]

  const result = domList(items, {
    render(nodes, { document, renderList }) {
      const nav = document.createElement('nav')
      nav.className = 'custom-toc'
      nav.appendChild(renderList(nodes))
      return nav
    },
  })

  expect(result.outerHTML).toBe(
    '<nav class="custom-toc"><ol><li><a href="#1">First</a></li></ol></nav>',
  )
})

it('domList should let callers style the returned root element directly', () => {
  const items = [createItem(1, 'First', 'first')]
  const result = domList(items)

  result.classList.add('custom')

  expect(result.outerHTML).toBe('<ol class="custom"><li><a href="#first">First</a></li></ol>')
})
