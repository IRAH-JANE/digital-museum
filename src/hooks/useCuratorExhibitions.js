import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storage'

const newId = () => `own-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

/** Exhibitions the visitor arranges themselves, in Curator mode. */
export function useCuratorStore() {
  const [items, setItems] = useLocalStorage(KEYS.exhibitions, [])

  const create = useCallback(
    ({ title, statement, style = 'ivory', artworkIds = [] }) => {
      const record = {
        id: newId(),
        title: title?.trim() || 'Untitled exhibition',
        statement: statement?.trim() ?? '',
        style,
        artworkIds,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setItems((cur) => [record, ...cur])
      return record
    },
    [setItems],
  )

  const update = useCallback(
    (id, patch) =>
      setItems((cur) =>
        cur.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: Date.now() } : item)),
      ),
    [setItems],
  )

  const remove = useCallback((id) => setItems((cur) => cur.filter((item) => item.id !== id)), [setItems])
  const clear = useCallback(() => setItems([]), [setItems])
  const get = useCallback((id) => items.find((item) => item.id === id) ?? null, [items])

  return { items, create, update, remove, clear, get, replace: setItems }
}
