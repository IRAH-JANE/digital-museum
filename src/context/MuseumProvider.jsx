import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useFavoritesStore } from '../hooks/useFavorites'
import { useRecentlyViewedStore } from '../hooks/useRecentlyViewed'
import { useProgressStore } from '../hooks/useMuseumProgress'
import { useSettingsStore } from '../hooks/useSettings'
import { useAudioEngine } from '../hooks/useAudio'
import { useCuratorStore } from '../hooks/useCuratorExhibitions'
import { achievementsById } from '../data/achievements'
import { read, write, KEYS } from '../utils/storage'

const MuseumContext = createContext(null)

export function MuseumProvider({ children }) {
  const settings = useSettingsStore()
  const favorites = useFavoritesStore()
  const recent = useRecentlyViewedStore()
  const progress = useProgressStore()
  const curator = useCuratorStore()
  const audio = useAudioEngine({ volume: settings.settings.volume, trackId: settings.settings.ambientTrack })

  const [onboarded, setOnboardedState] = useState(() => read(KEYS.onboarding, false))
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [compare, setCompare] = useState([])
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  const pushToast = useCallback((toast) => {
    toastId.current += 1
    const id = toastId.current
    setToasts((cur) => [...cur, { id, ...toast }])
    setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== id)), toast.duration ?? 4200)
  }, [])

  const dismissToast = useCallback((id) => setToasts((cur) => cur.filter((t) => t.id !== id)), [])

  const setOnboarded = useCallback((value) => {
    setOnboardedState(value)
    write(KEYS.onboarding, value)
  }, [])

  /* Favourites feed the "Collector" achievement, so the peak is recorded here. */
  const favouriteCount = favorites.count
  const recordFavouriteCount = progress.recordFavouriteCount
  useEffect(() => {
    recordFavouriteCount(favouriteCount)
  }, [favouriteCount, recordFavouriteCount])

  /* Night mode is a progress fact as well as a setting. */
  const isNight = settings.settings.night
  const markNightMode = progress.markNightMode
  useEffect(() => {
    if (isNight) markNightMode()
  }, [isNight, markNightMode])

  /* Newly earned achievements announce themselves once, then are remembered. */
  const earnedIds = useMemo(() => progress.earned.map((a) => a.id), [progress.earned])
  const unlocked = progress.progress.unlocked
  const unlock = progress.unlock
  useEffect(() => {
    const fresh = earnedIds.filter((id) => !unlocked.includes(id))
    if (!fresh.length) return
    unlock(fresh)
    fresh.forEach((id) => {
      const achievement = achievementsById[id]
      if (achievement) {
        pushToast({ kind: 'achievement', title: achievement.name, body: achievement.description, duration: 5200 })
      }
    })
  }, [earnedIds, unlocked, unlock, pushToast])

  /* Ambient mode: start the room tone on the first real gesture, never before. */
  const wantsAmbient = settings.settings.ambientAudio
  const audioPlaying = audio.playing
  const startAudio = audio.start
  useEffect(() => {
    if (!wantsAmbient || audioPlaying) return undefined
    const begin = () => startAudio()
    window.addEventListener('pointerdown', begin, { once: true })
    window.addEventListener('keydown', begin, { once: true })
    return () => {
      window.removeEventListener('pointerdown', begin)
      window.removeEventListener('keydown', begin)
    }
  }, [wantsAmbient, audioPlaying, startAudio])

  /* Keep the chosen track and volume in settings so they survive a reload. */
  const setSetting = settings.set
  const audioTrack = audio.current
  const audioVolume = audio.volume
  useEffect(() => {
    setSetting({ ambientTrack: audioTrack, volume: audioVolume })
  }, [audioTrack, audioVolume, setSetting])

  const toggleCompare = useCallback(
    (id) => {
      setCompare((cur) => {
        if (cur.includes(id)) return cur.filter((v) => v !== id)
        if (cur.length >= 2) return [cur[1], id]
        return [...cur, id]
      })
    },
    [],
  )

  const clearCompare = useCallback(() => setCompare([]), [])

  /** Recording a visit to one work: recent list, progress and artist discovery. */
  const visitArtwork = useCallback(
    (artwork) => {
      if (!artwork) return
      recent.record(artwork.id)
      progress.recordArtwork(artwork)
    },
    [recent, progress],
  )

  const toggleFavorite = useCallback(
    (artwork) => {
      const added = favorites.toggle(artwork.id)
      pushToast({
        kind: 'plain',
        title: added ? 'Saved to your collection' : 'Removed from your collection',
        body: artwork.title,
        duration: 2600,
      })
      return added
    },
    [favorites, pushToast],
  )

  const value = useMemo(
    () => ({
      settings,
      favorites: { ...favorites, toggleWithToast: toggleFavorite },
      recent,
      progress,
      curator,
      audio,
      onboarded,
      setOnboarded,
      paletteOpen,
      setPaletteOpen,
      searchOpen,
      setSearchOpen,
      compare,
      toggleCompare,
      clearCompare,
      toasts,
      pushToast,
      dismissToast,
      visitArtwork,
    }),
    [
      settings,
      favorites,
      toggleFavorite,
      recent,
      progress,
      curator,
      audio,
      onboarded,
      setOnboarded,
      paletteOpen,
      searchOpen,
      compare,
      toggleCompare,
      clearCompare,
      toasts,
      pushToast,
      dismissToast,
      visitArtwork,
    ],
  )

  return <MuseumContext.Provider value={value}>{children}</MuseumContext.Provider>
}

export function useMuseum() {
  const context = useContext(MuseumContext)
  if (!context) throw new Error('useMuseum must be used inside <MuseumProvider>')
  return context
}

/* Named views onto the same store, so components can ask for only what they need. */
export const useFavorites = () => useMuseum().favorites
export const useRecentlyViewed = () => useMuseum().recent
export const useMuseumProgress = () => useMuseum().progress
export const useMuseumAudio = () => useMuseum().audio
export const useTheme = () => useMuseum().settings
export const useMuseumSettings = () => useMuseum().settings
export const useCurator = () => useMuseum().curator
