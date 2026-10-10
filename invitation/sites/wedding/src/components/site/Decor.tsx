import { cn } from "@/lib/utils"
import { CornerBouquet, FloralSpray } from "./Florals"

type Props = { className?: string; style?: React.CSSProperties }

const EUCALYPTUS: [number, number, number][] = [
  [20, 30, -30], [31, 18, 25], [24, 42, 35], [38, 30, -25], [30, 8, 0],
]

/** A eucalyptus sprig, like the greenery on the printed card. (Named
 *  Butterfly so the template's call sites keep working.) */
export function Butterfly({ className, style, flutter = true }: Props & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 64 48" className={cn("text-foliage", className)} style={style} aria-hidden>
      <g className={cn(flutter && "animate-sway")} style={{ transformOrigin: "32px 46px" }}>
        <path d="M32 46C30 34 31 20 30 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {EUCALYPTUS.map(([x, y, r], i) => (
          <ellipse
            key={i}
            cx={x + (x < 30 ? 2 : 0)}
            cy={y}
            rx="7"
            ry="5.5"
            transform={`rotate(${r} ${x} ${y})`}
            fill="currentColor"
            fillOpacity=".22"
            stroke="currentColor"
            strokeWidth="1.1"
          />
        ))}
      </g>
    </svg>
  )
}

export function Heart({ className, style, filled = false }: Props & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2C4.5 7.4 6.6 5.5 9 5.5c1.4 0 2.5.7 3 1.7.5-1 1.6-1.7 3-1.7 2.4 0 4.5 1.9 4.5 4.8 0 5.6-7.5 10.2-7.5 10.2z"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.55 : 0}
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

/** A small peony bouquet. (Named BabysBreath so the template's call sites
 *  keep working.) */
export function BabysBreath({ className, style }: Props) {
  return <CornerBouquet className={className} style={style} />
}

/** The swaying arch of peonies and greenery along the top / bottom edge. */
export function FloralBand({ edge, className }: { edge: "top" | "bottom"; className?: string }) {
  return <FloralSpray flip={edge === "bottom"} className={className} />
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
