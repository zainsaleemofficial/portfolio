import { publicationApproved } from '../data/site'
import { crawlerPolicy } from '../data/seo.mjs'
export function GET() {
  const live =
    publicationApproved &&
    import.meta.env.PUBLIC_DEPLOYMENT_ENV === 'production'
  return new Response(crawlerPolicy(live), {
    headers: { 'Content-Type': 'text/plain' },
  })
}
