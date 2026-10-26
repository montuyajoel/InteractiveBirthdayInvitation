import { useId } from "react"
import { type CarModel, carSvg } from "@/lib/cars"
import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }

// Die-cast race-day motif: hot rods, red-stripe wheels, flames and orange track.
// The old template names (Butterfly, Heart, Sparkle, BabysBreath, HeartRule)
// are kept as aliases at the bottom so the section components work unchanged.

/** A toy-car wheel: black tyre, red stripe, chrome five-spoke rim. */
export function Wheel({ className, filled: _filled, ...svg }: React.SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} aria-hidden {...svg}>
      <circle cx="12" cy="12" r="11" fill="#121212" stroke="#2e2e2e" strokeWidth="1.2" strokeDasharray="1.4 1.1" />
      <circle cx="12" cy="12" r="7" fill="#d5dbe4" stroke="#e4002b" strokeWidth="1.3" />
      <g stroke="#5b6270" strokeWidth="1.3" strokeLinecap="round">
        {[0, 72, 144, 216, 288].map((a) => {
          const r = ((a - 90) * Math.PI) / 180
          return <path key={a} d={`M${12 + Math.cos(r) * 1.6} ${12 + Math.sin(r) * 1.6}L${12 + Math.cos(r) * 5.4} ${12 + Math.sin(r) * 5.4}`} />
        })}
      </g>
      <circle cx="12" cy="12" r="1.4" fill="#fff" />
    </svg>
  )
}

/** A die-cast hot rod with speed lines; `model` picks the paint job. */
export function SportsCar({ className, style, model = "blaze" }: Props & { flutter?: boolean; model?: CarModel }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 200 72" className={cn("overflow-visible", className)} style={style} aria-hidden>
      <g stroke="rgb(var(--c-bloom))" strokeWidth="2.4" strokeLinecap="round" opacity=".8">
        <path d="M-26 30H-2M-34 42H0M-20 54H2" />
      </g>
      <g
        className="animate-bob"
        style={{ transformOrigin: "100px 60px" }}
        dangerouslySetInnerHTML={{ __html: carSvg(model, `${model}${id}`) }}
      />
    </svg>
  )
}

/** A comic-book burst ("VROOM!"). */
export function ComicBurst({ className, style }: Props) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2
    const r = i % 2 ? 6 : 11.5
    return `${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`
  }).join(" ")
  return (
    <svg viewBox="0 0 24 24" className={cn("text-[#e4002b]", className)} style={style} aria-hidden>
      <polygon points={pts} fill="rgb(var(--c-bloom))" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

/** A hot-rod flame. */
export function Flame({ className, style }: Props) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e4002b" />
          <stop offset=".55" stopColor="#ff7a00" />
          <stop offset="1" stopColor="#ffd400" />
        </linearGradient>
      </defs>
      <path
        d="M12 23c-5 0-8-3.4-8-7.6 0-3.6 2.4-5.6 3.4-8.4.8 2 1.6 3 2.8 3.4C10 6.6 12 3.4 15.6 1c-.6 3.2.4 5.4 2 7.4 1.4 1.8 2.4 3.8 2.4 6.6C20 19.4 17 23 12 23z"
        fill={`url(#f${id})`}
        stroke="#061a5c"
        strokeWidth=".8"
        strokeLinejoin="round"
      />
      <path d="M12 21c-2.4 0-4-1.6-4-3.8 0-2 1.4-3 2-4.6 1 1.6 2.2 1.4 2.8-.4 1.6 1.6 3.2 3 3.2 5 0 2.2-1.6 3.8-4 3.8z" fill="#fff6c2" />
    </svg>
  )
}

/** A loop-de-loop of orange track. */
export function TrackLoop({ className, style }: Props & { small?: boolean }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 130 200" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb35c" />
          <stop offset=".5" stopColor="#ff7a00" />
          <stop offset="1" stopColor="#c94a00" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round">
        <path d="M-10 186H40Q70 186 72 150C74 120 108 112 108 80A44 44 0 1 0 64 124Q92 126 96 160Q100 186 140 186" stroke="#7a2a00" strokeWidth="17" opacity=".6" />
        <path d="M-10 186H40Q70 186 72 150C74 120 108 112 108 80A44 44 0 1 0 64 124Q92 126 96 160Q100 186 140 186" stroke={`url(#t${id})`} strokeWidth="13" />
        <path d="M-10 186H40Q70 186 72 150C74 120 108 112 108 80A44 44 0 1 0 64 124Q92 126 96 160Q100 186 140 186" stroke="#fff" strokeWidth="1.4" strokeDasharray="6 7" opacity=".7" />
      </g>
    </svg>
  )
}

/** A strip of orange track with a wheel in the middle. */
export function TrackRule({ className }: { className?: string }) {
  const strip = "h-2.5 w-16 rounded-sm bg-gradient-to-b from-[#ffb35c] via-[#ff7a00] to-[#c94a00] shadow-[0_2px_0_rgb(0_0_0/0.35)]"
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      <span className={strip} />
      <Wheel className="h-7 w-7" />
      <span className={strip} />
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="script mt-2 text-6xl sm:text-7xl">{title}</h2>
    </div>
  )
}

// Template names used by the section components.
export const Butterfly = SportsCar
export const Heart = Wheel
export const Sparkle = Flame
export const BabysBreath = TrackLoop
export const HeartRule = TrackRule
