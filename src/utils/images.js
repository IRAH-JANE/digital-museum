/**
 * Image helpers.
 *
 * Artwork photographs are served from Wikimedia Commons through the stable
 * Special:FilePath redirect, which resizes on the fly. No API key, no backend.
 * If a file is ever renamed upstream, <SmartImage> falls back to a generated
 * museum placeholder instead of a broken-image icon.
 */
const COMMONS = 'https://commons.wikimedia.org/wiki/Special:FilePath/'

export function wiki(fileName, width = 1280) {
  return `${COMMONS}${encodeURIComponent(fileName)}?width=${width}`
}

/** Deterministic 32-bit hash so the same artwork always gets the same placeholder. */
export function hashString(value = '') {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

/**
 * A pigment palette drawn from the artwork's own id, used for the loading
 * state and for the placeholder shown when a photograph cannot be reached.
 */
export function pigment(seed) {
  const h = hashString(seed)
  const base = h % 360
  return {
    a: `hsl(${base} 34% 24%)`,
    b: `hsl(${(base + 38) % 360} 42% 48%)`,
    c: `hsl(${(base + 190) % 360} 22% 82%)`,
    angle: (h % 60) - 30,
  }
}

/** An inline SVG "canvas" used for the digital-art room and for image failures. */
export function generatedCanvas(seed, { title = '', variant = 'wash' } = {}) {
  const { a, b, c, angle } = pigment(seed)
  const h = hashString(seed)
  const shapes =
    variant === 'grid'
      ? Array.from({ length: 24 }, (_, i) => {
          const x = (i % 6) * 100 + 40
          const y = Math.floor(i / 6) * 120 + 60
          const size = 24 + ((h >> i) % 46)
          const op = 0.18 + ((h >> (i + 3)) % 60) / 100
          return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${i % 3 ? b : c}" opacity="${op.toFixed(2)}"/>`
        }).join('')
      : variant === 'orbit'
        ? Array.from({ length: 14 }, (_, i) => {
            const r = 30 + i * 22
            const op = 0.5 - i * 0.03
            return `<circle cx="${300 + ((h >> i) % 40)}" cy="280" r="${r}" fill="none" stroke="${i % 2 ? b : c}" stroke-width="${1 + (i % 3)}" opacity="${op.toFixed(2)}"/>`
          }).join('')
        : /* 'wash': soft overlapping bands, blurred at the edges so it reads as a
             painted horizon rather than a row of loading-skeleton bars. Also the
             fallback shown when a real photograph fails to load, so it needs to
             look unmistakably like a piece of art, not an in-progress UI state. */
          Array.from({ length: 6 }, (_, i) => {
            const hue = (h + i * 47 + ((h >> (i + 2)) % 25)) % 360
            const sat = 34 + ((h >> i) % 34)
            const light = 30 + ((h >> (i + 3)) % 36)
            const y = -30 + i * 108 + ((h >> (i + 1)) % 40)
            const bandH = 70 + ((h >> (i + 6)) % 90)
            const op = 0.55 + ((h >> (i + 4)) % 30) / 100
            return `<rect x="-60" y="${y}" width="720" height="${bandH}" rx="${bandH / 2}" fill="hsl(${hue} ${sat}% ${light}%)" opacity="${op.toFixed(2)}" filter="url(#soften)"/>`
          }).join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 560" width="600" height="560" role="img" aria-label="${escapeXml(title)}">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="100%" stop-color="${b}"/>
      </linearGradient>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
      <filter id="soften" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="16"/></filter>
    </defs>
    <rect width="600" height="560" fill="url(#g)"/>
    ${shapes}
    <rect width="600" height="560" filter="url(#grain)" opacity="0.12"/>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (ch) => `&#${ch.charCodeAt(0)};`)
}
