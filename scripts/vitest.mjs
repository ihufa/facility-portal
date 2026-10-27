import { spawnSync } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Vitest loads two copies of itself on Windows when the working directory
// drive letter does not match the path Vite uses. Launch from the canonical path.
const cwd = process.platform === 'win32' ? realpathSync.native(process.cwd()) : process.cwd()
const vitestPath = fileURLToPath(new URL('../node_modules/vitest/vitest.mjs', import.meta.url))
const vitest = process.platform === 'win32' ? realpathSync.native(vitestPath) : vitestPath
const result = spawnSync(process.execPath, [vitest, ...process.argv.slice(2)], {
  cwd,
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
