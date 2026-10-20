import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { writeIndexingPolicy } from './indexing-policy.mjs'

// Local/PR builds default to preview. Only the production branch in Workers
// Builds, or an explicit local production test, produces public crawl files.
const production =
  process.argv.includes('--production') ||
  (process.env.WORKERS_CI === '1' && process.env.WORKERS_CI_BRANCH === 'main')
const environment = production ? 'production' : 'preview'
const result = spawnSync(
  process.execPath,
  ['node_modules/astro/bin/astro.mjs', 'build'],
  {
    stdio: 'inherit',
    env: { ...process.env, PUBLIC_DEPLOYMENT_ENV: environment },
  },
)
if (result.status !== 0) process.exit(result.status ?? 1)
await writeIndexingPolicy(production)
const headers = (await readFile('public/_headers', 'utf8')).replace(
  'X-Robots-Tag: noindex, nofollow',
  `X-Robots-Tag: ${production ? 'index, follow' : 'noindex, nofollow'}\n  X-Site-Environment: ${environment}`,
)
await writeFile('dist/_headers', headers)
const verify = spawnSync(process.execPath, ['scripts/verify-build.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, PUBLIC_DEPLOYMENT_ENV: environment },
})
process.exit(verify.status ?? 1)
