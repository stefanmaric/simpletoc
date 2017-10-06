const { test } = require('tap')
const mdList = require('../src/lib/md-list.js')

test('mdList should generate a markdown list given a tree', (t) => {
  const src = [['# First'], ['# Second'], ['# Third']]

  const expected = [
    '1. [First](#first)',
    '2. [Second](#second)',
    '3. [Third](#third)'
  ].join('\n')

  const result = mdList(src)

  t.strictSame(result, expected)
  t.end()
})

test('mdList should create nested list if the tree is nested', (t) => {
  const src = [['# First', [['## Second', [['### Third']]]]]]

  const expected = [
    '1. [First](#first)',
    '    1. [Second](#second)',
    '        1. [Third](#third)'
  ].join('\n')

  const result = mdList(src)

  t.strictSame(result, expected)
  t.end()
})

test('mdList should use bullets if the type is ul', (t) => {
  const src = [['# First'], ['# Second'], ['# Third']]

  const expected = [
    '* [First](#first)',
    '* [Second](#second)',
    '* [Third](#third)'
  ].join('\n')

  const result = mdList(src, { type: 'ul' })

  t.strictSame(result, expected)
  t.end()
})
