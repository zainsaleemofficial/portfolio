export interface Section {
  heading: string
  paragraphs: string[]
}
interface Entry {
  slug: string
  title: string
  summary: string
  approved: boolean
  sections: Section[]
}
export interface Project extends Entry {
  role: string
  ownership: string
  stack: string[]
  image?: { src: string; alt: string; width: number; height: number }
}
export type CaseStudy = Entry &
  (
    | {
        kind: 'software'
        problem: string
        solution: string
        role: string
        decisions: string[]
        stack: string[]
        outcome: string
      }
    | {
        kind: 'seo'
        problem: string
        baseline: string
        work: string[]
        period: string
        evidence: string[]
        outcome: string
      }
  )
export interface Article extends Entry {
  category: string
  published: string
  updated?: string
}
// Empty by design: only owner-approved, evidenced content may be published.
export const projects: Project[] = []
export const caseStudies: CaseStudy[] = []
export const articles: Article[] = []
