import { expect, it } from 'vitest'

import { mdItems } from '../src/lib/md-toc.ts'

it('mdItems should extract TOC items from markdown headings', () => {
  const source = '# First\n\n## Second\n\n### Third\n'

  const items = mdItems(source)

  expect(items).toEqual([
    {
      level: 1,
      text: 'First',
      id: 'first',
      href: '#first',
      source: '# First',
      children: [
        {
          level: 2,
          text: 'Second',
          id: 'second',
          href: '#second',
          source: '## Second',
          children: [
            {
              level: 3,
              text: 'Third',
              id: 'third',
              href: '#third',
              source: '### Third',
              children: [],
            },
          ],
        },
      ],
    },
  ])
})

it('mdItems should support custom heading extraction', () => {
  const source = '# First\n\n## Second\n'

  const items = mdItems(source, {
    headings: (text) => text.match(/^##+ .*$/gm) ?? [],
  })

  expect(items).toEqual([
    {
      level: 2,
      text: 'Second',
      id: 'second',
      href: '#second',
      source: '## Second',
      children: [],
    },
  ])
})
