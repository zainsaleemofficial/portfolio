import { expect, test } from '@playwright/test'

const representativeRoutes = [
  '/about/',
  '/contact/',
  '/services/ai-automation/',
]

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`supporting pages fit the ${width}px viewport without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of representativeRoutes) {
      await page.goto(route)
      await expect(page.locator('main h1')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(
        dimensions.documentWidth,
        `${route} at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewportWidth)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      )
    }
  })
}
