import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { GalleryWall } from '../components/gallery/GalleryWall'
import { TimelineRail } from '../components/timeline/TimelineRail'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { exhibitions } from '../data/exhibitions'
import { artworksById } from '../data/artworks'
import { artistsById } from '../data/artists'
import { useMuseumProgress } from '../context/MuseumProvider'

export default function ExhibitionDetail() {
  const { exhibitionId } = useParams()
  const exhibition = exhibitions.find((item) => item.id === exhibitionId)
  const { recordExhibition } = useMuseumProgress()

  const works = useMemo(
    () => (exhibition ? exhibition.artworkIds.map((id) => artworksById[id]).filter(Boolean) : []),
    [exhibition],
  )

  const lineup = useMemo(() => {
    const ids = [...new Set(works.map((work) => work.artistId))]
    return ids.map((id) => artistsById[id]).filter(Boolean)
  }, [works])

  useEffect(() => {
    if (exhibition) recordExhibition(exhibition.id)
  }, [exhibition, recordExhibition])

  if (!exhibition) {
    return (
      <EmptyState
        title="No such exhibition"
        body="It may have closed, or the link may be mistyped."
        actionLabel="See what is on"
        actionTo="/exhibitions"
      />
    )
  }

  const cover = artworksById[exhibition.coverId]

  return (
    <PageTransition kind="reveal">
      {/* A darker entrance, so the exhibition reads as a separate space */}
      <header className="relative overflow-hidden bg-[#141210] text-[#F3EEE4]">
        <div className="absolute inset-0 -z-10 opacity-40">
          <SmartImage
            src={cover?.image}
            seed={cover?.id ?? exhibition.id}
            alt=""
            eager
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/55 to-[#141210]" />

        <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-10 lg:py-24">
          <Link
            to="/exhibitions"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-plaque text-[#F3EEE4]/70 hover:text-[#F3EEE4]"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            All exhibitions
          </Link>

          <p className="mt-10 text-xs uppercase tracking-wall text-[#F3EEE4]/60">
            {exhibition.dates}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,7vw,5.5rem)] font-light uppercase leading-[0.95]">
            {exhibition.title}
          </h1>
          <p className="mt-5 font-display text-xl italic text-[#F3EEE4]/80 sm:text-2xl">
            {exhibition.tagline}
          </p>
          <p className="mt-4 text-xs uppercase tracking-plaque text-[#F3EEE4]/50">
            {exhibition.curator} · {works.length} works
          </p>
        </div>
      </header>

      <section className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
          <h2 className="plaque text-[var(--gold)]">Curator's statement</h2>
          <p className="mt-6 max-w-reading font-display text-xl font-light leading-[1.6] text-[var(--ink-soft)] sm:text-2xl">
            {exhibition.statement}
          </p>
        </div>
      </section>

      <GalleryWall artworks={works} roomNumber="—" roomName={exhibition.title} />

      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
        {exhibition.timeline?.length ? (
          <section className="mb-20">
            <SectionHeading title="Exhibition timeline" note="How the thread runs." />
            <TimelineRail entries={exhibition.timeline} />
          </section>
        ) : null}

        <section>
          <SectionHeading title="Artists in this exhibition" to="/artists" linkLabel="All artists" />
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {lineup.map((artist) => (
              <li key={artist.id}>
                <Link
                  to={`/artists/${artist.id}`}
                  className="flex items-baseline justify-between gap-4 border-b border-[var(--rule)] py-3"
                >
                  <span className="font-display text-lg">{artist.name}</span>
                  <span className="shrink-0 text-xs text-[var(--ink-faint)]">
                    {artist.birth ?? '—'}
                    {artist.death ? `–${artist.death}` : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageTransition>
  )
}
