/**
 * Creates a slice of `array` with elements taken from the beginning. Elements
 * are taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: `(value, index, array)`.
 *
 * @private
 * @param predicate The function invoked per iteration.
 * @param array The array to query.
 * @param index The current array index.
 * @returns Returns the slice of `array`.
 * @example
 *
 * const users = [
 *   { user: 'john', active: false },
 *   { user: 'mike', active: false },
 *   { user: 'berto', active: true },
 * ]
 *
 * takeWhile((user) => !user.active, users)
 * // => [{ user: 'john', active: false }, { user: 'mike', active: false }]
 */
export function takeWhile<T>(
  predicate: (value: T, index: number, array: readonly T[]) => unknown,
  array: readonly T[],
  index = 0,
): T[] {
  return index < array.length && predicate(array[index]!, index, array)
    ? takeWhile(predicate, array, index + 1)
    : array.slice(0, index)
}
