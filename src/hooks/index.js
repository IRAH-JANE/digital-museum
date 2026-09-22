/**
 * Public hook surface. The implementations live alongside their storage keys;
 * these names are what components import.
 */
export {
  useFavorites,
  useRecentlyViewed,
  useMuseumProgress,
  useMuseumAudio as useAudio,
  useTheme,
  useMuseumSettings,
  useCurator,
  useMuseum,
} from '../context/MuseumProvider'

export { useDebounce } from './useDebounce'
export { useKeyboardShortcuts, isTypingTarget } from './useKeyboardShortcuts'
export { useMediaQuery, useIsMobile, usePrefersReducedMotion } from './useMediaQuery'
export { useLocalStorage } from './useLocalStorage'
