import { useId } from "react"
import { type CarModel, carSvg } from "@/lib/cars"
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
      <circle cx="12" cy="12" r="6.2" fill={filled ? "#c9ced8" : "none"} stroke={filled ? "#c9ced8" : "currentColor"} strokeWidth="1.1" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {[0, 72, 144, 216, 288].map((a) => {
          const r = ((a - 90) * Math.PI) / 180
          return <path key={a} d={`M${12 + Math.cos(r) * 1.8} ${12 + Math.sin(r) * 1.8}L${12 + Math.cos(r) * 5.6} ${12 + Math.sin(r) * 5.6}`} />
        })}
      </g>
      <circle cx="12" cy="12" r="1.5" fill={filled ? "#d90f0f" : "currentColor"} />
    </svg>
  )
}

/** A side-view supercar with speed lines; `model` picks the paint and shape. */
export function SportsCar({ className, style, model = "rosso" }: Props & { flutter?: boolean; model?: CarModel }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 200 60" className={cn("overflow-visible", className)} style={style} aria-hidden>
      <g stroke="rgb(var(--c-foliage))" strokeWidth="2.4" strokeLinecap="round" opacity=".8">
        <path d="M-26 26H-2M-34 36H0M-20 46H2" />
      </g>
      <g
        className="animate-bob"
        style={{ transformOrigin: "100px 46px" }}
        dangerouslySetInnerHTML={{ __html: carSvg(model, "#9ca3af", `${model}${id}`) }}
      />
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
          <rect width={cell} height={cell} fill="#111216" />
          <rect x={cell} y={cell} width={cell} height={cell} fill="#111216" />
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
        stroke="#8b919e"
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
      <span className="h-2 w-16 bg-[repeating-conic-gradient(#111216_0_25%,#fff_0_50%)] bg-[length:8px_8px]" />
      <Wheel className="h-6 w-6" filled />
      <span className="h-2 w-16 bg-[repeating-conic-gradient(#111216_0_25%,#fff_0_50%)] bg-[length:8px_8px]" />
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
