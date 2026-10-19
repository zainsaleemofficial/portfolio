import { expect, test } from '@playwright/test'
import { services } from '../src/data/site'

const representativeRoutes = [
  '/about/',
  '/services/',
  '/contact/',
  ...services.map((service) => `/services/${service.slug}/`),
]

for (const width of [320, 375, 390, 768, 1024, 1440]) {
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

test('services and contact fit a short landscape viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 })
  for (const route of ['/services/', '/contact/']) {
    await page.goto(route)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await expect(page.locator('.header-cta')).toBeVisible()
    await page.locator('.header-cta').focus()
    await expect(page.locator('.header-cta')).toBeFocused()
  }
})
