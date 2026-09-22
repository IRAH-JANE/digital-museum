import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../ui/Modal'
import { SmartImage } from './SmartImage'
import { artworksById } from '../../data/artworks'
import { periodName } from '../../data/periods'
import { useMuseum } from '../../context/MuseumProvider'

const fields = [
  ['Artist', (a) => a.artist],
  ['Year', (a) => a.yearText],
  ['Medium', (a) => a.materials],
  ['Dimensions', (a) => a.dimensions],
  ['Period', (a) => periodName(a.period)],
  ['Region', (a) => a.region],
  ['Location', (a) => a.location],
]

/** Two works side by side, with an optional shared zoom. */
export function CompareDialog({ open, onClose }) {
  const { compare, clearCompare } = useMuseum()
  const [zoom, setZoom] = useState(1)
  const items = compare.map((id) => artworksById[id]).filter(Boolean)

  const close = () => {
    setZoom(1)
    onClose()
  }

  return (
    <Modal open={open} onClose={close} title="Compare" className="max-w-5xl">
      {items.length < 2 ? (
        <p className="text-sm text-[var(--ink-soft)]">
          Pick a second work to compare. Use the compare button on any artwork page, then reopen this panel.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {items.map((item) => (
              <div key={item.id}>
                <div className="frame-mount overflow-hidden p-2">
                  <div className="h-48 overflow-hidden sm:h-72">
                    <div
                      className="h-full w-full transition-transform duration-500 ease-gallery"
                      style={{ transform: `scale(${zoom})` }}
                    >
                      <SmartImage
                        src={item.thumb}
                        seed={item.id}
                        alt={`${item.title} by ${item.artist}`}
                        eager
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                </div>
                <Link to={`/artwork/${item.id}`} onClick={close} className="mt-3 block">
                  <p className="font-display text-xl italic leading-snug">{item.title}</p>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <label htmlFor="compare-zoom" className="plaque">
              Shared zoom
            </label>
            <input
              id="compare-zoom"
              type="range"
              min="1"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="flex-1 accent-[var(--gold)]"
            />
            <span className="w-12 text-right text-xs tabular-nums text-[var(--ink-soft)]">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <dl className="mt-8 divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
            {fields.map(([label, getter]) => (
              <div key={label} className="grid grid-cols-[6rem_1fr_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[8rem_1fr_1fr]">
                <dt className="plaque pt-0.5">{label}</dt>
                <dd className="leading-snug text-[var(--ink-soft)]">{getter(items[0])}</dd>
                <dd className="leading-snug text-[var(--ink-soft)]">{getter(items[1])}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => {
                clearCompare()
                close()
              }}
            >
              Clear selection
            </button>
            <button type="button" className="btn" onClick={close}>
              Done
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
