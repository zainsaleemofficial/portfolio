import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`homepage layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Software with')
    await page.evaluate(() => document.fonts.ready)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await expect(page.locator('.hero-portrait')).toBeVisible()
    expect(
      (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
    ).toEqual([])
    await page.screenshot({
      path: `artifacts/home-${width}.png`,
      fullPage: true,
      animations: 'disabled',
    })
    await page.screenshot({
      path: `artifacts/hero-${width}.png`,
      animations: 'disabled',
    })
    expect(errors).toEqual([])
    expect(
      await page
        .locator('img')
        .evaluateAll((imgs) =>
          imgs.every(
            (i) =>
              (i as HTMLImageElement).complete &&
              (i as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    ).toBe(true)
  })
}
test('mobile navigation opens, closes on Escape, and follows anchors', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open navigation' })
  await toggle.click()
  await expect(page.locator('#mobile-nav')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(page.locator('#mobile-nav')).toBeHidden()
  await toggle.click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Services' })
    .click()
  await expect(page).toHaveURL(/#services$/)
  await expect(page.locator('#mobile-nav')).toBeHidden()
})
test('filters and service disclosures work', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'SEO', exact: true }).click()
  await expect(page.locator('.work-card:visible')).toHaveCount(1)
  await expect(page.locator('.work-count')).toHaveText('1 area of expertise')
  await page.getByRole('button', { name: 'Software', exact: true }).click()
  await expect(page.locator('.work-card:visible')).toHaveCount(2)
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await expect(page.locator('.work-card:visible')).toHaveCount(3)
  const item = page
    .locator('.service-item')
    .filter({ hasText: 'Technical SEO' })
  await item.locator('summary').click()
  await item.getByRole('link', { name: 'Explore this service' }).click()
  await expect(page).toHaveURL(/services\/technical-seo\/$/)
  await expect(page.locator('h1')).toContainText('Technical SEO')
})
test('expertise supports presets and keyboard', async ({ page }) => {
  await page.goto('/#expertise')
  const slider = page.getByRole('slider')
  await slider.scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
  )
  await page.getByRole('button', { name: 'Build', exact: true }).click()
  await expect(slider).toHaveValue('25')
  await slider.focus()
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveValue('30')
  await page.keyboard.press('End')
  await expect(slider).toHaveValue('80')
  await expect(slider).toHaveAttribute(
    'aria-valuetext',
    'Search strategy in focus',
  )
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
  await page.getByRole('button', { name: 'Both', exact: true }).click()
  await expect(slider).toHaveValue('50')
})
test('expertise supports touch', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto('/#expertise')
  const slider = page.getByRole('slider')
  await slider.scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
  )
  await page.getByRole('button', { name: 'Grow', exact: true }).tap()
  await expect(slider).toHaveValue('75')
  const box = await slider.boundingBox()
  if (!box) throw Error('Slider missing')
  await page.touchscreen.tap(box.x + box.width * 0.25, box.y + box.height / 2)
  expect(Number(await slider.inputValue())).toBeLessThan(50)
  await context.close()
})
test('contact validates and creates a draft without claiming delivery', async ({
  page,
}) => {
  await page.goto('/contact/')
  await page.locator('form').scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
  )
  await page.getByRole('button', { name: 'Prepare an email' }).click()
  await expect(page.getByLabel('Your name')).toBeFocused()
  await page.getByLabel('Your name').fill('Test Visitor')
  await page.getByLabel('Your email').fill('visitor@example.com')
  await page.getByLabel('What can I help with?').selectOption('Technical SEO')
  await page
    .getByLabel('A little about your project')
    .fill('I would like to discuss improvements to my website.')
  await page.getByRole('button', { name: 'Prepare an email' }).click()
  await expect(page.getByRole('status')).toContainText('nothing has been sent')
  const draft = await page
    .getByRole('link', { name: 'Open email draft' })
    .getAttribute('href')
  expect(draft).toContain('mailto:me@zainsaleem.co?')
  expect(decodeURIComponent(draft!)).toContain('visitor@example.com')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download a copy' }).click()
  expect((await download).suggestedFilename()).toBe('project-brief.txt')
  await expect(
    page.getByRole('link', { name: 'Choose a call time' }),
  ).toHaveAttribute('href', 'https://calendly.com/zainsaleemofficial/30min')
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})
test('core content remains usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Make it work.' }),
  ).toBeVisible()
  await page.locator('.service-item').first().locator('summary').click()
  await expect(
    page.locator('.service-item').first().getByRole('link'),
  ).toBeVisible()
  await context.close()
})
test('alternate theme and reduced motion preserve contrast and content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(
    () => (document.documentElement.dataset.theme = 'ink-and-sage'),
  )
  expect(
    await page
      .locator('.hero-copy')
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe('none')
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
  await page.screenshot({
    path: 'artifacts/alternate-theme.png',
    fullPage: true,
    animations: 'disabled',
  })
})
test('static routes, metadata, local anchors and assets resolve', async ({
  page,
  request,
}) => {
  const routes = [
    '/',
    '/work/',
    '/insights/',
    '/privacy/',
    '/contact/',
    '/services/saas-development/',
    '/services/custom-software/',
    '/services/technical-seo/',
    '/services/local-seo/',
    '/services/link-building/',
  ]
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
    const links = await page
      .locator('a[href^="#"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    for (const link of links) expect(await page.locator(link!).count()).toBe(1)
  }
  expect((await request.get('/social-preview.png')).status()).toBe(200)
  expect(await (await request.get('/robots.txt')).text()).toContain(
    'Disallow: /',
  )
  expect(await (await request.get('/sitemap.xml')).text()).toContain('<urlset')
  await page.goto('/not-a-real-page/')
  await expect(page.locator('h1')).toContainText('Nothing here')
})
