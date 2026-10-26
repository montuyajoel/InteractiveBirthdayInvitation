import { useId } from "react"
import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }

// Supercar race-day motif: cars, wheels, checkered flags and comic bursts.
// The old template names (Butterfly, Heart, Sparkle, BabysBreath, HeartRule)
// are kept as aliases at the bottom so the section components work unchanged.

/** A racing wheel: tyre, rim and five spokes. */
export function Wheel({
  className,
  filled = false,
  ...svg
}: React.SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} aria-hidden {...svg}>
      <circle cx="12" cy="12" r="10" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="6.2" fill={filled ? "#fff" : "none"} fillOpacity={filled ? 0.9 : 0} stroke={filled ? "#fff" : "currentColor"} strokeWidth="1.1" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {[0, 72, 144, 216, 288].map((a) => {
          const r = ((a - 90) * Math.PI) / 180
          return <path key={a} d={`M${12 + Math.cos(r) * 1.8} ${12 + Math.sin(r) * 1.8}L${12 + Math.cos(r) * 5.6} ${12 + Math.sin(r) * 5.6}`} />
        })}
      </g>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

/** A low, wedge-shaped supercar seen from the side, with speed lines. */
export function SportsCar({ className, style }: Props & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 200 60" className={cn("overflow-visible text-brand", className)} style={style} aria-hidden>
      <g stroke="rgb(var(--c-foliage))" strokeWidth="2.4" strokeLinecap="round" opacity=".8">
        <path d="M-26 26H-2M-34 36H0M-20 46H2" />
      </g>
      <g className="animate-bob" style={{ transformOrigin: "100px 46px" }}>
        <path d="M4 26L22 24V29L6 30Z" fill="rgb(var(--c-ink))" />
        <path
          d="M6 46V36Q8 31 22 30L62 27Q88 12 118 12Q138 12 160 25L190 31Q197 34 196 42L194 46H171A13 13 0 0 0 145 46H61A13 13 0 0 0 35 46Z"
          fill="currentColor"
          stroke="rgb(var(--c-ink))"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M70 27Q90 16 116 16Q132 16 150 26Z" fill="rgb(var(--c-ink))" />
        <path d="M80 39L112 33L106 42Z" fill="rgb(var(--c-ink))" />
        <path d="M14 36H60M150 34H188" stroke="rgb(var(--c-bloom))" strokeWidth="3" strokeLinecap="round" />
        {[48, 158].map((x) => (
          <g key={x}>
            <circle cx={x} cy="46" r="11" fill="rgb(var(--c-ink))" />
            <circle cx={x} cy="46" r="5.5" fill="#d7dbe2" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** A spiky comic-book burst ("VROOM!"). */
export function ComicBurst({ className, style }: Props) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2
    const r = i % 2 ? 6 : 11.5
    return `${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`
  }).join(" ")
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <polygon points={pts} fill="rgb(var(--c-bloom))" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

/** A checkered flag on a pole; `small` draws a compact 24×24 icon. */
export function CheckeredFlag({ className, style, small = false }: Props & { small?: boolean; spider?: boolean }) {
  const id = useId().replace(/:/g, "")
  const cell = small ? 3 : 12
  const [w, h] = small ? [24, 24] : [130, 200]
  const flag = small
    ? "M5 3c4-2 7 2 11 0s5-1 6 0v10c-2-1-3-1-6 0s-7-2-11 0z"
    : "M24 18c24-12 40 10 64 0s30-6 38 0v62c-10-6-16-6-38 0S48 70 24 80z"
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={style} aria-hidden>
      <defs>
        <pattern id={`chk${id}`} width={cell * 2} height={cell * 2} patternUnits="userSpaceOnUse" patternTransform="skewY(-6)">
          <rect width={cell * 2} height={cell * 2} fill="#fff" />
          <rect width={cell} height={cell} style={{ fill: "rgb(var(--c-ink))" }} />
          <rect x={cell} y={cell} width={cell} height={cell} style={{ fill: "rgb(var(--c-ink))" }} />
        </pattern>
      </defs>
      <path
        d={small ? "M5 2v20" : "M24 12v184"}
        style={{ stroke: "rgb(var(--c-foliage))" }}
        strokeWidth={small ? 1.6 : 4}
        strokeLinecap="round"
      />
      <path
        d={flag}
        fill={`url(#chk${id})`}
        style={{ stroke: "rgb(var(--c-ink))" }}
        strokeWidth={small ? 0.8 : 2}
        strokeLinejoin="round"
        opacity={small ? 1 : 0.85}
      />
    </svg>
  )
}

export function RaceRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-brand", className)} aria-hidden>
      <span className="h-2 w-16 bg-[repeating-conic-gradient(rgb(var(--c-ink))_0_25%,#fff_0_50%)] bg-[length:8px_8px] ring-1 ring-ink/30" />
      <Wheel className="h-6 w-6 text-ink" filled />
      <span className="h-2 w-16 bg-[repeating-conic-gradient(rgb(var(--c-ink))_0_25%,#fff_0_50%)] bg-[length:8px_8px] ring-1 ring-ink/30" />
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

const SmallFlag = (p: Props) => <CheckeredFlag small {...p} />

// Template names used by the section components.
export const Butterfly = SportsCar
export const Heart = Wheel
export const Sparkle = SmallFlag
export const BabysBreath = CheckeredFlag
export const HeartRule = RaceRule
