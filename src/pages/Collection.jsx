import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { ArtworkFrame } from '../components/artwork/ArtworkFrame'
import { ArtworkRow } from '../components/artwork/ArtworkRow'
import { SmartImage } from '../components/artwork/SmartImage'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { artistsById } from '../data/artists'
import { artworksById } from '../data/artworks'
import { relativeTime } from '../utils/dateUtils'
import { useMuseum } from '../context/MuseumProvider'

const tabs = [
  { id: 'saved', label: 'Saved works' },
  { id: 'recent', label: 'Recently viewed' },
  { id: 'artists', label: 'Artists discovered' },
  { id: 'mine', label: 'My exhibitions' },
]

export default function Collection() {
  const { favorites, recent, progress, curator } = useMuseum()
  const [tab, setTab] = useState('saved')

  const discovered = progress.progress.discoveredArtists
    .map((id) => artistsById[id])
    .filter(Boolean)

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Yours alone</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            My collection
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            {favorites.count} saved · {recent.items.length} recently viewed · {discovered.length}{' '}
            artists met. All of it lives in this browser and never leaves it.
          </p>

          <div className="mt-9 flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={`border px-3.5 py-2 text-xs uppercase tracking-plaque transition-colors duration-300 ${
                  tab === item.id
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                    : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10">
        {tab === 'saved' ? (
          favorites.count ? (
            <>
              <SectionHeading
                title="Saved works"
                note="In the order you saved them."
                to="/artworks"
                linkLabel="Find more"
              />
              <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-4 xl:grid-cols-5">
                {favorites.items.map((artwork, index) => (
                  <ArtworkFrame
                    key={artwork.id}
                    artwork={artwork}
                    height="h-44 sm:h-52"
                    eager={index < 5}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => favorites.clear()}
                className="btn btn-quiet mt-14"
              >
                <Trash2 size={14} strokeWidth={1.5} />
                Remove every saved work
              </button>
            </>
          ) : (
            <EmptyState
              icon={Heart}
              title="Your collection is empty."
              body="Begin exploring the museum and save artworks that speak to you."
              actionLabel="Explore artworks"
              actionTo="/artworks"
            />
          )
        ) : null}

        {tab === 'recent' ? (
          recent.items.length ? (
            <>
              <SectionHeading title="Recently viewed" note="The last twenty, newest first." />
              <ul className="mx-auto max-w-4xl">
                {recent.items.map((artwork) => (
                  <li key={artwork.id}>
                    <ArtworkRow
                      artwork={artwork}
                      trailing={
                        <span className="shrink-0 text-xs text-[var(--ink-faint)]">
                          {relativeTime(artwork.viewedAt)}
                        </span>
                      }
                    />
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => recent.clear()} className="btn btn-quiet mt-10">
                <Trash2 size={14} strokeWidth={1.5} />
                Clear this list
              </button>
            </>
          ) : (
            <EmptyState
              title="Nothing viewed yet."
              body="Works you open are listed here so you can find your way back to them."
              actionLabel="Start looking"
              actionTo="/rooms"
            />
          )
        ) : null}

        {tab === 'artists' ? (
          discovered.length ? (
            <>
              <SectionHeading title="Artists discovered" note="Met through their work." />
              <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {discovered.map((artist) => (
                  <li key={artist.id}>
                    <Link
                      to={`/artists/${artist.id}`}
                      className="flex items-center gap-4 border-b border-[var(--rule)] py-3"
                    >
                      <SmartImage
                        src={artist.portrait}
                        seed={artist.id}
                        alt=""
                        className="h-14 w-14 shrink-0 border border-[var(--rule)]"
                        imgClassName="object-cover object-top"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg">{artist.name}</span>
                        <span className="block truncate text-xs text-[var(--ink-faint)]">
                          {artist.movement}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              title="No artists yet."
              body="Open a work and its maker is added here."
              actionLabel="Browse the artists"
              actionTo="/artists"
            />
          )
        ) : null}

        {tab === 'mine' ? (
          curator.items.length ? (
            <>
              <SectionHeading
                title="My exhibitions"
                note="Hung by you."
                to="/curator"
                linkLabel="Curator mode"
              />
              <ul className="space-y-10">
                {curator.items.map((own) => (
                  <li key={own.id} className="border-t border-[var(--rule)] pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl italic">{own.title}</h3>
                        {own.statement ? (
                          <p className="mt-2 max-w-reading text-sm text-[var(--ink-soft)]">
                            {own.statement}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
                        {own.artworkIds.length} {own.artworkIds.length === 1 ? 'work' : 'works'}
                      </p>
                    </div>
                    <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                      {own.artworkIds.map((id) => {
                        const artwork = artworksById[id]
                        if (!artwork) return null
                        return (
                          <Link key={id} to={`/artwork/${id}`} className="shrink-0">
                            <SmartImage
                              src={artwork.thumb}
                              seed={artwork.id}
                              alt={artwork.title}
                              className="h-28 w-28 border border-[var(--rule)]"
                              imgClassName="object-cover"
                            />
                          </Link>
                        )
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              title="You have not hung anything yet."
              body="Curator mode lets you choose works, arrange them and name the result."
              actionLabel="Open Curator mode"
              actionTo="/curator"
            />
          )
        ) : null}
      </div>
    </PageTransition>
  )
}
