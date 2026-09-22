import { Link } from 'react-router-dom'

/** An empty screen is an invitation, so it always carries one way forward. */
export function EmptyState({ title, body, actionLabel, actionTo, onAction, icon: Icon }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-6 py-24 text-center">
      {Icon ? <Icon size={28} strokeWidth={1} className="text-[var(--ink-faint)]" /> : null}
      <h2 className="font-display text-3xl font-light">{title}</h2>
      {body ? <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{body}</p> : null}
      {actionTo ? (
        <Link to={actionTo} className="btn mt-2">
          {actionLabel}
        </Link>
      ) : null}
      {onAction ? (
        <button type="button" onClick={onAction} className="btn mt-2">
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
