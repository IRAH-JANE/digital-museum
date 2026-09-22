import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { randomArtwork } from '../utils/recommendations'

export default function NotFound() {
  const suggestion = randomArtwork()

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="plaque text-[var(--gold)]">Room not found</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,10vw,6rem)] font-light leading-none">
          404
        </h1>
        <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
          There is no door here. The corridor you followed does not lead anywhere in this building.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/museum" className="btn btn-solid">
            Return to the lobby
          </Link>
          <Link to={`/artwork/${suggestion.id}`} className="btn">
            See {suggestion.title} instead
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}
