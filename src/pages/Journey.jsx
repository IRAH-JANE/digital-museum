import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Award } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Passport } from '../components/museum/Passport'
import { MuseumMap } from '../components/museum/MuseumMap'
import { achievements } from '../data/achievements'
import { periods } from '../data/periods'
import { artworksById } from '../data/artworks'
import { rooms } from '../data/rooms'
import { useMuseum } from '../context/MuseumProvider'

function Figure({ value, label, hint }) {
  return (
    <div className="border-t border-[var(--rule)] pt-4">
      <p className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-light leading-none">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-plaque text-[var(--ink-soft)]">{label}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--ink-faint)]">{hint}</p> : null}
    </div>
  )
}

export default function Journey() {
  const { progress, favorites, recent } = useMuseum()
  const seen = progress.progress.viewedArtworks

  /** How the works you have looked at spread across the periods. */
  const byPeriod = useMemo(() => {
    const counts = Object.fromEntries(periods.map((period) => [period.id, 0]))
    seen.forEach((id) => {
      const artwork = artworksById[id]
      if (artwork && counts[artwork.period] !== undefined) counts[artwork.period] += 1
    })
    return periods.map((period) => ({
      name: period.name,
      works: counts[period.id],
    }))
  }, [seen])

  const earnedIds = progress.earned.map((item) => item.id)
  const hasAnything = seen.length > 0

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Your museum journey</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Where you have been
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            A record of your visits, kept in this browser. Nothing is sent anywhere, and clearing
            your local data in Settings erases all of it.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10">
        <section className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          <Figure value={progress.stats.artworks} label="Artworks explored" />
          <Figure value={progress.stats.artists} label="Artists discovered" />
          <Figure
            value={`${progress.stats.rooms}/${progress.stats.totalRooms}`}
            label="Rooms visited"
          />
          <Figure value={progress.stats.exhibitions} label="Exhibitions" />
          <Figure value={progress.stats.tours} label="Tours completed" />
          <Figure value={favorites.count} label="Works saved" />
        </section>

        {/* -------------------------------------------------------------- the chart */}
        <section className="mt-20">
          <SectionHeading
            title="Across the periods"
            note={
              hasAnything
                ? 'Which centuries you have spent your time in.'
                : 'This fills in as you look at things.'
            }
            to="/timeline"
            linkLabel="Timeline"
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPeriod} margin={{ top: 8, right: 8, bottom: 8, left: -18 }}>
                <CartesianGrid stroke="var(--rule)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--ink-faint)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--rule)' }}
                  interval={0}
                  angle={-22}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'var(--ink-faint)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--rule)', opacity: 0.35 }}
                  contentStyle={{
                    background: 'var(--paper)',
                    border: '1px solid var(--rule)',
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="works" name="Works seen">
                  {byPeriod.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.works ? 'var(--gold)' : 'var(--rule)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ------------------------------------------------------------- passport */}
        <section className="mt-20 grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading title="My museum passport" note="A stamp for every room walked." />
            <Passport />
          </div>
          <div>
            <SectionHeading title="Floor plan" note="Visited rooms are marked." to="/rooms" />
            <MuseumMap />
          </div>
        </section>

        {/* --------------------------------------------------------- achievements */}
        <section className="mt-20">
          <SectionHeading
            title="Achievements"
            note={`${earnedIds.length} of ${achievements.length} earned.`}
          />
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const earned = earnedIds.includes(achievement.id)
              return (
                <li
                  key={achievement.id}
                  className={`flex items-start gap-4 border-t border-[var(--rule)] pt-4 ${
                    earned ? '' : 'opacity-45'
                  }`}
                >
                  <Award
                    size={18}
                    strokeWidth={1.25}
                    aria-hidden="true"
                    className={`mt-0.5 shrink-0 ${earned ? 'text-[var(--gold)]' : 'text-[var(--ink-faint)]'}`}
                  />
                  <div>
                    <p className="text-sm uppercase tracking-plaque">{achievement.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)]">
                      {achievement.description}
                    </p>
                    {!earned ? (
                      <p className="mt-1 text-[0.68rem] uppercase tracking-plaque text-[var(--ink-faint)]">
                        Not yet
                      </p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {!hasAnything ? (
          <p className="mt-16 border-t border-[var(--rule)] pt-8 text-sm text-[var(--ink-soft)]">
            Nothing recorded yet.{' '}
            <Link to="/rooms" className="link-underline">
              Walk into a room
            </Link>{' '}
            and this page starts filling itself in. There are {rooms.length} to choose from, and{' '}
            {recent.items.length === 0 ? 'no' : recent.items.length} works in your recent list.
          </p>
        ) : null}
      </div>
    </PageTransition>
  )
}
