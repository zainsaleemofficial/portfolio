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

## Reviewed homepage portrait correction for PR #5

Owner authorization: the request to fix the supplied homepage dual-contrast screenshot explicitly authorizes scoped implementation, reviewed baseline updates and production release only after green CI.

Source UI commit: `61c5eb84924c93d3ccfa8e3e2917d234b6da0890`, based on production merge `53dcd5f595e6216fe221a99a613dacae7a1264bb`. Source evidence: [Actions run 39308401430](https://github.com/zainsaleemofficial/portfolio/actions/runs/39308401430), artifact `portfolio-qa-evidence` (ID `12214906974`). Only its four native `home-*-actual.png` files were accepted, after inspecting original/candidate pairs in both themes and desktop/mobile. They are copied byte-for-byte, without masking or editing. The other four references are unchanged.

Review confirmed a clean hair/shoulder contour, a smooth bottom fade, preserved portrait identity and split treatment, aligned index/heading/description/link rows, and clearly visible Explore links. The original portrait asset is unchanged (SHA-256 `554110be131c7da9a61be1e0271e9d0af36a0589d30a88b8210fe236cb08798f`). A small SVG edge filter repairs the existing alpha contour; it does not regenerate the photograph. Desktop/tablet copy has reserved space beside the portrait; mobile copy precedes it. Existing interaction handlers and motion tokens are unchanged.

Full-image pixel comparisons confirmed the exact original dimensions and no changed pixels outside the expertise scene. Thus no header, other section, footer, or later section position was accepted as an incidental change:

| References                    | Dimensions  | Changed pixel bounds (left, top, right, bottom) |
| ----------------------------- | ----------- | ----------------------------------------------- |
| Default and sage home mobile  | 390 × 10795 | `(35, 4595, 354, 5258)`                         |
| Default and sage home desktop | 1440 × 7810 | `(161, 3183, 1236, 3707)`                       |

The candidate run passed all 49 functional tests, including the added 320/375/390/768/844-landscape/1024/1440/1920 alignment, clearance, overflow, hit-target, keyboard and no-JavaScript cases, plus all 12 local Worker-header checks. Its only failures were these four intentional homepage comparisons. Release still requires a fresh complete green CI run against the accepted references. The zero-difference policy, eight scenarios, viewport/theme coverage and copyright-only mask remain unchanged.

Local fallback Chromium was used for functional checks and visual investigation, but its system monospace fallback differs from CI even on unchanged production source. Its images were not accepted as references. The committed references come from the pinned CI browser only.

## Reviewed personal-brand editorial refinement for PR #8

Owner authorization: the personal-brand and professional-story request authorizes scoped editorial changes, screenshot review and release after green CI. No CSS, image assets, layout components, animations, contact behavior or indexing policy was changed.

Source UI commit: `d9f9296d0612406318772ffd517eee9398cb4992`. Evidence: [Actions run 39604528947](https://github.com/zainsaleemofficial/portfolio/actions/runs/39604528947), artifact `portfolio-qa-evidence` (ID `12348171214`, ZIP SHA-256 `c932bf40bedad7f4151edcf4b3bfceb88c3430d4bafec9d4f0fac5b2a23dbc82`). Only the four native homepage actual PNGs were copied byte-for-byte after comparing approved/candidate/difference images in both themes at desktop and mobile sizes. No local fallback-browser images were accepted.

Review covered the full default-theme page in consecutive crops and the alternate-theme hero, editorial sections, portrait scene, consultation and footer. Changes are the personal positioning line, descriptive organization wording, and the natural vertical reflow of that copy. The header's first 100 pixels remain pixel-identical in all four images. Portrait identity, split treatment, CTA clearance, heading alignment, services layout, consultation actions and footer remain intact. Mobile pages increase from 390 × 10795 to 390 × 10819; desktop pages increase from 1440 × 7810 to 1440 × 7842. No clipping, overlaps or unintended wrapping were found.

The source run passed 62 scenarios and both the generated preview output checks and local preview Worker-header checks. Its only failures were the four intentionally changed homepage comparisons. The other four visual references remain unchanged. Additional About, Story, Experience and Work screenshots were inspected; responsive and axe checks cover both themes at 320, 390, 768 and 1440 pixels. Release requires a fresh green complete run after this acceptance. All eight visual scenarios, assertions, masks and zero-difference tolerances remain unchanged.

## Future changes

1. Run `npm ci`, `npm run build` and `npm test` in the same Linux/browser environment as CI. Ordinary CI must stay in compare-only mode; never add an automatic update fallback.
2. For an intentionally changed design, generate candidates on an isolated local/review checkout with `npx playwright test tests/visual.spec.ts --update-snapshots=all`. This is candidate generation only, not acceptance. Never run it just to erase a failure.
3. Inspect every changed candidate against the current committed reference and the intended UI. Fix defects first. Preserve all eight scenarios, readiness assertions, viewport/theme coverage, zero-difference policy and existing mask boundaries.
4. Commit only the reviewed PNGs with the scoped UI/test change, and update this review record with the source commit, evidence and reason. A reviewer must explicitly examine the changed images before accepting the update.
5. Run the full suite again with updates disabled and require green CI before merging. Dependency/browser upgrades may require a separate reviewed reference migration; do not relax comparison tolerances.

## Reference SHA-256 hashes

- `home-mobile-linux.png`: `dee0daf2cd8a90ebf181cbcb6b795e68238a1ddf2c5341aa8c7c0092f8b02578`
- `home-desktop-linux.png`: `fc226b0b4380c1cdd7c9d2321daea78be1db3a2ecb1beaf611954c8ad82ee86e`
- `home-sage-mobile-linux.png`: `c3739e1211c459885851bdd08ab785929e92356d44a6b9d3015707ec2818b601`
- `home-sage-desktop-linux.png`: `e06491f84b4aa82be7b110b6fdd389df4b58652b259929c28d17b36a4b37019e`
- `contact-mobile-linux.png`: `555035b543e3c2f32dca8814cafab96088d7c04f2b6b07e23aa4a2185c44c458`
- `contact-desktop-linux.png`: `8b77f9eb38411e662a41700300fd03fd70214cf9744886491fa46fdd59d535b1`
- `service-mobile-linux.png`: `d220e14cab12e9d5dffba3f01675d0983522e906ee1f3c54c1c484ebcf1119c2`
- `mobile-navigation-open-linux.png`: `7c3e4fa420e10281e5f8db4046764318e8e071ad0fa99d65d7630b979c4b7227`

## Owner-approved Soulful Editorial rollout — 23 October 2026

The owner reviewed the `Portfolio-Editorial-Review.html` report with 128 before/after views and explicitly approved the proposed designs, screenshot references and production release: “Yes, go and go live. We should live.” This fulfills the human-review gate for the three editorial phases. Release remains conditional on fresh green preview and production CI for each phase.

Source native candidates: [run 39864891804](https://github.com/zainsaleemofficial/portfolio/actions/runs/39864891804), artifact `12464565169`, UI commit `433ff578d9299ed30aeabee025b4792ae0723917`. Follow-up [run 39964114388](https://github.com/zainsaleemofficial/portfolio/actions/runs/39964114388) used identical page source, passed 70 scenarios in both modes, and failed only the 23 unaccepted visual comparisons. Its Worker checks and mobile Lighthouse evidence passed. Before screenshots came from foundation [run 39861130897](https://github.com/zainsaleemofficial/portfolio/actions/runs/39861130897).

All accepted files are byte-for-byte native PNGs, not the report’s lossless display conversions or inspection crops. The ten personal-page files also exactly match recovered checkpoint `decc61b92bf6e68a7348192e27bdd83d175e7a33`. My Story is pixel-identical in both themes at desktop/mobile; its two committed references and the mobile-menu reference remain unchanged. Homepage opening/work-preview pixels, original portraits, shared chrome, facts and contact behavior are preserved.

The record covers all three approved phases; each branch commits only its applicable references and prerequisites. PR #12 accepts ten personal-page references. PR #13 adds eight commercial references. PR #14 adds five supporting-page references. No screenshot assertion, viewport, theme, mask or zero-pixel threshold changes. The final suite contains 26 visual references. Approval is scoped to these reviewed designs; it does not authorize automatic future baseline acceptance.

| Phase      | Reference                       | SHA-256                                                          |
| ---------- | ------------------------------- | ---------------------------------------------------------------- |
| personal   | about-desktop-linux.png         | bddd537b1682c11ef1c896c0a1f0ba298b56b7f42b0d66c2f757b9e7578eec3b |
| personal   | about-mobile-linux.png          | 38b8f7737826c014d3557e402e9d3dce540ad021eb8460eec8d406c665bd2cd0 |
| personal   | experience-desktop-linux.png    | 93443ba7ba71891630b1f7d5f60a0be00be7a86c80f1720c66ff24c6dc1adf31 |
| personal   | experience-mobile-linux.png     | a48375386331a35dde82711e995d0b2a2890c245ffdccc93d40fd2ebca761b08 |
| personal   | expertise-desktop-linux.png     | 5a85fc6779f0ef15b215356014f9dec0172a8e00681223df726802f9822f208c |
| personal   | expertise-mobile-linux.png      | 775f47a969fa4a72cf835e09191d48c3177b4a1db6d286ac97b0db20d9fe9d24 |
| personal   | home-desktop-linux.png          | 505d6dfabb20f250199fafbb938df3d49e0f9d36602172fd921a126dab8bc858 |
| personal   | home-mobile-linux.png           | d4d16eff51d6f4981a3dd31bce5645e5584ba1b91a30961cfe73f8dcc4c2a855 |
| personal   | home-sage-desktop-linux.png     | 043fab1531b917307d51853d1500bf489b5ff932bc2cede23ce1e7db18755c85 |
| personal   | home-sage-mobile-linux.png      | f7ff95a113d3b791493c724291e1193d76d2971cfcad0dd3e48b79a776868f59 |
| commercial | technical-seo-mobile-linux.png  | a063fabbf041f5b018766ce11c275f31d4d7a8d959ecfbac692ef34071210f36 |
| commercial | technical-seo-desktop-linux.png | 8304cf88ddd567853d7a960e915058a9599343cbcaee429e9757285a2bed7934 |
| commercial | services-mobile-linux.png       | 5d222fd39db96716834e35efe26f63682e4bbadc2bd21f4219c0d5502f760942 |
| commercial | services-desktop-linux.png      | 0d506d3546210755b2de01921d1060ab2e80f2ddec7c5245bd0cd1f97102df13 |
| commercial | service-desktop-linux.png       | b7161f973cdf8f331e078606c75b69d213d2fb58adf27a27350deb3c83944f64 |
| commercial | work-mobile-linux.png           | de1a917d6f093479de78b97ea2f8302a4413a109e02e6f49940366e7ee7669a8 |
| commercial | work-desktop-linux.png          | 16f78139017478634546f88bc6ddcb164578f51cb8458b9d4ca48ab3b2ce36d7 |
| commercial | service-mobile-linux.png        | 8188740378f1046080390a6183212b5c4c6440537cb49acc442b9207b46370bb |
| supporting | insights-mobile-linux.png       | 6355ba43b0e24d537eb6dd943c5823873d16864e5f8830f57c28467d7fb01d43 |
| supporting | insights-desktop-linux.png      | d518eba3d1154801dec81fbf503fbfd939764252360f720906ab02dc805fbdc8 |
| supporting | privacy-mobile-linux.png        | a6e9fbf981af1674fe20c67ff72b77396d67e6bd0d12658f10ddab2431135063 |
| supporting | contact-mobile-linux.png        | 55e90617d45c7affdd4590e02b0eb2418ce12c8cdc1bbdbc2b7402a7d3ac1f9b |
| supporting | contact-desktop-linux.png       | aae09445d2908e91396a9aa01cf69a0e9654db7591e22c1f949eb8527cf53744 |
