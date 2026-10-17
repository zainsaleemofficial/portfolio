import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
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
const files = await walk('dist')
const html = files.filter((f) => f.endsWith('.html'))
assert(html.length >= 11, 'Expected homepage, services, and supporting pages')
for (const file of html) {
  const text = await readFile(file, 'utf8')
  assert.equal((text.match(/<h1[ >]/g) || []).length, 1, `${file}: one h1`)
  assert(text.includes('rel="canonical"'), `${file}: canonical`)
  assert(text.includes('noindex, nofollow'), `${file}: preview robots`)
  for (const match of text.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = decodeURIComponent(match[1])
    const path = join('dist', target)
    const found = await stat(path).catch(() => null)
    assert(found, `${file}: missing target ${target}`)
  }
}
assert((await readFile('dist/robots.txt', 'utf8')).includes('Disallow: /'))
assert(
  (await readFile('dist/_headers', 'utf8')).includes('X-Robots-Tag: noindex'),
)
const home = await readFile('dist/index.html', 'utf8')
assert(home.includes('50+ software projects'), 'Homepage must label project count accurately')
assert(home.includes('Head of SaaS at LemStudio'), 'Homepage should reflect verified current role')
assert(home.includes('/my-story/'), 'Homepage should link to the complete story')
for (const page of ['about', 'my-story', 'experience', 'expertise', 'services/ai-automation']) {
  const content = await readFile(`dist/${page}/index.html`, 'utf8')
  assert(content.includes('Zain Saleem'), `${page}: missing brand identity`)
  assert(content.includes('noindex, nofollow'), `${page}: indexing protection`)
}
console.log(
  `Verified ${html.length} static HTML pages, internal assets/links, metadata, and preview indexing protection.`,
)
