import { JSDOM } from 'jsdom'
import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { domItems, domToc } from '../src/lib/dom-toc.ts'

const htmlString = readFileSync(
  new URL('./fixtures/commonmark-doc.input.html', import.meta.url),
  'utf8',
)

let dom: JSDOM

beforeEach(() => {
  dom = new JSDOM(htmlString)
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

it('domToc should append a non-empty list to the target element', () => {
  domToc()

  const wrapper = globalThis.document.querySelector('[simpletoc]')
  const list = wrapper?.querySelector('ol')

  expect(list).toBeTruthy()
  expect(list?.children.length).toBeGreaterThan(0)
})

it('domItems should support element roots and heading collections', () => {
  const root = globalThis.document.body
  const headings = root.querySelectorAll<HTMLElement>('h1, h2, h3')

  const items = domItems({ root, headings })

  expect(items[0]?.level).toBe(1)
  expect(items[0]?.text.length).toBeGreaterThan(0)
  expect(items[0]?.href.startsWith('#')).toBe(true)
})

it('domToc should create exactly 46 TOC links', () => {
  domToc()

  const links = globalThis.document.querySelectorAll('[simpletoc] ol a[href]')
  expect(links).toHaveLength(46)
})

it('domToc should support element targets and render passthrough', () => {
  const target = globalThis.document.createElement('div')

  const result = domToc({
    root: globalThis.document.body,
    target,
    render(items, { document, renderList }) {
      const nav = document.createElement('nav')
      nav.className = 'custom-toc'
      nav.appendChild(renderList(items))
      return nav
    },
  })

  expect(result).toBe(target.firstElementChild)
  expect(target.querySelector('nav.custom-toc')).toBeTruthy()
})
