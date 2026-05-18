import { expect, it } from 'vitest'

import { mdToc } from '../src/lib/md-toc.ts'

it('mdToc should, by default, replace lines that contain no more than TOC', () => {
  expect(mdToc('TOC')).toBe('')
})

it('mdToc should replace text that matches the target regex, if given', () => {
  expect(mdToc('Lorem ipsum dolor sit amet', { target: /dolor/ })).toBe('Lorem ipsum  sit amet')
})

it('mdToc should support custom heading extraction through headings', () => {
  const source = '# First\n\n## Second\n'

  expect(mdToc(source, { headings: /^##+ .*$/gm, target: /^# First$/m })).toBe(
    '1. [Second](#second)\n\n## Second\n',
  )
})

it('mdToc should generate a table of contents and replace the TOC line with it', () => {
  const source = `

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

  expect(mdToc(source)).toBe(expected)
})
