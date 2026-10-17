import { publicationApproved, site, services } from '../data/site'
import { projects, caseStudies, articles } from '../data/content'
export function GET() {
  const routes =
    publicationApproved &&
    import.meta.env.PUBLIC_DEPLOYMENT_ENV === 'production'
      ? [
          '/',
          '/work/',
          ...services.map((s) => `/services/${s.slug}/`),
          ...projects
            .filter((p) => p.approved)
            .map((p) => `/projects/${p.slug}/`),
          ...caseStudies
            .filter((c) => c.approved)
            .map((c) => `/case-studies/${c.slug}/`),
          ...articles
            .filter((a) => a.approved)
            .map((a) => `/insights/${a.slug}/`),
        ]
      : []
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((p) => `<url><loc>${site.url}${p}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  )
}
