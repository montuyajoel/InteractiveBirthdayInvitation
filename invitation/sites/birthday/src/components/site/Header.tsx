import { useEffect, useState } from "react"
import type { Route } from "@/lib/route"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#invitation", label: "Invitation" },
  { href: "#rsvp", label: "Register" },
  { href: "#gallery", label: "Gallery" },
  { href: "#directions", label: "Directions" },
]

export function Header({ route }: { route: Route }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("#invitation")

  useEffect(() => {
    // On the all-photos page, "Gallery" is where you are.
    if (route === "photos") setActive("#gallery")

    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) observer.observe(el)
    })
    return () => {
      window.removeEventListener("scroll", onScroll)
      observer.disconnect()
    }
  }, [route])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled ? "paper shadow-[0_1px_0_rgb(154_106_160/0.2)]" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#invitation" className="script shrink-0 text-3xl leading-none text-plum sm:text-4xl">
          Isabel <span className="text-mauve">16</span>
        </a>
        <ul className="flex items-center gap-0.5 overflow-x-auto sm:gap-2">
          {LINKS.map((l) => (
            <li key={l.href} className={l.href === "#invitation" ? "hidden sm:block" : undefined}>
              <a
                href={l.href}
                className={cn(
                  "block whitespace-nowrap px-1 py-1 text-[0.62rem] uppercase tracking-[0.12em] sm:tracking-[0.22em] transition-colors sm:px-3 sm:text-xs",
                  active === l.href
                    ? "text-plum underline decoration-mauve/60 underline-offset-[6px]"
                    : "text-mauve hover:text-plum",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
