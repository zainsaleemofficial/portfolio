# Design and content conventions

These rules describe the implemented site. Keep them aligned with the code when design-system or content ownership changes.

## Sources of truth

| Responsibility                                                                    | Authority                   | Rule                                                                                                                                                                         |
| --------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default semantic colors, typography, spacing, radii, borders, shadows, and motion | `src/styles/tokens.css`     | Components consume semantic variables. Add a component alias only when a shared token cannot express the value.                                                              |
| Alternate theme                                                                   | `src/styles/themes.css`     | Override existing semantic or documented component variables. The default `dual-contrast` theme remains authoritative.                                                       |
| Typography application                                                            | `src/styles/typography.css` | Manrope Variable is the primary face; Instrument Serif italic is the editorial accent.                                                                                       |
| Layout and component styling                                                      | `src/styles/globals.css`    | Preserve `--container-max`, `--gutter`, and `--section-spacing`. Main breakpoints are 768px and 1024px; 1090px, 440px, 380px, and 374px are deliberate component exceptions. |
| Public site configuration                                                         | `src/data/site.ts`          | Owns the canonical domain, contact email, booking URL, social profiles, portrait, services, and publication gate.                                                            |
| Professional facts                                                                | `src/data/brand.ts`         | Owns current role and company, primary positioning, career history, and verified achievement figures.                                                                        |
| Publishable editorial content                                                     | `src/data/content.ts`       | Projects, case studies, and articles render only when approved and supported by evidence and publication rights.                                                             |

The approved default palette is page `#f6f9f7`, surface `#ffffff`, hero `#102622`, primary text `#1a2b29`, action teal `#167a60`, and mint `#b8e9cc`. The expertise illustration uses component-scoped mint stops because its gradient is an intentional optical treatment. The alternate theme currently preserves those stops exactly.

Shared type sizes, weights, line heights, tracking, and measures come from tokens. Specialized hero and editorial compositions may adjust them locally. Do not consolidate component breakpoints or optical values without before/after browser evidence.

## Astro, React, and motion

Astro owns static structure, navigation, metadata, content rendering, and progressive enhancement. React is reserved for the two interactions that need client state: the expertise split and contact draft. Content and links must remain useful without JavaScript.

CSS variables in `tokens.css` are the only motion-token source. Preserve `0.18s`, `0.35s`, `0.7s`, `20px`, `0.06s`, and `cubic-bezier(0.22, 1, 0.36, 1)` unless a separately reviewed motion change is approved. Hero entrances, section reveals, hover transitions, and stagger consumers use these variables. Reduced motion removes animation and transition without hiding content.

The expertise interaction uses a CSS split controlled by pointer position and accessible heading buttons. It supports keyboard and touch input and intentionally has no range slider. React owns interaction state; CSS owns timing and presentation.

## Content integrity

The primary positioning is SaaS Development, AI Automation, and SEO Strategy. Zain is described as an AI-assisted SaaS developer, not a traditional programmer. `50+` means software projects across tools, prototypes, experiments, and products; it does not mean 50 commercial SaaS launches. Approximately `20+` products reached launch. LemStudio products remain company-owned.

Keep longer About and My Story prose in their pages. Normalizing facts does not authorize rewriting the professional story. Do not invent client results, company metrics, financial outcomes, testimonials, dates, or ownership. Add projects, case studies, and articles only with approval, evidence, and rights to publish.

## Accessibility and publication

Target WCAG 2.2 AA with semantic headings and landmarks, visible focus, labeled controls, sufficient contrast, at least 44px touch targets, keyboard and touch alternatives, no-JavaScript content, and reduced-motion behavior. Verify both themes and the required viewport widths with automated checks plus screenshot review.

The owner approved public search launch on 20 October 2026. `publicationApproved` is true; production eligibility is explicitly listed in `src/data/seo.mjs`. The metadata gate, robots, sitemap and Worker host guard remain restrictive for all previews. Local builds, branches, screenshots, and preview servers do not authorize deployment, DNS changes, production traffic changes, or indexing.
