import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Compass, Grid2x2, Heart, Landmark, Moon, Music, Search, Shuffle, SlidersHorizontal, Sun, Users,
} from 'lucide-react'
import { searchEverything } from '../../utils/search'
import { randomArtwork } from '../../utils/recommendations'
import { useMuseum } from '../../context/MuseumProvider'
import { useDebounce } from '../../hooks/useDebounce'

/** Cmd/Ctrl + K. Commands first, then anything in the collection that matches. */
export function CommandPalette() {
  const navigate = useNavigate()
  const { paletteOpen, setPaletteOpen, settings, audio } = useMuseum()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const debounced = useDebounce(query, 140)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const close = () => {
    setPaletteOpen(false)
    setQuery('')
    setActive(0)
  }

  const commands = useMemo(
    () => [
      { id: 'explore', label: 'Explore the museum', icon: Landmark, run: () => navigate('/museum') },
      { id: 'rooms', label: 'Open the rooms', icon: Grid2x2, run: () => navigate('/rooms') },
      { id: 'collection', label: 'Search the collection', icon: SlidersHorizontal, run: () => navigate('/artworks') },
      { id: 'discover', label: 'Discover something new', icon: Compass, run: () => navigate('/discover') },
      { id: 'artists', label: 'Browse the artists', icon: Users, run: () => navigate('/artists') },
      { id: 'mine', label: 'My collection', icon: Heart, run: () => navigate('/collection') },
      { id: 'random', label: 'Open a random artwork', icon: Shuffle, run: () => navigate(`/artwork/${randomArtwork().id}`) },
      { id: 'tour', label: 'Start a guided tour', icon: Compass, run: () => navigate('/tours') },
      {
        id: 'night',
        label: settings.settings.night ? 'Turn off Night at the Museum' : 'Night at the Museum',
        icon: settings.settings.night ? Sun : Moon,
        run: () => settings.toggleNight(),
      },
      {
        id: 'audio',
        label: audio.playing ? 'Stop ambient sound' : 'Start ambient sound',
        icon: Music,
        run: () => audio.toggle(),
      },
    ],
    [navigate, settings, audio],
  )

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    const matchedCommands = q
      ? commands.filter((command) => command.label.toLowerCase().includes(q))
      : commands
    if (!q) return matchedCommands.map((command) => ({ kind: 'command', ...command }))

    const found = searchEverything(q)
    return [
      ...matchedCommands.map((command) => ({ kind: 'command', ...command })),
      ...found.artworks.slice(0, 6).map((item) => ({
        kind: 'artwork',
        id: `a-${item.id}`,
        label: item.title,
        hint: `${item.artist} · ${item.yearText}`,
        run: () => navigate(`/artwork/${item.id}`),
      })),
      ...found.artists.slice(0, 3).map((artist) => ({
        kind: 'artist',
        id: `p-${artist.id}`,
        label: artist.name,
        hint: artist.movement,
        run: () => navigate(`/artists/${artist.id}`),
      })),
      ...found.rooms.map((room) => ({
        kind: 'room',
        id: `r-${room.id}`,
        label: room.name,
        hint: `Room ${room.number}`,
        run: () => navigate(`/rooms/${room.id}`),
      })),
    ]
  }, [debounced, commands, navigate])

  useEffect(() => {
    setActive(0)
  }, [debounced])

  useEffect(() => {
    if (paletteOpen) setTimeout(() => inputRef.current?.focus(), 30)
  }, [paletteOpen])

  useEffect(() => {
    if (!paletteOpen) return undefined
    document.body.classList.add('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [paletteOpen])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => Math.min(results.length - 1, i + 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const entry = results[active]
      if (entry) {
        entry.run()
        close()
      }
    }
    if (event.key === 'Escape') close()
  }

  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]')
    node?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {paletteOpen ? (
        <motion.div
          className="fixed inset-0 z-[96] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close the command palette"
            className="fixed inset-0 cursor-default bg-black/55 backdrop-blur-[2px]"
            onClick={close}
            tabIndex={-1}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative z-10 w-full max-w-xl border border-[var(--rule)] bg-[var(--paper)] shadow-2xl"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-[var(--rule)] px-4">
              <Search size={16} strokeWidth={1.25} className="shrink-0 text-[var(--ink-faint)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search artworks, artists, rooms or commands"
                aria-label="Search the museum"
                className="field border-none py-4 text-base"
              />
            </div>

            <ul ref={listRef} className="max-h-[52vh] overflow-y-auto py-1" role="listbox" aria-label="Results">
              {results.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
                  Nothing matches that. Try an artist, a period or a medium.
                </li>
              ) : null}
              {results.map((entry, index) => {
                const Icon = entry.icon
                return (
                  <li key={entry.id} role="option" aria-selected={index === active}>
                    <button
                      type="button"
                      data-active={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => {
                        entry.run()
                        close()
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                        index === active ? 'bg-[var(--wall-edge)]' : ''
                      }`}
                    >
                      {Icon ? (
                        <Icon size={15} strokeWidth={1.25} className="shrink-0 text-[var(--ink-faint)]" />
                      ) : (
                        <span className="plaque w-[15px] shrink-0 text-[0.6rem]">
                          {entry.kind === 'artwork' ? '◻' : entry.kind === 'artist' ? '◍' : '▤'}
                        </span>
                      )}
                      <span className="min-w-0 flex-1 truncate text-sm">{entry.label}</span>
                      {entry.hint ? (
                        <span className="hidden shrink-0 text-xs text-[var(--ink-faint)] sm:block">{entry.hint}</span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-[var(--rule)] px-4 py-2 text-[0.68rem] text-[var(--ink-faint)]">
              <span>↑ ↓ to move · ⏎ to open · esc to close</span>
              <span className="tabular-nums">{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
