import { expect, test } from '@playwright/test'

test('approved My Story v2 is complete, navigable and keeps the shared header', async ({ page }) => {
  await page.goto('/my-story/')
  await expect(page.locator('.story-v2 h1')).toContainText('I never had a')
  await expect(page.locator('.story-v2 [data-chapter]')).toHaveCount(7)
  await expect(page.locator('.story-v2 .dialogue-scene')).toHaveCount(1)
  await expect(page.locator('.site-header .desktop-nav a[href="/my-story/"]')).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.story-v2 a[href="#the-weekend"]')).toHaveCount(2)
  await expect(page.locator('.story-v2 a[href="https://calendly.com/zainsaleemofficial/30min"]')).toHaveAttribute('rel', /noopener/)
  const contrast = await page.locator('.story-v2 .chapter--5 .story-copy p').first().evaluate((element) => getComputedStyle(element, '::first-letter').color)
  expect(contrast).toBe('rgb(233, 255, 242)')
})

test('My Story chapter links remain usable at mobile widths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/my-story/')
  await page.getByRole('link', { name: /jump to the turning point/i }).click()
  await expect(page).toHaveURL(/#the-weekend$/)
  await expect(page.locator('#the-weekend')).toBeVisible()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'My Story' })).toBeVisible()
})
