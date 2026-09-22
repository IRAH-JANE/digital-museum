import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TopNav } from '../navigation/TopNav'
import { MobileNav } from '../navigation/MobileNav'
import { Footer } from './Footer'
import { CompareTray } from './CompareTray'
import { CompareDialog } from '../artwork/CompareDialog'
import { CommandPalette } from '../search/CommandPalette'
import { SearchOverlay } from '../search/SearchOverlay'
import { Toasts } from '../ui/Toasts'
import { GalleryLoading } from '../ui/Skeleton'
import { ErrorBoundary } from '../ui/ErrorState'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { randomArtwork } from '../../utils/recommendations'
import { useMuseum } from '../../context/MuseumProvider'

/** The building: navigation, the room you are in, and everything that floats. */
export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setPaletteOpen, setSearchOpen, paletteOpen, searchOpen, audio, settings } = useMuseum()
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const closeEverything = useCallback(() => {
    setPaletteOpen(false)
    setSearchOpen(false)
    setCompareOpen(false)
  }, [setPaletteOpen, setSearchOpen])

  const shortcuts = useMemo(
    () => ({
      'mod+k': () => setPaletteOpen((open) => !open),
      '/': () => setSearchOpen(true),
      r: () => navigate(`/artwork/${randomArtwork().id}`),
      m: () => audio.toggle(),
      escape: () => closeEverything(),
    }),
    [setPaletteOpen, setSearchOpen, navigate, audio, closeEverything],
  )

  useKeyboardShortcuts(shortcuts)

  return (
    <div className="wall flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-[var(--ink)] focus:bg-[var(--paper)] focus:px-4 focus:py-2"
      >
        Skip to the gallery
      </a>

      <TopNav />

      <main id="main" className="flex-1 pb-24 lg:pb-0">
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<GalleryLoading />}>
            <AnimatePresence mode="wait" initial={false}>
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <MobileNav />

      <CompareTray onOpen={() => setCompareOpen(true)} />
      <CompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} />
      <CommandPalette />
      <SearchOverlay />
      <Toasts />

      {/* Screen-reader announcement for the two modes that change the whole room */}
      <p className="sr-only" aria-live="polite">
        {settings.settings.night ? 'Night at the Museum is on.' : ''}
        {paletteOpen ? 'Command palette open.' : ''}
        {searchOpen ? 'Search open.' : ''}
      </p>
    </div>
  )
}
