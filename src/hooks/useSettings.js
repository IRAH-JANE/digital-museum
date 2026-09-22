import { useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storage'
import { usePrefersReducedMotion } from './useMediaQuery'

export const defaultSettings = {
  theme: 'auto', // 'light' | 'dark' | 'auto'
  night: false, // Night at the Museum overrides the theme entirely
  animations: true,
  reducedMotion: false,
  ambientAudio: false,
  ambientTrack: 'quiet-gallery',
  volume: 0.4,
  autoPlayTour: true,
  showLabels: true,
  density: 'comfortable', // 'comfortable' | 'compact'
}

export function useSettingsStore() {
  const [settings, setSettings] = useLocalStorage(KEYS.settings, defaultSettings)
  const systemReducedMotion = usePrefersReducedMotion()

  const value = useMemo(() => ({ ...defaultSettings, ...(settings ?? {}) }), [settings])

  const set = useCallback(
    (patch) => setSettings((cur) => ({ ...defaultSettings, ...cur, ...patch })),
    [setSettings],
  )

  const reset = useCallback(() => setSettings(defaultSettings), [setSettings])

  const systemDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

  const resolvedTheme = value.night ? 'night' : value.theme === 'auto' ? (systemDark ? 'dark' : 'light') : value.theme

  /** Motion is off if the visitor asked for it, or if the OS did. */
  const motionEnabled = value.animations && !value.reducedMotion && !systemReducedMotion

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark' || resolvedTheme === 'night')
    root.classList.toggle('night', resolvedTheme === 'night')
    root.dataset.motion = motionEnabled ? 'full' : 'reduced'
    root.style.colorScheme = resolvedTheme === 'light' ? 'light' : 'dark'
  }, [resolvedTheme, motionEnabled])

  const toggleNight = useCallback(() => set({ night: !value.night }), [set, value.night])

  return { settings: value, set, reset, resolvedTheme, motionEnabled, toggleNight, replace: setSettings }
}
