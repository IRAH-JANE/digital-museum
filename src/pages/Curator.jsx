import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, X } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Modal } from '../components/ui/Modal'
import { artworks, artworksById } from '../data/artworks'
import { searchArtworks } from '../utils/search'
import { useDebounce } from '../hooks/useDebounce'
import { useMuseum } from '../context/MuseumProvider'

const styles = [
  { id: 'ivory', label: 'Ivory wall', note: 'Daylight, wide spacing.' },
  { id: 'charcoal', label: 'Charcoal wall', note: 'Low light, works lit from above.' },
  { id: 'linen', label: 'Linen wall', note: 'Warm and close, for smaller pieces.' },
]

const swatch = { ivory: '#EFE9DD', charcoal: '#2A2320', linen: '#E4DCCC' }

export default function Curator() {
  const { curator, progress, pushToast, favorites } = useMuseum()

  const [title, setTitle] = useState('')
  const [statement, setStatement] = useState('')
  const [style, setStyle] = useState('ivory')
  const [selected, setSelected] = useState([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dragIndex = useRef(null)
  const debounced = useDebounce(query, 160)

  const pool = useMemo(
    () => (debounced.trim() ? searchArtworks(debounced, 60) : artworks),
    [debounced],
  )

  const move = (from, to) => {
    if (to < 0 || to >= selected.length) return
    setSelected((current) => {
      const next = [...current]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const toggle = (id) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )

  const save = () => {
    if (!selected.length) return
    curator.create({ title, statement, style, artworkIds: selected })
    progress.recordExhibitionCreated()
    pushToast({
      kind: 'plain',
      title: 'Exhibition hung',
      body: title.trim() || 'Untitled exhibition',
      duration: 3600,
    })
    setTitle('')
    setStatement('')
    setSelected([])
    setStyle('ivory')
  }

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Curator mode</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Hang your own
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            Choose works, put them in an order, give the result a name. Order matters in an
            exhibition — the first work sets the terms for everything after it.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[110rem] gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* ------------------------------------------------------------ the details */}
        <div>
          <SectionHeading title="The exhibition" />
          <div className="space-y-6">
            <div>
              <label htmlFor="ex-title" className="plaque block text-[var(--ink-faint)]">
                Title
              </label>
              <input
                id="ex-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Night and Silence"
                className="field mt-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="ex-statement" className="plaque block text-[var(--ink-faint)]">
                Statement
              </label>
              <textarea
                id="ex-statement"
                value={statement}
                onChange={(event) => setStatement(event.target.value)}
                rows={5}
                placeholder="What holds these works together?"
                className="field mt-2 w-full resize-y"
              />
            </div>
            <fieldset>
              <legend className="plaque text-[var(--ink-faint)]">Room style</legend>
              <div className="mt-3 space-y-2">
                {styles.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setStyle(option.id)}
                    aria-pressed={style === option.id}
                    className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors duration-300 ${
                      style === option.id
                        ? 'border-[var(--gold)] text-[var(--ink)]'
                        : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink)]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 border border-[var(--rule)]"
                      style={{ backgroundColor: swatch[option.id] }}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm">{option.label}</span>
                      <span className="block text-xs text-[var(--ink-faint)]">{option.note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3 border-t border-[var(--rule)] pt-6">
              <button
                type="button"
                onClick={save}
                disabled={!selected.length}
                className="btn btn-solid"
              >
                Save exhibition
              </button>
              <button type="button" onClick={() => setPickerOpen(true)} className="btn">
                <Plus size={15} strokeWidth={1.5} />
                Add works
              </button>
              {favorites.count ? (
                <button
                  type="button"
                  onClick={() =>
                    setSelected((current) => [
                      ...new Set([...current, ...favorites.ids]),
                    ])
                  }
                  className="btn btn-quiet"
                >
                  Add my saved works
                </button>
              ) : null}
            </div>
            {!selected.length ? (
              <p className="text-xs text-[var(--ink-faint)]">
                Add at least one work before saving.
              </p>
            ) : null}
          </div>
        </div>

        {/* --------------------------------------------------------- the running order */}
        <div>
          <SectionHeading
            title="Running order"
            note={`${selected.length} ${selected.length === 1 ? 'work' : 'works'} · drag to reorder, or use the arrows`}
          />
          {selected.length ? (
            <ol className="space-y-2">
              <AnimatePresence initial={false}>
                {selected.map((id, index) => {
                  const artwork = artworksById[id]
                  if (!artwork) return null
                  return (
                    <motion.li
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      draggable
                      onDragStart={() => {
                        dragIndex.current = index
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault()
                        if (dragIndex.current === null) return
                        move(dragIndex.current, index)
                        dragIndex.current = null
                      }}
                      className="flex items-center gap-3 border border-[var(--rule)] bg-[var(--paper)] p-2.5"
                    >
                      <GripVertical
                        size={16}
                        strokeWidth={1.25}
                        aria-hidden="true"
                        className="shrink-0 cursor-grab text-[var(--ink-faint)]"
                      />
                      <span className="w-7 shrink-0 text-center font-display text-lg text-[var(--ink-faint)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <SmartImage
                        src={artwork.thumb}
                        seed={artwork.id}
                        alt=""
                        className="h-14 w-14 shrink-0 border border-[var(--rule)]"
                        imgClassName="object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-base italic">
                          {artwork.title}
                        </span>
                        <span className="block truncate text-xs text-[var(--ink-faint)]">
                          {artwork.artist} · {artwork.yearText}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center">
                        <button
                          type="button"
                          onClick={() => move(index, index - 1)}
                          disabled={index === 0}
                          aria-label={`Move ${artwork.title} earlier`}
                          className="p-1.5 text-[var(--ink-faint)] hover:text-[var(--ink)] disabled:opacity-30"
                        >
                          <ChevronUp size={15} strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, index + 1)}
                          disabled={index === selected.length - 1}
                          aria-label={`Move ${artwork.title} later`}
                          className="p-1.5 text-[var(--ink-faint)] hover:text-[var(--ink)] disabled:opacity-30"
                        >
                          <ChevronDown size={15} strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(id)}
                          aria-label={`Remove ${artwork.title}`}
                          className="p-1.5 text-[var(--ink-faint)] hover:text-[var(--ink)]"
                        >
                          <X size={15} strokeWidth={1.5} />
                        </button>
                      </span>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ol>
          ) : (
            <div className="border border-dashed border-[var(--rule)] px-6 py-16 text-center">
              <p className="font-display text-2xl font-light">Nothing on the wall yet.</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Add works and they appear here in the order you chose them.
              </p>
              <button type="button" onClick={() => setPickerOpen(true)} className="btn mt-6">
                Choose works
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- saved exhibitions */}
      <div className="mx-auto max-w-[110rem] px-5 pb-20 sm:px-10">
        <SectionHeading
          title="Your exhibitions"
          note="Saved in this browser."
          to="/collection"
          linkLabel="In my collection"
        />
        {curator.items.length ? (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {curator.items.map((own) => (
              <li
                key={own.id}
                className="border border-[var(--rule)] p-5"
                style={{ backgroundColor: swatch[own.style] ?? swatch.ivory }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl italic text-charcoal">
                      {own.title}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-plaque text-charcoal/50">
                      {own.artworkIds.length} {own.artworkIds.length === 1 ? 'work' : 'works'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => curator.remove(own.id)}
                    aria-label={`Delete ${own.title}`}
                    className="shrink-0 p-1.5 text-charcoal/50 hover:text-charcoal"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </div>
                {own.statement ? (
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-charcoal/70">
                    {own.statement}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {own.artworkIds.slice(0, 6).map((id) => {
                    const artwork = artworksById[id]
                    if (!artwork) return null
                    return (
                      <Link key={id} to={`/artwork/${id}`} title={artwork.title}>
                        <SmartImage
                          src={artwork.thumb}
                          seed={artwork.id}
                          alt={artwork.title}
                          className="h-14 w-14 border border-charcoal/15"
                          imgClassName="object-cover"
                        />
                      </Link>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTitle(own.title)
                    setStatement(own.statement)
                    setStyle(own.style)
                    setSelected(own.artworkIds)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="mt-5 text-xs uppercase tracking-plaque text-charcoal/60 underline underline-offset-4 hover:text-charcoal"
                >
                  Load into the editor
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--ink-soft)]">Nothing saved yet.</p>
        )}
      </div>

      {/* ------------------------------------------------------------- work picker */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Choose works">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the collection"
          aria-label="Search the collection"
          className="field w-full"
        />
        <p className="mt-3 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
          {selected.length} selected
        </p>
        <ul className="mt-4 grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {pool.map((artwork) => {
            const on = selected.includes(artwork.id)
            return (
              <li key={artwork.id}>
                <button
                  type="button"
                  onClick={() => toggle(artwork.id)}
                  aria-pressed={on}
                  className={`block w-full border p-1.5 text-left transition-colors duration-300 ${
                    on ? 'border-[var(--gold)]' : 'border-[var(--rule)] hover:border-[var(--ink)]'
                  }`}
                >
                  <SmartImage
                    src={artwork.thumb}
                    seed={artwork.id}
                    alt=""
                    className="h-24 w-full"
                    imgClassName="object-cover"
                  />
                  <span className="mt-2 block truncate text-xs italic">{artwork.title}</span>
                  <span className="block truncate text-[0.65rem] text-[var(--ink-faint)]">
                    {artwork.artist}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-5 flex justify-end gap-3 border-t border-[var(--rule)] pt-4">
          <button type="button" onClick={() => setPickerOpen(false)} className="btn btn-solid">
            Done
          </button>
        </div>
      </Modal>
    </PageTransition>
  )
}
