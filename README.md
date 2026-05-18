# simpletoc

Simple Table of Contents generator for DOM and Markdown.

[![license](https://img.shields.io/github/license/stefanmaric/simpletoc.svg)](./LICENSE)
[![CI](https://github.com/stefanmaric/simpletoc/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanmaric/simpletoc/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/simpletoc.svg)](https://www.npmjs.com/package/simpletoc)
[![npm](https://img.shields.io/npm/dt/simpletoc.svg)](https://www.npmjs.com/package/simpletoc)
[![GitHub stars](https://img.shields.io/github/stars/stefanmaric/simpletoc.svg?style=flat-square)](https://github.com/stefanmaric/simpletoc/stargazers)

## Quick dive

### For the DOM

```javascript
import { domToc } from 'simpletoc'

const toc = domToc({
  // Only search for content in a specific place.
  root: '.content',
  // Only use headings from 1 to 3 levels.
  headings: 'h1, h2, h3',
  // Where to place the generated Table of Contents.
  target: '.table-of-contents-placeholder',
  // Use an unordered list (bullet list, no numbers).
  type: 'ul',
})
```

### For Markdown

```javascript
import { mdToc } from 'simpletoc'

const output = mdToc(markdownText, {
  // Place to inject the generated table of contents.
  target: /Table of contents here/,
  // Use an unordered list (bullet list, no numbers).
  type: 'ul',
})
```

You can also extract and render TOC items separately:

```javascript
import { domItems, domList } from 'simpletoc'

const items = domItems({
  root: document.querySelector('.content'),
  headings: document.querySelectorAll('.content h2, .content h3'),
})

const toc = domList(items, {
  render(items, { document, renderList }) {
    const nav = document.createElement('nav')
    nav.className = 'table-of-contents'
    nav.appendChild(renderList(items))
    return nav
  },
})

document.querySelector('.table-of-contents-placeholder').replaceChildren(toc)
```

Markdown items use the same normalized shape:

```javascript
import { mdItems, mdList } from 'simpletoc'

const items = mdItems(markdownText)
const toc = mdList(items, { type: 'ul' })
```

## API

Main exports:

- `domToc(options)`
- `mdToc(text, options)`
- `domItems(options)`
- `mdItems(text, options)`
- `domList(items, options)`
- `mdList(items, options)`

`domItems()` and `mdItems()` return normalized `TocItem[]` data:

```ts
type TocItem<TSource = unknown> = {
  level: number
  text: string
  id: string
  href: string
  source: TSource
  children: TocItem<TSource>[]
}
```

DOM notes:

- `root` accepts a CSS selector or an `Element`
- `headings` accepts a CSS selector or an iterable/list of `Element`
- `target` accepts a CSS selector or an `Element`
- `domList()` returns the root list element, so styling can be applied directly
- `domToc()` forwards `render` to `domList()` for custom rendering

Breaking changes from v1:

- `selector` was renamed to `headings`
- `domList()` and `mdList()` now take `TocItem[]`
- `domItems()` and `mdItems()` are the new extraction APIs
- DOM class options and old `getId` / `getAnchor` hooks were removed in favor of `render`

## Why?

I needed to generate a table of contents and all I found was kind of overkill or bulked.

## Install

```shell
$ pnpm add simpletoc
```

`simpletoc` is ESM-only.

You can also use it straight from a CDN with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import { domToc } from 'https://esm.sh/simpletoc'

  domToc()
</script>
```

If you only need one side of the library, use the subpath exports:

```html
<script type="module">
  import { domToc } from 'https://esm.sh/simpletoc/dom'
</script>
```

## Browser support

`simpletoc` targets Node.js 24+ and browsers in the current
[`baseline widely available`](https://browsersl.ist/#q=baseline+widely+available)
set.

## Some alternatives

- https://github.com/gajus/contents
- https://github.com/jgallen23/toc
- https://github.com/gfranko/jquery.tocify.js
- https://github.com/tscanlin/tocbot
- https://github.com/n1k0/toctoc
- https://github.com/aslushnikov/table-of-contents-preprocessor
- https://github.com/Oktavilla/markdown-it-table-of-contents
- https://github.com/gajus/markdown-contents
- https://github.com/thlorenz/doctoc

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md). ♥

## License

[MIT](./LICENSE) ♥
