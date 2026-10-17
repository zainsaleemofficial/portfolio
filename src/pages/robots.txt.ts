import { publicationApproved, site } from '../data/site'
export function GET() {
  const live =
    publicationApproved &&
    import.meta.env.PUBLIC_DEPLOYMENT_ENV === 'production'
  return new Response(
    live
      ? `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain' } },
  )
}
