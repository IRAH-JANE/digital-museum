import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const Landing = lazy(() => import('./pages/Landing'))
const Museum = lazy(() => import('./pages/Museum'))
const Rooms = lazy(() => import('./pages/Rooms'))
const RoomDetail = lazy(() => import('./pages/RoomDetail'))
const Artworks = lazy(() => import('./pages/Artworks'))
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'))
const Artists = lazy(() => import('./pages/Artists'))
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'))
const Exhibitions = lazy(() => import('./pages/Exhibitions'))
const ExhibitionDetail = lazy(() => import('./pages/ExhibitionDetail'))
const TimelinePage = lazy(() => import('./pages/TimelinePage'))
const Collection = lazy(() => import('./pages/Collection'))
const Discover = lazy(() => import('./pages/Discover'))
const Curator = lazy(() => import('./pages/Curator'))
const Journey = lazy(() => import('./pages/Journey'))
const Tours = lazy(() => import('./pages/Tours'))
const TourRun = lazy(() => import('./pages/TourRun'))
const Settings = lazy(() => import('./pages/Settings'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * The floor plan, in route form. `AppShell` carries navigation, the command
 * palette, search, compare tray and toasts — everything that floats above
 * whichever room is currently rendered in the `Outlet`.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/museum" element={<Museum />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:roomId" element={<RoomDetail />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/artwork/:artworkId" element={<ArtworkDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:artistId" element={<ArtistDetail />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/exhibitions/:exhibitionId" element={<ExhibitionDetail />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/curator" element={<Curator />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:tourId" element={<TourRun />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
