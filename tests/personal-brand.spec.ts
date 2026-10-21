import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { seoPages } from '../src/data/seo.mjs'

const employerNames =
  /reds[\s-]*glow|pearl[\s-]*lemon|trace[\s-]*mark(?:\s+impression)?|lem[\s-]*studio|lemon[\s-]*studio/i

test('public copy and metadata lead with the person without disclosing employers', async ({
  page,
}) => {
  for (const path of Object.keys(seoPages).filter((p) => p !== '/404/')) {
    await page.goto(path)
    expect(await page.locator('body').innerText()).not.toMatch(employerNames)
    expect(await page.title()).not.toMatch(employerNames)
    expect(
      await page.locator('meta[name="description"]').getAttribute('content'),
    ).not.toMatch(employerNames)
    const schema = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText(),
    )
    expect(JSON.stringify(schema)).not.toMatch(employerNames)
    const person = schema['@graph'].find(
      (node: Record<string, unknown>) => node['@type'] === 'Person',
    )
    expect(person['@id']).toBe('https://zainsaleem.co/#person')
    expect(person).not.toHaveProperty('worksFor')
  }
  await page.goto('/')
  await expect(page.locator('.hero-position')).toHaveText(
    'SaaS Product Development AI Automation & SEO Strategy',
  )
  await expect(page.locator('#work')).toContainText(
    'Head of SaaS at a UK-based software product company',
  )
})

test('all seven story chapters retain chronology, specificity and ownership distinctions', async ({
  page,
}) => {
  await page.goto('/my-story/')
  const chapters = page.locator('.story-chapter')
  await expect(chapters).toHaveCount(7)
  await expect(chapters.locator('h2')).toHaveText([
    'The kid who wanted to figure things out.',
    'The first real test.',
    'From SEO intern to leading delivery.',
    'Learning that the job is bigger than the title.',
    'A weekend challenge changed everything.',
    'Products, people and everything after the launch.',
    'Still curious. More responsibility.',
  ])
  for (const [i, paragraphs] of [3, 3, 3, 2, 3, 4, 3].entries())
    await expect(chapters.nth(i).locator('.brand-reading > p')).toHaveCount(
      paragraphs,
    )
  for (const text of [
    'seventh grade',
    'At 15',
    'Pakistan-based technology startup',
    'April 29, 2024',
    'Off-Page SEO Intern',
    'Head of Off-Page SEO for the client-facing side',
    '15 or more campaigns at once, sometimes over 20',
    'US-based digital marketing agency',
    'more than 20 clients',
    'trained a successor',
    'transition of roughly a month',
    'UK-based software product company',
    'develops, launches and sells its own software products to customers across different countries',
    'more than 50 software projects',
    'Approximately 20 or more reached launch',
    'products belong to the company',
    'not as products I own personally',
    'more than 100 booking pages',
    'managed teams of more than ten',
    'trained more than 25 people',
    'write poetry, read, cook and play cricket',
  ])
    await expect(page.locator('main')).toContainText(text)
  await expect(chapters.nth(1)).toContainText('The website came back online.')
  await expect(chapters.nth(5)).toContainText(
    "I'm not a traditional programmer",
  )
})

test('experience labels preserve actual roles, campaign scope and approximate milestones', async ({
  page,
}) => {
  await page.goto('/experience/')
  await expect(page.locator('.career-title h3')).toHaveText([
    'Pakistan-Based Technology Startup',
    'UK-Based Digital Marketing Agency',
    'US-Based Digital Marketing Agency',
    'UK-Based Software Product Company',
  ])
  await expect(page.locator('.career-detail h4')).toHaveText([
    'Website operations, WordPress performance & troubleshooting',
    'Off-Page SEO Intern → Head of Off-Page SEO (client-facing)',
    'SEO partner / SEO delivery leadership',
    'Head of SaaS — Product Development & Operations',
  ])
  for (const text of [
    'Joined 29 April 2024',
    '15+ concurrent campaigns',
    '20+ clients',
    'develops and sells its own software products internationally',
    'Approximately 20+ launches',
    'The products belong to the company',
    'not presenting a portfolio of personally owned products',
  ])
    await expect(page.locator('main')).toContainText(text)
  await expect(page.locator('.brand-metric > strong')).toHaveText([
    '50+',
    '20+',
    '25+',
    '10+',
  ])
})

for (const theme of ['dual-contrast', 'ink-and-sage']) {
  test(`edited narrative pages remain readable and accessible in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const path of ['/about/', '/my-story/', '/experience/', '/work/']) {
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value
        }, theme)
        await page.evaluate(() => document.fonts.ready)
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${path} at ${width}`,
        ).toBe(true)
        if (width === 390)
          expect(
            (
              await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
                .analyze()
            ).violations,
            path,
          ).toEqual([])
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: `artifacts/brand-review/${path.replaceAll('/', '')}-${theme}-${width}.png`,
            fullPage: true,
            animations: 'disabled',
          })
      }
    }
  })
}
