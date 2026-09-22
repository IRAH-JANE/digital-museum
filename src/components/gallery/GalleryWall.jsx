import { Fragment } from 'react'
import { ArtworkFrame } from '../artwork/ArtworkFrame'
import { cn } from '../../utils/cn'

/**
 * Works hung on a wall rather than laid out as cards: a picture rail runs
 * across the top of each bay, the frames hang from it, and the floor line
 * closes the bay underneath. The room name sits between the two bays, the way
 * a vinyl title sits between hangs.
 */
function Bay({ items, eagerFirst = false, offset = 0 }) {
  return (
    <div className="relative">
      {/* picture rail */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[var(--rule)]"
      />
      <div
        className={cn(
          'grid gap-x-8 gap-y-14 px-1 pb-16 pt-7 sm:gap-x-12 lg:gap-x-16',
          items.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2',
          items.length >= 3 ? 'lg:grid-cols-3' : '',
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              // A slight vertical stagger stops the hang from reading as a grid
              index % 2 === 1 ? 'sm:pt-10' : '',
              index % 3 === 2 ? 'lg:pt-4' : '',
            )}
          >
            <ArtworkFrame
              artwork={item}
              eager={eagerFirst && index + offset < 2}
              height="h-52 sm:h-60 lg:h-64"
            />
          </div>
        ))}
      </div>
      {/* floor line */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--rule)] to-transparent"
      />
    </div>
  )
}

export function GalleryWall({ artworks, roomNumber, roomName, className }) {
  const half = Math.ceil(artworks.length / 2)
  const bays = artworks.length > 3 ? [artworks.slice(0, half), artworks.slice(half)] : [artworks]

  return (
    <div className={cn('relative', className)}>
      {bays.map((bay, index) => (
        <Fragment key={index}>
          <Bay items={bay} eagerFirst={index === 0} offset={index * half} />
          {index === 0 && bays.length > 1 ? (
            <div className="flex items-center gap-6 py-14 sm:py-20">
              <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden="true" />
              <p className="text-center">
                <span className="plaque block">Room {roomNumber}</span>
                <span className="mt-1 block font-display text-3xl font-light tracking-wide sm:text-4xl">
                  {roomName}
                </span>
              </p>
              <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden="true" />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  )
}
