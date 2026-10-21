import { expectedRobots, productionBuild } from './seo-helpers'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`homepage layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
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
test('mobile navigation opens, closes on Escape, and follows page links', async ({
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
  await expect(page).toHaveURL(/\/services\/$/)
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
test('expertise responds to mouse, focus controls, and keyboard without a slider', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/#expertise')
  await page.locator('.identity-scene').scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
  )
  await expect(page.getByRole('slider')).toHaveCount(0)
  const scene = page.locator('.identity-scene')
  const software = scene.getByRole('button', {
    name: /Build something useful/i,
  })
  const seo = scene.getByRole('button', { name: /Make it discoverable/i })
  await software.click()
  await expect(software).toHaveAttribute('aria-pressed', 'true')
  await expect(scene).toHaveCSS('--identity-split', '77%')
  await seo.click()
  await expect(seo).toHaveAttribute('aria-pressed', 'true')
  await expect(scene).toHaveCSS('--identity-split', '23%')
  await scene.focus()
  await page.keyboard.press('ArrowRight')
  await expect(scene).toHaveCSS('--identity-split', '77%')
  await page.keyboard.press('Escape')
  await expect(scene).toHaveCSS('--identity-split', '50%')
  const box = await scene.boundingBox()
  if (!box) throw Error('Identity scene missing')
  await page.mouse.move(box.x + box.width * 0.73, box.y + box.height * 0.57)
  await expect
    .poll(async () =>
      Number(
        (
          await scene.evaluate((el) =>
            el.style.getPropertyValue('--identity-split'),
          )
        ).replace('%', ''),
      ),
    )
    .toBeGreaterThan(65)
  await expect(
    scene.getByRole('link', { name: /Explore software/i }),
  ).toHaveAttribute('href', '/services/saas-development/')
  await expect(
    scene.getByRole('link', { name: /Explore SEO/i }),
  ).toHaveAttribute('href', '/services/technical-seo/')
  expect(
    (await new AxeBuilder({ page }).withTags(tags).analyze()).violations,
  ).toEqual([])
})
test('expertise works by touch without requiring drag', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto('/#expertise')
  await page.locator('.identity-scene').scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
  )
  await page.getByRole('button', { name: /Make it discoverable/i }).tap()
  await expect(page.locator('.identity-scene')).toHaveCSS(
    '--identity-split',
    '23%',
  )
  await page.getByRole('button', { name: /Both perspectives/i }).tap()
  await expect(page.locator('.identity-scene')).toHaveCSS(
    '--identity-split',
    '50%',
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
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
    page
      .locator('main')
      .getByRole('link', { name: 'Book a Call', exact: true }),
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
    page.getByRole('button', { name: /Build something useful/i }),
  ).toBeVisible()
  await page.locator('.service-item').first().locator('summary').click()
  await expect(
    page.locator('.service-item').first().getByRole('link'),
  ).toBeVisible()
  await expect(page.getByRole('slider')).toHaveCount(0)
  await page.goto('/contact/')
  await expect(
    page.getByRole('button', { name: 'Prepare an email' }),
  ).toBeDisabled()
  await expect(page.getByLabel('Your email')).toBeDisabled()
  await expect(
    page
      .locator('main')
      .getByRole('link', { name: 'Book a Call', exact: true }),
  ).toHaveAttribute('href', 'https://calendly.com/zainsaleemofficial/30min')
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
    '/services/',
    '/services/ai-automation/',
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
      expectedRobots(route),
    )
    const links = await page
      .locator('a[href^="#"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    for (const link of links) expect(await page.locator(link!).count()).toBe(1)
  }
  expect((await request.get('/social-preview.png')).status()).toBe(200)
  expect(await (await request.get('/robots.txt')).text()).toContain(
    productionBuild ? 'Allow: /' : 'Disallow: /',
  )
  expect(await (await request.get('/sitemap.xml')).text()).toContain('<urlset')
  await page.goto('/not-a-real-page/')
  await expect(page.locator('h1')).toContainText('Nothing here')
})

test('verified personal brand pages tell the story without private project galleries', async ({
  page,
}) => {
  const routes = [
    ['/about/', 'Curious first.'],
    ['/my-story/', 'Nothing began'],
    ['/experience/', 'Roles changed.'],
    ['/expertise/', 'Make the work'],
    ['/services/ai-automation/', 'AI Automation'],
  ] as const
  for (const [route, heading] of routes) {
    await page.goto(route)
    await expect(page.locator('h1')).toContainText(heading)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      expectedRobots(route),
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
  await page.goto('/experience/')
  for (const name of [
    'Pakistan-Based Technology Startup',
    'UK-Based Digital Marketing Agency',
    'US-Based Digital Marketing Agency',
    'UK-Based Software Product Company',
  ])
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  await page.goto('/')
  await expect(
    page.getByRole('link', { name: 'My full story' }),
  ).toHaveAttribute('href', '/my-story/')
  await expect(
    page.getByRole('link', { name: 'Book a call' }).first(),
  ).toHaveAttribute('href', 'https://calendly.com/zainsaleemofficial/30min')
})
