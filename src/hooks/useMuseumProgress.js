import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storage'
import { achievements } from '../data/achievements'
import { rooms } from '../data/rooms'

export const emptyProgress = {
  entered: false,
  viewedArtworks: [],
  discoveredArtists: [],
  visitedRooms: [],
  visitedExhibitions: [],
  periods: [],
  toursCompleted: 0,
  exhibitionsCreated: 0,
  nightMode: false,
  favouritesPeak: 0,
  unlocked: [],
  startedAt: null,
}

const addOnce = (list, value) => (list.includes(value) ? list : [...list, value])

export function useProgressStore() {
  const [progress, setProgress] = useLocalStorage(KEYS.progress, emptyProgress)

  /** Merge stored progress with the default shape so old saves stay readable. */
  const safe = useMemo(() => ({ ...emptyProgress, ...(progress ?? {}) }), [progress])

  const update = useCallback((patch) => setProgress((cur) => ({ ...emptyProgress, ...cur, ...patch })), [setProgress])

  const markEntered = useCallback(
    () => setProgress((cur) => ({ ...emptyProgress, ...cur, entered: true, startedAt: cur?.startedAt ?? Date.now() })),
    [setProgress],
  )

  const recordArtwork = useCallback(
    (artwork) => {
      if (!artwork) return
      setProgress((cur) => {
        const base = { ...emptyProgress, ...cur }
        return {
          ...base,
          viewedArtworks: addOnce(base.viewedArtworks, artwork.id),
          discoveredArtists: addOnce(base.discoveredArtists, artwork.artistId),
          periods: addOnce(base.periods, artwork.period),
        }
      })
    },
    [setProgress],
  )

  const recordRoom = useCallback(
    (roomId) => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      return { ...base, visitedRooms: addOnce(base.visitedRooms, roomId) }
    }),
    [setProgress],
  )

  const recordExhibition = useCallback(
    (id) => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      return { ...base, visitedExhibitions: addOnce(base.visitedExhibitions, id) }
    }),
    [setProgress],
  )

  const recordTour = useCallback(
    () => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      return { ...base, toursCompleted: base.toursCompleted + 1 }
    }),
    [setProgress],
  )

  const recordExhibitionCreated = useCallback(
    () => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      return { ...base, exhibitionsCreated: base.exhibitionsCreated + 1 }
    }),
    [setProgress],
  )

  const recordFavouriteCount = useCallback(
    (count) => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      if (count <= base.favouritesPeak) return base
      return { ...base, favouritesPeak: count }
    }),
    [setProgress],
  )

  const markNightMode = useCallback(
    () => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      return base.nightMode ? base : { ...base, nightMode: true }
    }),
    [setProgress],
  )

  const unlock = useCallback(
    (ids) => setProgress((cur) => {
      const base = { ...emptyProgress, ...cur }
      const merged = [...new Set([...base.unlocked, ...ids])]
      if (merged.length === base.unlocked.length) return base
      return { ...base, unlocked: merged }
    }),
    [setProgress],
  )

  const reset = useCallback(() => setProgress(emptyProgress), [setProgress])

  const earned = useMemo(() => achievements.filter((a) => a.test(safe)), [safe])

  const stats = useMemo(
    () => ({
      artworks: safe.viewedArtworks.length,
      artists: safe.discoveredArtists.length,
      rooms: safe.visitedRooms.length,
      totalRooms: rooms.length,
      exhibitions: safe.visitedExhibitions.length,
      tours: safe.toursCompleted,
      periods: safe.periods.length,
      achievements: earned.length,
    }),
    [safe, earned],
  )

  return {
    progress: safe,
    stats,
    earned,
    update,
    markEntered,
    recordArtwork,
    recordRoom,
    recordExhibition,
    recordTour,
    recordExhibitionCreated,
    recordFavouriteCount,
    markNightMode,
    unlock,
    reset,
    replace: setProgress,
  }
}
