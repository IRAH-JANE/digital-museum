import { useEffect } from 'react'

/** True when the visitor is typing, so a shortcut should stay out of the way. */
export function isTypingTarget(target) {
  if (!target) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable === true ||
    target.getAttribute?.('role') === 'textbox'
  )
}

/**
 * `handlers` maps a key description to a callback:
 *   { 'mod+k': fn, '/': fn, 'escape': fn, 'f': fn }
 * Escape is always delivered, even from inside a field, so a modal can close.
 */
export function useKeyboardShortcuts(handlers, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return undefined
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase()
      const mod = event.metaKey || event.ctrlKey
      const combo = mod ? `mod+${key}` : key

      if (key !== 'escape' && isTypingTarget(event.target)) return

      const handler = handlers[combo]
      if (handler) {
        event.preventDefault()
        handler(event)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handlers, enabled])
}
