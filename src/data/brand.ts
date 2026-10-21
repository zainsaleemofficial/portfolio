// Public-facing facts adapted from the October 2026 Final Verified Update.
// Source: user's Personal Brand Master Document (TXT and DOCX).
// Approximate figures are labelled; no private company work or unapproved project visuals.
export const brandIdentity = {
  currentRole: 'Head of SaaS',
  currentOrganization: 'a UK-based software product company',
  currentOrganizationLabel: 'UK-Based Software Product Company',
  primaryPositioning: 'SaaS Development, AI Automation & SEO Strategy',
} as const

export const brandNumbers = {
  softwareProjects: '50+',
  launchedProducts: '20+',
  peopleTrained: '25+',
  teamMembersLed: '10+',
} as const

export const brandHighlights = [
  {
    figure: brandNumbers.softwareProjects,
    label: 'software projects',
    detail:
      'Includes SaaS tools, internal utilities, prototypes and experiments — not 50 launched companies.',
  },
  {
    figure: brandNumbers.launchedProducts,
    label: 'products launched',
    detail:
      'An approximate count of company-owned software products brought to launch.',
  },
  {
    figure: brandNumbers.peopleTrained,
    label: 'people trained',
    detail:
      'Knowledge shared with colleagues as teams and responsibilities evolved.',
  },
  {
    figure: brandNumbers.teamMembersLed,
    label: 'team members led',
    detail: 'Teams of more than ten people across delivery and product work.',
  },
] as const

export const experience = [
  {
    organization: 'Pakistan-Based Technology Startup',
    label: 'The technical foundation',
    when: 'Started professionally at 15',
    role: 'Website operations, WordPress performance & troubleshooting',
    summary:
      'My first professional role covered website maintenance, speed, hosting, plugins and security at a technology startup. When a WordPress site went down and the usual developer was unavailable, I volunteered to investigate and helped bring it back online.',
    details: [
      'Hands-on website performance and technical troubleshooting',
      'Small utilities and practical workflow improvements',
    ],
  },
  {
    organization: 'UK-Based Digital Marketing Agency',
    label: 'Learning to lead through SEO',
    when: 'Joined 29 April 2024',
    role: 'Off-Page SEO Intern → Head of Off-Page SEO (client-facing)',
    summary:
      'I started as an intern and grew into leading client-side off-page SEO delivery. I managed 15+ concurrent campaigns, trained teammates, improved processes and built internal tools instead of simply accepting repetitive work.',
    details: [
      'Off-page, technical, semantic and local SEO',
      'Campaign leadership, process design and team training',
    ],
  },
  {
    organization: 'US-Based Digital Marketing Agency',
    label: 'US agency partnership',
    when: 'Separate US agency engagement',
    role: 'SEO partner / SEO delivery leadership',
    summary:
      'I helped coordinate local SEO work across 20+ clients and the team supporting that delivery. When the agency needed an additional creative capability, I sourced and coordinated a small video-editing team. The work strengthened my operational problem-solving.',
    details: [
      'Local SEO and Google Business Profile strategy',
      'Multi-client delivery and team coordination',
    ],
  },
  {
    organization: brandIdentity.currentOrganizationLabel,
    label: 'Building products that solve real problems',
    when: 'Current role',
    role: `${brandIdentity.currentRole} — Product Development & Operations`,
    summary:
      'Leading AI-assisted SaaS product development, integrations, launches and operational workflows for a UK-based company that develops and sells its own software products internationally. A weekend software challenge at a digital marketing agency led to the transition into product work.',
    details: [
      `Hands-on AI-assisted building across ${brandNumbers.softwareProjects} projects`,
      `Approximately ${brandNumbers.launchedProducts} launches, integrations, support and go-to-market`,
    ],
  },
] as const

export const capabilities = [
  {
    label: 'SaaS development',
    heading: 'From a business problem to something people can actually use.',
    description:
      'I work from the user problem outward: shape the idea, design the workflow, build with AI-assisted platforms, test the product, and stay involved as real usage uncovers the next challenge.',
    href: '/services/saas-development/',
  },
  {
    label: 'AI automation',
    heading: 'Give repetitive work less space in the day.',
    description:
      'I look for the tasks and handoffs that slow people down, then help create connected workflows, internal tools and practical automations. The goal is a dependable process, not a flashy demo.',
    href: '/services/ai-automation/',
  },
  {
    label: 'SEO strategy',
    heading: 'Understand search and the business behind it.',
    description:
      'I bring client-side off-page SEO leadership, local SEO delivery, technical analysis and a practical view of how websites get discovered. Search remains a serious part of my work, not a line in my past.',
    href: '/services/technical-seo/',
  },
] as const

export const interests = [
  'Writing poetry',
  'Reading',
  'Cooking',
  'Cricket with friends',
] as const
