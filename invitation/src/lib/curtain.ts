import { useSyncExternalStore } from "react"

// Whether the opening curtains have been drawn back. The header stays hidden
// until they are. A visitor arriving on a deep link (#rsvp…) skips the curtain.
let open = typeof window !== "undefined" && window.location.hash.length > 1
const listeners = new Set<() => void>()

export function openCurtain() {
  if (open) return
  open = true
  listeners.forEach((l) => l())
}

export function useCurtainOpen() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => open,
    () => open,
  )
}
