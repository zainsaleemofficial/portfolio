import { useState } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { Code2, ScanSearch, ArrowUpRight } from 'lucide-react'
import { motionTokens } from '../data/motion'
import { useHydrated } from './useHydrated'
export default function DualExpertise() {
  const hydrated = useHydrated()
  const [value, setValue] = useState(50)
  const reduced = useReducedMotion()
  const focus =
    value < 40
      ? 'Software development in focus'
      : value > 60
        ? 'Search strategy in focus'
        : 'Software and search, working together'
  return (
    <LazyMotion features={domAnimation}>
      <div className="dual-expertise">
        <div className="dual-panels">
          <m.div
            className="dual-divider"
            initial={false}
            animate={{ x: `${value}%` }}
            transition={{
              duration: reduced ? 0 : motionTokens.normal,
              ease: motionTokens.ease,
            }}
            aria-hidden="true"
          />
          <div className={`dual-panel ${value <= 60 ? 'is-active' : ''}`}>
            <Code2 aria-hidden="true" />
            <p className="eyebrow">01 / Engineering</p>
            <h3>
              Make it
              <br />
              <span className="serif">work.</span>
            </h3>
            <p>
              SaaS products. Custom applications. Automations that make a
              complicated process feel simple.
            </p>
            <a className="text-link" href="/services/saas-development/">
              Explore development <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
          <div className={`dual-panel ${value >= 40 ? 'is-active' : ''}`}>
            <ScanSearch aria-hidden="true" />
            <p className="eyebrow">02 / Search</p>
            <h3>
              Help it
              <br />
              <span className="serif">get found.</span>
            </h3>
            <p>
              Technical SEO. Local visibility. Search strategy grounded in how
              websites actually work.
            </p>
            <a className="text-link" href="/services/technical-seo/">
              Explore SEO <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
        <div className="dual-controls">
          <label htmlFor="expertise-range">Shift the perspective</label>
          <input
            id="expertise-range"
            type="range"
            disabled={!hydrated}
            min="20"
            max="80"
            step="5"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-valuetext={focus}
            aria-describedby="expertise-help"
          />
          <div className="focus-presets">
            {[
              ['Build', 25],
              ['Both', 50],
              ['Grow', 75],
            ].map(([label, num]) => (
              <button
                key={label}
                disabled={!hydrated}
                onClick={() => setValue(Number(num))}
                aria-pressed={value === num}
              >
                {label}
              </button>
            ))}
          </div>
          <p id="expertise-help" className="small">
            Drag, use the arrow keys, or choose a focus.
          </p>
          <p className="focus-status" role="status">
            {focus}
          </p>
        </div>
      </div>
    </LazyMotion>
  )
}
