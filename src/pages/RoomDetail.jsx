import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { GalleryWall } from '../components/gallery/GalleryWall'
import { MuseumMap } from '../components/museum/MuseumMap'
import { EmptyState } from '../components/ui/EmptyState'
import { rooms, getRoom } from '../data/rooms'
import { artworksByRoom } from '../data/artworks'
import { useMuseumProgress } from '../context/MuseumProvider'

export default function RoomDetail() {
  const { roomId } = useParams()
  const room = getRoom(roomId)
  const { recordRoom } = useMuseumProgress()

  const works = useMemo(() => (room ? artworksByRoom(room.id) : []), [room])
  const index = rooms.findIndex((item) => item.id === roomId)
  const previous = index > 0 ? rooms[index - 1] : rooms[rooms.length - 1]
  const next = index < rooms.length - 1 ? rooms[index + 1] : rooms[0]

  useEffect(() => {
    if (room) recordRoom(room.id)
  }, [room, recordRoom])

  if (!room) {
    return (
      <EmptyState
        title="No such room"
        body="That door does not lead anywhere. The floor plan will show you what is open."
        actionLabel="See the floor plan"
        actionTo="/rooms"
      />
    )
  }

  return (
    <PageTransition kind="slide">
      <div>
        <header className="border-b border-[var(--rule)]">
          <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
            <Link
              to="/rooms"
              className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-plaque text-[var(--ink-soft)]"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              All rooms
            </Link>
            <div className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <p className="plaque text-[var(--gold)]">Room {room.number}</p>
                <h1 className="mt-3 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-light uppercase leading-none tracking-tight">
                  {room.name}
                </h1>
                <p className="mt-4 max-w-reading font-display text-xl italic text-[var(--ink-soft)]">
                  {room.subtitle}
                </p>
                <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
                  {room.description}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-xs sm:grid-cols-4 lg:grid-cols-2">
                <div className="border-t border-[var(--rule)] pt-3">
                  <dt className="plaque text-[var(--ink-faint)]">Period</dt>
                  <dd className="mt-1.5 text-[var(--ink-soft)]">{room.periodLabel}</dd>
                </div>
                <div className="border-t border-[var(--rule)] pt-3">
                  <dt className="plaque text-[var(--ink-faint)]">On display</dt>
                  <dd className="mt-1.5 text-[var(--ink-soft)]">{works.length} works</dd>
                </div>
                <div className="border-t border-[var(--rule)] pt-3">
                  <dt className="plaque text-[var(--ink-faint)]">Lighting</dt>
                  <dd className="mt-1.5 text-[var(--ink-soft)]">{room.atmosphere.mood}</dd>
                </div>
                <div className="border-t border-[var(--rule)] pt-3">
                  <dt className="plaque text-[var(--ink-faint)]">Timeline</dt>
                  <dd className="mt-1.5">
                    <Link to="/timeline" className="link-underline text-[var(--ink-soft)]">
                      See the period
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        {works.length ? (
          <GalleryWall artworks={works} roomNumber={room.number} roomName={room.name} />
        ) : (
          <EmptyState
            title="This room is being rehung"
            body="Nothing is on these walls at the moment. Try the room next door."
            actionLabel="Back to the floor plan"
            actionTo="/rooms"
          />
        )}

        <div className="mx-auto max-w-[110rem] px-5 pb-16 sm:px-10">
          <nav className="flex flex-col gap-4 border-t border-[var(--rule)] py-10 sm:flex-row sm:items-center sm:justify-between">
            <Link to={`/rooms/${previous.id}`} className="group flex items-center gap-3 text-left">
              <ArrowLeft
                size={16}
                strokeWidth={1.5}
                className="text-[var(--ink-faint)] transition-transform duration-500 ease-gallery group-hover:-translate-x-1"
              />
              <span>
                <span className="plaque block text-[var(--ink-faint)]">Previous room</span>
                <span className="font-display text-xl">{previous.name}</span>
              </span>
            </Link>
            <Link
              to={`/rooms/${next.id}`}
              className="group flex items-center gap-3 text-left sm:text-right"
            >
              <span className="sm:order-1">
                <span className="plaque block text-[var(--ink-faint)]">Next room</span>
                <span className="font-display text-xl">{next.name}</span>
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="text-[var(--ink-faint)] transition-transform duration-500 ease-gallery group-hover:translate-x-1 sm:order-2"
              />
            </Link>
          </nav>

          <MuseumMap currentRoomId={room.id} compact />
        </div>
      </div>
    </PageTransition>
  )
}
