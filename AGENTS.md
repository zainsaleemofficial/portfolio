# Portfolio agent instructions

These rules apply to ChatGPT, Codex, and other coding agents working on `zainsaleemofficial/portfolio`.

## Priorities and approval gates

1. Prefer connected GitHub tools for repository inspection and small, reviewable edits. Use Codex or a terminal only when execution, screenshots, or complex debugging require it.
2. Inspect the current branch, commit, and relevant source before proposing changes. Do not assume earlier reports describe current state.
3. Never create a branch, commit, push, open a release PR, merge, deploy, change DNS/Cloudflare settings, or change indexing policy without the owner's explicit authorization for that operation. Local drafting and read-only inspection are allowed.
4. Work on one scoped development branch, normally based on current `main`; avoid unrelated refactors. Never force-push, delete branches, or overwrite work without approval.
5. `main` is connected to production Cloudflare deployment. A merge to `main` is a production release and requires separate authorization.
6. Report what was actually executed and observed. Distinguish local checks, GitHub Actions, Cloudflare build/deployment, and live HTTP checks. Never claim a passing test or deployment without evidence.

## Architecture

- Astro static pages own routes, layout, metadata, and most content; React islands are used only for interactive expertise and contact-draft experiences.
- Use strict TypeScript. Keep service/contact configuration in `src/data/site.ts`, verified career facts in `src/data/brand.ts`, and approved editorial entries in `src/data/content.ts`.
- Use `src/styles/tokens.css` for semantic visual and motion tokens, `themes.css` for alternate theme, and the existing CSS architecture. There is no `src/data/motion.ts` in the current project.
- Preserve the approved Dual Contrast palette, self-hosted Manrope and Instrument Serif, responsive layout, animations, accessibility, and no-JavaScript content. Read `design-system/MASTER.md` and `docs/DESIGN-CONTENT-CONVENTIONS.md` before visual work.
- Do not invent professional results, clients, testimonials, project ownership, launch counts, dates, or portfolio evidence. Keep unapproved projects/case studies/articles unpublished. Do not commit private source documents or secrets.
- The contact form prepares a `mailto:` draft and text download; it does not send or store inquiries. Do not claim otherwise. Calendly is an external booking link.

## Indexing and security

- The owner approved public search launch on 20 October 2026. `publicationApproved` is `true`; only explicit indexable routes in `src/data/seo.mjs` may be public in production. Further policy changes still require owner approval.
- Preserve fail-closed previews: HTML/HTTP `noindex, nofollow`, disallowing robots and empty sitemap. Production requires an approved route, production build and canonical host. Never remove the Worker host guard or weaken its security headers. See `docs/SEO-LAUNCH.md`.
- Preserve restrictive security headers, safe external links, and credential hygiene.

## Validation and release

- For code changes: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test`; verify local Worker headers when relevant. GitHub Actions is the authoritative repeatable CI runner, not a substitute for live release checks.
- For docs-only changes: check paths, links, claims, Markdown formatting, and consistency with code; run the CI workflow when a PR is opened.
- Playwright baselines require human review; never auto-approve screenshots to turn a red build green. Preserve keyboard/touch, axe, reduced-motion, both themes, and viewport coverage.
- CI workflow currently triggers on PRs targeting `main`, pushes to `phase3/automated-qa`, and manual dispatch. Do not assume other feature-branch pushes trigger it.
- A release requires explicit merge approval, green checks, Cloudflare deployment verification, and live smoke tests including robots and headers.

See `README.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT-WORKFLOW.md`, and `docs/PHASE3-RELEASE.md` for current project details.
