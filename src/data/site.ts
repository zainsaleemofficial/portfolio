export const site = {
  name: 'Zain Saleem',
  title: 'SaaS & Software Developer × SEO Strategist',
  url: 'https://zainsaleem.co',
  email: 'me@zainsaleem.co',
  bookingUrl: 'https://calendly.com/zainsaleemofficial/30min',
  portrait: {
    src: '/images/zain-portrait.webp',
    width: 760,
    height: 1143,
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
// Keep false until the owner approves the hosted preview and production cutover.
export const publicationApproved = false
export const services = [
  {
    slug: 'saas-development',
    title: 'SaaS Product Development',
    group: 'Build',
    summary: 'From a focused product idea to software people can use.',
    intro:
      'A useful product begins with a clear problem. I help turn that problem into a considered application, with a scope that makes sense for the people using it.',
    scope: [
      'Define the core user journey and a practical first release.',
      'Build responsive interfaces and the application workflows behind them.',
      'Connect the services and APIs the product actually needs.',
      'Prepare the codebase for maintenance and future improvements.',
    ],
    process:
      'We start with the problem, audience, and constraints. From there, we agree on the core workflow, build in reviewable stages, and test the product before release.',
    note: 'My experience includes building 50+ SaaS tools while working with a UK-based agency. Product ownership and individual contributions will be documented with approved examples.',
  },
  {
    slug: 'custom-software',
    title: 'Custom Software Development',
    group: 'Build',
    summary: 'Applications and automations shaped around the way you work.',
    intro:
      'Repeated manual tasks and disconnected tools can make a straightforward process difficult. Custom software can bring those steps together in one understandable workflow.',
    scope: [
      'Map the current process and identify the practical bottlenecks.',
      'Build internal tools, custom applications, and automation workflows.',
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
      'SaaS interfaces and application workflows built around a clear user need.',
    service: 'saas-development',
    art: 'product',
  },
  {
    id: 'automation',
    category: 'Software',
    title: 'Less repetition. More flow.',
    description: 'Custom tools, connected systems, and practical automations.',
    service: 'custom-software',
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
  'Software engineering',
  'Automation',
  'Technical SEO',
  'Local SEO',
  'Organic growth',
]
