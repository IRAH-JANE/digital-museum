import { rooms } from '../../data/rooms'
import { useMuseumProgress } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

/** One stamp per room entered. The empty ones are deliberately visible. */
export function Passport() {
  const { progress } = useMuseumProgress()
  const visited = new Set(progress.visitedRooms)

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
      {rooms.map((room) => {
        const stamped = visited.has(room.id)
        return (
          <div key={room.id} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.62rem] tracking-plaque transition-colors duration-700',
                stamped
                  ? 'rotate-[-8deg] border-[var(--gold)] text-[var(--gold)]'
                  : 'border-dashed border-[var(--rule)] text-[var(--ink-faint)]',
              )}
            >
              {stamped ? room.number : '—'}
            </span>
            <span
              className={cn(
                'text-sm',
                stamped ? 'text-[var(--ink)]' : 'text-[var(--ink-faint)]',
              )}
            >
              {room.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
