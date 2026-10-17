# Zain Saleem — Dual Contrast

A personal portfolio for a **SaaS & Software Developer × SEO Strategist**, built with static Astro pages and two React islands. Tailwind v4, semantic CSS tokens, self-hosted Manrope/Instrument Serif, Lucide, and Motion support the interface.

This is a working prototype awaiting the original portrait and approved project evidence. Illustrations are explicitly labeled; no client work, testimonials, dates, ownership, or results have been fabricated.

## Local development

Use Node 24 and npm 11. Dependency versions are locked in `package-lock.json`.

```bash
npm ci
npm run dev
```

In the managed cloud machine, set `NPM_CONFIG_CACHE=/tmp/npm-cache` and `ASTRO_TELEMETRY_DISABLED=1` first because the home directory is read-only. Astro uses port 4321. In agent sessions it may daemonize; use `npx astro dev status`, `npx astro dev logs`, or `npx astro dev stop`. Add `--ignore-lock` for foreground operation.

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm test
npm audit
```

`npm run format` applies formatting. The production build verifies pages, links, metadata, and preview indexing protection. Playwright uses `/usr/bin/chromium`; override `CHROMIUM_PATH` elsewhere. Set `TEST_BASE_URL` to test an existing local or deployed preview. Tests cover six viewport widths, axe checks, navigation, filters, service disclosures, keyboard/touch expertise controls, contact drafts, reduced motion, alternate theme, routes, and no-JavaScript content. Reports and screenshots are ignored under `artifacts/`. See `QA.md` for actual results and limitations.

## Project structure

```text
src/components/     Static components and two React islands
src/data/site.ts    Services, contact details, socials, portrait
src/data/content.ts Typed projects, software/SEO case studies, articles
src/data/motion.ts  Shared timing and easing
src/layouts/        Metadata, document, navigation, footer
src/pages/          Static pages and approved-content templates
src/styles/         Tokens, themes, typography, layout
design-system/      Design decisions and research record
scripts/            Build integrity checks
tests/              Browser and accessibility checks
```

## Update content and design

Edit verified identity, services, booking, socials, and portrait in `src/data/site.ts`. Add genuine content to `src/data/content.ts`; only entries with `approved: true` generate detail pages. Listings update automatically. Review the surrounding editorial copy when publishing the first entries. Never create thin or fictional case studies to fill slots.

Set `site.portrait` to an approved real asset with `src`, `width`, `height`, and `alt`. The hero preserves the image with `object-fit: contain`. Test actual head/shoulder framing at every required width. The current monogram explicitly marks the missing original photo.

Change colors, typography, spacing, and radii in `src/styles/tokens.css`. Try `data-theme="ink-and-sage"` in the layout for the alternate theme. `src/data/motion.ts` maps shared timing into CSS and React. See `design-system/MASTER.md` and `CONTENT_TODO.md`.

## Contact and privacy

The verified Calendly URL opens externally without an embedded widget. The brief form validates input, prepares a `mailto:` draft, and provides a text download. It never sends a message or stores data on a server. Visitors review and send email themselves. Direct email and verified social links are available. No analytics, database, tracking scripts, or authentication are required.

## Cloudflare preview

Current Astro guidance recommends **Cloudflare Workers Static Assets** for new projects. `wrangler.jsonc` targets a separate `zain-saleem-portfolio-preview` Worker, uploads `dist/`, and enables custom 404 handling. It includes no production zone, custom domain, or route.

```bash
npm run build
npm run cf:preview
# After account authentication is available:
npm run deploy:preview
```

For this cloud machine use `WRANGLER_SEND_METRICS=false` and `XDG_CONFIG_HOME=/tmp/zain-cloudflare-config`. Supply `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` securely in environment settings, never in chat or Git. Scope the token to the intended account with Workers Scripts Edit; Account Settings Read may be needed for the workers.dev subdomain lookup. Preview deployment does not need DNS-edit permission. Allow access to `api.cloudflare.com` and the resulting `*.workers.dev` hostname.

Verify the returned hosted URL, headers, mobile layouts, interactions, and Lighthouse before claiming deployment success. The local Worker runtime is not a hosted preview. The temporary-account flow requires accepting Cloudflare terms and has not been used.

## Production approval gate

Preview HTML and `_headers` send `noindex, nofollow`; robots.txt disallows crawling and the sitemap is empty. Canonical metadata, Person schema, and a 1200×630 social image are present.

Before production, complete the content checklist, verify the hosted preview, obtain explicit owner approval, and inspect the existing domain/redirect/DNS state. Then coordinate `publicationApproved`, `PUBLIC_DEPLOYMENT_ENV`, `_headers`, robots/sitemap policy, and build assertions. Keep changes minimal and reversible. No DNS, nameservers, existing redirects, or production traffic have been changed.

## Design tools

UI UX Pro Max's existing design-system workflow was used. Refero, Mobbin, and Motionsites.ai have no callable tools in this session. No skill or MCP was installed or reconfigured. Research and reference access limitations are documented in `design-system/REFERENCES.md`.
