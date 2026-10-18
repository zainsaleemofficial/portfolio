# Dual Contrast — Zain Saleem

The approved direction is a charcoal-green / muted-forest cinematic introduction paired with a clean white navigation header followed by spacious, light editorial sections. SaaS development and AI-assisted building lead; SEO strategy is the complementary perspective. The visual signature is large, restrained typography, dark-to-light rhythm, and an interactive engineering/search split in the middle of the page.

## Tokens

`src/styles/tokens.css` is the global source for semantic colors, type, space, radius, borders, elevation, and timing. The current owner-approved palette is near-white `#f6f9f7`, white `#ffffff`, charcoal text `#1a2b29`, hero green `#102622`, muted teal `#167a60`, and soft mint `#b8e9cc`. The navigation header is light, while the hero remains dark charcoal/forest green with a restrained portrait halo and softer photo borders. The CTA is white on teal, with measured contrast above 4.5:1. Secondary forest and teal gradient stops are semantic tokens, rather than extra brand accents. Avoid raw color values inside components.

`themes.css` defines the optional `ink-and-sage` palette. Set the layout HTML's `data-theme` to `ink-and-sage` to preview it. The default is `dual-contrast`. Both must pass contrast checks.

## Typography and layout

Self-hosted Manrope provides precise, readable body and heading text; Instrument Serif italic creates a warmer editorial counterpoint. Font tokens, fluid heading sizes, weights, line heights, and measures are in `tokens.css`. `typography.css` assigns semantic roles. No external font requests.

The maximum content width is 1240px; prose is 760px. Fluid gutters and section spacing set the rhythm. Main breakpoints are 768px and 1024px, documented together in `globals.css` and aligned with navigation. The expertise section uses component-specific 1090px and narrow-width adjustments; its two headings remain separately operable rather than becoming stacked cards. A 374px adjustment keeps the hero headline compact. Validate at 320/375/390/768/1024/1440px and landscape. Native disclosures avoid five repetitive service cards.

## Motion and interaction

`src/styles/tokens.css` owns the shared duration, easing, entrance-distance, and stagger variables. Content is never initially hidden. Hero and section entrances move only a small distance; no scroll hijacking or indefinite decorative animation. The expertise composition uses a pointer-positioned CSS split and interactive heading buttons with pointer, keyboard, and touch controls; it has no range slider. Motion respects reduced-motion preference.

Buttons use a consistent 4px radius, clear hover/active/focus states, and at least 44px control height. Filters expose pressed state. Navigation exposes expanded state and closes on Escape. Forms use visible labels, native validation, and honest draft feedback; no pretend delivery status.

## Portrait and content

The hero currently uses the supplied teal-green studio photograph at `public/images/zain-hero-studio-2026.webp`. It is displayed in a dedicated cover-fitted photographic frame with a subtle green border, inward photo lighting, and a soft glow extending below the image. Do not mask, regenerate, or change facial details during ordinary palette adjustments. Compare against the supplied original photograph before final personal-brand approval; preserve authentic features. Verify full head and shoulder framing at all widths.

Work visuals are original CSS illustrations with explicit labels. Unapproved content produces no detail pages. Do not introduce fictitious metrics or testimonials to fill space.

## Accessibility

Target WCAG 2.2 AA: meaningful headings, landmark navigation, skip link, visible focus, labels, contrast, and alternatives to dragging. Test the default and alternate palettes, hover states, keyboard, touch, no-JavaScript content, and reduced motion. Automated results supplement manual review; they are not a conformance certification.

## Skill decisions

UI UX Pro Max's design-system search recommended spacious scroll storytelling, readable content without effects, and reduced-motion support. Those principles are adopted. Its generated brutalist/blue palette was rejected in favor of the owner's approved Dual Contrast direction. Its Astro guidance supports static components, shared metadata, and selective islands. GSAP is unnecessary for this implementation.
