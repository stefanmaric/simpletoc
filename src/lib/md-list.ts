import type { TocItem } from './toc-item.ts'

export type MdListOptions = {
  type?: 'ol' | 'ul'
}

/**
 * Given TOC items extracted from markdown headings, creates a markdown list of
 * references that point to those headings.
 *
 * @param items Array of nested TOC items.
 * @param options Options object.
 * @param options.type Type of list to use, ordered or unordered.
 * @param depth Initial indentation depth.
 * @returns A new markdown list.
 * @example
 *
 * const items = [
 *   {
 *     level: 1,
 *     text: 'First',
 *     id: 'first',
 *     href: '#first',
 *     source: '# First',
 *     children: [
 *       {
 *         level: 2,
 *         text: 'Second',
 *         id: 'second',
 *         href: '#second',
 *         source: '## Second',
 *         children: [
 *           {
 *             level: 3,
 *             text: 'Third',
 *             id: 'third',
 *             href: '#third',
 *             source: '### Third',
 *             children: [],
 *           },
 *         ],
 *       },
 *     ],
 *   },
 * ]
 *
 * mdList(items)
 * // => "1. [First](#first)\n    1. [Second](#second)\n        1. [Third](#third)"
 *
 * mdList(items, { type: 'ul' })
 * // => "* [First](#first)\n    * [Second](#second)\n        * [Third](#third)"
 */
export function mdList(items: TocItem<string>[], options: MdListOptions = {}, depth = 0): string {
  const { type = 'ol' } = options

  return items
    .reduce<string[]>((accumulator, item, index) => {
      const pad = ' '.repeat(depth * 4)
      const bullet = type === 'ol' ? `${index + 1}.` : '*'
      const line = `${pad}${bullet} [${item.text}](${item.href})`

      accumulator.push(line)

      if (item.children.length) accumulator.push(mdList(item.children, options, depth + 1))

      return accumulator
    }, [])
    .join('\n')
}
