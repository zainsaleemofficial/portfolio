# Visual regression references

## Strategy

The eight scenarios in `tests/visual.spec.ts` compare with the PNGs committed in `tests/visual.spec.ts-snapshots/`. CI uses the locked Playwright Chromium on Ubuntu 24.04 and runs the complete suite. It does not build a historical source commit, contact a second reference server, or regenerate snapshots. `updateSnapshots: 'none'` makes missing references fail. Comparisons allow zero differing pixels (`threshold: 0`, `maxDiffPixels: 0`); no tolerance was raised to resolve PR #4.

Keep the existing viewport sizes, reduced motion, loaded fonts/images, disabled screenshot animations/caret, and copyright-only mask. The copyright mask is inherited from the previous suite; no navigation, CTA, contact or footer links are masked. Contact snapshots represent the initial render; hydrated validation, draft generation and download are separately tested.

## Reviewed reference migration for PR #4

Owner authorization: the request “FIX PR #4, PASS CI & DEPLOY TO PRODUCTION” explicitly delegates screenshot inspection and acceptance of reviewed references, with production release conditional on green CI. All eight original/current pairs were inspected before copying these files. This is a scoped acceptance of the navigation/contact changes, not an automatic snapshot update.

Source UI commit: `6b59e59933a803ec0bdc32430c95ac9f1ca540d6`.
Source evidence: [Actions run 39276010125](https://github.com/zainsaleemofficial/portfolio/actions/runs/39276010125), artifact `portfolio-qa-evidence` (ID `12196538775`). Its `artifacts/test-results.json` contains the base64 image attachments named `*-phase3.png` (current) and `*-phase2.png` (original). References are byte-for-byte copies of the reviewed current attachments, not resized crops or edited images. Full artifacts expire; the committed reference PNGs and hashes below preserve the accepted result.

Review found only the requested header/Services-link, contact, Consultation and footer differences. Home desktop images retain identical height; the unchanged hero, work, story and expertise areas match the original pixels. Mobile height increases are explained by the extra CTA and wrapped footer links. Contact and service headings, text wrapping, CTA alignment and footer layout were inspected; no further UI changes were needed after the email spacing fix in the source commit.

| Reference                          | Pixels      | Review                                                                                                                                  |
| ---------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `home-mobile-linux.png`            | 390 × 10795 | Closed navigation remains unchanged; Services link, Consultation actions and footer links intentionally updated.                        |
| `home-desktop-linux.png`           | 1440 × 7810 | Five-link header, Services directory link, Consultation actions and footer links intentionally updated; unchanged body pixels verified. |
| `home-sage-mobile-linux.png`       | 390 × 10795 | Same scoped mobile changes in the existing alternate theme.                                                                             |
| `home-sage-desktop-linux.png`      | 1440 × 7810 | Same scoped desktop changes in the existing alternate theme; unchanged body pixels verified.                                            |
| `contact-mobile-linux.png`         | 390 × 2595  | Booking, direct email and optional brief are separate; copy/fallback spacing corrected; single-column layout retained.                  |
| `contact-desktop-linux.png`        | 1440 × 2130 | Contact choices clarified within existing two-column layout; initial below-fold draft remains unhydrated until visible.                 |
| `service-mobile-linux.png`         | 390 × 3041  | Service content retained; overview backlink, email/brief actions and footer links updated.                                              |
| `mobile-navigation-open-linux.png` | 390 × 439   | Five page links and prominent booking button; spacing/alignment inspected.                                                              |

## Future changes

1. Run `npm ci`, `npm run build` and `npm test` in the same Linux/browser environment as CI. Ordinary CI must stay in compare-only mode; never add an automatic update fallback.
2. For an intentionally changed design, generate candidates on an isolated local/review checkout with `npx playwright test tests/visual.spec.ts --update-snapshots=all`. This is candidate generation only, not acceptance. Never run it just to erase a failure.
3. Inspect every changed candidate against the current committed reference and the intended UI. Fix defects first. Preserve all eight scenarios, readiness assertions, viewport/theme coverage, zero-difference policy and existing mask boundaries.
4. Commit only the reviewed PNGs with the scoped UI/test change, and update this review record with the source commit, evidence and reason. A reviewer must explicitly examine the changed images before accepting the update.
5. Run the full suite again with updates disabled and require green CI before merging. Dependency/browser upgrades may require a separate reviewed reference migration; do not relax comparison tolerances.

## Reference SHA-256 hashes

- `home-mobile-linux.png`: `04357bb3952f0d2efa9206566cebdb61de843863c9c82c5c50654bf6c9719946`
- `home-desktop-linux.png`: `dd38105713fc1a555e78a71e06049d157a017309e78d6cb97153c6a9b1bde162`
- `home-sage-mobile-linux.png`: `93777cc688f0d5e11651576d6a3859b883dbac60be2585f3c368d6a1c5378744`
- `home-sage-desktop-linux.png`: `1b48e7036cfab13e524a9bfd401675cab60256a3c9739ef48419d701dbc9e5c0`
- `contact-mobile-linux.png`: `555035b543e3c2f32dca8814cafab96088d7c04f2b6b07e23aa4a2185c44c458`
- `contact-desktop-linux.png`: `8b77f9eb38411e662a41700300fd03fd70214cf9744886491fa46fdd59d535b1`
- `service-mobile-linux.png`: `d220e14cab12e9d5dffba3f01675d0983522e906ee1f3c54c1c484ebcf1119c2`
- `mobile-navigation-open-linux.png`: `7c3e4fa420e10281e5f8db4046764318e8e071ad0fa99d65d7630b979c4b7227`
