# Current architecture

This document describes the static portfolio and its shared editorial system. The owner-approved My Story V2 came from PR #10; website-wide adaptation is documented in `EDITORIAL-AUDIT.md` and `EDITORIAL-STORYTELLING.md`. Release records distinguish drafted, tested and deployed changes.

## Runtime and rendering

- Astro 7 uses `output: 'static'`, canonical site `https://zainsaleem.co`, and `trailingSlash: 'always'` (`astro.config.mjs`). The build produces static HTML and assets.
- React 19 is integrated with `@astrojs/react` for the `DualExpertise.tsx` interaction and `BriefForm.tsx` draft experience. Most UI is rendered by `.astro` components and remains useful without JavaScript.
- Tailwind CSS 4 is configured through `@tailwindcss/vite`; semantic styles live in `src/styles/`. Manrope and Instrument Serif are self-hosted.
- `src/layouts/Layout.astro` provides page chrome, canonical/meta tags, social preview metadata, structured Person data, and the publication gate.

## Content and routes

- `src/data/site.ts`: name, canonical domain, email, Calendly, portrait, socials, six services, `publicationApproved`.
- `src/data/brand.ts`: verified role, positioning, career facts, and quantitative claims.
- `src/data/content.ts`: typed projects, case studies, and articles. Arrays are intentionally empty until evidence and owner approval are supplied.
- `src/pages/services/[slug].astro`: statically generates six service routes from `services`.
- `src/pages/services/index.astro`: Build/Grow directory using the same service titles, summaries and slugs. Header links target Work, Services, About, My Story, Experience and Contact; Expertise and Insights remain in footer/contextual links. Exact pages use `aria-current="page"`; service detail pages mark the Services ancestor with `aria-current="location"`.
- `src/pages/projects/[slug].astro`, `case-studies/[slug].astro`, and `insights/[slug].astro`: content detail routes governed by approved entries.
- Other pages include homepage, contact, about, my-story, experience, expertise, work, insights, privacy, and 404.

## Contact and booking data flow

Visitor -> hydrated `BriefForm.tsx` -> browser validation -> `mailto:` URL or downloaded text file. No form backend, stored submission, or automatic email delivery exists. Booking links open the existing external Calendly destination. Do not introduce tracking or third-party processing without a separate privacy review.

Contact presents Calendly booking and direct email before the optional email brief. Shared Consultation links provide both methods plus `/contact/#email-brief`. Service detail inquiries add only the public service title to a URL-encoded mailto subject; the contact page does not parse query parameters or prefill personal information.

## Styling, themes, and interaction

`src/styles/tokens.css` defines semantic colors, type, spacing, and motion values. `themes.css` defines the alternate `ink-and-sage` theme; `typography.css` and `globals.css` apply them. `design-system/MASTER.md` is the approved visual authority. Reduced motion, focus states, keyboard/touch interaction, and responsive widths are tested. Do not refer to a nonexistent `src/data/motion.ts`.

`src/components/editorial/` provides static, opt-in content primitives. `EditorialFrame` imports `editorial.css`; the stylesheet's `ed-*` patterns are scoped away from chrome and My Story. `EditorialIntro` supplies one H1 and optional before/after slots, `EditorialSection` supplies an explicitly labelled surface, `NarrativePanel` groups a supported aside and caption, and `ReadingNav` uses native section anchors. Personal, commercial and utility compositions consume these primitives with the existing semantic palette. No new client island or animation dependency is introduced.

The future article template uses a readable content measure and native navigation when there are more than two sections. `ContentSections` supplies stable per-page anchors and an optional attributed quote. Quote text and attribution still require factual/publication approval. The article/project/case-study arrays remain empty; there are no filler public routes. My Story's independently approved raw HTML, scoped stylesheet and lightweight progress enhancement remain intact.

## Publication and response controls

The indexing decision is gated by both `publicationApproved` and `PUBLIC_DEPLOYMENT_ENV === 'production'` in `Layout.astro` and generated crawl files. The owner approved the public launch on 20 October 2026, so the publication gate is true. `src/data/seo.mjs` owns the metadata and explicit indexable route inventory. Default builds are previews; `scripts/build.mjs` selects production only for the existing Workers Builds main branch or an explicit production test. `PUBLIC_DEPLOYMENT_ENV` is set for Astro by that wrapper. The bundled `.astro/indexing-policy.json` mirrors the build decision and existing security headers. `src/worker.ts` enforces the canonical host, preserves security headers and keeps preview hosts noindex with blocked robots and an empty sitemap, even when serving a production artifact. No account-level or DNS configuration is needed. See `SEO-LAUNCH.md`.

## Build, CI, and hosting

- `npm run build` invokes the environment-aware build wrapper, Astro and `scripts/verify-build.mjs`. `npm run build:production` explicitly tests the public build. `npm run typecheck` generates ignored Worker policy/types before Astro diagnostics.
- Playwright and axe tests live under `tests/`; `playwright.config.ts` uses local preview by default and browser-managed Chromium in CI.
- `.github/workflows/portfolio-checks.yml` runs dependency installation, typecheck, ESLint, Prettier, build, Playwright, Worker-header verification, and evidence upload in both preview and production modes. Visual tests preserve the original eight scenarios and PR #10's two Story scenarios, then extend coverage for materially revised pages. References are committed under `tests/visual.spec.ts-snapshots/`, with zero differing pixels allowed and snapshot updates disabled in normal runs. See `docs/VISUAL-BASELINES.md` for review provenance and future updates.
- `tests/editorial.spec.ts` audits all registered public pages in both themes at 320/390/768/1024/1440/1920px, checks axe at mobile width and saves desktop/mobile review evidence under ignored `artifacts/editorial/current/`. The no-JS pass follows every reading anchor. `scripts/review-editorial.mjs <stage>` can capture an independent native image/heading/metadata inventory without changing accepted references.
- GitHub `main` is linked to the production Cloudflare Worker `portfolio`. The checked-in `wrangler.jsonc` is configured for a distinct preview Worker named `zain-saleem-portfolio-preview`; do not conflate the two.
- Production smoke verification and the exact deployed merge commit are recorded in `docs/PHASE3-RELEASE.md`.

## Boundaries

No database, auth, analytics, contact submission backend, or client CMS is currently required. Preserve static-first architecture and avoid new dependencies without a demonstrated need. Document real source changes in the relevant file rather than creating parallel sources of truth.
