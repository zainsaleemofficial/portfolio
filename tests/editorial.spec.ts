import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { seoPages } from '../src/data/seo.mjs'
import { expectedRobots } from './seo-helpers'
import { services } from '../src/data/site'

const routes = Object.keys(seoPages).filter((path) => path !== '/404/')
const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

test('service explanations retain the accurate shared problem, scope, process and expectations', async ({
  page,
}) => {
  for (const service of services) {
    await page.goto(`/services/${service.slug}/`)
    await expect(page.locator('.ed-service-problem')).toHaveText(
      service.problem,
    )
    await expect(page.locator('#starting-point')).toContainText(service.intro)
    await expect(page.locator('.ed-scope-list li p')).toHaveText([
      ...service.scope,
    ])
    await expect(page.locator('#approach')).toContainText(service.process)
    await expect(page.locator('#approach')).toContainText(service.note)
  }
})

for (const theme of ['dual-contrast', 'ink-and-sage']) {
  test(`editorial inventory: every page fits, reads and remains accessible in ${theme}`, async ({
    page,
  }) => {
    test.setTimeout(240000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const route of routes) {
      for (const width of [320, 390, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 })
        const response = await page.goto(route)
        expect(response?.status(), route).toBe(200)
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value
        }, theme)
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator('main h1')).toHaveCount(1)
        await expect(page.locator('main h1')).toBeVisible()
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${route} at ${width}`,
        ).toBe(true)
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          'content',
          expectedRobots(route),
        )
        if (width === 390) {
          expect(
            (await new AxeBuilder({ page }).withTags(tags).analyze())
              .violations,
            route,
          ).toEqual([])
        }
        if (width === 390 || width === 1440) {
          for (const image of await page.locator('img').all())
            await image.scrollIntoViewIfNeeded()
          await page.evaluate(() => scrollTo(0, 0))
          await page.screenshot({
            path: `artifacts/editorial/current/${route === '/' ? 'home' : route.replaceAll('/', '-')}-${theme}-${width}.png`,
            fullPage: true,
            animations: 'disabled',
          })
        }
      }
    }
  })
}

test('editorial reading links and core actions remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    const links = page.locator('main .ed-reading-nav a')
    for (const link of await links.all()) {
      const href = await link.getAttribute('href')
      expect(href).toMatch(/^#.+/)
      await expect(page.locator(href!)).toHaveCount(1)
      await link.click()
      await expect(page).toHaveURL(new RegExp(`${href}$`))
    }
  }
  await context.close()
})
