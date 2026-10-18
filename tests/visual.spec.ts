// Review and approve snapshots from the accepted Phase 2.1 baseline.
// Do not auto-commit snapshots: visual changes need owner review.
import { expect, test } from '@playwright/test'

const phase2BaseUrl = process.env.VISUAL_BASE_URL

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
  testInfo: import('@playwright/test').TestInfo,
  options: {
    label: string
    route: string
    width: number
    theme?: string
    locator?: string
    openMobileMenu?: boolean
  },
) {
  const screenshotOptions = {
    animations: 'disabled' as const,
    caret: 'hide' as const,
    ...(options.locator ? {} : { fullPage: true }),
  }
  const target = options.locator ? page.locator(options.locator) : page

  if (!phase2BaseUrl) {
    await expect(target).toHaveScreenshot(`${options.label}.png`, {
      ...screenshotOptions,
      mask: options.locator ? [] : [page.locator('.footer-bottom p')],
      maxDiffPixelRatio: 0.001,
    })
    return
  }

  await loadPageImages(page)
  const baselinePage = await page.context().newPage()
  try {
    await baselinePage.setViewportSize({ width: options.width, height: 900 })
    await baselinePage.emulateMedia({ reducedMotion: 'reduce' })
    await baselinePage.goto(new URL(options.route, phase2BaseUrl).href)
    if (options.theme) {
      await baselinePage.evaluate((theme) => {
        document.documentElement.dataset.theme = theme
      }, options.theme)
    }
    await baselinePage.evaluate(() => document.fonts.ready)
    await expect(baselinePage.locator('main h1')).toBeVisible()
    await loadPageImages(baselinePage)
    if (options.openMobileMenu) {
      await baselinePage
        .getByRole('button', { name: 'Open navigation' })
        .click()
      await expect(
        baselinePage.getByRole('navigation', { name: 'Mobile navigation' }),
      ).toBeVisible()
    }

    const baselineTarget = options.locator
      ? baselinePage.locator(options.locator)
      : baselinePage
    const current = await target.screenshot({
      ...screenshotOptions,
      mask: options.locator ? [] : [page.locator('.footer-bottom p')],
    })
    const approved = await baselineTarget.screenshot({
      ...screenshotOptions,
      mask: options.locator ? [] : [baselinePage.locator('.footer-bottom p')],
    })

    if (!current.equals(approved)) {
      await testInfo.attach(`${options.label}-phase3.png`, {
        body: current,
        contentType: 'image/png',
      })
      await testInfo.attach(`${options.label}-phase2.png`, {
        body: approved,
        contentType: 'image/png',
      })
    }
    expect(
      current.equals(approved),
      `${options.label} must match approved Phase 2 commit 776d747`,
    ).toBe(true)
  } finally {
    await baselinePage.close()
  }
}

const views = [
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
  test(`approved visual baseline: ${view.label}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: view.width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(view.route)
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme
    }, view.theme)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('main h1')).toBeVisible()
    await expectApprovedPage(page, testInfo, {
      ...view,
    })
  })
}

test('approved visual baseline: mobile menu open', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible()
  await expectApprovedPage(page, testInfo, {
    label: 'mobile-navigation-open',
    route: '/',
    width: 390,
    locator: '.site-header',
    openMobileMenu: true,
  })
})
