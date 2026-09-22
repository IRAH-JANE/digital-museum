import { artworks, artworksById } from '../data/artworks'

/**
 * Related works are found with metadata only — no model, no network. Shared
 * artist counts for most, then period, medium, region and overlapping tags.
 */
export function relatedTo(artworkId, limit = 4) {
  const source = artworksById[artworkId]
  if (!source) return []
  const sourceTags = new Set(source.tags ?? [])

  return artworks
    .filter((item) => item.id !== source.id)
    .map((item) => {
      let weight = 0
      if (item.artistId === source.artistId) weight += 6
      if (item.period === source.period) weight += 3
      if (item.medium === source.medium) weight += 2
      if (item.region === source.region) weight += 1
      if (item.category === source.category) weight += 2
      const shared = (item.tags ?? []).filter((tag) => sourceTags.has(tag)).length
      weight += shared * 1.5
      return { item, weight }
    })
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((entry) => entry.item)
}

/** Why a work was suggested, so the interface can say so rather than guess. */
export function relationLabel(sourceId, candidateId) {
  const a = artworksById[sourceId]
  const b = artworksById[candidateId]
  if (!a || !b) return 'Related'
  if (a.artistId === b.artistId) return `Also by ${b.artist}`
  if (a.period === b.period) return 'Same period'
  if (a.medium === b.medium) return `Also ${b.medium.toLowerCase()}`
  if (a.region === b.region) return `Also from ${b.region}`
  return 'Related subject'
}

/**
 * Recommendations for a returning visitor: works close to what they have
 * already saved and viewed, with anything they have seen removed.
 */
export function recommendFor({ favorites = [], viewed = [] }, limit = 6) {
  const seen = new Set([...favorites, ...viewed])
  const seeds = [...favorites, ...viewed].slice(0, 6)
  if (!seeds.length) {
    return artworks.filter((a) => (a.tags ?? []).includes('famous')).slice(0, limit)
  }
  const tally = new Map()
  seeds.forEach((seedId) => {
    relatedTo(seedId, 8).forEach((item, index) => {
      if (seen.has(item.id)) return
      tally.set(item.id, (tally.get(item.id) ?? 0) + (8 - index))
    })
  })
  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => artworksById[id])
    .filter(Boolean)
}

/** Works that are neither tagged famous nor already seen. */
export function hiddenGems({ viewed = [] } = {}, limit = 4) {
  const seen = new Set(viewed)
  return artworks
    .filter((a) => !(a.tags ?? []).includes('famous') && !seen.has(a.id))
    .slice(0, limit)
}

export function randomArtwork(excludeId) {
  const pool = excludeId ? artworks.filter((a) => a.id !== excludeId) : artworks
  return pool[Math.floor(Math.random() * pool.length)]
}
