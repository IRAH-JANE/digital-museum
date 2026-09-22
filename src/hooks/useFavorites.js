import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storage'
import { artworksById } from '../data/artworks'

/** Implementation. The app consumes this through `useFavorites` in the provider. */
export function useFavoritesStore() {
  const [ids, setIds] = useLocalStorage(KEYS.favorites, [])

  const toggle = useCallback(
    (id) => {
      let added = false
      setIds((current) => {
        if (current.includes(id)) return current.filter((value) => value !== id)
        added = true
        return [id, ...current]
      })
      return added
    },
    [setIds],
  )

  const remove = useCallback((id) => setIds((current) => current.filter((v) => v !== id)), [setIds])
  const clear = useCallback(() => setIds([]), [setIds])
  const has = useCallback((id) => ids.includes(id), [ids])

  const items = useMemo(() => ids.map((id) => artworksById[id]).filter(Boolean), [ids])

  return { ids, items, count: ids.length, toggle, remove, clear, has, replace: setIds }
}
