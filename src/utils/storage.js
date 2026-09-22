/**
 * The only place in the app that touches localStorage.
 * Everything is namespaced, guarded, and versioned so that an export from one
 * build can be validated on import into another.
 */
const PREFIX = 'digital-museum'
export const STORAGE_VERSION = 1

export const KEYS = {
  favorites: `${PREFIX}:favorites`,
  recent: `${PREFIX}:recent`,
  progress: `${PREFIX}:progress`,
  settings: `${PREFIX}:settings`,
  exhibitions: `${PREFIX}:curator`,
  onboarding: `${PREFIX}:onboarded`,
}

let warned = false

function available() {
  try {
    const probe = `${PREFIX}:probe`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    if (!warned) {
      warned = true
      console.warn('Local storage is unavailable; this visit will not be saved.')
    }
    return false
  }
}

export function read(key, fallback) {
  if (typeof window === 'undefined' || !available()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  if (typeof window === 'undefined' || !available()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key) {
  if (typeof window === 'undefined' || !available()) return
  window.localStorage.removeItem(key)
}

export function clearAll() {
  Object.values(KEYS).forEach(remove)
}

export function exportAll() {
  return {
    application: 'digital-museum',
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    favorites: read(KEYS.favorites, []),
    recent: read(KEYS.recent, []),
    progress: read(KEYS.progress, null),
    settings: read(KEYS.settings, null),
    exhibitions: read(KEYS.exhibitions, []),
  }
}

/** Validate before writing: a bad file should never corrupt a real collection. */
export function validateBackup(payload) {
  const errors = []
  if (!payload || typeof payload !== 'object') {
    return { ok: false, errors: ['That file is not a Digital Museum backup.'] }
  }
  if (payload.application !== 'digital-museum') {
    errors.push('This file was not exported from Digital Museum.')
  }
  if (typeof payload.version !== 'number' || payload.version > STORAGE_VERSION) {
    errors.push('This backup was made by a newer version of the museum.')
  }
  if (payload.favorites && !Array.isArray(payload.favorites)) errors.push('Favourites are malformed.')
  if (payload.recent && !Array.isArray(payload.recent)) errors.push('Recently viewed is malformed.')
  if (payload.exhibitions && !Array.isArray(payload.exhibitions)) errors.push('Exhibitions are malformed.')
  if (payload.progress && typeof payload.progress !== 'object') errors.push('Progress is malformed.')
  return { ok: errors.length === 0, errors }
}

export function importAll(payload) {
  const check = validateBackup(payload)
  if (!check.ok) return check
  if (Array.isArray(payload.favorites)) write(KEYS.favorites, payload.favorites.filter((v) => typeof v === 'string'))
  if (Array.isArray(payload.recent)) write(KEYS.recent, payload.recent.slice(0, 20))
  if (Array.isArray(payload.exhibitions)) write(KEYS.exhibitions, payload.exhibitions)
  if (payload.progress) write(KEYS.progress, payload.progress)
  if (payload.settings) write(KEYS.settings, payload.settings)
  return { ok: true, errors: [] }
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
