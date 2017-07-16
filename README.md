simpletoc
=========

Simple Table of Contents generator for DOM and Markdown. 1.5kb

[![license](https://img.shields.io/github/license/stefanmaric/simpletoc.svg)]()
[![Travis](https://img.shields.io/travis/stefanmaric/simpletoc.svg)]()
[![Coveralls](https://img.shields.io/coveralls/stefanmaric/simpletoc.svg)]()
[![npm](https://img.shields.io/npm/v/simpletoc.svg)]()
[![npm](https://img.shields.io/npm/dt/simpletoc.svg)]()
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
  type: 'ul'
})
```

### For Markdown

```javascript
simpletoc.mdToc(markdownText, {
  // Place to inject the generated table of contents.
  target: /Table of contents here/,
  // Use an unordered list (bullet list, no numbers).
  type: 'ul'
})
```

## Why?

I needed to generate a table of contents and all I found was kind of overkill or bulked.


## Install

```shell
$ npm install simpletoc
```

Or grab a copy from the `dist/` folder – there's no CDN available at the moment.


## Some alternatives

* https://github.com/gajus/contents
* https://github.com/jgallen23/toc
* https://github.com/gfranko/jquery.tocify.js
* https://github.com/tscanlin/tocbot
* https://github.com/n1k0/toctoc
* https://github.com/aslushnikov/table-of-contents-preprocessor
* https://github.com/Oktavilla/markdown-it-table-of-contents
* https://github.com/gajus/markdown-contents


## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md). ♥


## License

[MIT](./LICENSE) ♥
