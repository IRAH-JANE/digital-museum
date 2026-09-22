import { artworks } from '../data/artworks'
import { artists } from '../data/artists'
import { rooms } from '../data/rooms'
import { exhibitions } from '../data/exhibitions'
import { periodName } from '../data/periods'

/** One flat haystack per artwork, built once at module load. */
const artworkIndex = artworks.map((item) => ({
  item,
  haystack: [
    item.title,
    item.artist,
    item.yearText,
    String(item.year),
    periodName(item.period),
    item.medium,
    item.materials,
    item.category,
    item.region,
    item.location,
    ...(item.tags ?? []),
  ]
    .join(' ')
    .toLowerCase(),
}))

const artistIndex = artists.map((artist) => ({
  artist,
  haystack: [artist.name, artist.nationality, artist.movement, String(artist.birth ?? ''), artist.bio]
    .join(' ')
    .toLowerCase(),
}))

function score(haystack, title, query) {
  const t = title.toLowerCase()
  if (t === query) return 100
  if (t.startsWith(query)) return 80
  if (t.includes(query)) return 60
  if (haystack.includes(query)) return 30
  return 0
}

export function searchArtworks(query, limit = 40) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return artworkIndex
    .map(({ item, haystack }) => ({ item, s: score(haystack, item.title, q) }))
    .filter((entry) => entry.s > 0)
    .sort((a, b) => b.s - a.s || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((entry) => entry.item)
}

export function searchArtists(query, limit = 8) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return artistIndex
    .map(({ artist, haystack }) => ({ artist, s: score(haystack, artist.name, q) }))
    .filter((entry) => entry.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((entry) => entry.artist)
}

export function searchEverything(query) {
  const q = query.trim().toLowerCase()
  if (!q) return { artworks: [], artists: [], rooms: [], exhibitions: [] }
  return {
    artworks: searchArtworks(q, 12),
    artists: searchArtists(q, 5),
    rooms: rooms.filter((r) => `${r.name} ${r.subtitle} ${r.periodLabel}`.toLowerCase().includes(q)).slice(0, 4),
    exhibitions: exhibitions.filter((e) => `${e.title} ${e.tagline}`.toLowerCase().includes(q)).slice(0, 3),
  }
}

/** Suggestions shown under an empty or short search field. */
export const searchSuggestions = [
  'Vincent van Gogh',
  'Impressionism',
  'The Starry Night',
  'Woodblock print',
  'Sculpture',
  'Vermeer',
  'Night',
  'Photography',
]

/**
 * Filtering for the collection page. Every clause is optional; an empty filter
 * set returns the whole collection in its catalogue order.
 */
export function filterArtworks(list, filters) {
  const { periods = [], mediums = [], regions = [], yearFrom, yearTo, query } = filters
  let result = query ? searchArtworks(query, 500) : list
  if (periods.length) result = result.filter((a) => periods.includes(a.period))
  if (mediums.length) result = result.filter((a) => mediums.includes(a.medium))
  if (regions.length) result = result.filter((a) => regions.includes(a.region))
  if (typeof yearFrom === 'number') result = result.filter((a) => a.year >= yearFrom)
  if (typeof yearTo === 'number') result = result.filter((a) => a.year <= yearTo)
  return result
}

export function sortArtworks(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'year-asc':
      return copy.sort((a, b) => a.year - b.year)
    case 'year-desc':
      return copy.sort((a, b) => b.year - a.year)
    case 'artist':
      return copy.sort((a, b) => a.artist.localeCompare(b.artist))
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return copy
  }
}
