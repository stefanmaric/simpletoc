import tap from 'tap'
import tree from '../src/lib/tree'

const { test } = tap

function lexHeadingCompare(current, next) {
  // In HTML, h1 is semantically greater than h2,
  // but h2 is lexicographically greater than h1
  //
  // "Strings are compared based on standard lexicographical ordering, using
  // Unicode values.", from:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
  return next > current
}

test('tree should return same number of nodes if all items have same heirarchy', (t) => {
  const src = Array(9).fill('h1')
  const result = tree(src, lexHeadingCompare)
  t.strictSame(src.length, result.length)
  t.end()
})

test('tree should nest smaller items', (t) => {
  const src = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  const expected = [['h1', [['h2', [['h3', [['h4', [['h5', [['h6']]]]]]]]]]]]

  const result = tree(src, lexHeadingCompare)
  t.strictSame(result, expected)
  t.end()
})
