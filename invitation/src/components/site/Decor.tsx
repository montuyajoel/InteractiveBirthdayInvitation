import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }

// Spider-hero motif: webs, little spiders and comic-book bursts.
// The old template names (Butterfly, Heart, Sparkle, BabysBreath, HeartRule)
// are kept as aliases at the bottom so the section components work unchanged.

const LEGS = [
  // [hip x, hip y, knee x, knee y, foot x, foot y] for the left side; mirrored for the right
  [10.4, 10.5, 6.5, 7, 5, 2.5],
  [10, 12, 5, 10.5, 2.5, 8.5],
  [10, 13.5, 5, 15, 2.5, 17.5],
  [10.4, 15, 6.5, 18.5, 5, 22],
]

/** A spider emblem, like the one on a hero's chest. */
export function SpiderEmblem({
  className,
  filled = false,
  ...svg
}: React.SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} aria-hidden {...svg}>
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {LEGS.map(([hx, hy, kx, ky, fx, fy], i) => (
          <g key={i}>
            <path d={`M${hx} ${hy}L${kx} ${ky}L${fx} ${fy}`} />
            <path d={`M${24 - hx} ${hy}L${24 - kx} ${ky}L${24 - fx} ${fy}`} />
          </g>
        ))}
      </g>
      <circle cx="12" cy="8.4" r="1.9" fill="currentColor" fillOpacity={filled ? 1 : 0.25} stroke="currentColor" strokeWidth="1" />
      <ellipse cx="12" cy="14.2" rx="2.6" ry="4" fill="currentColor" fillOpacity={filled ? 1 : 0.25} stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/** A little spider dangling from a thread of web; bobs gently. */
export function HangingSpider({ className, style }: Props & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 48 64" className={cn("overflow-visible text-ink", className)} style={style} aria-hidden>
      <path d="M24 -40V36" stroke="rgb(var(--c-foliage))" strokeWidth="1" />
      <g className="animate-bob" style={{ transformOrigin: "24px 0" }}>
        <SpiderEmblem x="12" y="32" width="24" height="24" filled className="text-ink" />
      </g>
    </svg>
  )
}

/** A spiky comic-book "POW" burst. */
export function ComicBurst({ className, style }: Props) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2
    const r = i % 2 ? 6 : 11.5
    return `${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`
  }).join(" ")
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <polygon points={pts} fill="#ffd23f" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

/** A spider web, drawn from spokes and sagging rings, with a spider on a thread. */
export function SpiderWeb({ className, style, spider = true }: Props & { spider?: boolean }) {
  const cx = 65
  const cy = 80
  const spokes = Array.from({ length: 10 }, (_, i) => (i * 2 * Math.PI) / 10 + 0.2)
  const rings = [12, 24, 37, 50, 62]
  const pt = (a: number, r: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  return (
    <svg viewBox="0 0 130 200" className={className} style={style} aria-hidden>
      <g fill="none" style={{ stroke: "rgb(var(--c-foliage))" }} strokeWidth="1" strokeLinecap="round" opacity=".75">
        {spokes.map((a, i) => {
          const [x, y] = pt(a, 68)
          return <path key={i} d={`M${cx} ${cy}L${x.toFixed(1)} ${y.toFixed(1)}`} />
        })}
        {rings.map((r) => (
          <path
            key={r}
            d={spokes
              .map((a, i) => {
                const b = spokes[(i + 1) % spokes.length]
                const [x1, y1] = pt(a, r)
                const [x2, y2] = pt(b, r)
                const [qx, qy] = pt((a + b + (i === spokes.length - 1 ? 2 * Math.PI : 0)) / 2, r * 0.82)
                return `${i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)}` : ""}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
              })
              .join("")}
          />
        ))}
      </g>
      {spider && (
        <>
          <path d={`M${cx + 20} ${cy + 30}V170`} style={{ stroke: "rgb(var(--c-foliage))" }} strokeWidth="1" />
          <g className="animate-bob" style={{ transformOrigin: `${cx + 20}px ${cy + 30}px` }}>
            <SpiderEmblem x={cx + 9} y="164" width="22" height="22" filled className="text-brand" />
          </g>
        </>
      )}
    </svg>
  )
}

export function WebRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-brand", className)} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-brand/70" />
      <SpiderEmblem className="h-6 w-6" filled />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-brand/70" />
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
export const Butterfly = HangingSpider
export const Heart = SpiderEmblem
export const Sparkle = ComicBurst
export const BabysBreath = SpiderWeb
export const HeartRule = WebRule
