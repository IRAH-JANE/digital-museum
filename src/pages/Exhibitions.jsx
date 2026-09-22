import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { Reveal } from '../components/ui/Reveal'
import { exhibitions } from '../data/exhibitions'
import { artworksById } from '../data/artworks'
import { useCurator } from '../context/MuseumProvider'

export default function Exhibitions() {
  const curator = useCurator()

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Temporary</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Exhibitions
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            Selections that cut across the floor plan. Each one follows a single decision through
            works that were never hung together.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
        <ul className="space-y-16">
          {exhibitions.map((exhibition, index) => {
            const cover = artworksById[exhibition.coverId]
            return (
              <li key={exhibition.id}>
                <Reveal delay={0.04}>
                  <Link
                    to={`/exhibitions/${exhibition.id}`}
                    className="group grid gap-8 border-t border-[var(--rule)] pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
                  >
                    <div className="frame-mount p-3 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_32px_66px_-28px_rgba(0,0,0,0.6)]">
                      <SmartImage
                        src={cover?.image}
                        seed={cover?.id ?? exhibition.id}
                        alt={cover ? `${cover.title} by ${cover.artist}` : exhibition.title}
                        eager={index === 0}
                        className="h-64 w-full sm:h-[26rem]"
                        imgClassName="object-cover transition-transform duration-[1400ms] ease-gallery group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="lg:py-4">
                      <p className="plaque text-[var(--ink-faint)]">{exhibition.dates}</p>
                      <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.2rem)] font-light uppercase leading-[1.05]">
                        {exhibition.title}
                      </h2>
                      <p className="mt-3 font-display text-xl italic text-[var(--ink-soft)]">
                        {exhibition.tagline}
                      </p>
                      <p className="mt-6 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">
                        {exhibition.statement}
                      </p>
                      <p className="mt-6 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
                        {exhibition.artworkIds.length} works · {exhibition.curator}
                      </p>
                      <span className="btn mt-8">
                        Enter exhibition
                        <ArrowRight
                          size={15}
                          strokeWidth={1.5}
                          className="transition-transform duration-500 ease-gallery group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>

        {/* ------------------------------------------------------- the visitor's own */}
        <section className="mt-24 border-t border-[var(--rule)] pt-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl font-light">Your exhibitions</h2>
              <p className="mt-2 max-w-reading text-sm text-[var(--ink-soft)]">
                Anything you hang yourself in Curator mode appears here, saved in this browser.
              </p>
            </div>
            <Link to="/curator" className="btn btn-solid">
              Curator mode
            </Link>
          </div>

          {curator.items.length ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {curator.items.map((own) => {
                const cover = artworksById[own.artworkIds[0]]
                return (
                  <li key={own.id}>
                    <Link to="/curator" className="group block border border-[var(--rule)] p-4">
                      <SmartImage
                        src={cover?.thumb}
                        seed={cover?.id ?? own.id}
                        alt=""
                        className="h-40 w-full"
                        imgClassName="object-cover"
                      />
                      <p className="mt-4 font-display text-xl italic">{own.title}</p>
                      <p className="mt-1 text-xs text-[var(--ink-faint)]">
                        {own.artworkIds.length} {own.artworkIds.length === 1 ? 'work' : 'works'}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-8 text-sm text-[var(--ink-soft)]">
              You have not hung anything yet.
            </p>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
