import { publicationApproved, site } from '../data/site'
import { indexableRoutes } from '../data/seo.mjs'
export function GET() {
  const routes =
    publicationApproved &&
    import.meta.env.PUBLIC_DEPLOYMENT_ENV === 'production'
      ? indexableRoutes
      : []
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `<url><loc>${site.url}${path}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  )
}
