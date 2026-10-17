import { useState, type SubmitEvent } from 'react'
import { ArrowUpRight, Download } from 'lucide-react'
export default function BriefForm({ email }: { email: string }) {
  const [draft, setDraft] = useState<{ body: string; url: string } | null>(null)
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (data.get('website')) return
    const body = `Name: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\nFocus: ${data.get('focus')}\n\n${String(data.get('message')).trim()}`
    setDraft({
      body,
      url: `mailto:${email}?subject=${encodeURIComponent('Project inquiry — ' + String(data.get('focus')))}&body=${encodeURIComponent(body)}`,
    })
  }
  function download() {
    if (!draft) return
    const url = URL.createObjectURL(
      new Blob([draft.body], { type: 'text/plain;charset=utf-8' }),
    )
    const a = document.createElement('a')
    a.href = url
    a.download = 'project-brief.txt'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <form
      className="brief-form"
      onSubmit={submit}
      onChange={() => setDraft(null)}
    >
      <p className="eyebrow">Tell me a little about it</p>
      <div className="form-row">
        <label>
          Your name
          <input name="name" required maxLength={100} autoComplete="name" />
        </label>
        <label>
          Your email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
      </div>
      <label>
        What can I help with?
        <select name="focus" required defaultValue="">
          <option value="" disabled>
            Select a starting point
          </option>
          {[
            'SaaS development',
            'Custom software',
            'Technical SEO',
            'Local SEO',
            'Link building',
            'A combination',
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        A little about your project
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={3000}
          rows={5}
          placeholder="The problem, your audience, and what you want to change."
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="small">
        This prepares a draft in your browser. You review and send it using your
        email app. Nothing is submitted to this website.
      </p>
      <button className="button" type="submit">
        Prepare an email <ArrowUpRight aria-hidden="true" size={20} />
      </button>
      {draft && (
        <div className="draft-result">
          <p role="status">Your draft is ready; nothing has been sent.</p>
          <a
            className="button"
            href={draft.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open email draft <ArrowUpRight aria-hidden="true" size={20} />
          </a>
          <button type="button" className="text-link" onClick={download}>
            Download a copy <Download aria-hidden="true" size={18} />
          </button>
        </div>
      )}
    </form>
  )
}
