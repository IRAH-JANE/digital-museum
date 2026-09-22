import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { rooms } from '../../data/rooms'
import { useMuseumProgress } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

/**
 * The floor plan. Rooms are placed by their `floor` coordinates, visited rooms
 * carry a stamp, and the room you are standing in is filled.
 */
export function MuseumMap({ currentRoomId, compact = false }) {
  const { progress } = useMuseumProgress()
  const visited = new Set(progress.visitedRooms)

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="plaque mb-3 text-center">Entrance</p>
      <div className="mb-4 flex justify-center" aria-hidden="true">
        <span className="h-6 w-px bg-[var(--rule)]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rooms.map((room) => {
          const isCurrent = room.id === currentRoomId
          const hasVisited = visited.has(room.id)
          return (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'group relative flex flex-col justify-between border p-3 transition-colors duration-500 ease-gallery',
                room.floor.span === 2 ? 'col-span-2' : '',
                isCurrent
                  ? 'border-[var(--gold)] bg-[var(--gold)]/12'
                  : 'border-[var(--rule)] hover:border-[var(--ink)]',
                compact ? 'min-h-[4.5rem]' : 'min-h-[5.5rem]',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="plaque">{room.number}</span>
                {hasVisited ? (
                  <Check size={13} strokeWidth={1.5} className="text-[var(--gold)]" aria-label="Visited" />
                ) : null}
              </div>
              <div>
                <p className="font-display text-base leading-tight">{room.name}</p>
                {!compact ? (
                  <p className="mt-0.5 text-[0.7rem] text-[var(--ink-faint)]">{room.count} works</p>
                ) : null}
              </div>
            </Link>
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs text-[var(--ink-faint)]">
        {visited.size} of {rooms.length} rooms visited
      </p>
    </div>
  )
}
