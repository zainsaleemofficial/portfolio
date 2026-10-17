# Dual Contrast — Zain Saleem

The approved direction is a deep-forest / dark-teal cinematic introduction followed by spacious, light editorial sections. Software development leads; search is the complementary perspective. The visual signature is large, restrained typography, dark-to-light rhythm, and an interactive engineering/search split in the middle of the page.

## Tokens

`src/styles/tokens.css` is the global source for semantic colors, type, space, radius, borders, elevation, and timing. The refined owner-approved palette uses deep evergreen `#071e19`, forest `#124b39`, emerald `#10b981`, mint `#dcece8`, and near-white `#f8fafc`; navy is no longer the dominant hero color. Dark emerald is refined to `#076b50` for contrast on mint. Avoid raw color values inside components.

`themes.css` defines the optional `ink-and-sage` palette. Set the layout HTML's `data-theme` to `ink-and-sage` to preview it. The default is `dual-contrast`. Both must pass contrast checks.

## Typography and layout

Self-hosted Manrope provides precise, readable body and heading text; Instrument Serif italic creates a warmer editorial counterpoint. Font tokens, fluid heading sizes, weights, line heights, and measures are in `tokens.css`. `typography.css` assigns semantic roles. No external font requests.

The maximum content width is 1240px; prose is 760px. Fluid gutters and section spacing set the rhythm. Main breakpoints are 768px and 1024px, documented together in `globals.css` and aligned with navigation. At 440px and below, expertise panels stack for readability and the focus control highlights the selected panel; a 374px adjustment keeps the hero headline compact. Validate at 320/375/390/768/1024/1440px and landscape. Native disclosures avoid five repetitive service cards.

## Motion and interaction

`src/data/motion.ts` supplies shared durations, easing, entrance distance, and stagger. The layout maps these into CSS variables. Content is never initially hidden. Hero and section entrances move only a small distance; no scroll hijacking or indefinite decorative animation. The expertise divider uses a transform and has native range, button, keyboard, and touch controls. Motion respects reduced-motion preference.

Buttons use a consistent 4px radius, clear hover/active/focus states, and at least 44px control height. Filters expose pressed state. Navigation exposes expanded state and closes on Escape. Forms use visible labels, native validation, and honest draft feedback; no pretend delivery status.

## Portrait and content

The current hero uses the optional professional portrait supplied in the conversation, optimized to a 760 × 1143 WebP at `public/images/zain-portrait.webp`. The actual subject is displayed using `object-fit: contain`; a gentle radial alpha mask blends the photo background with forest-green CSS lighting. Compare against the supplied original photograph before final personal-brand approval; preserve authentic features. Verify full head and shoulder framing at all widths.

Work visuals are original CSS illustrations with explicit labels. Unapproved content produces no detail pages. Do not introduce fictitious metrics or testimonials to fill space.

## Accessibility

Target WCAG 2.2 AA: meaningful headings, landmark navigation, skip link, visible focus, labels, contrast, and alternatives to dragging. Test the default and alternate palettes, hover states, keyboard, touch, no-JavaScript content, and reduced motion. Automated results supplement manual review; they are not a conformance certification.

## Skill decisions

UI UX Pro Max's design-system search recommended spacious scroll storytelling, readable content without effects, and reduced-motion support. Those principles are adopted. Its generated brutalist/blue palette was rejected in favor of the owner's approved Dual Contrast direction. Its Astro guidance supports static components, shared metadata, and selective islands. GSAP is unnecessary for this implementation.
