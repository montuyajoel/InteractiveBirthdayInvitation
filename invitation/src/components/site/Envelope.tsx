import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import invitationCard from "@/assets/invitationCard"
import { eventTitle } from "@/lib/event"
import { cn } from "@/lib/utils"
import { ComicBurst, SpiderEmblem } from "./Decor"

type Stage = "closed" | "thwip" | "open"

/** A web pattern laid over the envelope paper. */
function WebPattern({ className }: { className?: string }) {
  const lines = Array.from({ length: 9 }, (_, i) => (i * 180) / 8)
  return (
    <svg viewBox="0 0 340 236" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 h-full w-full", className)} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        {lines.map((deg) => {
          const a = (deg * Math.PI) / 180
          return <path key={deg} d={`M170 236L${170 + Math.cos(a) * 400} ${236 - Math.sin(a) * 400}`} />
        })}
        {[50, 95, 145, 200, 260, 330].map((r) => (
          <path
            key={r}
            d={lines
              .slice(0, -1)
              .map((deg, i) => {
                const p = (d: number, rr: number) => {
                  const a = (d * Math.PI) / 180
                  return `${(170 + Math.cos(a) * rr).toFixed(1)} ${(236 - Math.sin(a) * rr).toFixed(1)}`
                }
                return `${i === 0 ? `M${p(deg, r)}` : ""}Q${p(deg + 11.25, r * 0.86)} ${p(lines[i + 1], r)}`
              })
              .join("")}
          />
        ))}
      </g>
    </svg>
  )
}

// Confetti that bursts out when the card leaps from the envelope.
const PIECES = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.2
  const d = 120 + ((i * 37) % 90)
  return {
    dx: Math.cos(a) * d,
    dy: Math.sin(a) * d * 0.8 - 60,
    rot: ((i * 83) % 300) - 150,
    size: 12 + ((i * 7) % 12),
    delay: (i % 6) * 0.04,
    kind: i % 3,
  }
})

/** A hero-red envelope sealed with a spider; tap and the card is web-slung out. */
export function Envelope() {
  const [stage, setStage] = useState<Stage>("closed")
  const [zoom, setZoom] = useState(false)
  const open = stage === "open"

  useEffect(() => {
    if (stage !== "thwip") return
    const t = setTimeout(() => setStage("open"), 650)
    return () => clearTimeout(t)
  }, [stage])

  return (
    <div className="relative mx-auto w-[300px] [perspective:1200px] sm:w-[340px]">
      <button
        type="button"
        onClick={() => (open ? setZoom(true) : stage === "closed" && setStage("thwip"))}
        className={cn(
          "group relative block h-[210px] w-full transition-[margin] duration-700 [transform-style:preserve-3d] focus-visible:outline-none sm:h-[236px]",
          open ? "mt-[250px] sm:mt-[270px]" : "mt-6 md:mt-[120px]",
          stage === "closed" && "animate-wiggle",
        )}
        aria-label={open ? "View the full invitation" : "Open the envelope"}
      >
        {/* back of envelope */}
        <span className="absolute inset-0 z-0 overflow-hidden rounded-[4px] bg-[var(--env-back)] text-white/15 shadow-[0_24px_50px_-18px_rgb(var(--c-ink)/0.7)]">
          <WebPattern />
        </span>

        {/* flap: flips up and stays open behind the card */}
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-[62%] origin-top transition-transform duration-500 ease-out",
            stage === "closed" ? "z-30" : "z-[1] [transform:rotateX(180deg)]",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 overflow-hidden transition-colors duration-500",
              stage === "closed" ? "bg-[var(--env-flap)] text-black/25" : "bg-[var(--env-sides)] text-black/20",
            )}
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          >
            <WebPattern />
          </span>
        </span>

        {/* the card, pulled out on a strand of web */}
        <span
          className={cn(
            "absolute bottom-3 left-1/2 z-10 aspect-[2/3] w-[200px] origin-bottom sm:w-[226px]",
            "transition-transform duration-[900ms] ease-[cubic-bezier(.2,1.45,.45,1)]",
            open
              ? "-translate-x-1/2 -translate-y-[130px] rotate-[-3deg] group-hover:-translate-y-[140px] group-hover:rotate-0"
              : "-translate-x-1/2 translate-y-0 scale-[0.62]",
          )}
        >
          <span
            className={cn(
              "absolute bottom-full left-1/2 h-[150px] w-px origin-bottom -translate-x-1/2 bg-gradient-to-t from-ink/80 via-ink/50 to-transparent transition-transform duration-300",
              stage === "closed" ? "scale-y-0" : "scale-y-100",
            )}
            aria-hidden
          />
          <span className="relative block h-full w-full overflow-hidden rounded-[3px] shadow-[0_14px_34px_-10px_rgb(var(--c-ink)/0.7)] ring-2 ring-white">
            <img src={invitationCard} alt={`Invitation: ${eventTitle}`} className="h-full w-full object-cover" />
            {open && (
              <span
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-sheen bg-gradient-to-r from-transparent via-white/60 to-transparent"
                aria-hidden
              />
            )}
          </span>
        </span>

        {/* front pocket */}
        <span
          className="absolute inset-0 z-20 overflow-hidden rounded-[4px] bg-[var(--env-pocket)] text-black/20"
          style={{ clipPath: "polygon(0 34%, 50% 66%, 100% 34%, 100% 100%, 0 100%)" }}
        >
          <WebPattern />
        </span>
        <span className="absolute inset-0 z-20 bg-[var(--env-sides)]" style={{ clipPath: "polygon(0 34%, 50% 66%, 0 100%)" }} />
        <span className="absolute inset-0 z-20 bg-[var(--env-sides)]" style={{ clipPath: "polygon(100% 34%, 50% 66%, 100% 100%)" }} />
        <span className="pointer-events-none absolute inset-x-0 bottom-3 z-20 text-center font-script text-2xl tracking-wider text-white/90 [text-shadow:2px_2px_0_rgb(var(--c-ink))]">
          For you, hero!
        </span>

        {/* spider seal */}
        <span
          className={cn(
            "absolute left-1/2 top-[54%] z-40 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center transition-all duration-300",
            stage === "closed" ? "group-hover:scale-110" : "scale-0 rotate-180 opacity-0",
          )}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-ink shadow-lg ring-4 ring-white">
            <SpiderEmblem className="h-9 w-9 text-white" filled />
          </span>
        </span>

        {/* THWIP! */}
        {stage !== "closed" && (
          <span className="pointer-events-none absolute left-1/2 top-[30%] z-50 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <span className="relative grid h-32 w-32 animate-thwip place-items-center opacity-0">
              <ComicBurst className="absolute inset-0 h-full w-full" />
              <span className="relative -rotate-12 font-script text-3xl text-brand [text-shadow:2px_2px_0_white]">
                THWIP!
              </span>
            </span>
          </span>
        )}

        {/* confetti burst */}
        {stage !== "closed" && (
          <span className="pointer-events-none absolute left-1/2 top-[30%] z-50" aria-hidden>
            {PIECES.map((p, i) => (
              <span
                key={i}
                className="absolute left-0 top-0 animate-burst opacity-0"
                style={{
                  animationDelay: `${0.25 + p.delay}s`,
                  ["--dx" as string]: `${p.dx}px`,
                  ["--dy" as string]: `${p.dy}px`,
                  ["--rot" as string]: `${p.rot}deg`,
                }}
              >
                {p.kind === 0 ? (
                  <SpiderEmblem filled className="text-ink" style={{ width: p.size, height: p.size }} />
                ) : p.kind === 1 ? (
                  <ComicBurst style={{ width: p.size, height: p.size }} />
                ) : (
                  <span className="block rounded-full bg-brand" style={{ width: p.size / 2, height: p.size / 2 }} />
                )}
              </span>
            ))}
          </span>
        )}
      </button>

      <p className="mt-4 text-center font-serif font-semibold italic text-brand">
        {open ? "Tap the card to see it up close" : "Tap the spider seal to open your invitation"}
      </p>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-[min(92vw,560px)] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Invitation</DialogTitle>
          <img
            src={invitationCard}
            alt={`Invitation: ${eventTitle}`}
            className="max-h-[88vh] w-full rounded-[3px] object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
