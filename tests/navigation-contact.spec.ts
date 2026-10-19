import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { publicationApproved, services, site } from '../src/data/site'

const navigation = [
  ['Work', '/work/'],
  ['Services', '/services/'],
  ['About', '/about/'],
  ['Experience', '/experience/'],
  ['Contact', '/contact/'],
] as const

test('desktop navigation follows page routes and marks only the current page', async ({
  page,
}) => {
  for (const [label, route] of navigation) {
    await page.goto(route)
    const nav = page.getByRole('navigation', {
      name: 'Main navigation',
      exact: true,
    })
    await expect(nav.getByRole('link')).toHaveText(
      navigation.map(([name]) => name),
    )
    for (const [name, href] of navigation) {
      await expect(
        nav.getByRole('link', { name, exact: true }),
      ).toHaveAttribute('href', href)
    }
    await expect(nav.locator('[aria-current]')).toHaveCount(1)
    await expect(
      nav.getByRole('link', { name: label, exact: true }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('.brand')).toHaveAttribute('href', '/')
  }
  await page.goto('/')
  await expect(page.locator('.desktop-nav [aria-current]')).toHaveCount(0)
})

test('mobile navigation works by keyboard, restores focus on Escape and closes after navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/services/')
  const toggle = page.locator('.menu-toggle')
  const nav = page.getByRole('navigation', {
    name: 'Mobile navigation',
    exact: true,
  })
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(nav.getByRole('link')).toHaveText([
    ...navigation.map(([name]) => name),
    'Book a Call',
  ])
  await page.keyboard.press('Tab')
  await expect(
    nav.getByRole('link', { name: 'Work', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  const current = nav.getByRole('link', { name: 'Services', exact: true })
  await expect(current).toBeFocused()
  await expect(current).toHaveAttribute('aria-current', 'page')
  expect(
    await current.evaluate((element) => {
      const style = getComputedStyle(element)
      return (
        style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2
      )
    }),
  ).toBe(true)
  await page.keyboard.press('Escape')
  await expect(nav).toBeHidden()
  await expect(toggle).toBeFocused()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/work\/$/)
  await expect(nav).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(
    nav.getByRole('link', { name: 'Work', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
})

test('Services directory groups all six shared service summaries and links to the detail journey', async ({
  page,
}) => {
  await page.goto('/services/')
  await expect(page).toHaveTitle(
    'Services — SaaS Development, AI Automation & SEO | Zain Saleem',
  )
  await expect(page.locator('main h1')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${site.url}/services/`,
  )
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /SaaS product development.*technical SEO.*local SEO.*link building/,
  )
  await expect(page.locator('.service-directory article')).toHaveCount(6)
  for (const group of ['Build', 'Grow']) {
    const section = page.getByRole('region', { name: group, exact: true })
    await expect(
      section.getByRole('heading', { name: group, level: 2 }),
    ).toBeVisible()
    await expect(section.locator('article')).toHaveCount(3)
    for (const service of services.filter((item) => item.group === group)) {
      const entry = section.locator('article').filter({
        has: page.getByRole('heading', { name: service.title, level: 3 }),
      })
      await expect(entry.locator('p')).toHaveText(service.summary)
      await expect(entry.getByRole('link')).toHaveAttribute(
        'href',
        `/services/${service.slug}/`,
      )
    }
  }
  for (const service of services) {
    await page.goto(`/services/${service.slug}/`)
    await expect(page.locator('.desktop-nav a[aria-current]')).toHaveAttribute(
      'href',
      '/services/',
    )
    await expect(page.locator('.desktop-nav a[aria-current]')).toHaveAttribute(
      'aria-current',
      'location',
    )
    await expect(
      page.getByRole('link', { name: 'All services', exact: true }),
    ).toHaveAttribute('href', '/services/')
    const email = page
      .locator('main')
      .getByRole('link', { name: 'Send an Email', exact: true })
    const url = new URL((await email.getAttribute('href'))!)
    expect(url.protocol).toBe('mailto:')
    expect(url.pathname).toBe(site.email)
    expect(url.searchParams.get('subject')).toBe(`Inquiry — ${service.title}`)
    expect([...url.searchParams.keys()]).toEqual(['subject'])
    await expect(
      page
        .locator('main')
        .getByRole('link', { name: 'Book a Call', exact: true }),
    ).toHaveAttribute('href', site.bookingUrl)
    await page
      .getByRole('link', { name: 'Prepare an Email Brief', exact: true })
      .click()
    await expect(page).toHaveURL(/\/contact\/#email-brief$/)
    await expect(
      page.getByRole('heading', { name: 'Prepare an Email Brief' }),
    ).toBeInViewport()
  }
})

test('contact distinguishes booking, direct email and optional browser-only drafts', async ({
  page,
}) => {
  await page.goto('/contact/')
  const main = page.locator('main')
  for (const name of [
    'Book a Call',
    'Send an Email',
    'Prepare an Email Brief',
  ]) {
    await expect(
      main.getByRole('heading', { name, exact: true, level: 2 }),
    ).toBeVisible()
  }
  await expect(
    main.getByRole('link', { name: 'Book a Call', exact: true }),
  ).toHaveAttribute('href', site.bookingUrl)
  await expect(
    main.getByRole('link', { name: 'Send an Email', exact: true }),
  ).toHaveAttribute('href', `mailto:${site.email}`)
  await expect(main).toContainText('Calendly opens in a new tab')
  await expect(main).toContainText('Nothing is submitted through this website.')
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET') requests.push(request.url())
  })
  await page.locator('form').scrollIntoViewIfNeeded()
  await expect(page.getByLabel('Your name')).toBeEnabled()
  await page.getByLabel('Your name').fill('QA & Visitor')
  await page.getByLabel('Your email').fill('visitor@example.com')
  await page.getByLabel('What can I help with?').selectOption('Technical SEO')
  await page
    .getByLabel('A little about your project')
    .fill('Review crawling & indexing, then discuss a practical plan.')
  await page
    .getByRole('button', { name: 'Prepare an email', exact: true })
    .click()
  const draft = new URL(
    (await page
      .getByRole('link', { name: 'Open email draft' })
      .getAttribute('href'))!,
  )
  expect(draft.searchParams.get('subject')).toBe(
    'Project inquiry — Technical SEO',
  )
  expect(draft.searchParams.get('body')).toContain(
    'Name: QA & Visitor\nEmail: visitor@example.com\nFocus: Technical SEO',
  )
  expect(draft.searchParams.get('body')).toContain('Review crawling & indexing')
  expect(new URL(page.url()).search).toBe('')
  expect(requests).toEqual([])
  await expect(page.getByRole('status')).toHaveText(
    'Your draft is ready; nothing has been sent.',
  )
})

test('mobile navigation and services-to-contact journey remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/')
  const nav = page.getByRole('navigation', {
    name: 'Navigation without JavaScript',
  })
  for (const [name, href] of navigation) {
    await expect(nav.getByRole('link', { name, exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute(
      'href',
      href,
    )
  }
  await expect(nav.getByRole('link', { name: 'Book a Call' })).toHaveAttribute(
    'href',
    site.bookingUrl,
  )
  await nav.getByRole('link', { name: 'Services', exact: true }).click()
  await expect(
    nav.getByRole('link', { name: 'Services', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await page
    .locator('main')
    .getByRole('link', { name: 'Technical SEO', exact: true })
    .click()
  await page
    .getByRole('link', { name: 'Prepare an Email Brief', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Prepare an email', exact: true }),
  ).toBeDisabled()
  await expect(
    page
      .locator('main')
      .getByRole('link', { name: 'Send an Email', exact: true }),
  ).toHaveAttribute('href', `mailto:${site.email}`)
  await context.close()
})

for (const theme of ['dual-contrast', 'ink-and-sage']) {
  test(`capture navigation and conversion review candidates in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of ['services', 'contact']) {
        await page.goto(`/${route}/`)
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value
        }, theme)
        await page.evaluate(() => document.fonts.ready)
        const screenshot = await page.screenshot({
          path: `artifacts/${route}-${theme}-${width}-candidate.png`,
          fullPage: true,
          animations: 'disabled',
        })
        await testInfo.attach(`${route}-${width}-candidate`, {
          body: screenshot,
          contentType: 'image/png',
        })
      }
      if (width === 390) {
        await page.locator('.menu-toggle').click()
        await page.locator('.site-header').screenshot({
          path: `artifacts/navigation-${theme}-candidate.png`,
          animations: 'disabled',
        })
      }
    }
  })

  test(`Services directory and open mobile menu have no WCAG A/AA violations in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/services/')
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value
    }, theme)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const scan = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
    expect((await scan()).violations).toEqual([])
    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('.menu-toggle').click()
    expect((await scan()).violations).toEqual([])
  })
}

test('new service route keeps independent crawl restrictions', async ({
  page,
  request,
}) => {
  expect(publicationApproved).toBe(false)
  await page.goto('/services/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  )
  expect(await (await request.get('/robots.txt')).text()).toMatch(
    /^User-agent: \*\s+Disallow: \/\s*$/,
  )
  expect(await (await request.get('/sitemap.xml')).text()).not.toMatch(
    /<url(?:\s|>)/,
  )
})
