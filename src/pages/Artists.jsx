import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { EmptyState } from '../components/ui/EmptyState'
import { artists } from '../data/artists'
import { artworksByArtist } from '../data/artworks'
import { useDebounce } from '../hooks/useDebounce'
import { cn } from '../utils/cn'

export default function Artists() {
  const [query, setQuery] = useState('')
  const [movement, setMovement] = useState('All')
  const debounced = useDebounce(query, 160)

  const movements = useMemo(
    () => ['All', ...new Set(artists.map((artist) => artist.movement))].sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b))),
    [],
  )

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return artists
      .filter((artist) => (movement === 'All' ? true : artist.movement === movement))
      .filter((artist) =>
        q
          ? [artist.name, artist.nationality, artist.movement]
              .join(' ')
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => (a.birth ?? 0) - (b.birth ?? 0))
  }, [debounced, movement])

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">The people who made it</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Artists
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            {artists.length} names, listed by year of birth. Dates, places and movements follow the
            standard record; interpretation is kept to the individual works.
          </p>

          <div className="mt-9">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, nationality or movement"
              aria-label="Search the artists"
              className="field w-full max-w-xl"
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {movements.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMovement(option)}
                  aria-pressed={movement === option}
                  className={cn(
                    'border px-3 py-1.5 text-xs transition-colors duration-300',
                    movement === option
                      ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                      : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10">
        {results.length === 0 ? (
          <EmptyState
            title="No artists found."
            body="Try another name, nationality or movement."
            actionLabel="Show everyone"
            onAction={() => {
              setQuery('')
              setMovement('All')
            }}
          />
        ) : (
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((artist) => {
              const count = artworksByArtist(artist.id).length
              return (
                <li key={artist.id}>
                  <Link to={`/artists/${artist.id}`} className="group block">
                    <div className="overflow-hidden border border-[var(--rule)] bg-[var(--mat)]">
                      <SmartImage
                        src={artist.portrait}
                        seed={artist.id}
                        alt={`Portrait of ${artist.name}`}
                        className="h-56 w-full"
                        imgClassName="object-cover object-top grayscale-[0.25] transition-all duration-[1200ms] ease-gallery group-hover:scale-[1.04] group-hover:grayscale-0"
                      />
                    </div>
                    <div className="mt-4 border-t border-[var(--rule)] pt-3">
                      <p className="font-display text-xl leading-snug">{artist.name}</p>
                      <p className="mt-1 text-xs text-[var(--ink-soft)]">
                        {artist.birth ? artist.birth : '—'}
                        {artist.death ? ` — ${artist.death}` : artist.birth ? ' — ' : ''}
                        {artist.nationality ? ` · ${artist.nationality}` : ''}
                      </p>
                      <p className="mt-0.5 text-xs italic text-[var(--ink-faint)]">
                        {artist.movement} · {count} {count === 1 ? 'work' : 'works'}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </PageTransition>
  )
}
