// Reproducible review evidence only. This never writes accepted snapshots.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { seoPages } from '../src/data/seo.mjs'

const stage = process.argv[2] || 'candidate'
if (!/^[a-z0-9-]+$/.test(stage))
  throw new Error('Use a simple review stage name')
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4355'
const output = `artifacts/editorial/${stage}`
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
})
const pages = Object.keys(seoPages).filter((path) => path !== '/404/')
const report = []
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    })
    for (const path of pages) {
      const response = await page.goto(new URL(path, base).href)
      await page.evaluate(() => document.fonts.ready)
      for (const image of await page.locator('img').all())
        await image.scrollIntoViewIfNeeded()
      await page.evaluate(() => scrollTo(0, 0))
      const file = `${path === '/' ? 'home' : path.replaceAll('/', '-').replace(/^-|-$/g, '')}-${width}.png`
      await page.screenshot({
        path: `${output}/${file}`,
        fullPage: true,
        animations: 'disabled',
      })
      report.push({
        path,
        width,
        status: response.status(),
        screenshot: file,
        ...(await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          title: document.title,
          h1: [...document.querySelectorAll('main h1')].map((el) =>
            el.textContent.trim(),
          ),
          h2: [...document.querySelectorAll('main h2')].map((el) =>
            el.textContent.trim(),
          ),
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          robots: document.querySelector('meta[name="robots"]')?.content,
        }))),
      })
    }
    await page.close()
  }
} finally {
  await browser.close()
}
await writeFile(`${output}/inventory.json`, JSON.stringify(report, null, 2))
console.log(
  `Captured ${report.length} native full-page images and heading/metadata inventory in ${output}`,
)
if (
  report.some(
    (item) => item.overflow || item.status !== 200 || item.h1.length !== 1,
  )
)
  process.exitCode = 1
