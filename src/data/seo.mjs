// Metadata and publication inventory. Visible service content stays in site.ts.
export const siteOrigin = 'https://zainsaleem.co'

/** @typedef {{title: string, description: string, label: string, intent: string, index: boolean}} PageSEO */
/** @type {Record<string, PageSEO>} */
export const seoPages = {
  '/': {
    title: 'Zain Saleem | SaaS Development, AI Automation & SEO',
    description:
      'Zain Saleem, Head of SaaS at LemStudio, builds AI-assisted SaaS products and business workflows, with expertise in technical SEO, local SEO and link building.',
    label: 'Home',
    intent: 'Zain Saleem; personal brand and professional services',
    index: true,
  },
  '/services/': {
    title: 'SaaS Development, AI Automation & SEO Services | Zain Saleem',
    description:
      'Explore six services from Zain Saleem: SaaS product development, AI automation, custom business software, technical SEO, local SEO and link building.',
    label: 'Services',
    intent: 'Compare software, automation and SEO services',
    index: true,
  },
  '/services/saas-development/': {
    title: 'SaaS Product Development Services | Zain Saleem',
    description:
      'Shape and build a useful SaaS product with Zain Saleem. AI-assisted development, practical user workflows, integrations and testing around real business needs.',
    label: 'SaaS Product Development',
    intent: 'SaaS product development services',
    index: true,
  },
  '/services/ai-automation/': {
    title: 'AI Automation & Workflow Development | Zain Saleem',
    description:
      'Connect tools and reduce repetitive work with Zain Saleem. Practical AI automation, workflow integrations, human checks and testing for real business processes.',
    label: 'AI Automation & Workflows',
    intent: 'AI automation and workflow development services',
    index: true,
  },
  '/services/custom-software/': {
    title: 'Custom Business Software Development | Zain Saleem',
    description:
      'Create internal tools and custom business software with Zain Saleem. AI-assisted applications and API integrations shaped around how your team actually works.',
    label: 'Custom Business Software',
    intent: 'Custom software and internal business tools',
    index: true,
  },
  '/services/technical-seo/': {
    title: 'Technical SEO Services | Zain Saleem',
    description:
      'Find and prioritize technical SEO issues with Zain Saleem: crawling, indexing, canonicals, internal links, structured data, performance and implementation checks.',
    label: 'Technical SEO',
    intent: 'Technical SEO audit and implementation services',
    index: true,
  },
  '/services/local-seo/': {
    title: 'Local SEO Services | Zain Saleem',
    description:
      'Improve your local search foundations with Zain Saleem. Review business information, service-area content and listings around your actual services and customers.',
    label: 'Local SEO',
    intent: 'Local SEO services for real business service areas',
    index: true,
  },
  '/services/link-building/': {
    title: 'Link Building & Off-Page SEO Services | Zain Saleem',
    description:
      'Plan relevant link building and off-page SEO with Zain Saleem. Backlink review, publication research, transparent outreach and clear quality criteria.',
    label: 'Link Building & Off-Page SEO',
    intent: 'Link building and off-page SEO services',
    index: true,
  },
  '/about/': {
    title: 'About Zain Saleem | Head of SaaS at LemStudio',
    description:
      'Meet Zain Saleem, Head of SaaS at LemStudio. Learn how technical curiosity, SEO leadership and AI-assisted product building shape his approach to business problems.',
    label: 'About',
    intent: 'Who is Zain Saleem; professional profile',
    index: true,
  },
  '/experience/': {
    title: 'Experience & Leadership | Zain Saleem',
    description:
      'Explore Zain Saleem’s roles at RedsGlow, Pearl Lemon, Tracemark Impression and LemStudio, spanning technical work, SEO delivery, SaaS products and team leadership.',
    label: 'Experience',
    intent: 'Zain Saleem professional experience and leadership',
    index: true,
  },
  '/expertise/': {
    title: 'Expertise & Approach | Zain Saleem',
    description:
      'How Zain Saleem approaches SaaS development, AI automation and SEO strategy: understand the business problem, shape a practical workflow and test what helps.',
    label: 'Expertise',
    intent: 'Zain Saleem capabilities and working approach',
    index: true,
  },
  '/my-story/': {
    title: 'My Story | Zain Saleem',
    description:
      'Zain Saleem’s story, from learning HTML and CSS at school to SEO leadership and Head of SaaS at LemStudio. Seven chapters about curiosity and responsibility.',
    label: 'My Story',
    intent: 'Zain Saleem personal and career journey',
    index: true,
  },
  '/work/': {
    title: 'Software & Search Experience | Zain Saleem',
    description:
      'Explore Zain Saleem’s areas of work in SaaS products, connected workflows and search strategy. Illustrations explain the work; they are not client case studies.',
    label: 'Work',
    intent: 'Explore software and search work areas',
    index: true,
  },
  '/contact/': {
    title: 'Contact Zain Saleem | Book a Call or Send an Email',
    description:
      'Discuss SaaS development, AI automation or SEO with Zain Saleem. Book a Calendly call, email me@zainsaleem.co or prepare an optional email draft in your browser.',
    label: 'Contact',
    intent: 'Contact Zain Saleem; book a call or email',
    index: true,
  },
  '/privacy/': {
    title: 'Privacy | Zain Saleem',
    description:
      'How zainsaleem.co handles browser-only email drafts, direct email links, Calendly booking and Cloudflare hosting. No website form submissions are stored.',
    label: 'Privacy',
    intent: 'Privacy information; utility page',
    index: false,
  },
  '/insights/': {
    title: 'Insights | Zain Saleem',
    description:
      'Future writing on SaaS development, AI automation and SEO strategy from Zain Saleem. No articles are published yet; explore current services and experience.',
    label: 'Insights',
    intent: 'Unpublished writing directory; excluded until substantive',
    index: false,
  },
  '/404/': {
    title: 'Page Not Found | Zain Saleem',
    description:
      'This page could not be found. Explore Zain Saleem’s services, work and professional story, or get in touch about your project.',
    label: 'Page Not Found',
    intent: 'Missing page; excluded',
    index: false,
  },
}

export const indexableRoutes = Object.keys(seoPages).filter(
  (path) => seoPages[path].index,
)
export const emptySitemap =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'

/** @param {boolean} production */
export function crawlerPolicy(production) {
  if (!production) return 'User-agent: *\nDisallow: /\n'
  return `# Search discovery is allowed. Training controls are separate.\nUser-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: Applebot-Extended\nDisallow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`
}
