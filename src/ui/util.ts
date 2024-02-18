export type ClickableAction = (e: KeyboardEvent | MouseEvent) => void

// Helper function to allow multiple types of interactions on a focusable element
// to trigger a "click-equivalent" action. Optionally with a "reverse" action
// if a modifier key is held down (or the user right-clicks).
export function clickable (action: ClickableAction, reverseAction?: ClickableAction): ClickableAction {
  return (e: KeyboardEvent | MouseEvent) => {
    const takeAction = (e instanceof MouseEvent)
      || (e instanceof KeyboardEvent && ['Enter', ' '].contains(e.key))

    if (!takeAction) { return }

    const isReversed = e.ctrlKey || (e instanceof MouseEvent && e.button === 2)

    if (isReversed) {
      if (reverseAction) { reverseAction(e) }
      else { return }
    } else {
      action(e)
    }
  }
}
