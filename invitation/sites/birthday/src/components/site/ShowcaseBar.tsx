// Showcase-only: Apple-style switcher between the four sample events,
// floating at the bottom of the screen.
import { Home } from "lucide-react"
import { SHOWCASE_EVENTS, SLUG, eventHref } from "@/lib/showcase"
import { cn } from "@/lib/utils"

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif'

export function ShowcaseBar() {
  return (
    <>
      {/* room so the bar never covers the footer's last line */}
      <div className="h-24" aria-hidden />
      <nav
        aria-label="Sample events"
        style={{ fontFamily: SYSTEM_FONT }}
        className="fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-50 flex justify-center px-2"
      >
        <div className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-black/5 bg-white/75 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl backdrop-saturate-150">
          <a
            href="/"
            aria-label="All sample events"
            className="flex h-8 w-8 shrink-0 sm:h-9 sm:w-9 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-black/5"
          >
            <Home className="h-4 w-4" />
          </a>
          {SHOWCASE_EVENTS.map((e) => (
            <a
              key={e.slug}
              href={eventHref(e.slug)}
              aria-current={e.slug === SLUG ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-2 text-[12px] font-medium tracking-[-0.01em] transition-colors sm:px-4 sm:text-[13px]",
                e.slug === SLUG ? "bg-[#1d1d1f] text-white" : "text-[#1d1d1f] hover:bg-black/5",
              )}
            >
              {e.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
