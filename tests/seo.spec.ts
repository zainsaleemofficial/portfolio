import { expect, test } from '@playwright/test'
import {
  seoPages,
  indexableRoutes,
  siteOrigin,
  crawlerPolicy,
} from '../src/data/seo.mjs'
import { services, site } from '../src/data/site'
import { expectedRobots, productionBuild } from './seo-helpers'

test('all published pages have unique metadata, canonical and sharing identity', async ({
  page,
}) => {
  const titles = new Set<string>(),
    descriptions = new Set<string>()
  for (const [path, seo] of Object.entries(seoPages).filter(
    ([path]) => path !== '/404/',
  )) {
    expect((await page.goto(path))?.status()).toBe(200)
    await expect(page).toHaveTitle(seo.title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      seo.description,
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      expectedRobots(path),
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      siteOrigin + path,
    )
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveCount(1)
    for (const [attribute, name, value] of [
      ['property', 'og:title', seo.title],
      ['property', 'og:description', seo.description],
      ['property', 'og:url', siteOrigin + path],
      ['property', 'og:image', siteOrigin + '/social-preview.png'],
      ['name', 'twitter:title', seo.title],
      ['name', 'twitter:description', seo.description],
      ['name', 'twitter:image', siteOrigin + '/social-preview.png'],
    ])
      await expect(
        page.locator(`meta[${attribute}="${name}"]`),
      ).toHaveAttribute('content', value)
    expect(titles.has(seo.title)).toBe(false)
    titles.add(seo.title)
    expect(descriptions.has(seo.description)).toBe(false)
    descriptions.add(seo.description)
  }
})

test('linked JSON-LD describes the visible person, services and real hierarchy', async ({
  page,
}) => {
  for (const path of indexableRoutes) {
    await page.goto(path)
    const schema = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText(),
    )
    expect(schema['@context']).toBe('https://schema.org')
    const graph = schema['@graph'] as Record<string, unknown>[]
    const person = graph.find((node) => node['@type'] === 'Person')!
    expect(person['@id']).toBe(`${siteOrigin}/#person`)
    expect(person.name).toBe('Zain Saleem')
    expect(person.jobTitle).toBe('Head of SaaS')
    expect(person).not.toHaveProperty('worksFor')
    expect(graph.some((node) => node['@type'] === 'Organization')).toBe(false)
    expect(person.sameAs).toEqual(site.socials.map((s) => s.url))
    const webpage = graph.find((node) =>
      ['WebPage', 'ProfilePage'].includes(String(node['@type'])),
    )!
    expect(webpage.url).toBe(siteOrigin + path)
    expect(webpage.name).toBe(seoPages[path].title)
    if (path === '/about/') expect(webpage['@type']).toBe('ProfilePage')
    const service = services.find((s) => path === `/services/${s.slug}/`)
    if (service) {
      const node = graph.find((node) => node['@type'] === 'Service')!
      expect(node.name).toBe(service.title)
      expect(node.description).toBe(service.intro)
      expect(node.provider).toEqual({ '@id': `${siteOrigin}/#person` })
      await expect(page.locator('main')).toContainText(service.intro)
      const breadcrumb = graph.find(
        (node) => node['@type'] === 'BreadcrumbList',
      )!
      expect(breadcrumb.itemListElement).toEqual([
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteOrigin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: `${siteOrigin}/services/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: service.title,
          item: siteOrigin + path,
        },
      ])
    }
    if (path === '/services/')
      expect(
        graph.find((node) => node['@type'] === 'ItemList')?.numberOfItems,
      ).toBe(6)
    for (const node of graph)
      for (const invented of ['aggregateRating', 'review', 'award', 'address'])
        expect(node).not.toHaveProperty(invented)
  }
})

test('sitemap and crawler policies coordinate search access and training opt-outs', async ({
  request,
}) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toBe(crawlerPolicy(productionBuild))
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  expect(urls).toEqual(
    productionBuild ? indexableRoutes.map((p) => siteOrigin + p) : [],
  )
  for (const url of urls) {
    const page = await request.get(url.replace(siteOrigin, ''))
    expect(page.status()).toBe(200)
    expect(await page.text()).toContain(`rel="canonical" href="${url}"`)
    expect(await page.text()).toContain('name="robots" content="index, follow"')
  }
  expect(xml).not.toMatch(/<(lastmod|priority|changefreq)>/)
  for (const path of [
    '/projects/not-approved/',
    '/case-studies/not-approved/',
    '/insights/not-approved/',
  ])
    expect((await request.get(path)).status()).toBe(404)
})

test('brand assets are reachable with correct formats and dimensions', async ({
  request,
  page,
}) => {
  for (const [path, type] of [
    ['/favicon.svg', 'image/svg+xml'],
    ['/favicon.ico', 'image/'],
    ['/favicon-96.png', 'image/png'],
    ['/apple-touch-icon.png', 'image/png'],
    ['/social-preview.png', 'image/png'],
  ]) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain(type)
  }
  await page.goto('/')
  const dimensions = await page.evaluate(async () => {
    const sizes = []
    for (const path of [
      '/favicon-96.png',
      '/apple-touch-icon.png',
      '/social-preview.png',
    ]) {
      const image = new Image()
      image.src = path
      await image.decode()
      sizes.push([image.naturalWidth, image.naturalHeight])
    }
    return sizes
  })
  expect(dimensions).toEqual([
    [96, 96],
    [180, 180],
    [1200, 630],
  ])
})
