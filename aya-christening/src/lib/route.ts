import { useEffect, useState } from "react"

// Hash routes work on any static host (and in the single-file bundle)
// without server rewrites. "#/photos" is the all-photos page; any other hash
// is an anchor on the home page.
export const PHOTOS_ROUTE = "#/photos"

export type Route = "home" | "photos"

const current = (): Route => (window.location.hash.startsWith(PHOTOS_ROUTE) ? "photos" : "home")

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(current)

  useEffect(() => {
    const onChange = () => setRoute(current())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  useEffect(() => {
    if (route === "photos") {
      window.scrollTo(0, 0)
      return
    }
    // Coming back home: the section didn't exist when the hash changed, so
    // scroll to it once it has rendered.
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [route])

  return route
}
