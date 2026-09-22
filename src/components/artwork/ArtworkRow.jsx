import { Link } from 'react-router-dom'
import { SmartImage } from './SmartImage'
import { FavoriteButton } from './FavoriteButton'
import { periodName } from '../../data/periods'

/** A compact list entry, used in search results and the collection page. */
export function ArtworkRow({ artwork, trailing }) {
  return (
    <div className="group flex items-center gap-4 border-b border-[var(--rule)] py-3">
      <Link to={`/artwork/${artwork.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <SmartImage
          src={artwork.thumb}
          seed={artwork.id}
          alt=""
          className="h-16 w-16 shrink-0 border border-[var(--rule)]"
          imgClassName="object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-lg italic leading-snug">{artwork.title}</p>
          <p className="truncate text-xs text-[var(--ink-soft)]">
            {artwork.artist} · {artwork.yearText}
          </p>
          <p className="truncate text-xs text-[var(--ink-faint)]">
            {periodName(artwork.period)} · {artwork.medium}
          </p>
        </div>
      </Link>
      {trailing ?? <FavoriteButton artwork={artwork} size={16} className="shrink-0" />}
    </div>
  )
}
