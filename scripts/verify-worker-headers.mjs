// Verify actual LOCAL workerd responses with canonical and preview Host headers.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { indexableRoutes, crawlerPolicy, siteOrigin } from '../src/data/seo.mjs'
const source = await readFile('public/_headers', 'utf8')
const security = source
  .split('/_astro/*')[0]
  .split('\n')
  .flatMap((line) => {
    const m = line.match(/^\s+([^:]+):\s*(.+)$/)
    return m && m[1] !== 'X-Robots-Tag' ? [[m[1].toLowerCase(), m[2]]] : []
  })
const production = (await readFile('dist/_headers', 'utf8')).includes(
  'X-Site-Environment: production',
)
const base = new URL(process.env.LOCAL_WORKER_URL || 'http://127.0.0.1:8787')
assert.equal(base.protocol, 'http:')
assert(
  ['127.0.0.1', 'localhost'].includes(base.hostname),
  'Refusing non-local target',
)
async function request(path, host) {
  let lastError
  for (let i = 0; i < 40; i++) {
    try {
      const response = await new Promise((resolve, reject) => {
        const req = http.get(
          new URL(path, base),
          { headers: { Host: host } },
          (res) => {
            const chunks = []
            res.on('data', (chunk) => chunks.push(chunk))
            res.on('end', () =>
              resolve({
                status: res.statusCode,
                headers: res.headers,
                text: Buffer.concat(chunks).toString(),
              }),
            )
          },
        )
        req.setTimeout(5000, () =>
          req.destroy(new Error('Local Worker timeout')),
        )
        req.on('error', reject)
      })
      if (response.status === 503 && i < 39) throw new Error('Worker starting')
      return response
    } catch (error) {
      lastError = error
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw lastError
}
for (const host of ['zainsaleem.co', 'portfolio.example.workers.dev']) {
  const publicHost = production && host === 'zainsaleem.co'
  for (const path of [
    ...indexableRoutes,
    '/privacy/',
    '/insights/',
    '/not-a-real-page/',
  ]) {
    const r = await request(path, host)
    const missing = path === '/not-a-real-page/'
    assert.equal(r.status, missing ? 404 : 200, `${host}${path}: status`)
    for (const [name, value] of security)
      assert.equal(r.headers[name], value, `${host}${path}: ${name}`)
    const robots = !publicHost
      ? 'noindex, nofollow'
      : indexableRoutes.includes(path) && !missing
        ? 'index, follow'
        : 'noindex, follow'
    assert.equal(
      r.headers['x-robots-tag'],
      robots,
      `${host}${path}: HTTP indexing`,
    )
    assert(
      r.text.includes(`name="robots" content="${robots}"`),
      `${host}${path}: HTML indexing`,
    )
    assert.equal(
      r.headers['x-site-environment'],
      undefined,
      'Internal build marker must not leak',
    )
  }
  const robots = await request('/robots.txt', host)
  assert.equal(robots.status, 200)
  assert.equal(robots.text, crawlerPolicy(publicHost))
  const sitemap = await request('/sitemap.xml', host)
  assert.equal(sitemap.status, 200)
  const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  )
  assert.deepEqual(
    urls.sort(),
    publicHost ? indexableRoutes.map((p) => siteOrigin + p).sort() : [],
  )
  for (const path of [
    '/favicon.svg',
    '/favicon.ico',
    '/favicon-96.png',
    '/apple-touch-icon.png',
    '/social-preview.png',
  ]) {
    assert.equal(
      (await request(path, host)).status,
      200,
      `${host}${path}: public asset`,
    )
  }
}
console.log(
  `Verified actual ${production ? 'production' : 'preview'} Worker: 14 approved routes, utility/404 policy, all security headers, crawl files, assets and preview-host protection.`,
)
