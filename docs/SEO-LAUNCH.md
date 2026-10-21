# Public search launch

The owner explicitly authorized public indexing, scoped implementation and production release after green CI on 20 October 2026. This replaces the former prelaunch gate; historical release reports still describe their original noindex state.

## Sources of truth

- `src/data/site.ts`: approval, canonical site configuration, services and contact destinations.
- `src/data/seo.mjs`: unique page metadata, primary search intent, explicit indexable route inventory and crawler policy. Metadata is separate from visible service summaries; no duplicate service content was introduced.
- `src/data/structured-data.ts`: a linked JSON-LD graph from verified public data.
- `public/_headers`: the existing security policy and a restrictive fallback. Build output varies indexing headers only.
- `scripts/build.mjs` and `scripts/indexing-policy.mjs`: Astro environment and bundled Worker policy. The ignored generated policy is not a public asset.
- `src/worker.ts`: canonical-host enforcement of indexing and preservation of security headers. Cloudflare does not automatically attach `_headers` to custom Worker responses, so the Worker applies the same source security policy explicitly.

## Route decisions and intent

Fourteen pages are eligible in production: Home, Services, six services, About, Experience, Expertise, My Story, Work and Contact. Each has a distinct intent and unique title/description in the metadata inventory. The homepage owns personal-brand/positioning intent; Services compares offerings; individual services own their commercial topic. About is a personal profile; Experience records roles, Expertise explains approach, My Story is autobiographical, and Work explains work areas without presenting fabricated case studies.

Privacy remains `noindex, follow` as a utility page. Empty Insights remains `noindex, follow` until substantive approved articles exist. Missing/unpublished projects, case studies and articles return 404 and are excluded. There are no location/doorway pages. Existing URLs, visible copy, design, portraits, navigation, animations and contact behavior are preserved.

## Environment matrix

| Build / request                                       | HTML and HTTP robots | robots.txt                                           | Sitemap                 |
| ----------------------------------------------------- | -------------------- | ---------------------------------------------------- | ----------------------- |
| Default/local/PR/staging                              | noindex, nofollow    | Disallow all                                         | Empty                   |
| Production artifact on workers.dev/version/other host | noindex, nofollow    | Disallow all                                         | Empty                   |
| Production on zainsaleem.co, approved page            | index, follow        | Search discovery allowed; training groups disallowed | 14 canonical HTTPS URLs |
| Production utility or missing page                    | noindex, follow      | Crawl permitted so noindex can be read               | Excluded                |

`npm run build` defaults to preview. The existing Cloudflare pipeline's documented `WORKERS_CI=1` and `WORKERS_CI_BRANCH=main` select production. `npm run build:production` is the explicit local/CI production test. The wrapper sets `PUBLIC_DEPLOYMENT_ENV` for Astro. An arbitrary inherited `PUBLIC_DEPLOYMENT_ENV=production` does not make an ordinary preview build public. Production artifacts are additionally protected at runtime by canonical-host checks. Headers supplied by a visitor cannot opt preview hosts into indexing.

No lastmod, changefreq or priority values are fabricated. Add future content to the approved content data and metadata inventory only after content approval, then require sitemap/HTTP/schema tests. No analytics, cookies, submission backend or new third-party service was added.

On the canonical production host, HTTP requests redirect permanently to HTTPS with the path and query preserved. This is enforced in the Worker without changing zone settings. Production Worker QA uses a temporary local certificate trusted explicitly by the test client, plus a second HTTP listener to verify the redirect. Certificate validation is not disabled.

## Entity and crawler policy

The graph connects stable Person `/#person`, WebSite `/#website`, page `#webpage`, breadcrumbs and service entities. About is a ProfilePage whose main entity is the verified Person. Services lists six real offerings; each detail page uses Service with that Person as provider. Job title comes from verified visible content. Following the owner's personal-brand refinement, the employer is described in public prose and Person `worksFor` is omitted; no anonymous Organization entity is substituted. No addresses, ratings, testimonials, awards or credentials were invented. Service schema does not imply eligibility for a Google rich result.

Search discovery is allowed through the wildcard group, with an explicit OAI-SearchBot group. Training opt-outs cover GPTBot, Google-Extended, ClaudeBot, CCBot and Applebot-Extended. Googlebot access is separate from Google-Extended. ChatGPT-User is a user-triggered fetcher, not the automatic search-indexing control. robots is a cooperative policy, not authentication or a guarantee against scraping.

Read-only Cloudflare inspection found AI-training blocking enabled and AI-search blocking disabled, Bot Fight Mode off, no custom WAF entrypoint, and the existing managed protections. No security settings were changed. Managed robots may prepend Cloudflare policy; live effective policy must also be verified.

## Validation and release

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test`. Then repeat build and full Playwright with `npm run build:production` and `TEST_DEPLOYMENT_ENV=production npm test`. Run `scripts/verify-worker-headers.mjs` against an actual local Wrangler instance for each build. It checks canonical and preview Host headers, all 14 approved routes, utility/404 responses, headers, crawl files and icons. It refuses non-local targets.

The eight visual scenarios remain compare-only against the existing reviewed references, with zero differing pixels allowed. No reference update is planned for head-only SEO changes. Any difference must be investigated and inspected before acceptance. CI runs both complete suites and both actual Worker checks. Generated metadata evidence is uploaded under `artifacts/`.

After green CI, review the exact diff, merge under the owner's release authorization, identify the Cloudflare build/version for the exact merge, and verify live HTML/HTTP indexing, metadata, schema, robots, sitemap, assets, redirects and conversions. Submit the sitemap only after live production is confirmed indexable. Record actual release evidence and external-validator/platform results in the PR and final report; do not infer indexing from successful delivery.

Search Console access is verified/full for `sc-domain:zainsaleem.co`; the prelaunch inspection reported “URL is unknown to Google” with no previous sitemap submission. Bing access was not configured. If unavailable at release, the owner must connect Bing Webmaster Tools or import the verified Google property, then submit `https://zainsaleem.co/sitemap.xml`. No DNS changes are authorized by this document.

## Official references

- [Workers Builds variables](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Static asset headers and Worker responses](https://developers.cloudflare.com/workers/static-assets/headers/)
- [OpenAI crawler roles](https://developers.openai.com/api/docs/bots)
- [Google AI search fundamentals](https://developers.google.com/search/docs/appearance/ai-features)
- [Google crawler controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [Anthropic crawler policy](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Common Crawl CCBot](https://commoncrawl.org/faq)
- [Applebot controls](https://support.apple.com/en-us/119829)
- [Schema.org ProfilePage](https://schema.org/ProfilePage) and [Service](https://schema.org/Service)

Crawlability, structured data and sitemap submission do not guarantee indexing, rankings or AI citations. New search-performance/field Core Web Vitals data, useful approved content and independent citations remain later priorities.
