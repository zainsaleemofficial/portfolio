# Prototype verification — 17 October 2026

## Result

The prototype builds and runs locally. The restored baseline passed 14 browser tests on Astro's production preview; the final version passed all 14 tests on Cloudflare's local Worker runtime, including its real `_headers` policy. No tests were skipped. A hosted Cloudflare preview has **not** been deployed because account credentials are missing.

## Checks completed

| Check                     | Actual result                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Prerequisites             | Node 24.19.0, npm 11.9.0, Python 3.12.14, Git 2.52.0, system Chromium available                                          |
| Reproducible installation | `npm ci --no-fund` passed                                                                                                |
| Development startup       | Saved Astro startup command ran; HTTP response contained the expected identity and headline                              |
| TypeScript / Astro check  | 0 errors, 0 warnings, 0 hints                                                                                            |
| ESLint / Prettier         | Passed                                                                                                                   |
| Production build          | 11 static HTML pages; internal links/assets, canonical metadata, and preview indexing protections verified               |
| Playwright                | 14 passed, 0 failed, 0 skipped on final local Worker build                                                               |
| Accessibility automation  | No axe violations for selected WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA rules in tested home/contact states and alternate theme |
| Dependency audit          | 0 reported vulnerabilities across production and development dependencies                                                |
| Source review             | No credential-pattern matches; environment secrets, dependencies, and generated output excluded from Git                 |
| Cloudflare dry run        | Passed; static asset configuration accepted, no deployment performed                                                     |
| Cloudflare authentication | `wrangler whoami`: not authenticated                                                                                     |

Tests cover the six requested widths (320, 375, 390, 768, 1024, 1440px), horizontal overflow, console errors, mobile navigation/Escape, work filters, service disclosures, expertise presets/keyboard/touch, contact validation/draft/download, reduced motion, alternate theme, no-JavaScript content, local routes/assets, and 404 behavior. The draft form is disabled before hydration to prevent a native GET submission from exposing inquiry text in a URL. Direct contact links work without JavaScript.

Real screenshots were inspected at all six widths. Additional work, expertise, services, case-study, and contact views were reviewed. Small-phone expertise panels were changed to stacked panels for readability. Text arrows were replaced with SVGs after missing glyphs appeared in screenshots. All supporting routes were separately checked at 320px without horizontal overflow; 844×390 landscape also passed. The skip link was manually verified as the first Tab stop and navigates to `#main`.

## Local Lighthouse measurement

Lighthouse 13.5.0, mobile simulation, production assets served by the local Cloudflare runtime. Final run: 17 October 2026. This is a single local lab measurement, not deployed performance or field Core Web Vitals.

| Metric                   | Result      |
| ------------------------ | ----------- |
| Performance              | 100         |
| Accessibility            | 100         |
| Best practices           | 100         |
| SEO                      | 66          |
| Largest Contentful Paint | 1.4 seconds |
| First Contentful Paint   | 1.4 seconds |
| Cumulative Layout Shift  | 0.006       |
| Total Blocking Time      | 0 ms        |

SEO is intentionally reduced because previews are blocked from indexing. Do not remove that protection for a score. Final Lighthouse reported no console errors. A previous run identified an inlined-font CSP violation; `assetsInlineLimit: 0` fixes it while preserving `font-src 'self'`. Render-blocking font/CSS requests and network dependency chains remain optimization opportunities, not current target failures. INP was not measured; it requires interaction/field evidence. Actual portrait assets and real-world hosting latency will change results and require another run.

Local security headers were verified: CSP, noindex, nosniff, frame protection, referrer policy, and disabled camera/microphone/geolocation. Wrangler's local `Request.cf` metadata fetch fell back to a placeholder; the static site does not use it. That fallback does not verify deployed behavior.

## Tools and remaining limits

UI UX Pro Max was used successfully. Refero, Mobbin, and Motionsites.ai were not callable, and no skill/MCP configuration was changed. Makashif and Ali Rehman reference screenshots were inspected through a TLS-verified proxy fetch adapter; Lusion and Adham's complete visual experiences could not be verified. See `design-system/REFERENCES.md`.

Calendly's supplied URL returned HTTP 200. No booking or email was sent. Calendar availability and email delivery were not tested. The form prepares a draft rather than sending a message.

The original portrait and approved project/case-study content are still missing. Automated accessibility results are not a complete WCAG certification; real-device, screen-reader, cross-browser, and deployed checks remain. No production DNS, redirects, routes, nameservers, or traffic have been changed.

Browser screenshots, traces, and Lighthouse HTML/JSON reports are in ignored `artifacts/` and `test-results/`. Re-run the documented commands to regenerate them. GitHub synchronization and the final commit are reported in the handoff; publication of the saved cloud environment remains a separate user action.
