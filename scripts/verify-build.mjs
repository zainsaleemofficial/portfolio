import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import assert from 'node:assert/strict'

async function walk(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...(await walk(path)))
    else result.push(path)
  }
  return result
}

const attribute = (tag, name) => {
  const match = tag.match(
    new RegExp(`(?:\\s|<)${name}\\s*=\\s*["']([^"']*)["']`, 'i'),
  )
  return match?.[1]
}

const SITE_URL = 'https://zainsaleem.co'
const production = process.env.PUBLIC_DEPLOYMENT_ENV === 'production'
const { seoPages, indexableRoutes, crawlerPolicy } =
  await import('../src/data/seo.mjs')
const decode = (s) =>
  s
    ?.replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
const titles = new Set(),
  descriptionsSeen = new Set(),
  metadata = []
const files = await walk('dist')
const html = files.filter((file) => file.endsWith('.html'))
assert(html.length >= 16, 'Missing expected static pages')

for (const file of html) {
  const text = await readFile(file, 'utf8')
  const head = text.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  assert(head, `${file}: missing head`)
  assert.equal(
    (text.match(/<h1(?:\s|>)/gi) || []).length,
    1,
    `${file}: exactly one h1`,
  )

  const metaTags = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0])
  const robots = metaTags.filter(
    (tag) => attribute(tag, 'name')?.toLowerCase() === 'robots',
  )
  assert.equal(robots.length, 1, `${file}: exactly one robots meta tag`)
  const route = file.endsWith('404.html')
    ? '/404/'
    : '/' +
      relative('dist', file).split(sep).slice(0, -1).filter(Boolean).join('/') +
      '/'
  const path = route === '//' ? '/' : route
  const page = seoPages[path]
  assert(page, `${file}: register metadata and an explicit indexing decision`)
  const expectedRobots = production
    ? page.index
      ? 'index, follow'
      : 'noindex, follow'
    : 'noindex, nofollow'
  assert.equal(
    attribute(robots[0], 'content'),
    expectedRobots,
    `${file}: indexing policy`,
  )
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1])
  assert.equal(title, page.title, `${file}: metadata title`)
  assert(!titles.has(title), `${file}: duplicate title`)
  titles.add(title)
  const descriptions = metaTags.filter(
    (tag) => attribute(tag, 'name')?.toLowerCase() === 'description',
  )
  assert.equal(
    descriptions.length,
    1,
    `${file}: exactly one description meta tag`,
  )
  const description = decode(attribute(descriptions[0], 'content'))
  assert.equal(description, page.description, `${file}: metadata description`)
  assert(!descriptionsSeen.has(description), `${file}: duplicate description`)
  descriptionsSeen.add(description)

  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0])
  const canonicals = links.filter(
    (tag) => attribute(tag, 'rel')?.toLowerCase() === 'canonical',
  )
  assert.equal(canonicals.length, 1, `${file}: exactly one canonical`)
  const canonical = attribute(canonicals[0], 'href')
  assert(canonical, `${file}: canonical missing href`)
  assert.equal(
    new URL(canonical).origin,
    SITE_URL,
    `${file}: canonical site origin`,
  )
  if (file.endsWith(`${sep}index.html`)) {
    const directory = relative('dist', file).split(sep).slice(0, -1).join('/')
    const route = directory ? `/${directory}/` : '/'
    assert.equal(canonical, `${SITE_URL}${route}`, `${file}: canonical route`)
  }

  for (const [name, expected] of [
    ['og:title', title],
    ['og:description', description],
    ['og:url', canonical],
    ['og:image', `${SITE_URL}/social-preview.png`],
  ]) {
    assert.equal(
      decode(
        attribute(
          metaTags.find((tag) => attribute(tag, 'property') === name) || '',
          'content',
        ),
      ),
      expected,
      `${file}: ${name}`,
    )
  }
  for (const [name, expected] of [
    ['twitter:title', title],
    ['twitter:description', description],
    ['twitter:image', `${SITE_URL}/social-preview.png`],
  ]) {
    assert.equal(
      decode(
        attribute(
          metaTags.find((tag) => attribute(tag, 'name') === name) || '',
          'content',
        ),
      ),
      expected,
      `${file}: ${name}`,
    )
  }
  const scripts = [
    ...text.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ]
  assert.equal(scripts.length, 1, `${file}: one linked JSON-LD graph`)
  const data = JSON.parse(scripts[0][1])
  assert.equal(data['@context'], 'https://schema.org')
  const ids = new Set(data['@graph'].map((node) => node['@id']))
  assert.equal(ids.size, data['@graph'].length, `${file}: unique entity IDs`)
  function validateReferences(node) {
    if (!node || typeof node !== 'object') return
    if (node['@id'])
      assert(ids.has(node['@id']), `${file}: dangling graph reference`)
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(validateReferences)
      else if (value && typeof value === 'object') validateReferences(value)
    }
  }
  data['@graph'].forEach(validateReferences)
  assert(
    data['@graph'].some((node) => node['@type'] === 'Person'),
    `${file}: Person`,
  )
  const person = data['@graph'].find((node) => node['@type'] === 'Person')
  assert(
    !Object.hasOwn(person, 'worksFor'),
    `${file}: employer is not disclosed`,
  )
  const employerNames =
    /reds[\s-]*glow|pearl[\s-]*lemon|trace[\s-]*mark(?:\s+impression)?|lem[\s-]*studio|lemon[\s-]*studio/i
  const publicText = text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
  assert.doesNotMatch(
    publicText,
    employerNames,
    `${file}: public employer name`,
  )
  assert.doesNotMatch(
    title + ' ' + description,
    employerNames,
    `${file}: employer metadata`,
  )
  assert(
    data['@graph'].some((node) => node['@type'] === 'WebSite'),
    `${file}: WebSite`,
  )
  metadata.push({
    url: canonical,
    title,
    description,
    canonical,
    indexing: expectedRobots,
    intent: page.intent,
  })

  for (const match of text.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = decodeURIComponent(match[1])
    const path = join('dist', target)
    const found = await stat(path).catch(() => null)
    assert(found, `${file}: missing target ${target}`)
  }
  // Check fragment destinations across pages as well as local skip links.
  for (const match of text.matchAll(/href="([^"\s]*)"/g)) {
    const href = match[1]
    if (!href.startsWith('/') && !href.startsWith('#')) continue
    const destination = new URL(href, canonical)
    assert.equal(destination.origin, SITE_URL, `${file}: internal link origin`)
    if (!destination.hash) continue
    let targetHtml = text
    if (!href.startsWith('#')) {
      const targetPath = join('dist', decodeURIComponent(destination.pathname))
      const targetStat = await stat(targetPath)
      targetHtml = await readFile(
        targetStat.isDirectory() ? join(targetPath, 'index.html') : targetPath,
        'utf8',
      )
    }
    const ids = [...targetHtml.matchAll(/\bid="([^"]*)"/g)].map((m) => m[1])
    assert(
      ids.includes(decodeURIComponent(destination.hash.slice(1))),
      `${file}: missing fragment destination ${href}`,
    )
  }
}

const robotsTxt = await readFile('dist/robots.txt', 'utf8')
assert.equal(
  robotsTxt,
  crawlerPolicy(production),
  'Environment-specific crawler policy',
)
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.match(sitemap, /<urlset\b/i)
const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
)
assert.deepEqual(
  sitemapURLs.sort(),
  (production ? indexableRoutes.map((path) => SITE_URL + path) : []).sort(),
)
assert.doesNotMatch(sitemap, /<(lastmod|changefreq|priority)>/)
const headers = await readFile('dist/_headers', 'utf8')
assert(
  headers.includes(
    `X-Site-Environment: ${production ? 'production' : 'preview'}`,
  ),
)
assert(
  headers.includes(
    `X-Robots-Tag: ${production ? 'index, follow' : 'noindex, nofollow'}`,
  ),
)
const sourceHeaders = await readFile('public/_headers', 'utf8')
for (const line of sourceHeaders
  .split('\n')
  .filter((line) => line.trim() && !line.includes('X-Robots-Tag'))) {
  assert(
    headers.includes(line),
    'Security and cache headers must remain unchanged',
  )
}
assert.match(
  await readFile('src/data/site.ts', 'utf8'),
  /export const publicationApproved\s*=\s*true\b/,
)
await mkdir('artifacts', { recursive: true })
await writeFile(
  `artifacts/seo-${production ? 'production' : 'preview'}-metadata.json`,
  JSON.stringify(metadata, null, 2),
)

const home = await readFile('dist/index.html', 'utf8')
assert(
  home.includes('50+ software projects'),
  'Homepage must label project count accurately',
)
assert(
  home.includes('Head of SaaS at a UK-based software product company'),
  'Homepage should reflect verified current role',
)
assert(
  home.includes('/my-story/'),
  'Homepage should link to the complete story',
)

for (const page of [
  'about',
  'my-story',
  'experience',
  'expertise',
  'services',
  'services/ai-automation',
  'services/saas-development',
  'services/custom-software',
  'services/technical-seo',
  'services/local-seo',
  'services/link-building',
]) {
  const content = await readFile(`dist/${page}/index.html`, 'utf8')
  assert(content.includes('Zain Saleem'), `${page}: missing brand identity`)
}
console.log(
  `Verified ${html.length} HTML pages, canonical/description/robots metadata, internal assets, content integrity, ${production ? '14 public sitemap URLs' : 'empty preview sitemap'}, and environment-specific headers.`,
)
