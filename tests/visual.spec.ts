// Compare all eight scenarios against reviewed, committed PNG references.
// Normal test runs never generate or accept missing/changed references.
import { expect, test } from '@playwright/test'

async function loadPageImages(page: import('@playwright/test').Page) {
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded()
  }
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true)
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function expectApprovedPage(
  page: import('@playwright/test').Page,
  options: { label: string; locator?: string },
) {
  await loadPageImages(page)
  const target = options.locator ? page.locator(options.locator) : page
  await expect(target).toHaveScreenshot(`${options.label}.png`, {
    animations: 'disabled',
    caret: 'hide',
    ...(options.locator ? {} : { fullPage: true }),
    mask: options.locator ? [] : [page.locator('.footer-bottom p')],
    // Preserve the previous CI's exact-pixel requirement; no tolerance increase.
    threshold: 0,
    maxDiffPixels: 0,
  })
}

const views = [
  {
    label: 'technical-seo-mobile',
    route: '/services/technical-seo/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'technical-seo-desktop',
    route: '/services/technical-seo/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'services-mobile',
    route: '/services/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'services-desktop',
    route: '/services/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'service-desktop',
    route: '/services/ai-automation/',
    width: 1440,
    theme: 'dual-contrast',
  },
  { label: 'work-mobile', route: '/work/', width: 390, theme: 'dual-contrast' },
  {
    label: 'work-desktop',
    route: '/work/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'about-mobile',
    route: '/about/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'about-desktop',
    route: '/about/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'experience-mobile',
    route: '/experience/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'experience-desktop',
    route: '/experience/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'expertise-mobile',
    route: '/expertise/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'expertise-desktop',
    route: '/expertise/',
    width: 1440,
    theme: 'dual-contrast',
  },
  {
    label: 'story-mobile',
    route: '/my-story/',
    width: 390,
    theme: 'dual-contrast',
  },
  {
    label: 'story-desktop',
    route: '/my-story/',
    width: 1440,
    theme: 'dual-contrast',
  },
  { label: 'home-mobile', route: '/', width: 390, theme: 'dual-contrast' },
  { label: 'home-desktop', route: '/', width: 1440, theme: 'dual-contrast' },
  { label: 'home-sage-mobile', route: '/', width: 390, theme: 'ink-and-sage' },
  {
    label: 'home-sage-desktop',
    route: '/',
    width: 1440,
    theme: 'ink-and-sage',
  },
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
    await expectApprovedPage(page, { label: view.label })
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
  await expectApprovedPage(page, {
    label: 'mobile-navigation-open',
    locator: '.site-header',
  })
})
