import { seoPages } from '../src/data/seo.mjs'
export const productionBuild = process.env.TEST_DEPLOYMENT_ENV === 'production'
export const expectedRobots = (path: string) =>
  !productionBuild
    ? 'noindex, nofollow'
    : seoPages[path]?.index
      ? 'index, follow'
      : 'noindex, follow'
