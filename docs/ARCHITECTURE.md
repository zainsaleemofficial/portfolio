# Current architecture (Phase 4)

This document describes the checked-in implementation at Phase 3 production merge `6705916d7b6c7e435d60d36bb309b919ce5fd0d7`. It is descriptive, not a redesign proposal.

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
- `src/pages/services/index.astro`: Build/Grow directory using the same service titles, summaries and slugs. Header links target Work, Services, About, Experience and Contact pages; My Story, Expertise and Insights remain in footer/contextual links. Exact pages use `aria-current="page"`; service detail pages mark the Services ancestor with `aria-current="location"`.
- `src/pages/projects/[slug].astro`, `case-studies/[slug].astro`, and `insights/[slug].astro`: content detail routes governed by approved entries.
- Other pages include homepage, contact, about, my-story, experience, expertise, work, insights, privacy, and 404.

## Contact and booking data flow

Visitor -> hydrated `BriefForm.tsx` -> browser validation -> `mailto:` URL or downloaded text file. No form backend, stored submission, or automatic email delivery exists. Booking links open the existing external Calendly destination. Do not introduce tracking or third-party processing without a separate privacy review.

Contact presents Calendly booking and direct email before the optional email brief. Shared Consultation links provide both methods plus `/contact/#email-brief`. Service detail inquiries add only the public service title to a URL-encoded mailto subject; the contact page does not parse query parameters or prefill personal information.

## Styling, themes, and interaction

`src/styles/tokens.css` defines semantic colors, type, spacing, and motion values. `themes.css` defines the alternate `ink-and-sage` theme; `typography.css` and `globals.css` apply them. `design-system/MASTER.md` is the approved visual authority. Reduced motion, focus states, keyboard/touch interaction, and responsive widths are tested. Do not refer to a nonexistent `src/data/motion.ts`.

## Publication and response controls

The indexing decision is gated by both `publicationApproved` and `PUBLIC_DEPLOYMENT_ENV === 'production'` in `Layout.astro` and generated crawl files. The current gate is false. Independent safeguards are `public/_headers` (`X-Robots-Tag`), disallowing `robots.txt`, and empty `sitemap.xml`. A deployment is not permission to index.

## Build, CI, and hosting

- `npm run build` invokes `astro build` followed by `scripts/verify-build.mjs`.
- Playwright and axe tests live under `tests/`; `playwright.config.ts` uses local preview by default and browser-managed Chromium in CI.
- `.github/workflows/portfolio-checks.yml` runs dependency installation, typecheck, ESLint, Prettier, build, Playwright, Worker-header verification, and evidence upload. Visual tests compare all eight scenarios against reviewed PNG references committed under `tests/visual.spec.ts-snapshots/`, with zero differing pixels allowed and snapshot updates disabled in normal runs. See `docs/VISUAL-BASELINES.md` for review provenance and future updates.
- GitHub `main` is linked to the production Cloudflare Worker `portfolio`. The checked-in `wrangler.jsonc` is configured for a distinct preview Worker named `zain-saleem-portfolio-preview`; do not conflate the two.
- Production smoke verification and the exact deployed merge commit are recorded in `docs/PHASE3-RELEASE.md`.

## Boundaries

No database, auth, analytics, contact submission backend, or client CMS is currently required. Preserve static-first architecture and avoid new dependencies without a demonstrated need. Document real source changes in the relevant file rather than creating parallel sources of truth.
