import { Component } from 'react'
import { Link } from 'react-router-dom'

export function ErrorNotice({ title, body, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-6 py-24 text-center">
      <h2 className="font-display text-3xl font-light">{title}</h2>
      <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{body}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {onRetry ? (
          <button type="button" className="btn" onClick={onRetry}>
            Try again
          </button>
        ) : null}
        <Link to="/museum" className="btn btn-quiet">
          Return to the gallery
        </Link>
      </div>
    </div>
  )
}

/** Catches a render failure in one page rather than blanking the whole museum. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('A gallery failed to open:', error)
  }

  render() {
    if (this.state.failed) {
      return (
        <ErrorNotice
          title="Something went wrong while opening this room"
          body="The page could not be built. Reloading usually clears it; your collection is saved separately and is unaffected."
          onRetry={() => this.setState({ failed: false })}
        />
      )
    }
    return this.props.children
  }
}
