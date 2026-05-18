import type { Tree } from './tree.ts'

export type TocItem<TSource = unknown> = {
  level: number
  text: string
  id: string
  href: string
  source: TSource
  children: TocItem<TSource>[]
}

export function itemsFromTree<T>(
  nodes: Tree<T>,
  map: (source: T, children: TocItem<T>[]) => TocItem<T>,
): TocItem<T>[] {
  return nodes.map(([source, children]) => {
    const childItems = children ? itemsFromTree(children, map) : []
    return map(source, childItems)
  })
}
