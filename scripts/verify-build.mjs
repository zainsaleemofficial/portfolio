import { readFile, readdir, stat } from 'node:fs/promises'
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
  assert.equal(
    attribute(robots[0], 'content'),
    'noindex, nofollow',
    `${file}: robots must block indexing`,
  )
  const descriptions = metaTags.filter(
    (tag) => attribute(tag, 'name')?.toLowerCase() === 'description',
  )
  assert.equal(
    descriptions.length,
    1,
    `${file}: exactly one description meta tag`,
  )
  assert(attribute(descriptions[0], 'content'), `${file}: nonempty description`)

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
assert.match(
  robotsTxt,
  /^User-agent:\s*\*\s*\nDisallow:\s*\/\s*$/i,
  'robots.txt must disallow all',
)
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.match(sitemap, /<urlset\b/i, 'Expected URL set root')
assert.doesNotMatch(sitemap, /<url(?:\s|>)/i, 'Sitemap must remain empty')
const headers = await readFile('dist/_headers', 'utf8')
assert.match(
  headers,
  /\/\*\s*\n\s*X-Robots-Tag:\s*noindex,\s*nofollow/i,
  'Restrictive default X-Robots-Tag required',
)
const sourceHeaders = await readFile('public/_headers', 'utf8')
assert.equal(
  headers,
  sourceHeaders,
  'Source and generated Worker headers must match',
)
const siteSource = await readFile('src/data/site.ts', 'utf8')
assert.match(
  siteSource,
  /export const publicationApproved\s*=\s*false\b/,
  'Publication approval must remain false',
)

const home = await readFile('dist/index.html', 'utf8')
assert(
  home.includes('50+ software projects'),
  'Homepage must label project count accurately',
)
assert(
  home.includes('Head of SaaS at LemStudio'),
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
  `Verified ${html.length} HTML pages, canonical/description/robots metadata, internal assets, content integrity, empty sitemap, and restrictive headers.`,
)
