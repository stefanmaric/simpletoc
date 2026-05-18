import { takeWhile } from './take-while.ts'

export type TreeNode<T> = [T, Tree<T>?]
export type Tree<T> = Array<TreeNode<T>>
export type Compare<T> = (current: T, next: T) => boolean

/**
 * Creates a tree of nested arrays based on `array` data and `compare`
 * criteria. Elements are compared against their left neighbour using
 * `compare`, which is invoked with these arguments: `(current, next)`. If the
 * invocation returns truthy, `next` will be nested into `current`, and `next`
 * will be placed at the same level as `current` otherwise.
 *
 * @param array The array to structure as a tree.
 * @param compare Function invoked per item in the array.
 * @returns An array of arrays representing the tree.
 * @example
 *
 * const levels = [5, 3, 2, 5, 4]
 *
 * function comparator(current, next) {
 *   return next < current
 * }
 *
 * tree(levels, comparator)
 * // => [[5, [[3, [[2]]]]], [5, [[4]]]]
 */
export function tree<T>([current, ...rest]: Iterable<T>, compare: Compare<T>): Tree<T> {
  if (current === undefined) return []

  const children = takeWhile((next) => compare(current, next), rest)
  const result: TreeNode<T> = children.length ? [current, tree(children, compare)] : [current]

  return rest.length - children.length
    ? [result, ...tree(rest.slice(children.length), compare)]
    : [result]
}
