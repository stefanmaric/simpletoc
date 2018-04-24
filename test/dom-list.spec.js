import jsdom from 'jsdom'
import tap from 'tap'
import domList from '../src/lib/dom-list'

const { test } = tap

// Prepare environment for DOM testing
const dom = new jsdom.JSDOM()

global.window = dom.window
global.document = dom.window.document

function createFragment (html) {
  return jsdom.JSDOM.fragment(html).firstChild
}

test('domList should convert a tree of DOM elements into an HTML ordered list', (t) => {
  const tree = [
    [
      createFragment('<h1 id="1">First</h1>'),
      [[createFragment('<h2 id="2">Second</h2>')]]
    ],
    [createFragment('<h1 id="3">Third</h1>')]
  ]

  const expected =
    '<ol class="simpletoc"><li><a href="#1">First</a><ol class="simpletoc"><li><a href="#2">Second</a></li></ol></li><li><a href="#3">Third</a></li></ol>'

  const result = domList(tree).outerHTML

  t.equal(result, expected)
  t.end()
})

test('domList should generate ids for elements that does not have it already', (t) => {
  const tree = [
    [createFragment('<h1>First</h1>')],
    [createFragment('<h2>Second</h2>')],
    [createFragment('<h1>Third</h1>')]
  ]

  const expected =
    '<ol class="simpletoc"><li><a href="#first">First</a></li><li><a href="#second">Second</a></li><li><a href="#third">Third</a></li></ol>'

  const result = domList(tree).outerHTML

  t.equal(result, expected)
  t.end()
})
