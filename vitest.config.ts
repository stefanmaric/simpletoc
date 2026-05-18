import type { ViteUserConfigExport } from 'vitest/config'

import { defineConfig } from 'vitest/config'

const config: ViteUserConfigExport = defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
  },
})

export default config
