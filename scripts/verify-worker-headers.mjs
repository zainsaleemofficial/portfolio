// Read-only verification against an already running LOCAL Wrangler preview.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const defaultHeaders = (await readFile('public/_headers', 'utf8'))
  .split('/_astro/*')[0]
  .split('\n')
  .flatMap((line) => {
    const match = line.match(/^\s+([^:]+):\s*(.+)$/)
    return match ? [[match[1], match[2]]] : []
  })

const base = process.env.LOCAL_WORKER_URL || 'http://127.0.0.1:8787'
const url = new URL(base)
assert.equal(url.protocol, 'http:', 'Local Worker test requires HTTP')
assert(
  ['127.0.0.1', 'localhost', '::1'].includes(url.hostname),
  'Refusing non-local Worker verification target',
)

async function request(path) {
  let lastError
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(new URL(path, url), {
        signal: AbortSignal.timeout(5000),
        redirect: 'manual',
      })
      // Wait for Wrangler to finish starting, never bypass a live HTTP failure.
      if (response.status === 503 && attempt < 39) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        continue
      }
      return response
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  throw new Error(`Local Worker unavailable: ${String(lastError)}`)
}

for (const path of [
  '/',
  '/about/',
  '/my-story/',
  '/experience/',
  '/services/',
  '/services/saas-development/',
  '/services/ai-automation/',
  '/services/custom-software/',
  '/services/technical-seo/',
  '/services/local-seo/',
  '/services/link-building/',
  '/contact/',
]) {
  const response = await request(path)
  assert.equal(response.status, 200, `${path}: expected HTTP 200`)
  for (const [name, value] of defaultHeaders) {
    assert.equal(response.headers.get(name), value, `${path}: ${name}`)
  }
  assert.equal(
    response.headers.get('x-robots-tag')?.replace(/\s+/g, '').toLowerCase(),
    'noindex,nofollow',
    `${path}: restrictive X-Robots-Tag required`,
  )
}
console.log('Verified restrictive local Worker headers on 12 routes.')
