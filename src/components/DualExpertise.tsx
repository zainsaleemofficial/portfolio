import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { ArrowUpRight, Code2, ScanSearch, MoveHorizontal } from 'lucide-react'
import { useHydrated } from './useHydrated'

type Perspective = 'software' | 'both' | 'search'
const positions: Record<Perspective, number> = { software: 77, both: 50, search: 23 }

export default function DualExpertise() {
  const ready = useHydrated()
  const scene = useRef<HTMLDivElement>(null)
  const [perspective, setPerspective] = useState<Perspective>('both')

  function show(next: Perspective) {
    setPerspective(next)
    scene.current?.style.setProperty('--identity-split', `${positions[next]}%`)
  }

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!ready || event.pointerType !== 'mouse' || !scene.current) return
    const rect = scene.current.getBoundingClientRect()
    if (!rect.width) return
    const x = Math.max(19, Math.min(81, ((event.clientX - rect.left) / rect.width) * 100))
    scene.current.style.setProperty('--identity-split', `${x.toFixed(1)}%`)
  }

  function onLeave() {
    scene.current?.style.setProperty('--identity-split', `${positions[perspective]}%`)
  }

  function onKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'ArrowLeft' || event.key === 'Home') {
      event.preventDefault()
      show('search')
    } else if (event.key === 'ArrowRight' || event.key === 'End') {
      event.preventDefault()
      show('software')
    } else if (event.key === 'Escape') {
      show('both')
    }
  }

  return (
    <div className="identity-experience">
      <div
        className="identity-scene"
        ref={scene}
        style={{ '--identity-split': '50%' } as CSSProperties}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onKeyDown={onKeys}
        tabIndex={ready ? 0 : -1}
        role="group"
        aria-label="Two perspectives: software engineering and SEO strategy. Move the mouse to reveal each side or use the focus buttons. Arrow keys and Escape also work when this scene is focused."
      >
        <div className="identity-paper identity-paper--mint" aria-hidden="true" />
        <div className="identity-paper identity-paper--white" aria-hidden="true" />
        <div className="identity-technical" aria-hidden="true">
          <span>function buildProduct() {'{'}</span>
          <span>  design.implement();</span>
          <span>  test.ship();</span>
          <span>{'}'}</span>
        </div>
        <div className="identity-search-lines" aria-hidden="true">
          <span>crawl / index / discover</span>
          <span>signals → relevance → trust</span>
        </div>
        <div className="identity-cut" aria-hidden="true" />
        <div className="identity-photo" aria-hidden="true">
          <img
            className="identity-photo-main"
            src="/images/zain-portrait.webp"
            alt=""
            width="620"
            height="775"
            loading="lazy"
            decoding="async"
          />
          <img
            className="identity-photo-treatment"
            src="/images/zain-portrait.webp"
            alt=""
            width="620"
            height="775"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="identity-copy identity-copy--software">
          <div className="identity-index"><Code2 size={21} aria-hidden="true" /><span>01 / Software engineering</span></div>
          <h3>
            <button type="button" disabled={!ready} aria-pressed={perspective === 'software'} onClick={() => show('software')}>
              Build<span className="identity-editorial">something useful.</span>
            </button>
          </h3>
          <p>Software products, internal tools and automations built around real problems.</p>
          <a href="/services/saas-development/" className="identity-discover">
            Explore software <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="identity-copy identity-copy--search">
          <div className="identity-index"><ScanSearch size={21} aria-hidden="true" /><span>02 / Search strategy</span></div>
          <h3>
            <button type="button" disabled={!ready} aria-pressed={perspective === 'search'} onClick={() => show('search')}>
              Make it<span className="identity-editorial">discoverable.</span>
            </button>
          </h3>
          <p>Technical SEO, local visibility and the thinking that helps people find you.</p>
          <a href="/services/technical-seo/" className="identity-discover">
            Explore SEO <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="identity-footnote">
        <span className="identity-hint"><MoveHorizontal size={17} aria-hidden="true" /> Move across the portrait to explore two perspectives</span>
        <button className="identity-reset" type="button" disabled={!ready} onClick={() => show('both')} aria-pressed={perspective === 'both'}>
          Both perspectives <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="sr-only" role="status">
        {perspective === 'both' ? 'Both perspectives' : perspective === 'software' ? 'Software development in focus' : 'SEO strategy in focus'}
      </p>
    </div>
  )
}
