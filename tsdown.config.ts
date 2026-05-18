import type { UserConfigExport } from 'tsdown'

import { defineConfig } from 'tsdown'

const shared = {
  clean: false,
  dts: {
    sourcemap: true,
  },
  minify: true,
  platform: 'neutral',
  sourcemap: true,
} as const

const config: UserConfigExport = defineConfig([
  {
    ...shared,
    clean: true,
    entry: {
      index: './src/index.ts',
    },
  },
  {
    ...shared,
    entry: {
      dom: './src/dom.ts',
    },
  },
  {
    ...shared,
    entry: {
      md: './src/md.ts',
    },
    // Quality checks
    publint: true,
    attw: {
      profile: 'esm-only',
    },
  },
])

export default config
