import { site, services } from './site'
import { brandIdentity } from './brand'
import { seoPages } from './seo.mjs'

export function structuredData(
  path: string,
  title: string,
  description: string,
) {
  const canonical = new URL(path, site.url).href
  const personId = `${site.url}/#person`
  const websiteId = `${site.url}/#website`
  const pageId = `${canonical}#webpage`
  const service = services.find((entry) => path === `/services/${entry.slug}/`)
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name: site.name,
      url: `${site.url}/`,
      jobTitle: brandIdentity.currentRole,
      image: new URL(site.portrait.src, site.url).href,
      sameAs: site.socials.map((entry) => entry.url),
      knowsAbout: services.map((entry) => entry.title),
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${site.url}/`,
      name: site.name,
      inLanguage: 'en',
      publisher: { '@id': personId },
    },
    {
      '@type': path === '/about/' ? 'ProfilePage' : 'WebPage',
      '@id': pageId,
      url: canonical,
      name: title,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      ...(path === '/about/' ? { mainEntity: { '@id': personId } } : {}),
      ...(service ? { mainEntity: { '@id': `${canonical}#service` } } : {}),
      ...(path === '/services/'
        ? { mainEntity: { '@id': `${canonical}#services` } }
        : {}),
      ...(path !== '/' && seoPages[path]
        ? { breadcrumb: { '@id': `${canonical}#breadcrumb` } }
        : {}),
    },
  ]
  if (path !== '/' && seoPages[path]) {
    const trail = [
      { name: 'Home', url: `${site.url}/` },
      ...(service ? [{ name: 'Services', url: `${site.url}/services/` }] : []),
      { name: seoPages[path].label, url: canonical },
    ]
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: trail.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.name,
        item: entry.url,
      })),
    })
  }
  if (service)
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      url: canonical,
      name: service.title,
      serviceType: service.title,
      description: service.intro,
      provider: { '@id': personId },
      mainEntityOfPage: { '@id': pageId },
    })
  if (path === '/services/')
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonical}#services`,
      name: 'Services',
      numberOfItems: services.length,
      itemListElement: services.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.title,
        url: `${site.url}/services/${entry.slug}/`,
      })),
    })
  return { '@context': 'https://schema.org', '@graph': graph }
}
