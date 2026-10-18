# Zain Saleem — Dual Contrast portfolio

Personal-brand portfolio for SaaS development, AI automation, and SEO strategy. The live site is `https://zainsaleem.co`; GitHub `main` deploys to Cloudflare Worker `portfolio`. **The site is deliberately not approved for search indexing.**

## Technology

Astro 7 static output, React 19 islands, TypeScript, Tailwind CSS 4, semantic CSS, self-hosted Manrope and Instrument Serif, Playwright/axe, and Cloudflare Workers static assets. The existing contact form prepares an email draft and text download; it does not send or store submissions.

## Develop locally

Use a supported Node version consistent with the lockfile and CI (GitHub Actions currently uses Node 22). Install dependencies with `npm ci`.

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm run build
npm test
```

`npm run build` also executes `scripts/verify-build.mjs`, which checks generated content and indexing restrictions. Playwright starts an Astro preview unless `TEST_BASE_URL` is set. In CI it uses Playwright-managed Chromium; local setups may use `/usr/bin/chromium` or override `CHROMIUM_PATH`. See `playwright.config.ts`.

The local Worker header check is performed by `.github/workflows/portfolio-checks.yml` using `wrangler dev --local` and `scripts/verify-worker-headers.mjs`. Do not treat a local Worker response as live production evidence.

## Source map

| Location                                              | Responsibility                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`                            | Document metadata, canonical URLs, global shell, indexing meta               |
| `src/components/`                                     | Astro components and two interactive React islands                           |
| `src/data/site.ts`                                    | Public identity/contact, service definitions, publication gate               |
| `src/data/brand.ts`                                   | Approved professional facts and career narrative data                        |
| `src/data/content.ts`                                 | Typed projects, case studies, and articles; currently empty pending approval |
| `src/styles/`                                         | Semantic tokens, themes, typography, and global styles/motion                |
| `public/_headers`                                     | Static asset security and indexing response headers                          |
| `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts` | Crawling and sitemap policy                                                  |
| `scripts/`                                            | Generated-build and local Worker integrity checks                            |
| `tests/`                                              | Functional, accessibility, responsive, and visual Playwright tests           |
| `.github/workflows/portfolio-checks.yml`              | Automated CI quality gates                                                   |

See `docs/ARCHITECTURE.md` for detail and `design-system/MASTER.md` for approved design decisions.

## Content, design, and privacy

Edit service/contact links in `src/data/site.ts`, verified professional facts in `src/data/brand.ts`, and evidence-backed approved editorial entries in `src/data/content.ts`. Never invent client work or publish company-owned screenshots without permission. Review `CONTENT_TODO.md` before any public-content change.

Use semantic variables from `src/styles/tokens.css`, and preserve the approved Dual Contrast layout and both themes. Read `docs/DESIGN-CONTENT-CONVENTIONS.md` before visual changes. The contact draft is client-side; no analytics, database, or contact-form backend is configured.

## Deployment and indexing

`main` is the production deployment branch. The actual production Worker is `portfolio`; the checked-in `wrangler.jsonc` names `zain-saleem-portfolio-preview` for a separate manual preview workflow. **Do not run a manual Wrangler deploy expecting it to target production.** Verify the intended target and obtain approval first.

`publicationApproved = false`; generated HTML contains `noindex, nofollow`, `robots.txt` disallows crawling, `sitemap.xml` contains no URL entries, and `public/_headers` sends `X-Robots-Tag: noindex, nofollow`. These controls must not be relaxed without explicit approval.

The Phase 3 QA suite was merged to `main` at `6705916d7b6c7e435d60d36bb309b919ce5fd0d7`. GitHub Actions Run #4 passed and the production release was smoke-tested; see `docs/PHASE3-RELEASE.md` for evidence and limitations. `QA.md` is an earlier prototype verification record, not the current release status.

## Working with AI tools

Read `AGENTS.md` and `docs/DEVELOPMENT-WORKFLOW.md`. Prefer direct GitHub integration for inspection and documentation; use Codex when local execution or browser debugging is necessary. Require explicit authorization for remote writes and production operations.
