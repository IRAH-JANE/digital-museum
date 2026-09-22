import { Link } from 'react-router-dom'

export function SectionHeading({ title, note, to, linkLabel = 'See all' }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 border-b border-[var(--rule)] pb-3">
      <div>
        <h2 className="font-display text-2xl font-light leading-tight sm:text-3xl">{title}</h2>
        {note ? <p className="mt-1 text-sm text-[var(--ink-soft)]">{note}</p> : null}
      </div>
      {to ? (
        <Link to={to} className="link-underline shrink-0 pb-1 text-xs uppercase tracking-plaque text-[var(--ink-soft)]">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  )
}
