import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CARDS } from "@/assets/cards"
import { cn } from "@/lib/utils"
import { Heart } from "./Decor"

/** Left/right swipe on touch screens: calls back with -1 or +1. */
function useSwipe(onSwipe: (dir: -1 | 1) => void) {
  const start = useRef<number | null>(null)
  const swiped = useRef(false)
  return {
    swiped,
    handlers: {
      onTouchStart: (e: React.TouchEvent) => {
        start.current = e.touches[0].clientX
        swiped.current = false
      },
      onTouchEnd: (e: React.TouchEvent) => {
        if (start.current === null) return
        const dx = e.changedTouches[0].clientX - start.current
        start.current = null
        if (Math.abs(dx) > 40) {
          swiped.current = true
          onSwipe(dx < 0 ? 1 : -1)
        }
      },
    },
  }
}

/** An envelope that opens to reveal the printed invitation card(s). */
export function Envelope() {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [index, setIndex] = useState(0)
  const many = CARDS.length > 1
  const card = CARDS[index]
  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + CARDS.length) % CARDS.length)
  const swipe = useSwipe((dir) => open && many && go(dir))

  return (
    <div className="relative mx-auto w-[300px] sm:w-[340px]">
      <button
        type="button"
        onClick={() => {
          if (swipe.swiped.current) return // a swipe isn't a tap
          if (open) setZoom(true)
          else setOpen(true)
        }}
        {...swipe.handlers}
        className={cn(
          "group relative block h-[210px] w-full transition-[margin] duration-700 focus-visible:outline-none sm:h-[236px]",
          open ? "mt-[230px] sm:mt-[250px]" : "mt-6 md:mt-[120px]",
        )}
        aria-label={open ? `View the card up close: ${card.alt}` : "Open the envelope"}
      >
        {/* back of envelope */}
        <span className="absolute inset-0 rounded-[3px] bg-[var(--env-back)] shadow-[0_18px_40px_-18px_rgb(var(--c-ink)/0.55)]" />

        {/* the card */}
        <span
          className={cn(
            "absolute left-1/2 bottom-3 w-[200px] sm:w-[226px] aspect-[2/3] origin-bottom transition-transform duration-700 ease-out",
            open
              ? "-translate-x-1/2 -translate-y-[120px] rotate-[-2deg] delay-300 group-hover:-translate-y-[130px] group-hover:rotate-0"
              : "-translate-x-1/2 translate-y-0 scale-[0.62]",
          )}
        >
          <img
            key={card.src}
            src={card.src}
            alt={card.alt}
            className="h-full w-full rounded-[2px] bg-white object-cover shadow-[0_10px_30px_-10px_rgb(var(--c-ink)/0.5)] ring-1 ring-white animate-in fade-in duration-500"
          />
        </span>

        {/* front pocket */}
        <span
          className="absolute inset-0 rounded-[3px] bg-[var(--env-pocket)]"
          style={{ clipPath: "polygon(0 34%, 50% 66%, 100% 34%, 100% 100%, 0 100%)" }}
        />
        <span
          className="absolute inset-0 bg-[var(--env-sides)]"
          style={{ clipPath: "polygon(0 34%, 50% 66%, 0 100%)" }}
        />
        <span
          className="absolute inset-0 bg-[var(--env-sides)]"
          style={{ clipPath: "polygon(100% 34%, 50% 66%, 100% 100%)" }}
        />

        {/* flap */}
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-[62%] origin-top bg-[var(--env-flap)] transition-transform duration-500 [backface-visibility:hidden]",
            open ? "[transform:rotateX(180deg)] -z-0 opacity-0 delay-150" : "z-10",
          )}
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />

        {/* wax seal */}
        <span
          className={cn(
            "absolute left-1/2 top-[54%] z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-md transition-all duration-300",
            open ? "scale-0 opacity-0" : "group-hover:scale-110",
          )}
        >
          <Heart className="h-6 w-6 text-white" filled />
        </span>
      </button>

      {open && many && <CardPicker index={index} onIndex={setIndex} onStep={go} className="mt-4" />}

      <p className="mt-3 text-center font-serif italic text-brand">
        {!open
          ? "Tap the seal to open your invitation"
          : many
            ? "Swipe or use the arrows to see each card; tap one to see it up close"
            : "Tap the card to see it up close"}
      </p>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-[min(92vw,560px)] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            Invitation card {index + 1} of {CARDS.length}
          </DialogTitle>
          <img
            key={card.src}
            src={card.src}
            alt={card.alt}
            {...swipe.handlers}
            className="max-h-[80vh] w-full rounded-[2px] object-contain animate-in fade-in duration-300"
          />
          {many && <CardPicker index={index} onIndex={setIndex} onStep={go} dark />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** Previous / next arrows with a dot per card. */
function CardPicker({
  index,
  onIndex,
  onStep,
  dark = false,
  className,
}: {
  index: number
  onIndex: (i: number) => void
  onStep: (dir: -1 | 1) => void
  dark?: boolean
  className?: string
}) {
  const btn = cn(
    "grid h-9 w-9 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2",
    dark
      ? "bg-white/15 text-white hover:bg-white/25 focus-visible:ring-white"
      : "text-brand hover:bg-highlight focus-visible:ring-brand",
  )
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <button type="button" onClick={() => onStep(-1)} className={btn} aria-label="Previous card">
        <ChevronLeft className="h-5 w-5" />
      </button>
      {CARDS.map((c, i) => (
        <button
          key={c.src}
          type="button"
          onClick={() => onIndex(i)}
          aria-label={`Card ${i + 1}: ${c.alt}`}
          aria-current={i === index}
          className={cn(
            "h-2.5 rounded-full transition-all",
            i === index ? "w-6" : "w-2.5",
            dark ? (i === index ? "bg-white" : "bg-white/40") : i === index ? "bg-brand" : "bg-brand/30",
          )}
        />
      ))}
      <button type="button" onClick={() => onStep(1)} className={btn} aria-label="Next card">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
