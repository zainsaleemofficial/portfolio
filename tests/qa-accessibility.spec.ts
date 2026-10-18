import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test('keyboard entry reveals the skip link and a visible focus outline', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  expect(
    await skip.evaluate((element) => {
      const style = getComputedStyle(element)
      return (
        style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2
      )
    }),
  ).toBe(true)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

for (const theme of ['dual-contrast', 'ink-and-sage'] as const) {
  test(`contact form submitted state has no WCAG A/AA violations in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/contact/')
    await page.evaluate((selectedTheme) => {
      document.documentElement.dataset.theme = selectedTheme
    }, theme)
    await page.locator('form').scrollIntoViewIfNeeded()
    await page.waitForFunction(
      () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
    )
    const name = page.getByLabel('Your name')
    await expect(name).toBeEnabled()
    await name.fill('QA Visitor')
    await page.getByLabel('Your email').fill('visitor@example.com')
    await page
      .getByLabel('What can I help with?')
      .selectOption({ label: 'AI automation' })
    await page
      .getByLabel('A little about your project')
      .fill('Please advise on a reliable workflow automation.')
    await page.getByRole('button', { name: 'Prepare an email' }).click()
    await expect(page.getByRole('status')).toContainText(
      'nothing has been sent',
    )
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze()
    expect(results.violations).toEqual([])
  })
}

test('reduced motion suppresses entrance animation without hiding the main content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('main h1')).toBeVisible()
  await expect(page.locator('.hero-copy')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.hero-portrait')).toBeVisible()
})
