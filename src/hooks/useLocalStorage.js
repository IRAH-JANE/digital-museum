import { useCallback, useEffect, useRef, useState } from 'react'
import { read, write } from '../utils/storage'

/**
 * State that survives a reload. Writes are debounced so that dragging a volume
 * slider does not hammer localStorage.
 */
export function useLocalStorage(key, initialValue, { debounce = 120 } = {}) {
  const [value, setValue] = useState(() => read(key, initialValue))
  const timer = useRef(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => write(key, value), debounce)
    return () => clearTimeout(timer.current)
  }, [key, value, debounce])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
