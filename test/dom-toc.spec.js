import jsdom from 'jsdom'
import tap from 'tap'
import { readFileSync } from 'fs'
import { join } from 'path'
import domToc from '../src/lib/dom-toc'

const { test } = tap

const htmlString = readFileSync(
  join(__dirname, 'fixtures', 'commonmark-doc.input.html')
).toString()

// Prepare environment for DOM testing
const dom = new jsdom.JSDOM(htmlString)

global.window = dom.window
global.document = dom.window.document

test('domToc should work', (t) => {
  domToc()

  const wrapper = global.document.querySelector('[simpletoc]')
  const list = wrapper.querySelector('.simpletoc')

  t.test('domToc should append a list on the target element', (subTest) => {
    subTest.ok(list)
    subTest.end()
  })

  t.test('domToc should create a non-empty list', (subTest) => {
    subTest.ok(list.children.length > 0)
    subTest.end()
  })

  t.test('domToc should create exactly 46 TOC links', (subTest) => {
    const links = list.querySelectorAll('a[href]')
    subTest.ok(links.length === 46)
    subTest.end()
  })

  t.end()
})
