import { AnimatePresence, motion } from 'framer-motion'
import { periods } from '../../data/periods'
import { mediums, regions, yearBounds } from '../../data/artworks'
import { cn } from '../../utils/cn'

function Group({ title, options, selected, onToggle }) {
  return (
    <fieldset className="border-t border-[var(--rule)] pt-4">
      <legend className="plaque mb-3">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={isOn}
              className={cn(
                'border px-3 py-1.5 text-xs transition-colors duration-300',
                isOn
                  ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function FilterPanel({ open, filters, setFilters, resultCount }) {
  const toggle = (key, value) =>
    setFilters((current) => {
      const list = current[key]
      return {
        ...current,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      }
    })

  const active =
    filters.periods.length +
    filters.mediums.length +
    filters.regions.length +
    (filters.yearFrom !== yearBounds.min ? 1 : 0) +
    (filters.yearTo !== yearBounds.max ? 1 : 0)

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="space-y-5 pb-8 pt-2">
            <Group
              title="Period"
              options={periods.map((p) => ({ value: p.id, label: p.name }))}
              selected={filters.periods}
              onToggle={(value) => toggle('periods', value)}
            />
            <Group
              title="Medium"
              options={mediums.map((m) => ({ value: m, label: m }))}
              selected={filters.mediums}
              onToggle={(value) => toggle('mediums', value)}
            />
            <Group
              title="Region"
              options={regions.map((r) => ({ value: r, label: r }))}
              selected={filters.regions}
              onToggle={(value) => toggle('regions', value)}
            />

            <fieldset className="border-t border-[var(--rule)] pt-4">
              <legend className="plaque mb-3">Year</legend>
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <span className="sr-only">Earliest year</span>
                  <input
                    type="range"
                    min={yearBounds.min}
                    max={yearBounds.max}
                    value={filters.yearFrom}
                    onChange={(event) =>
                      setFilters((c) => ({ ...c, yearFrom: Math.min(Number(event.target.value), c.yearTo) }))
                    }
                    className="w-full accent-[var(--gold)]"
                  />
                </label>
                <span className="w-40 shrink-0 text-right text-xs tabular-nums text-[var(--ink-soft)]">
                  {filters.yearFrom < 0 ? `${Math.abs(filters.yearFrom)} BCE` : filters.yearFrom} —{' '}
                  {filters.yearTo}
                </span>
              </div>
              <label className="mt-2 block">
                <span className="sr-only">Latest year</span>
                <input
                  type="range"
                  min={yearBounds.min}
                  max={yearBounds.max}
                  value={filters.yearTo}
                  onChange={(event) =>
                    setFilters((c) => ({ ...c, yearTo: Math.max(Number(event.target.value), c.yearFrom) }))
                  }
                  className="w-full accent-[var(--gold)]"
                />
              </label>
            </fieldset>

            <div className="flex items-center justify-between border-t border-[var(--rule)] pt-4">
              <p className="text-xs text-[var(--ink-soft)]">
                {resultCount} {resultCount === 1 ? 'work' : 'works'}
                {active ? ` · ${active} ${active === 1 ? 'filter' : 'filters'} on` : ''}
              </p>
              <button
                type="button"
                className="btn btn-quiet"
                disabled={!active}
                onClick={() =>
                  setFilters((c) => ({
                    ...c,
                    periods: [],
                    mediums: [],
                    regions: [],
                    yearFrom: yearBounds.min,
                    yearTo: yearBounds.max,
                  }))
                }
              >
                Clear filters
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
