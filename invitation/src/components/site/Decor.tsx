import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }

/** A graduation cap with a swinging tassel (named Butterfly so the call sites stay put). */
export function Butterfly({ className, style, flutter = true }: Props & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 64 48" className={cn("text-brand", className)} style={style} aria-hidden>
      <path d="M32 6 4 17l28 11 28-11z" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M16 22v10c0 4 7.5 7 16 7s16-3 16-7V22" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <g className={cn(flutter && "animate-tassel")} style={{ transformOrigin: "32px 17px" }}>
        <path d="M32 17l18 5v13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 35h4l1 6h-6z" fill="currentColor" fillOpacity=".55" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </g>
      <circle cx="32" cy="17" r="1.6" fill="currentColor" />
    </svg>
  )
}

/** A five-pointed star (named Heart so the call sites stay put). */
export function Heart({ className, style, filled = false }: Props & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <path
        d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.6 : 0}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ className, style }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <path d="M12 2c.6 5 2.4 7.4 8 10-5.6 2.6-7.4 5-8 10-.6-5-2.4-7.4-8-10 5.6-2.6 7.4-5 8-10z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

// Leaves along the laurel stem: [x, y, angle in degrees, side].
const LEAVES: [number, number, number, 1 | -1][] = [
  [62, 176, -20, -1], [62, 176, 20, 1],
  [58, 150, -28, -1], [60, 148, 24, 1],
  [54, 124, -34, -1], [57, 120, 18, 1],
  [49, 98, -38, -1], [54, 94, 12, 1],
  [45, 72, -42, -1], [52, 68, 6, 1],
  [43, 46, -46, -1], [50, 42, 0, 1],
]

/** A laurel sprig with gold berries (named BabysBreath so the call sites stay put). */
export function BabysBreath({ className, style }: Props) {
  return (
    <svg viewBox="0 0 130 200" className={className} style={style} aria-hidden>
      <path d="M64 198C62 150 54 90 46 22" fill="none" style={{ stroke: "rgb(var(--c-foliage))" }} strokeWidth="1.3" strokeLinecap="round" />
      {LEAVES.map(([x, y, a, side], i) => (
        <path
          key={i}
          d="M0 0C6 -6 18 -7 28 0C18 7 6 6 0 0z"
          transform={`translate(${x} ${y}) rotate(${side === 1 ? a - 40 : 180 + a + 40})`}
          style={{ fill: "rgb(var(--c-foliage) / 0.22)", stroke: "rgb(var(--c-foliage))" }}
          strokeWidth=".9"
        />
      ))}
      {[[76, 134], [36, 112], [70, 84], [34, 60], [58, 28]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" style={{ fill: "rgb(var(--c-bloom))", stroke: "rgb(var(--c-brand) / 0.5)" }} strokeWidth=".7" />
      ))}
    </svg>
  )
}

export function HeartRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-brand", className)} aria-hidden>
      <span className="h-px w-16 bg-brand/50" />
      <Heart className="h-5 w-5" />
      <span className="h-px w-16 bg-brand/50" />
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
