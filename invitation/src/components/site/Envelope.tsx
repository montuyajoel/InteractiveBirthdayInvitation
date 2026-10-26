import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import invitationCard from "@/assets/invitationCard"
import { eventTitle } from "@/lib/event"
import { cn } from "@/lib/utils"
import { CheckeredFlag, ComicBurst, Wheel } from "./Decor"

// closed → start lights count down → lights out: VROOM! → card on show
type Stage = "closed" | "lights" | "go" | "open"

const CARBON: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgb(255 255 255 / 0.05) 0 3px, transparent 3px 6px), repeating-linear-gradient(-45deg, rgb(0 0 0 / 0.35) 0 3px, transparent 3px 6px)",
}

/** Twin racing stripes running down the middle of the envelope. */
function Stripes() {
  return (
    <span className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden>
      <span className="w-4 bg-brand" />
      <span className="w-4 bg-bloom" />
    </span>
  )
}

// Wheels, flags and sparks that fly out when the lights go out.
const PIECES = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.2
  const d = 120 + ((i * 37) % 90)
  return {
    dx: Math.cos(a) * d,
    dy: Math.sin(a) * d * 0.8 - 60,
    rot: ((i * 83) % 300) - 150,
    size: 14 + ((i * 7) % 12),
    delay: (i % 6) * 0.04,
    kind: i % 3,
  }
})

/** A carbon-fibre envelope with racing stripes; F1-style start lights launch the card. */
export function Envelope() {
  const [stage, setStage] = useState<Stage>("closed")
  const [zoom, setZoom] = useState(false)
  const open = stage === "open"
  const launched = stage === "go" || stage === "open"

  useEffect(() => {
    if (stage === "lights") {
      const t = setTimeout(() => setStage("go"), 1700)
      return () => clearTimeout(t)
    }
    if (stage === "go") {
      const t = setTimeout(() => setStage("open"), 250)
      return () => clearTimeout(t)
    }
  }, [stage])

  return (
    <div className="relative mx-auto w-[300px] [perspective:1200px] sm:w-[340px]">
      <button
        type="button"
        onClick={() => (open ? setZoom(true) : stage === "closed" && setStage("lights"))}
        className={cn(
          "group relative block h-[210px] w-full transition-[margin] duration-700 [transform-style:preserve-3d] focus-visible:outline-none sm:h-[236px]",
          open ? "mt-[250px] sm:mt-[270px]" : "mt-6 md:mt-[120px]",
          stage === "closed" && "animate-wiggle",
          stage === "lights" && "animate-rev",
        )}
        aria-label={open ? "View the full invitation" : "Open the envelope"}
      >
        {/* back of envelope */}
        <span
          className="absolute inset-0 z-0 overflow-hidden rounded-[4px] bg-[var(--env-back)] shadow-[0_24px_60px_-18px_rgb(var(--c-brand)/0.45)] ring-1 ring-white/15"
          style={CARBON}
        />

        {/* flap: flips up and stays open behind the card */}
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-[62%] origin-top transition-transform duration-500 ease-out",
            launched ? "z-[1] [transform:rotateX(180deg)]" : "z-30",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 overflow-hidden transition-colors duration-500",
              launched ? "bg-[var(--env-sides)]" : "bg-[var(--env-flap)]",
            )}
            style={{ ...CARBON, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          >
            <Stripes />
          </span>
        </span>

        {/* the card */}
        <span
          className={cn(
            "absolute bottom-3 left-1/2 z-10 aspect-[2/3] w-[200px] origin-bottom sm:w-[226px]",
            "transition-transform duration-[800ms] ease-[cubic-bezier(.2,1.5,.45,1)]",
            open
              ? "-translate-x-1/2 -translate-y-[130px] rotate-[-3deg] group-hover:-translate-y-[140px] group-hover:rotate-0"
              : "-translate-x-1/2 translate-y-0 scale-[0.62]",
          )}
        >
          {/* speed streaks either side while it launches */}
          {launched && (
            <span className="pointer-events-none absolute inset-0" aria-hidden>
              {[18, 42, 66, 84].map((top, i) => (
                <span key={top}>
                  <span
                    className="absolute right-full mr-3 h-[3px] w-24 origin-right animate-streak rounded-full bg-gradient-to-l from-white/80 to-transparent opacity-0"
                    style={{ top: `${top}%`, animationDelay: `${0.15 + i * 0.07}s` }}
                  />
                  <span
                    className="absolute left-full ml-3 h-[3px] w-24 origin-left animate-streak rounded-full bg-gradient-to-r from-brand/80 to-transparent opacity-0"
                    style={{ top: `${top + 6}%`, animationDelay: `${0.2 + i * 0.07}s` }}
                  />
                </span>
              ))}
            </span>
          )}
          <span className="relative block h-full w-full overflow-hidden rounded-[3px] shadow-[0_14px_34px_-10px_rgb(0_0_0/0.9)] ring-2 ring-white">
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
          className="absolute inset-0 z-20 overflow-hidden rounded-[4px] bg-[var(--env-pocket)]"
          style={{ ...CARBON, clipPath: "polygon(0 34%, 50% 66%, 100% 34%, 100% 100%, 0 100%)" }}
        >
          <Stripes />
        </span>
        <span
          className="absolute inset-0 z-20 bg-[var(--env-sides)]"
          style={{ ...CARBON, clipPath: "polygon(0 34%, 50% 66%, 0 100%)" }}
        />
        <span
          className="absolute inset-0 z-20 bg-[var(--env-sides)]"
          style={{ ...CARBON, clipPath: "polygon(100% 34%, 50% 66%, 100% 100%)" }}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-2 z-20 text-center font-script text-2xl italic text-white [text-shadow:2px_2px_0_rgb(var(--c-brand))]">
          For you, racer!
        </span>

        {/* start button seal */}
        <span
          className={cn(
            "absolute left-1/2 top-[54%] z-40 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center transition-all duration-300",
            stage === "closed" ? "group-hover:scale-110" : "scale-0 opacity-0",
          )}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-brand shadow-lg ring-4 ring-white/90">
            <span className="font-serif text-[0.6rem] font-black uppercase leading-tight tracking-[0.12em] text-white">
              Start
              <br />
              engine
            </span>
          </span>
        </span>

        {/* start lights gantry */}
        <span
          className={cn(
            "absolute left-1/2 top-[30%] z-40 flex -translate-x-1/2 -translate-y-1/2 gap-2 rounded-full bg-black/90 px-3 py-2 shadow-xl ring-2 ring-white/20 transition-all duration-300",
            stage === "lights" ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0",
          )}
          aria-hidden
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn(
                "h-6 w-6 rounded-full bg-[#2a0606] ring-1 ring-white/10 sm:h-7 sm:w-7",
                stage === "lights" && "animate-light",
              )}
              style={{ animationDelay: `${0.15 + i * 0.28}s` }}
            />
          ))}
        </span>

        {/* VROOM! */}
        {launched && (
          <span className="pointer-events-none absolute left-1/2 top-[30%] z-50 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <span className="relative grid h-36 w-36 animate-pop place-items-center opacity-0">
              <ComicBurst className="absolute inset-0 h-full w-full" />
              <span className="relative -rotate-12 font-script text-3xl italic text-brand [text-shadow:2px_2px_0_white]">
                VROOM!
              </span>
            </span>
          </span>
        )}

        {/* confetti burst */}
        {launched && (
          <span className="pointer-events-none absolute left-1/2 top-[30%] z-50" aria-hidden>
            {PIECES.map((p, i) => (
              <span
                key={i}
                className="absolute left-0 top-0 animate-burst opacity-0"
                style={{
                  animationDelay: `${0.1 + p.delay}s`,
                  ["--dx" as string]: `${p.dx}px`,
                  ["--dy" as string]: `${p.dy}px`,
                  ["--rot" as string]: `${p.rot}deg`,
                }}
              >
                {p.kind === 0 ? (
                  <Wheel filled className="text-ink" style={{ width: p.size, height: p.size }} />
                ) : p.kind === 1 ? (
                  <CheckeredFlag small style={{ width: p.size + 4, height: p.size + 4 }} />
                ) : (
                  <span className="block rounded-full bg-bloom" style={{ width: p.size / 2, height: p.size / 2 }} />
                )}
              </span>
            ))}
          </span>
        )}
      </button>

      <p className="mt-4 text-center font-serif font-semibold italic text-brand">
        {open
          ? "Tap the card to see it up close"
          : stage === "closed"
            ? "Press start to open your invitation"
            : "Lights out and away we go…"}
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
