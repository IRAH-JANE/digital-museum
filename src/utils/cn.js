/** Tiny class-name joiner. Keeps JSX readable without pulling in a dependency. */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
