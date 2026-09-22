import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Heart, Landmark, Menu, Search, X } from 'lucide-react'
import { navItems } from './TopNav'
import { useMuseum } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

const primary = [
  { to: '/museum', label: 'Explore', icon: Landmark },
  { to: '/rooms', label: 'Rooms', icon: Compass },
  { to: '/collection', label: 'Saved', icon: Heart },
]

/** Bottom bar on phones, with a slide-out for everything else. */
export function MobileNav() {
  const { setSearchOpen, favorites } = useMuseum()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--rule)] bg-[var(--wall)]/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto flex h-16 max-w-lg items-stretch">
          {primary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 text-[0.62rem] uppercase tracking-plaque transition-colors duration-300',
                  isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-soft)]',
                )
              }
            >
              <span className="relative">
                <item.icon size={18} strokeWidth={1.25} />
                {item.to === '/collection' && favorites.count > 0 ? (
                  <span className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                ) : null}
              </span>
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-[0.62rem] uppercase tracking-plaque text-[var(--ink-soft)]"
          >
            <Search size={18} strokeWidth={1.25} />
            Search
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-[0.62rem] uppercase tracking-plaque text-[var(--ink-soft)]"
            aria-expanded={menuOpen}
          >
            <Menu size={18} strokeWidth={1.25} />
            More
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/55"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[82vw] max-w-sm flex-col border-l border-[var(--rule)] bg-[var(--wall)] px-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-xl">Digital Museum</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-quiet px-2 py-2"
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={1.25} />
                </button>
              </div>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block border-b border-[var(--rule)] py-3 font-display text-2xl transition-colors duration-300',
                          isActive ? 'text-[var(--gold)]' : '',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-[var(--rule)] py-3 font-display text-2xl"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
