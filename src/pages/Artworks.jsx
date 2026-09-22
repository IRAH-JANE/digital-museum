import { useMemo, useState } from 'react'
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { FilterPanel } from '../components/search/FilterPanel'
import { ArtworkFrame } from '../components/artwork/ArtworkFrame'
import { ArtworkRow } from '../components/artwork/ArtworkRow'
import { EmptyState } from '../components/ui/EmptyState'
import { artworks, yearBounds } from '../data/artworks'
import { filterArtworks, sortArtworks } from '../utils/search'
import { useDebounce } from '../hooks/useDebounce'
import { cn } from '../utils/cn'

const emptyFilters = {
  periods: [],
  mediums: [],
  regions: [],
  yearFrom: yearBounds.min,
  yearTo: yearBounds.max,
}

const sorts = [
  { value: 'catalogue', label: 'Catalogue order' },
  { value: 'year-asc', label: 'Earliest first' },
  { value: 'year-desc', label: 'Latest first' },
  { value: 'artist', label: 'Artist A–Z' },
  { value: 'title', label: 'Title A–Z' },
]

export default function Artworks() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState('catalogue')
  const [panelOpen, setPanelOpen] = useState(false)
  const [layout, setLayout] = useState('wall')
  const debounced = useDebounce(query, 180)

  const results = useMemo(
    () => sortArtworks(filterArtworks(artworks, { ...filters, query: debounced }), sort),
    [filters, debounced, sort],
  )

  const activeFilters =
    filters.periods.length +
    filters.mediums.length +
    filters.regions.length +
    (filters.yearFrom !== yearBounds.min ? 1 : 0) +
    (filters.yearTo !== yearBounds.max ? 1 : 0)

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">The collection</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Artworks
          </h1>

          <div className="mt-9 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, artist, period, region, medium or year"
                aria-label="Search the collection"
                className="field w-full pr-10"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--ink-faint)] hover:text-[var(--ink)]"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setPanelOpen((open) => !open)}
                aria-expanded={panelOpen}
                className={cn('btn', activeFilters ? 'border-[var(--gold)] text-[var(--gold)]' : '')}
              >
                <SlidersHorizontal size={15} strokeWidth={1.5} />
                Filters
                {activeFilters ? <span className="ml-1">({activeFilters})</span> : null}
              </button>

              <label className="sr-only" htmlFor="sort">
                Sort the collection
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="field py-2.5 text-xs"
              >
                {sorts.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex border border-[var(--rule)]">
                {[
                  { value: 'wall', icon: LayoutGrid, label: 'Wall view' },
                  { value: 'list', icon: List, label: 'List view' },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLayout(value)}
                    aria-pressed={layout === value}
                    aria-label={label}
                    className={cn(
                      'p-2.5 transition-colors duration-300',
                      layout === value
                        ? 'bg-[var(--ink)] text-[var(--paper)]'
                        : 'text-[var(--ink-faint)] hover:text-[var(--ink)]',
                    )}
                  >
                    <Icon size={15} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FilterPanel
            open={panelOpen}
            filters={filters}
            setFilters={setFilters}
            resultCount={results.length}
          />
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10">
        <p className="mb-10 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
          {results.length} {results.length === 1 ? 'work' : 'works'}
          {debounced ? ` matching “${debounced}”` : ''}
        </p>

        {results.length === 0 ? (
          <EmptyState
            title="No artworks found."
            body="Try another artist, period, or medium."
            actionLabel="Clear everything"
            onAction={() => {
              setQuery('')
              setFilters(emptyFilters)
            }}
          />
        ) : layout === 'wall' ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((artwork, index) => (
              <ArtworkFrame
                key={artwork.id}
                artwork={artwork}
                height="h-44 sm:h-52"
                eager={index < 5}
              />
            ))}
          </div>
        ) : (
          <ul className="mx-auto max-w-4xl">
            {results.map((artwork) => (
              <li key={artwork.id}>
                <ArtworkRow artwork={artwork} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTransition>
  )
}
