import { expect, it } from 'vitest'

import { tree } from '../src/lib/tree.ts'

function lexHeadingCompare(current: string, next: string): boolean {
  return next > current
}

it('tree should return the same number of nodes if all items have the same hierarchy', () => {
  const source = Array(9).fill('h1')
  expect(tree(source, lexHeadingCompare)).toHaveLength(source.length)
})

it('tree should nest smaller items', () => {
  const source = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  const expected = [['h1', [['h2', [['h3', [['h4', [['h5', [['h6']]]]]]]]]]]]

  expect(tree(source, lexHeadingCompare)).toEqual(expected)
})
