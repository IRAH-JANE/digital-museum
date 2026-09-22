import { Link } from 'react-router-dom'

const columns = [
  [
    { to: '/museum', label: 'Explore' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/artworks', label: 'Collection' },
  ],
  [
    { to: '/artists', label: 'Artists' },
    { to: '/exhibitions', label: 'Exhibitions' },
    { to: '/timeline', label: 'Timeline' },
  ],
  [
    { to: '/about', label: 'About' },
    { to: '/settings', label: 'Settings' },
    { to: '/journey', label: 'Your journey' },
  ],
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--rule)]">
      <div className="mx-auto grid max-w-[110rem] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Digital Museum</p>
          <p className="mt-1 text-sm italic text-[var(--ink-soft)]">Art without walls.</p>
        </div>
        {columns.map((column, index) => (
          <nav key={index} aria-label={`Footer links ${index + 1}`}>
            <ul className="space-y-2">
              {column.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="link-underline text-xs uppercase tracking-plaque text-[var(--ink-soft)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-[110rem] border-t border-[var(--rule)] px-4 py-5 text-[0.7rem] leading-relaxed text-[var(--ink-faint)] sm:px-8">
        Photographs of the historical works are reproductions of public-domain art, served from Wikimedia Commons.
        Nothing you save leaves your browser.
      </div>
    </footer>
  )
}
