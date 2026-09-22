import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Moon, Music, Search, Sun } from 'lucide-react'
import { useMuseum } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

export const navItems = [
  { to: '/museum', label: 'Explore' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/artworks', label: 'Artworks' },
  { to: '/artists', label: 'Artists' },
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/collection', label: 'My collection' },
  { to: '/about', label: 'About' },
]

export function TopNav() {
  const { setSearchOpen, settings, audio } = useMuseum()
  const [lifted, setLifted] = useState(false)
  const location = useLocation()
  const night = settings.settings.night

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-500 ease-gallery',
        lifted ? 'border-[var(--rule)] bg-[var(--wall)]/92 backdrop-blur' : 'border-transparent bg-transparent',
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex h-16 max-w-[110rem] items-center gap-6 px-4 sm:px-8">
        <Link to="/museum" className="shrink-0">
          <span className="font-display text-lg leading-none tracking-wide sm:text-xl">Digital Museum</span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden flex-1 items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'link-underline py-1 text-xs uppercase tracking-plaque transition-colors duration-300',
                  isActive || location.pathname.startsWith(`${item.to}/`)
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="btn btn-quiet px-2 py-2"
            aria-label="Search the collection"
          >
            <Search size={17} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={audio.toggle}
            aria-pressed={audio.playing}
            className={cn('btn btn-quiet px-2 py-2', audio.playing ? 'text-[var(--gold)]' : '')}
            aria-label={audio.playing ? 'Stop ambient sound' : 'Start ambient sound'}
          >
            <Music size={17} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={settings.toggleNight}
            aria-pressed={night}
            className={cn('btn btn-quiet px-2 py-2', night ? 'text-[var(--gold)]' : '')}
            aria-label={night ? 'Turn the gallery lights back on' : 'Night at the Museum'}
          >
            {night ? <Sun size={17} strokeWidth={1.25} /> : <Moon size={17} strokeWidth={1.25} />}
          </button>
        </div>
      </div>
    </header>
  )
}
