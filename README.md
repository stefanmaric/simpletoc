# simpletoc

Simple Table of Contents generator for DOM and Markdown. 1.5kb

[![license](https://img.shields.io/github/license/stefanmaric/simpletoc.svg)](./LICENSE)
[![Travis](https://img.shields.io/travis/stefanmaric/simpletoc.svg)](https://travis-ci.org/stefanmaric/simpletoc)
[![Coveralls](https://img.shields.io/coveralls/stefanmaric/simpletoc.svg)](https://coveralls.io/github/stefanmaric/simpletoc)
[![npm](https://img.shields.io/npm/v/simpletoc.svg)](https://www.npmjs.com/package/simpletoc)
[![Greenkeeper badge](https://badges.greenkeeper.io/stefanmaric/simpletoc.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/dt/simpletoc.svg)](https://www.npmjs.com/package/simpletoc)
[![GitHub stars](https://img.shields.io/github/stars/stefanmaric/simpletoc.svg?style=flat-square)](https://github.com/stefanmaric/simpletoc/stargazers)


## Quick dive

### For the DOM

```javascript
simpletoc.domToc({
  // Only search for content in a specific place.
  root: '.content',
  // Only use headings from 1 to 3 levels.
  selector: 'h1, h2, h3',
  // Where to place the generated Table of Contents.
  target: '.table-of-contents-placeholder',
  // Use an unordered list (bullet list, no numbers).
  type: 'ul',
})
```

### For Markdown

```javascript
simpletoc.mdToc(markdownText, {
  // Place to inject the generated table of contents.
  target: /Table of contents here/,
  // Use an unordered list (bullet list, no numbers).
  type: 'ul',
})
```


## Why?

I needed to generate a table of contents and all I found was kind of overkill or bulked.


## Install

```shell
$ npm install simpletoc
```

Or use a CDN like [jsDelivr](https://www.jsdelivr.com/package/npm/simpletoc).


## Browser support

`simpletoc` should work in every major browser and every node.js LTS version. Distribution files are
transpiled with babel and target is defined in the [`.browserlistrc` file](./.browserslistrc).
[See the list of browsers here](https://browserl.ist/?q=%3E1%25%2C+not+op_mini+all%2C+not+dead).


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
