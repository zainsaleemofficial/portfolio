import { publicationApproved } from './data/site'
import policy from '../.astro/indexing-policy.json'
import {
  seoPages,
  siteOrigin,
  crawlerPolicy,
  emptySitemap,
} from './data/seo.mjs'

// A production artifact must never make workers.dev or version-preview hosts
// indexable. No request headers can opt a preview host into public indexing.
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const production =
      publicationApproved &&
      url.hostname === new URL(siteOrigin).hostname &&
      policy.production
    if (production && url.protocol === 'http:') {
      url.protocol = 'https:'
      const headers = new Headers(policy.securityHeaders)
      headers.set('Location', url.href)
      return new Response(null, { status: 301, headers })
    }
    const asset = await env.ASSETS.fetch(request)
    const headers = new Headers(asset.headers)
    for (const [name, value] of Object.entries(policy.securityHeaders))
      headers.set(name, value)
    headers.delete('X-Site-Environment')
    const html = headers.get('content-type')?.includes('text/html')
    const indexable =
      production &&
      asset.status === 200 &&
      (!html || seoPages[url.pathname]?.index === true)
    const robots = indexable
      ? 'index, follow'
      : production
        ? 'noindex, follow'
        : 'noindex, nofollow'
    headers.set('X-Robots-Tag', robots)
    if (production && url.pathname.startsWith('/_astro/'))
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    if (!production) {
      headers.set('Cache-Control', 'no-store')
      headers.delete('ETag')
      headers.delete('Last-Modified')
      if (url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml') {
        headers.set(
          'Content-Type',
          url.pathname === '/robots.txt'
            ? 'text/plain; charset=utf-8'
            : 'application/xml',
        )
        return new Response(
          request.method === 'HEAD'
            ? null
            : url.pathname === '/robots.txt'
              ? crawlerPolicy(false)
              : emptySitemap,
          { status: 200, headers },
        )
      }
    }
    const response = new Response(asset.body, {
      status: asset.status,
      statusText: asset.statusText,
      headers,
    })
    if (!production && html && request.method !== 'HEAD') {
      return new HTMLRewriter()
        .on('meta[name="robots"]', {
          element(element) {
            element.setAttribute('content', robots)
          },
        })
        .transform(response)
    }
    return response
  },
}
