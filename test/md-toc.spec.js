const { test } = require('tap')
const mdToc = require('../src/lib/md-toc.js')

test('mdToc should, by default, replace lines that contain no more than "TOC"', (t) => {
  const src = 'TOC'
  const expected = ''
  const result = mdToc(src)

  t.strictSame(result, expected)
  t.end()
})

test('mdToc should replace text that matches the target regex, if given', (t) => {
  const src = 'Lorem ipsum dolor sit amet'
  const expected = 'Lorem ipsum  sit amet'
  const result = mdToc(src, { target: /dolor/ })

  t.strictSame(result, expected)
  t.end()
})

test('mdToc should generate a table of contents and replace the TOC line with it', (t) => {
  const src = `

TOC

# First

Lorem ipsum dolor sit amet

## Second

Lorem ipsum dolor sit amet

### Third

Lorem ipsum dolor sit amet
`
  const expected = `

1. [First](#first)
    1. [Second](#second)
        1. [Third](#third)

# First

Lorem ipsum dolor sit amet

## Second

Lorem ipsum dolor sit amet

### Third

Lorem ipsum dolor sit amet
`

  const result = mdToc(src)

  t.strictSame(result, expected)
  t.end()
})
