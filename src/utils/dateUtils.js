/** Date helpers used by Today's Artwork, Artwork of the Hour and On This Day. */

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function dayIndex(date = new Date()) {
  const start = Date.UTC(date.getFullYear(), 0, 0)
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((now - start) / 86400000)
}

/** Same date in, same item out — no backend needed for a shared "today". */
export function pickForDay(list, date = new Date(), offset = 0) {
  if (!list.length) return null
  const seed = date.getFullYear() * 1000 + dayIndex(date) + offset
  return list[seed % list.length]
}

export function pickForHour(list, date = new Date()) {
  if (!list.length) return null
  const seed = dayIndex(date) * 24 + date.getHours()
  return list[seed % list.length]
}

export function formatDateLong(date = new Date()) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatClock(date = new Date()) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function yearLabel(year) {
  if (year === null || year === undefined) return 'Date unknown'
  if (year < 0) return `${Math.abs(year)} BCE`
  return String(year)
}

export function relativeTime(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} d ago`
  return new Date(timestamp).toLocaleDateString()
}
