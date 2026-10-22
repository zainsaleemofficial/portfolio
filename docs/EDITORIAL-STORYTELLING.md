# Editorial storytelling patterns (approved My Story reference)

My Story v2 was approved as a **page-specific editorial direction**, not a wholesale redesign. It keeps the global Header and Footer and uses `src/styles/story-editorial.css` scoped to `.story-v2` with shared project colors and self-hosted typefaces.

For future page revisions, borrow principles rather than duplicating entire compositions: a compelling opening scene, purposeful subheadings, short human-centered paragraphs, generous rhythm, expressive but accessible typographic contrast, occasional factual visual artifacts, and a meaningful closing CTA. Break text density with variations only where they clarify the story. Respect WCAG contrast, reduced motion and no-JS navigation. Facts and reconstructed dialogue require clear grounding. Do not introduce new employer names, fabricated results or case studies.

The owner authorized adapting this quality across the existing website on 23 October 2026. The [route audit](EDITORIAL-AUDIT.md) records purpose, problems and bounded changes. This authorization preserves My Story, the global chrome, original portraits, facts, contact infrastructure, public SEO policy and Cloudflare/security configuration. Future work still needs the scope authorization described in `AGENTS.md`; this document is a creative standard, not unlimited release permission.

## How to compose a page

Start with a one-sentence purpose and the visitor's next useful action. Write the section headings in order before adding visual treatments. If they do not form a coherent explanation, fix the content. Choose a rhythm suited to the material: an introduction can be warm and compact; service scope should be easy to scan; legal content needs a quiet reading column. Use a dark section for a meaningful change in subject or emphasis, not to meet an alternating-background quota.

The ten mandatory rules are in `design-system/MASTER.md`. Every new page must be beautiful to look at, enjoyable to read, human in its writing, thoughtful in its interactions and clear in its purpose. These are review criteria, not permission to add poetic filler.

## Reusable primitives

```astro
---
import Layout from '../layouts/Layout.astro'
import EditorialFrame from '../components/editorial/EditorialFrame.astro'
import EditorialIntro from '../components/editorial/EditorialIntro.astro'
import EditorialSection from '../components/editorial/EditorialSection.astro'
import ReadingNav from '../components/editorial/ReadingNav.astro'
---

<Layout>
  <EditorialFrame class="example-page">
    <EditorialIntro eyebrow="About the work" tone="forest">
      <Fragment slot="heading">
        A clear purpose.
        <br />
        <span class="serif">A human perspective.</span>
      </Fragment>
      <p>
        A supported, specific introduction explaining what this page helps the
        reader understand.
      </p>
      <ReadingNav
        slot="after"
        items={[{ id: 'approach', label: 'The approach' }]}
      />
    </EditorialIntro>
    <EditorialSection id="approach" labelledBy="approach-title">
      <div class="ed-split">
        <h2 id="approach-title">The approach</h2>
        <div class="ed-prose">
          <p>Plain-language explanation grounded in the actual work.</p>
        </div>
      </div>
    </EditorialSection>
  </EditorialFrame>
</Layout>
```

This example demonstrates API and semantics, not copy to publish or a required layout. `EditorialIntro` owns one H1; `EditorialSection` lets the page supply its actual hierarchy. A `NarrativePanel` is an aside with a label, a short observation and an optional caption slot. Do not use blockquote markup unless quoting a real attributed source. Native `ReadingNav` anchors work without JS and do not imply a progress calculation. No additional client runtime is required.

## Token and surface roles

Use existing forest for reflective/high-emphasis surfaces, inverse text for dark reading, mint as an accent and pale alternate for a quieter pause. Use brand-dark for readable text on light backgrounds; the alternate theme's brand-primary is a button fill, not a body-text color. Scope surface aliases so nested panels can explicitly reset their reading colors. Do not change global typography to style a single page.

`--editorial-display` is for page openings, `--editorial-measure` limits sustained reading to 60ch, and `--editorial-opening-space` sets fluid opening rhythm. Existing spacing and motion tokens continue to own ordinary sections, controls and reveals. Mobile compositions stack deliberately at 900px; compact navigation remains the shared header's responsibility.

## Writing and evidence

Use concrete facts, short paragraphs and connected headings. A sentence should orient the reader, explain the work or help with a decision. Avoid grand promises, invented scenes, generic growth slogans and repetitive disclaimers. Keep useful limits near the claim they qualify: approximate launch figures, company ownership, SEO uncertainty, human checks in automation and the browser-only email draft. Employer labels remain descriptive and anonymous. Brand facts stay in `brand.ts`; service descriptions stay in `site.ts`; approved publications stay in `content.ts`.

## Motion, access and performance

Reuse existing reveal/hover behavior and tokens. Content is visible before JS; no delayed opacity gate, scroll hijacking, new animation dependency or endless decorative motion. Reduced motion removes movement. All disclosures, links, reading navigation and core conversions work with keyboard/touch and without JS; the optional draft and expertise enhancement retain their existing progressive fallback.

## Review and release checklist

The article shell in `src/pages/insights/[slug].astro` shows native section navigation for pieces with more than two sections. `ContentSections` gives each section a stable local anchor; an optional `quote` requires both source text and attribution. Use quotations only when verified and approved. The prose system includes reading measure, paragraph rhythm, section spacing and attributed pull quotes. Do not populate the article array merely to demonstrate the layout. Any future diagram needs a real explanatory purpose, a caption/alternative and its own responsive review.

- State each page's purpose and verify its heading sequence, facts and next action.
- Inspect before/after at desktop and mobile, both themes, small screens, tablet and landscape. Check full pages, wrapping, all interactive states and overflow.
- Run install, typecheck, lint, formatting, both builds, generated metadata, complete Playwright/axe suites and actual local Worker checks. Run performance checks and distinguish lab results from field Core Web Vitals.
- Inspect every changed visual candidate against the old reference and intended direction. Commit reviewed native images only; preserve all assertions and exact-pixel thresholds. Protect the unchanged My Story/header/portrait references.
- Keep each phase independently reviewable and revertible. Release only with green CI, reviewed significant changes and verified deployment. Verify public canonical pages plus protected preview hosts, crawl files, metadata, schema, booking and email after release.
