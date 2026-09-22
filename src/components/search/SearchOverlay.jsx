import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../ui/Modal'
import { searchEverything, searchSuggestions } from '../../utils/search'
import { useDebounce } from '../../hooks/useDebounce'
import { useMuseum } from '../../context/MuseumProvider'
import { SmartImage } from '../artwork/SmartImage'

/** Full search, opened from the nav or with the / key. */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useMuseum()
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 160)
  const fieldRef = useRef(null)

  useEffect(() => {
    if (searchOpen) setTimeout(() => fieldRef.current?.focus(), 60)
    else setQuery('')
  }, [searchOpen])

  const results = useMemo(() => searchEverything(debounced), [debounced])
  const total = results.artworks.length + results.artists.length + results.rooms.length + results.exhibitions.length
  const close = () => setSearchOpen(false)

  return (
    <Modal open={searchOpen} onClose={close} className="max-w-3xl">
      <h2 className="plaque mb-4">Search the collection</h2>
      <input
        ref={fieldRef}
        data-autofocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Artist, title, period, medium, region or year"
        aria-label="Search the collection"
        className="field font-display text-2xl"
      />

      {!debounced ? (
        <div className="mt-8">
          <p className="plaque mb-3">Try</p>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="border border-[var(--rule)] px-3 py-1.5 text-xs text-[var(--ink-soft)] transition-colors duration-300 hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {debounced && total === 0 ? (
        <div className="py-12 text-center">
          <p className="font-display text-2xl">No artworks found.</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">Try another artist, period or medium.</p>
        </div>
      ) : null}

      {debounced && total > 0 ? (
        <div className="mt-8 max-h-[52vh] space-y-8 overflow-y-auto pr-1">
          {results.artworks.length ? (
            <section>
              <p className="plaque mb-3">Artworks</p>
              <ul className="space-y-1">
                {results.artworks.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/artwork/${item.id}`}
                      onClick={close}
                      className="flex items-center gap-3 py-1.5 transition-colors duration-200 hover:text-[var(--gold)]"
                    >
                      <SmartImage
                        src={item.thumb}
                        seed={item.id}
                        alt=""
                        className="h-11 w-11 shrink-0 border border-[var(--rule)]"
                        imgClassName="object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate font-display text-lg italic">{item.title}</span>
                      <span className="hidden shrink-0 text-xs text-[var(--ink-faint)] sm:block">
                        {item.artist} · {item.yearText}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.artists.length ? (
            <section>
              <p className="plaque mb-3">Artists</p>
              <ul className="space-y-1">
                {results.artists.map((artist) => (
                  <li key={artist.id}>
                    <Link
                      to={`/artists/${artist.id}`}
                      onClick={close}
                      className="flex items-baseline justify-between gap-4 py-1.5 transition-colors duration-200 hover:text-[var(--gold)]"
                    >
                      <span className="font-display text-lg">{artist.name}</span>
                      <span className="text-xs text-[var(--ink-faint)]">{artist.movement}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.rooms.length || results.exhibitions.length ? (
            <section>
              <p className="plaque mb-3">Elsewhere in the building</p>
              <ul className="space-y-1">
                {results.rooms.map((room) => (
                  <li key={room.id}>
                    <Link to={`/rooms/${room.id}`} onClick={close} className="block py-1.5 hover:text-[var(--gold)]">
                      Room {room.number} — {room.name}
                    </Link>
                  </li>
                ))}
                {results.exhibitions.map((exhibition) => (
                  <li key={exhibition.id}>
                    <Link
                      to={`/exhibitions/${exhibition.id}`}
                      onClick={close}
                      className="block py-1.5 hover:text-[var(--gold)]"
                    >
                      Exhibition — {exhibition.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </Modal>
  )
}
