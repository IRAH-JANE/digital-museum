import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { ArtworkFrame } from '../components/artwork/ArtworkFrame'
import { TimelineRail } from '../components/timeline/TimelineRail'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { getArtist, artistsById } from '../data/artists'
import { artworksByArtist } from '../data/artworks'
import { periodName } from '../data/periods'

export default function ArtistDetail() {
  const { artistId } = useParams()
  const artist = getArtist(artistId)

  const works = useMemo(() => (artist ? artworksByArtist(artist.id) : []), [artist])
  const related = useMemo(
    () => (artist?.related ?? []).map((id) => artistsById[id]).filter(Boolean),
    [artist],
  )

  if (!artist) {
    return (
      <EmptyState
        title="No such artist"
        body="That name is not in the museum's index."
        actionLabel="Browse the artists"
        actionTo="/artists"
      />
    )
  }

  const lifespan = artist.birth
    ? `${artist.birth}${artist.death ? ` — ${artist.death}` : ' — '}`
    : null

  return (
    <PageTransition kind="slide">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <Link
            to="/artists"
            className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-plaque text-[var(--ink-soft)]"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            All artists
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-14">
            <div className="max-w-xs border border-[var(--rule)] bg-[var(--mat)] p-2">
              <SmartImage
                src={artist.portrait}
                seed={artist.id}
                alt={`Portrait of ${artist.name}`}
                eager
                className="h-72 w-full"
                imgClassName="object-cover object-top"
              />
            </div>

            <div>
              <h1 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-light uppercase leading-none tracking-tight">
                {artist.name}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-plaque text-[var(--ink-faint)]">
                {lifespan}
                {lifespan && artist.nationality ? ' · ' : ''}
                {artist.nationality}
              </p>
              <p className="mt-2 font-display text-xl italic text-[var(--ink-soft)]">
                {artist.movement}
              </p>
              <p className="mt-7 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">
                {artist.bio}
              </p>
              <p className="mt-6 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
                {works.length} {works.length === 1 ? 'work' : 'works'} on display
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
        <section className="mb-20">
          <SectionHeading title="Notable works" note="In this museum's collection." />
          {works.length ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-4">
              {works.map((work, index) => (
                <ArtworkFrame key={work.id} artwork={work} height="h-48 sm:h-56" eager={index < 4} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-sm text-[var(--ink-soft)]">
              Nothing by this artist is currently hung.
            </p>
          )}
        </section>

        {artist.timeline?.length ? (
          <section className="mb-20">
            <SectionHeading title="Timeline" note="Dates as generally recorded." />
            <TimelineRail
              entries={artist.timeline.map((entry) => ({
                year: entry.year,
                label: entry.label,
              }))}
            />
          </section>
        ) : null}

        {works.length ? (
          <section className="mb-20">
            <SectionHeading title="Periods and rooms" />
            <ul className="flex flex-wrap gap-3">
              {[...new Set(works.map((work) => work.period))].map((period) => (
                <li key={period}>
                  <Link
                    to="/timeline"
                    className="border border-[var(--rule)] px-3 py-1.5 text-xs uppercase tracking-plaque text-[var(--ink-soft)] transition-colors duration-300 hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  >
                    {periodName(period)}
                  </Link>
                </li>
              ))}
              {[...new Set(works.map((work) => work.roomId))].map((roomId) => (
                <li key={roomId}>
                  <Link
                    to={`/rooms/${roomId}`}
                    className="border border-[var(--rule)] px-3 py-1.5 text-xs uppercase tracking-plaque text-[var(--ink-soft)] transition-colors duration-300 hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  >
                    Room · {roomId}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length ? (
          <section>
            <SectionHeading title="Related artists" note="Neighbours in time, place or approach." />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((other) => (
                <li key={other.id}>
                  <Link
                    to={`/artists/${other.id}`}
                    className="group flex items-center gap-4 border-t border-[var(--rule)] pt-4"
                  >
                    <SmartImage
                      src={other.portrait}
                      seed={other.id}
                      alt=""
                      className="h-16 w-16 shrink-0 border border-[var(--rule)]"
                      imgClassName="object-cover object-top"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg">{other.name}</span>
                      <span className="block truncate text-xs text-[var(--ink-faint)]">
                        {other.movement}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </PageTransition>
  )
}
