// Review and approve snapshots from the accepted Phase 2.1 baseline.
// Do not auto-commit snapshots: visual changes need owner review.
import { expect, test } from '@playwright/test'

const views = [
  { label: 'home-mobile', route: '/', width: 390, theme: 'dual-contrast' },
  { label: 'home-desktop', route: '/', width: 1440, theme: 'dual-contrast' },
  { label: 'home-sage-mobile', route: '/', width: 390, theme: 'ink-and-sage' },
  { label: 'home-sage-desktop', route: '/', width: 1440, theme: 'ink-and-sage' },
  {
    label: 'contact-mobile',
    route: '/contact/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'contact-desktop',
    route: '/contact/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'service-mobile',
    route: '/services/ai-automation/',
    width: 390,
    theme: 'dual-contrast',
  },
] as const

for (const view of views) {
  test(`approved visual baseline: ${view.label}`, async ({ page }) => {
    await page.setViewportSize({ width: view.width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(view.route)
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme
    }, view.theme)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page).toHaveScreenshot(`${view.label}.png`, {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      mask: [page.locator('.footer-bottom p')], // Dynamic copyright year
      maxDiffPixelRatio: 0.001,
    })
  })
}

test('approved visual baseline: mobile menu open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible()
  await expect(page.locator('.site-header')).toHaveScreenshot(
    'mobile-navigation-open.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    },
  )
})
