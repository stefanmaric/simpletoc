import { expect, it } from 'vitest'

import type { TocItem } from '../src/lib/toc-item.ts'

import { mdList } from '../src/lib/md-list.ts'

function createItem(
  level: number,
  text: string,
  id: string,
  source: string,
  children: TocItem<string>[] = [],
): TocItem<string> {
  return { level, text, id, href: `#${id}`, source, children }
}

it('mdList should generate a markdown list given TOC items', () => {
  const source = [
    createItem(1, 'First', 'first', '# First'),
    createItem(1, 'Second', 'second', '# Second'),
    createItem(1, 'Third', 'third', '# Third'),
  ]

  const expected = ['1. [First](#first)', '2. [Second](#second)', '3. [Third](#third)'].join('\n')

  expect(mdList(source)).toBe(expected)
})

it('mdList should create a nested list when the tree is nested', () => {
  const source = [
    createItem(1, 'First', 'first', '# First', [
      createItem(2, 'Second', 'second', '## Second', [
        createItem(3, 'Third', 'third', '### Third'),
      ]),
    ]),
  ]

  const expected = [
    '1. [First](#first)',
    '    1. [Second](#second)',
    '        1. [Third](#third)',
  ].join('\n')

  expect(mdList(source)).toBe(expected)
})

it('mdList should use bullets when the type is ul', () => {
  const source = [
    createItem(1, 'First', 'first', '# First'),
    createItem(1, 'Second', 'second', '# Second'),
    createItem(1, 'Third', 'third', '# Third'),
  ]

  const expected = ['* [First](#first)', '* [Second](#second)', '* [Third](#third)'].join('\n')

  expect(mdList(source, { type: 'ul' })).toBe(expected)
})
