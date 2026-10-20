import { brandIdentity, brandNumbers } from './brand'
import { siteOrigin } from './seo.mjs'

export const site = {
  name: 'Zain Saleem',
  title: `${brandIdentity.currentRole} at ${brandIdentity.currentCompany} | ${brandIdentity.primaryPositioning}`,
  url: siteOrigin,
  email: 'me@zainsaleem.co',
  bookingUrl: 'https://calendly.com/zainsaleemofficial/30min',
  portrait: {
    src: '/images/zain-hero-studio-2026.webp',
    width: 1122,
    height: 1402,
    alt: 'Zain Saleem in a navy blazer, looking thoughtfully to the left',
  },
  socials: [
    { label: 'GitHub', url: 'https://github.com/zainsaleemofficial' },
    { label: 'Facebook', url: 'https://www.facebook.com/ZainSaleemOfficial/' },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/zainsaleem_official',
    },
  ],
}
// Owner approved public search launch on 20 October 2026. Preview protection is independent.
export const publicationApproved = true
export const services = [
  {
    slug: 'saas-development',
    title: 'SaaS Product Development',
    group: 'Build',
    summary: 'Turn a business problem into a product people can actually use.',
    intro:
      'I work from the problem outward: understand the workflow, shape the experience, build with AI-assisted platforms and integrations, then test what happens when real people use it.',
    scope: [
      'Define the core user journey and a practical first release.',
      'Use AI-assisted development tools to create and iterate on the core workflows.',
      'Connect the services and APIs the product actually needs.',
      'Plan for testing, administration, maintenance and future improvements.',
    ],
    process:
      'We start with the problem, audience, and constraints. From there, we agree on the core workflow, build in reviewable stages, and test the product before release.',
    note: `My background includes ${brandNumbers.softwareProjects} AI-assisted software projects, from prototypes and internal tools to launched SaaS. Approximately ${brandNumbers.launchedProducts} products reached launch. Company-owned work is not presented as personally owned IP.`,
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation & Workflows',
    group: 'Build',
    summary: 'Make repeatable processes easier for the people doing the work.',
    intro:
      'An automation is useful when it reduces friction without creating a new problem to maintain. I help identify the handoffs, data and repetitive decisions that can be handled more reliably with connected tools and AI-assisted workflows.',
    scope: [
      'Map the existing process, exceptions and points of friction.',
      'Design an automation around the right tools, integrations and human checks.',
      'Build and test the workflow in practical stages.',
      'Document what should happen when something fails or needs a manual decision.',
    ],
    process:
      'We start with the real work, not a technology demonstration. I identify what is worth automating and what should remain in human hands, then test the approach with actual scenarios.',
    note: 'Automations need sensible access controls, privacy, monitoring and maintenance. Outcomes depend on the underlying process and systems.',
  },
  {
    slug: 'custom-software',
    title: 'Custom Business Software',
    group: 'Build',
    summary: 'Applications and automations shaped around the way you work.',
    intro:
      'Repeated manual tasks and disconnected tools can make a straightforward process difficult. Custom software can bring those steps together in one understandable workflow.',
    scope: [
      'Map the current process and identify the practical bottlenecks.',
      'Develop internal tools and useful applications with AI-assisted workflows.',
      'Integrate existing tools through suitable APIs.',
      'Document the workflow so the next person can maintain it.',
    ],
    process:
      'We first look at how the work happens today, including the exceptions. A small, useful solution comes before an unnecessarily complicated system.',
    note: 'Access requirements, data handling, integrations, and delivery scope are agreed before implementation.',
  },
  {
    slug: 'technical-seo',
    title: 'Technical SEO',
    group: 'Grow',
    summary: 'Help search engines discover and understand your website.',
    intro:
      'Search visibility depends partly on how a website is built. I review the technical foundations and turn findings into a clear, prioritized implementation plan.',
    scope: [
      'Review crawling, indexing, canonical URLs, and sitemaps.',
      'Assess page structure, internal linking, and structured data.',
      'Investigate performance and mobile usability issues.',
      'Support implementation and verify the resulting changes.',
    ],
    process:
      'We establish a baseline, investigate the most meaningful problems, and prioritize fixes by impact and effort. Changes are checked against the original findings.',
    note: 'Search rankings cannot be guaranteed. Recommendations depend on the website, evidence, competition, and business goals.',
  },
  {
    slug: 'local-seo',
    title: 'Local SEO',
    group: 'Grow',
    summary: 'Make your business easier to find in the places you serve.',
    intro:
      'Local search works best when your website and business information give people a consistent, useful picture of what you do and where you do it.',
    scope: [
      'Review business information and local search presence.',
      'Assess service and location pages for useful, accurate content.',
      'Identify inconsistencies in relevant business listings.',
      'Plan improvements around the actual services and areas you cover.',
    ],
    process:
      'We begin with your real service area and customer needs, review the current presence, and agree on the most useful improvements. Location content should help people, not multiply empty pages.',
    note: 'No fabricated locations, customer reviews, or guaranteed map positions.',
  },
  {
    slug: 'link-building',
    title: 'Link Building & Off-Page SEO',
    group: 'Grow',
    summary: 'Relevant opportunities that support a credible search presence.',
    intro:
      'Off-page work starts with understanding your audience, subject matter, and existing visibility. Relevance and quality matter more than a large number of unrelated links.',
    scope: [
      'Review the existing backlink profile and relevant opportunities.',
      'Research publications and websites connected to your audience.',
      'Plan useful content and appropriate outreach opportunities.',
      'Document placements and assess their relevance over time.',
    ],
    process:
      'We agree on quality criteria before outreach begins. Opportunities are reviewed for relevance and transparency rather than presented as guaranteed ranking gains.',
    note: 'No guaranteed rankings, fabricated authority metrics, or claims of relationships that have not been established.',
  },
] as const
export const workAreas = [
  {
    id: 'saas',
    category: 'Software',
    title: 'Products with a purpose.',
    description:
      'AI-assisted products, workflows and applications built for real business needs.',
    service: 'saas-development',
    art: 'product',
  },
  {
    id: 'automation',
    category: 'Software',
    title: 'Smarter workflows. Less manual work.',
    description:
      'Useful automations and connected systems shaped around how teams work.',
    service: 'ai-automation',
    art: 'flow',
  },
  {
    id: 'search',
    category: 'SEO',
    title: 'Built to be discovered.',
    description: 'Technical foundations and search strategy working together.',
    service: 'technical-seo',
    art: 'search',
  },
] as const
export const insightTopics = [
  'SaaS development',
  'AI-assisted product development',
  'AI automation',
  'Technical SEO',
  'Local SEO',
  'Organic growth',
]
