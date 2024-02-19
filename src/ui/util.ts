/**
 * Helper function to determine if a keyboard action counts as "click equivalent"
 * (i.e. should be processed as a "click" when an element is in focus).
 */
export function ifClickEquivalent(fn: (e: KeyboardEvent) => void) {
  return (e: KeyboardEvent) => {
    if (['Enter', ' '].contains(e.key)) {
      fn(e)
      e.preventDefault()
    }
  }
}
