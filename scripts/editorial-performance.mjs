// Local lab evidence only; this does not measure deployed or field Core Web Vitals.
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const origin = 'http://127.0.0.1:4327'
const output = 'artifacts/editorial/performance'
await mkdir(output, { recursive: true })
const server = spawn(
  process.execPath,
  [
    'node_modules/astro/bin/astro.mjs',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4327',
    '--ignore-lock',
  ],
  { stdio: 'inherit' },
)
let serverError
server.on('error', (error) => {
  serverError = error
})
const measurements = []
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverError) throw serverError
    if (server.exitCode !== null)
      throw new Error('Preview exited before lab measurement')
    try {
      if ((await fetch(origin)).ok) {
        ready = true
        break
      }
    } catch {
      /* Server is starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (!ready) throw new Error('Preview did not become ready')
  for (const [label, route] of [
    ['home', '/'],
    ['services', '/services/'],
    ['contact', '/contact/'],
    ['story', '/my-story/'],
  ]) {
    const reportPath = `${output}/${label}.json`
    await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [
          'node_modules/lighthouse/cli/index.js',
          `${origin}${route}`,
          '--quiet',
          '--output=json',
          `--output-path=${reportPath}`,
          '--only-categories=performance,accessibility,best-practices',
          '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
        ],
        {
          stdio: 'inherit',
          env: { ...process.env, CHROME_PATH: chromium.executablePath() },
        },
      )
      child.once('error', reject)
      child.once('exit', (code) =>
        code === 0
          ? resolve()
          : reject(new Error(`Lighthouse ${label} exited ${code}`)),
      )
    })
    const report = JSON.parse(await readFile(reportPath, 'utf8'))
    if (report.runtimeError) throw new Error(report.runtimeError.message)
    const value = (key) => report.audits[key]?.numericValue ?? null
    measurements.push({
      route,
      environment:
        'local production build; Lighthouse default mobile simulation',
      lighthouseVersion: report.lighthouseVersion,
      scores: Object.fromEntries(
        Object.entries(report.categories).map(([key, category]) => [
          key,
          category.score,
        ]),
      ),
      lcpMs: value('largest-contentful-paint'),
      cls: value('cumulative-layout-shift'),
      tbtMs: value('total-blocking-time'),
      fcpMs: value('first-contentful-paint'),
      warnings: report.runWarnings,
    })
  }
} finally {
  server.kill('SIGTERM')
  await writeFile(
    `${output}/summary.json`,
    JSON.stringify(measurements, null, 2),
  )
}
console.log(JSON.stringify(measurements, null, 2))
