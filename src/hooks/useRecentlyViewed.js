import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storage'
import { artworksById } from '../data/artworks'

const LIMIT = 20

export function useRecentlyViewedStore() {
  const [entries, setEntries] = useLocalStorage(KEYS.recent, [])

  const record = useCallback(
    (id) => {
      setEntries((current) => {
        const without = current.filter((entry) => entry.id !== id)
        return [{ id, at: Date.now() }, ...without].slice(0, LIMIT)
      })
    },
    [setEntries],
  )

  const clear = useCallback(() => setEntries([]), [setEntries])

  const items = useMemo(
    () =>
      entries
        .map((entry) => ({ ...artworksById[entry.id], viewedAt: entry.at }))
        .filter((item) => item.id),
    [entries],
  )

  return { entries, items, ids: entries.map((e) => e.id), record, clear, replace: setEntries }
}
