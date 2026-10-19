import { expect, test } from '@playwright/test'
import { services, site } from '../src/data/site'

test('mobile navigation exposes its state and resets when switching to desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  // The accessible name changes when the menu opens.
  const toggle = page.locator('.menu-toggle')
  await expect(toggle).toHaveAttribute('aria-label', 'Open navigation')
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAttribute('aria-label', 'Close navigation')
  await expect(menu).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(menu).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(menu).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('contact validation rejects invalid email and editing clears an obsolete draft', async ({
  page,
}) => {
  await page.goto('/contact/')
  await page.locator('form').scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
  )
  const name = page.getByLabel('Your name')
  const email = page.getByLabel('Your email')
  const focus = page.getByLabel('What can I help with?')
  const message = page.getByLabel('A little about your project')
  await expect(name).toBeEnabled()
  await name.fill('QA Visitor')
  await email.fill('invalid-email')
  await focus.selectOption({ label: 'Technical SEO' })
  await message.fill(
    'Please review our website accessibility and search configuration.',
  )
  await page.getByRole('button', { name: 'Prepare an email' }).click()
  expect(
    await email.evaluate(
      (input) => (input as HTMLInputElement).validity.typeMismatch,
    ),
  ).toBe(true)
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0)
  await email.fill('visitor@example.com')
  await page.getByRole('button', { name: 'Prepare an email' }).click()
  const draft = page.getByRole('link', { name: 'Open email draft' })
  await expect(draft).toHaveAttribute('href', /mailto:me@zainsaleem\.co/)
  await message.fill(
    'A revised project description with different requirements.',
  )
  await expect(draft).toHaveCount(0)
  await expect(page.getByRole('status')).toHaveCount(0)
})

test('booking calls to action use the approved URL and safe external-link attributes', async ({
  page,
}) => {
  for (const route of [
    '/',
    '/contact/',
    '/services/',
    ...services.map((service) => `/services/${service.slug}/`),
  ]) {
    await page.goto(route)
    const bookings = page.locator('a[href*="calendly.com"]')
    expect(await bookings.count(), `${route}: booking CTA`).toBeGreaterThan(0)
    for (const booking of await bookings.all()) {
      await expect(booking).toHaveAttribute('href', site.bookingUrl)
      await expect(booking).toHaveAttribute('target', '_blank')
      const rel = (await booking.getAttribute('rel'))?.split(/\s+/) ?? []
      expect(rel, `${route}: noreferrer`).toContain('noreferrer')
      expect(rel, `${route}: noopener`).toContain('noopener')
    }
  }
})

test('every approved service has matching heading, description, canonical and consultation', async ({
  page,
}) => {
  for (const service of services) {
    const path = `/services/${service.slug}/`
    await page.goto(path)
    await expect(page.locator('main h1')).toContainText(service.title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      service.summary,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${site.url}${path}`,
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
    await expect(
      page.getByRole('heading', { name: 'What the work can include' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'How we start' }),
    ).toBeVisible()
    await expect(
      page.locator('main a[href="/contact/#email-brief"]'),
    ).toHaveCount(1)
  }
})
