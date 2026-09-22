import { Link } from 'react-router-dom'
import { relatedTo, relationLabel } from '../../utils/recommendations'
import { SmartImage } from './SmartImage'

export function RelatedWorks({ artworkId, limit = 4 }) {
  const items = relatedTo(artworkId, limit)
  if (!items.length) return null

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-6 border-b border-[var(--rule)] pb-3 font-display text-2xl font-light">
        You may also like
      </h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {items.map((item) => (
          <Link key={item.id} to={`/artwork/${item.id}`} className="group block">
            <div className="frame-mount p-1.5 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.6)]">
              <SmartImage
                src={item.thumb}
                seed={item.id}
                alt={`${item.title} by ${item.artist}`}
                className="h-36 w-full"
                imgClassName="transition-transform duration-[1200ms] ease-gallery group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-3 font-display text-base italic leading-snug">{item.title}</p>
            <p className="text-xs text-[var(--ink-faint)]">{relationLabel(artworkId, item.id)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
