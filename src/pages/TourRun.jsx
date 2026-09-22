import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { GuidedTour } from '../components/museum/GuidedTour'
import { EmptyState } from '../components/ui/EmptyState'
import { toursById } from '../data/tours'
import { artworks } from '../data/artworks'

/** Six works drawn at random, built once per visit to this route. */
function buildRandomTour() {
  const pool = [...artworks]
  const stops = []
  while (stops.length < 6 && pool.length) {
    const [picked] = pool.splice(Math.floor(Math.random() * pool.length), 1)
    stops.push({ id: picked.id, note: `${picked.artist}, ${picked.yearText}. Chosen at random.` })
  }
  return {
    id: 'random',
    name: 'Random tour',
    length: '6 stops',
    description: 'Six works, drawn without a theme.',
    stops,
  }
}

export default function TourRun() {
  const { tourId } = useParams()
  const tour = useMemo(
    () => (tourId === 'random' ? buildRandomTour() : toursById[tourId]),
    [tourId],
  )

  if (!tour) {
    return (
      <EmptyState
        title="No such tour"
        body="That route is not running today."
        actionLabel="See the tours"
        actionTo="/tours"
      />
    )
  }

  return <GuidedTour tour={tour} />
}
