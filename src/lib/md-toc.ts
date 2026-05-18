import type { MdListOptions } from './md-list.ts'
import type { TocItem } from './toc-item.ts'
import type { Compare } from './tree.ts'

import { mdList } from './md-list.ts'
import { itemsFromTree } from './toc-item.ts'
import { tree } from './tree.ts'

export type MdItemsOptions = {
  compare?: Compare<string>
  headings?: RegExp | ((text: string) => string[])
  text?: (heading: string) => string
  id?: (text: string, heading: string) => string
}

export type MdTocOptions = MdListOptions &
  MdItemsOptions & {
    target?: RegExp
  }

/**
 * Extract headings from markdown text.
 *
 * @param text Markdown text.
 * @param pattern Regex used to search for headings.
 * @returns Array of headings found in `text`.
 * @example
 *
 * const mdText = `
 * # First
 *
 * Bla bla Bla.
 *
 * ## Second
 *
 * Bla.
 *
 * # Third
 *
 * End.
 * `
 *
 * defaultExtract(mdText)
 * // => ['# First', '## Second', '# Third']
 *
 * defaultExtract(mdText, /^##+ .*$/gm)
 * // => ['## Second']
 */
function defaultExtract(text: string, pattern: RegExp = /^#+ .*$/gm): string[] {
  // Strip code blocks away, because bash-style comments can be treated as headings.
  return text.replace(/```[\S\s]+?```/g, '').match(pattern) ?? []
}

/**
 * Given a line representing a markdown heading, returns its text ready for use
 * as reference text.
 *
 * @param heading Markdown heading.
 * @returns Heading text ready to be used as reference text.
 */
function defaultGetText(heading: string): string {
  return heading.replace(/^#+ +/, '').replace(/\[(.+?)\]\(.+?\)/, '$1')
}

/**
 * Given a markdown heading's text, returns a reference close to GitHub Flavored
 * Markdown heading references.
 *
 * @param text Heading text to parse.
 * @returns A markdown reference.
 */
function defaultGetId(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s/g, '-')
}

function getHeadingLevel(heading: string): number {
  return heading.match(/^#+/)?.[0].length ?? 0
}

/**
 * Extract TOC items from markdown headings.
 *
 * @param input Markdown text.
 * @param options Options object.
 * @param options.compare Function used to compare hierarchy of headings.
 * @param options.headings Regex or function used to extract headings from
 * `text`.
 * @param options.text Function used to generate the visible heading text.
 * @param options.id Function used to generate the heading id.
 * @returns TOC items generated from the headings.
 */
export function mdItems(input: string, options: MdItemsOptions = {}): TocItem<string>[] {
  const {
    compare = (current, next) => getHeadingLevel(next) > getHeadingLevel(current),
    headings = /^#+ .*$/gm,
    text = defaultGetText,
    id = defaultGetId,
  } = options

  const extractedHeadings =
    typeof headings === 'function' ? headings(input) : defaultExtract(input, headings)

  return itemsFromTree(tree(extractedHeadings, compare), (heading, children) => {
    const itemText = text(heading)
    const itemId = id(itemText, heading)

    return {
      level: getHeadingLevel(heading),
      text: itemText,
      id: itemId,
      href: `#${itemId}`,
      source: heading,
      children,
    }
  })
}

/**
 * Handy function to automagically generate a table of contents for a markdown
 * document.
 *
 * @param text Markdown text.
 * @param options Options object.
 * @param options.compare Function used to compare hierarchy of headings.
 * @param options.headings Regex or function used to extract headings from
 * `text`.
 * @param options.target Regex to search for text to be replaced with the table
 * of contents.
 * @returns The input text with a markdown list inserted at `target`.
 * @example
 *
 * const mdText = `
 *
 * TOC
 *
 * # First
 *
 * Bla bla Bla.
 *
 * ## Second
 *
 * Bla.
 *
 * # Third
 *
 * End.
 * `
 *
 * mdToc(mdText)
 * // => "\n\n1. [First](#first)\n    1. [Second](#second)\n2. [Third](#third)\n\n# First\n\nBla bla Bla.\n\n## Second\n\nBla.\n\n# Third\n\nEnd.\n"
 */
export function mdToc(text: string, options: MdTocOptions = {}): string {
  return text.replace(options.target ?? /^TOC$/m, mdList(mdItems(text, options), options))
}
