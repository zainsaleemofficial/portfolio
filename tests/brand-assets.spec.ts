import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { seoPages, siteOrigin } from '../src/data/seo.mjs'

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

test('all pages declare the portrait PNG and multi-size ICO without the legacy Z reference', async ({
  page,
}) => {
  for (const path of Object.keys(seoPages).filter((p) => p !== '/404/')) {
    await page.goto(path)
    const icons = page.locator('head link[rel="icon"]')
    await expect(icons).toHaveCount(2)
    await expect(icons.nth(0)).toHaveAttribute('href', '/favicon.ico')
    await expect(icons.nth(0)).toHaveAttribute('type', 'image/x-icon')
    await expect(icons.nth(0)).toHaveAttribute(
      'sizes',
      '16x16 32x32 48x48 96x96',
    )
    await expect(icons.nth(1)).toHaveAttribute('href', '/favicon-96.png')
    await expect(icons.nth(1)).toHaveAttribute('sizes', '96x96')
    await expect(
      page.locator('head link[rel="apple-touch-icon"]'),
    ).toHaveAttribute('href', '/apple-touch-icon.png')
    await expect(page.locator('head link[href="/favicon.svg"]')).toHaveCount(0)
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'Zain Saleem',
    )
  }
})

test('portrait icon responses are decodable, correctly sized and consistent with every ICO frame', async ({
  request,
}) => {
  const pngs = new Map<number, Buffer>()
  for (const size of [32, 48, 96, 180]) {
    const path = size === 180 ? '/apple-touch-icon.png' : `/favicon-${size}.png`
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
    const png = await response.body()
    expect(png.subarray(0, 8)).toEqual(pngSignature)
    const metadata = await sharp(png).metadata()
    expect([metadata.width, metadata.height]).toEqual([size, size])
    expect(png.length).toBeLessThan(size === 180 ? 25000 : 10000)
    pngs.set(size, png)
  }
  const response = await request.get('/favicon.ico')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(
    /image\/(x-icon|vnd\.microsoft\.icon)/,
  )
  const ico = await response.body()
  expect(ico.readUInt16LE(0)).toBe(0)
  expect(ico.readUInt16LE(2)).toBe(1)
  expect(ico.readUInt16LE(4)).toBe(4)
  let end = 70
  for (const [i, size] of [16, 32, 48, 96].entries()) {
    const entry = 6 + i * 16
    expect([ico[entry], ico[entry + 1]]).toEqual([size, size])
    expect(ico.readUInt16LE(entry + 4)).toBe(1)
    expect(ico.readUInt16LE(entry + 6)).toBe(32)
    const length = ico.readUInt32LE(entry + 8)
    const offset = ico.readUInt32LE(entry + 12)
    expect(offset).toBe(end)
    const frame = ico.subarray(offset, offset + length)
    expect(frame.subarray(0, 8)).toEqual(pngSignature)
    expect((await sharp(frame).metadata()).width).toBe(size)
    if (size !== 16) expect(frame).toEqual(pngs.get(size))
    end += length
  }
  expect(end).toBe(ico.length)
  const legacy = await request.get('/favicon.svg')
  expect(legacy.status()).toBe(200)
  expect(await legacy.text()).toContain(
    `data:image/png;base64,${pngs.get(96)!.toString('base64')}`,
  )
  expect(await legacy.text()).not.toMatch(/<text|<path/)
})

test('portrait sources stay authentic and displayed image priorities remain appropriate', async ({
  page,
}) => {
  const original = await readFile('public/images/zain-hero-studio-2026.webp')
  expect(createHash('sha256').update(original).digest('hex')).toBe(
    '3843c9d8ab178cae7a3498133497178c883f1d497fbdacb19e4c7cec91917bb2',
  )
  const cutout = await readFile('public/images/zain-portrait.webp')
  expect(createHash('sha256').update(cutout).digest('hex')).toBe(
    '554110be131c7da9a61be1e0271e9d0af36a0589d30a88b8210fe236cb08798f',
  )
  await page.goto('/')
  const hero = page.locator('.hero-portrait img')
  await expect(hero).toHaveAttribute(
    'alt',
    'Zain Saleem in a navy blazer, looking thoughtfully to the left',
  )
  await expect(hero).toHaveAttribute('width', '1122')
  await expect(hero).toHaveAttribute('height', '1402')
  await expect(hero).toHaveAttribute('fetchpriority', 'high')
  await expect(hero).not.toHaveAttribute('loading', 'lazy')
  const duplicates = page.locator('.identity-photo[aria-hidden="true"] img')
  await expect(duplicates).toHaveCount(2)
  for (const image of await duplicates.all()) {
    await expect(image).toHaveAttribute('alt', '')
    await expect(image).toHaveAttribute('width', '620')
    await expect(image).toHaveAttribute('height', '775')
    await expect(image).toHaveAttribute('fetchpriority', 'low')
  }
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  )
  expect(
    schema['@graph'].find(
      (node: Record<string, unknown>) => node['@type'] === 'Person',
    ).image,
  ).toBe(siteOrigin + '/images/zain-hero-studio-2026.webp')
})
