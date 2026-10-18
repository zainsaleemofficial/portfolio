# Development and release workflow

## Tool selection

Use ChatGPT's connected GitHub integration for read-only inspection, drafting, branch/PR management, and scoped repository changes after approval. Reserve Codex for local npm/build execution, interactive browser investigation, screenshot review, or complex debugging that cannot be done reliably through connected tools. GitHub Actions is the repeatable CI environment.

## Change lifecycle

1. **Inspect:** Read `main` SHA, current code, relevant docs, and recent CI. Confirm the intended scope and production risk.
2. **Authorize branch:** Request approval before creating one short-lived branch from current `main`.
3. **Prepare:** Draft only scoped changes. Explain exact paths and effects before remote writes; ask approval to commit/push.
4. **Validate:** Use the repo's typecheck, lint, format, build, Playwright, and Worker checks as appropriate. Do not claim a test passed if it was not executed. For docs-only changes, check Markdown, paths, links, and technical accuracy; CI may run on the PR.
5. **Review:** Compare branch with `main`, review visual baselines manually if changed, and open a PR only with approval. Note that current CI runs for PRs targeting `main`, pushes to `phase3/automated-qa`, and manual dispatch; ordinary feature-branch pushes alone may not run CI.
6. **Release:** Request explicit merge/deploy approval. `main` automatically deploys to the production Cloudflare Worker; do not change DNS or Cloudflare settings as part of routine work.
7. **Verify:** Check actual GitHub merge SHA, Cloudflare build/deployment SHA where available, live HTTP statuses, key interactions, redirect behavior, `X-Robots-Tag`, meta robots, `robots.txt`, and empty sitemap. Report local, CI, and production evidence separately.

## Quality and approval boundaries

- Preserve `publicationApproved = false` and all other indexing restrictions until separately authorized.
- Preserve the approved Phase 2 design, verified professional facts, portrait identity, and honest contact-form behavior.
- Do not weaken assertions, blindly update snapshots, force-push, or add unrelated refactors to clear CI.
- Stop on failed checks, report exact logs and smallest safe correction, and request authorization before additional remote commits if that is the current agreed approval gate.
- Do not disclose secrets, private brand documents, or unapproved client/company evidence.

## Known maintenance opportunities (not authorized by this document)

- GitHub Actions uses `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/upload-artifact@v4`; CI reported a Node runtime deprecation warning. Update in a separately reviewed maintenance change.
- CI push trigger names `phase3/automated-qa` rather than a generic development-branch pattern. Consider a separately approved trigger update after confirming expected CI usage and costs.
- Historical `QA.md` records earlier prototype tests; current release evidence is in `docs/PHASE3-RELEASE.md`.
