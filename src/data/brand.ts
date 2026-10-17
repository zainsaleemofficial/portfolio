// Public-facing facts adapted from the October 2026 Final Verified Update.
// Source: user's Personal Brand Master Document (TXT and DOCX).
// Approximate figures are labelled; no private company work or unapproved project visuals.
export const brandHighlights = [
  { figure: '50+', label: 'software projects', detail: 'Includes SaaS tools, internal utilities, prototypes and experiments — not 50 launched companies.' },
  { figure: '20+', label: 'products launched', detail: 'An approximate count of products brought to launch across the LemStudio ecosystem.' },
  { figure: '25+', label: 'people trained', detail: 'Knowledge shared with colleagues as teams and responsibilities evolved.' },
  { figure: '10+', label: 'team members led', detail: 'Teams of more than ten people across delivery and product work.' },
] as const

export const experience = [
  {
    organization: 'RedsGlow',
    label: 'The technical foundation',
    when: 'Started professionally at 15',
    role: 'Website operations, WordPress performance & troubleshooting',
    summary: 'My first professional role covered website maintenance, speed, hosting, plugins and security at a startup. When a WordPress site went down and the usual developer was unavailable, I volunteered to investigate and helped bring it back online.',
    details: ['Hands-on website performance and technical troubleshooting', 'Small utilities and practical workflow improvements'],
  },
  {
    organization: 'Pearl Lemon',
    label: 'Learning to lead through SEO',
    when: 'Joined 29 April 2024',
    role: 'Off-Page SEO Intern → Head of Off-Page SEO (client-facing)',
    summary: 'I started as an intern and grew into leading client-side off-page SEO delivery. I managed 15+ concurrent campaigns, trained teammates, improved processes and built internal tools instead of simply accepting repetitive work.',
    details: ['Off-page, technical, semantic and local SEO', 'Campaign leadership, process design and team training'],
  },
  {
    organization: 'Tracemark Impression',
    label: 'US agency partnership',
    when: 'Separate US agency engagement',
    role: 'SEO partner / SEO delivery leadership',
    summary: 'I helped coordinate local SEO work across 20+ clients and the team supporting that delivery. When the agency needed an additional creative capability, I sourced and coordinated a small video-editing team. The work strengthened my operational problem-solving.',
    details: ['Local SEO and Google Business Profile strategy', 'Multi-client delivery and team coordination'],
  },
  {
    organization: 'LemStudio',
    label: 'Building products that solve real problems',
    when: 'Current role',
    role: 'Head of SaaS',
    summary: 'After a weekend software challenge at Pearl Lemon, I was invited to work directly with its CEO, Deepak Shukla. That transition became LemStudio, where I lead AI-assisted SaaS development, automation, product operations, launches and teams.',
    details: ['Hands-on AI-assisted building across 50+ projects', 'Approximately 20+ launches, integrations, support and go-to-market'],
  },
] as const

export const capabilities = [
  {
    label: 'SaaS development',
    heading: 'From a business problem to something people can actually use.',
    description: 'I work from the user problem outward: shape the idea, design the workflow, build with AI-assisted platforms, test the product, and stay involved as real usage uncovers the next challenge.',
    href: '/services/saas-development/',
  },
  {
    label: 'AI automation',
    heading: 'Give repetitive work less space in the day.',
    description: 'I look for the tasks and handoffs that slow people down, then help create connected workflows, internal tools and practical automations. The goal is a dependable process, not a flashy demo.',
    href: '/services/ai-automation/',
  },
  {
    label: 'SEO strategy',
    heading: 'Understand search and the business behind it.',
    description: 'I bring client-side off-page SEO leadership, local SEO delivery, technical analysis and a practical view of how websites get discovered. Search remains a serious part of my work, not a line in my past.',
    href: '/services/technical-seo/',
  },
] as const

export const interests = ['Writing poetry', 'Reading', 'Cooking', 'Cricket with friends'] as const
