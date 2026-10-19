import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const width of [320, 375, 390, 768, 844, 1024, 1440, 1920]) {
  test(`dual expertise keeps aligned, unobstructed content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 844 ? 390 : 900 })
    await page.goto('/#expertise')
    const scene = page.locator('.identity-scene')
    await scene.scrollIntoViewIfNeeded()
    await page.evaluate(() => document.fonts.ready)
    await expect(scene.getByRole('button').first()).toBeEnabled()

    for (const theme of ['dual-contrast', 'ink-and-sage']) {
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme
      }, theme)
      const geometry = await scene.evaluate((element) => {
        const rect = (selector: string) =>
          element.querySelector(selector)!.getBoundingClientRect()
        const photo = rect('.identity-photo')
        const software = rect('.identity-copy--software')
        const search = rect('.identity-copy--search')
        const offsets = ['.identity-index', 'h3', 'p', 'a'].map((selector) =>
          Math.abs(
            rect(`.identity-copy--software ${selector}`).top -
              rect(`.identity-copy--search ${selector}`).top,
          ),
        )
        return {
          offsets,
          separated:
            innerWidth < 768
              ? photo.top >= Math.max(software.bottom, search.bottom) + 20
              : photo.left >= software.right - 1 &&
                photo.right <= search.left + 1,
          noOverflow: document.documentElement.scrollWidth <= innerWidth,
          textFits: [...element.querySelectorAll('.identity-copy')].every(
            (copy) => copy.scrollWidth <= copy.clientWidth + 1,
          ),
        }
      })
      expect(geometry.offsets, theme).toEqual([0, 0, 0, 0])
      expect(geometry.separated, theme).toBe(true)
      expect(geometry.noOverflow, theme).toBe(true)
      expect(geometry.textFits, theme).toBe(true)

      for (const link of await scene.locator('.identity-discover').all()) {
        await link.scrollIntoViewIfNeeded()
        await expect(link).toBeVisible()
        const box = await link.boundingBox()
        expect(box?.height).toBeGreaterThanOrEqual(44)
        // Hit-test the label itself, not just its transparent link box.
        expect(
          await link.evaluate((element) => {
            const range = document.createRange()
            range.selectNodeContents(element.firstChild!)
            const box = range.getBoundingClientRect()
            return element.contains(
              document.elementFromPoint(
                box.x + box.width / 2,
                box.y + box.height / 2,
              ),
            )
          }),
        ).toBe(true)
      }
    }
    if (width === 390 || width === 1440) {
      expect(
        (
          await new AxeBuilder({ page })
            .include('.identity-experience')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([])
    }
    const seo = scene.getByRole('link', { name: 'Explore SEO' })
    await seo.focus()
    await expect(seo).toBeFocused()
    expect(
      await seo.evaluate((element) => {
        const style = getComputedStyle(element)
        return (
          style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2
        )
      }),
    ).toBe(true)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/services\/technical-seo\/$/)
  })
}

test('dual expertise links remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/#expertise')
  await page.getByRole('link', { name: 'Explore SEO', exact: true }).click()
  await expect(page).toHaveURL(/\/services\/technical-seo\/$/)
  await context.close()
})
