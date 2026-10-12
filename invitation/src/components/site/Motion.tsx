// Things that move: falling petals, butterflies, doves, fountain spray,
// rising hearts and twinkles. They're HTML-level layers animated with CSS
// transforms only (cheap on phones), never block taps, and are hidden
// entirely for visitors who prefer reduced motion (see .motion-layer in
// index.css).
import { cn } from "@/lib/utils"

type Style = React.CSSProperties & Record<`--${string}`, string>

// Fixed pseudo-random values so the scene is the same on every render.
const seq = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453
    return x - Math.floor(x)
  })

const PETAL_COLORS = ["#e8b4c2", "#f3d3dc", "#c98a9c", "#f7e3e6", "#b98ac0"]

/** Rose petals drifting down the whole page. */
export function FallingPetals({ count = 16 }: { count?: number }) {
  const r = seq(count * 4, 3.7)
  return (
    <div className="motion-layer pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 10 + r[i * 4] * 12
        const style: Style = {
          left: `${r[i * 4 + 1] * 100}%`,
          width: size,
          height: size,
          animationDuration: `${13 + r[i * 4 + 2] * 12}s`,
          animationDelay: `${-r[i * 4 + 3] * 20}s`,
          "--drift": `${(r[i * 4 + 2] - 0.5) * 160}px`,
          "--spin": `${(r[i * 4] > 0.5 ? 1 : -1) * (240 + r[i * 4 + 1] * 360)}deg`,
        }
        return (
          <span key={i} className="petal-fall absolute -top-8 block" style={style}>
            <span className="petal-sway block h-full w-full" style={{ animationDuration: `${3 + r[i * 4 + 3] * 3}s` }}>
              <svg viewBox="0 0 20 20" className="h-full w-full drop-shadow-[0_2px_2px_rgb(74_46_59/0.18)]">
                <path d="M10 1C16 4 19 11 14 17C11 20 6 19 4 15C1 9 4 3 10 1Z" fill={PETAL_COLORS[i % PETAL_COLORS.length]} />
                <path d="M10 3C9 8 8 12 6 16" stroke="#ffffff" strokeOpacity=".5" strokeWidth="1" fill="none" />
              </svg>
            </span>
          </span>
        )
      })}
    </div>
  )
}

const WINGS = {
  lilac: ["#b9a2cf", "#8b6aa0"],
  blush: ["#f0c9d4", "#c4849a"],
  cream: ["#f7ece4", "#c9a874"],
} as const

/** An embroidered butterfly with flapping wings (stays in place; wrap it to move it). */
export function FlutterButterfly({ tone = "lilac", className }: { tone?: keyof typeof WINGS; className?: string }) {
  const [fill, edge] = WINGS[tone]
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden>
      <g className="wing-flap" style={{ transformOrigin: "32px 24px" }}>
        <path d="M32 24C26 6 6 4 9 17c2 8 13 9 23 7zM32 24c6-18 26-20 23-7-2 8-13 9-23 7z" fill={fill} stroke={edge} strokeWidth="1.4" />
        <path d="M32 24c-6 4-16 14-9 17 4 2 8-7 9-17zM32 24c6 4 16 14 9 17-4 2-8-7-9-17z" fill={fill} stroke={edge} strokeWidth="1.4" opacity=".9" />
        <circle cx="18" cy="15" r="3" fill="#ffffff" opacity=".7" />
        <circle cx="46" cy="15" r="3" fill="#ffffff" opacity=".7" />
      </g>
      <path d="M32 16v17" stroke="#4a2e3b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 16l-4-6M32 16l4-6" stroke="#4a2e3b" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/**
 * Butterflies wandering across their (relatively positioned) parent.
 * `paths` = how many; each takes its own height, speed and direction.
 */
export function Butterflies({ count = 2, seed = 1, className }: { count?: number; seed?: number; className?: string }) {
  const r = seq(count * 4, seed + 0.31)
  const tones = ["lilac", "blush", "cream"] as const
  return (
    <div className={cn("motion-layer pointer-events-none absolute inset-0 z-10 overflow-hidden", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="butterfly-fly absolute left-0 block"
          style={{
            top: `${10 + r[i * 4] * 70}%`,
            animationDuration: `${18 + r[i * 4 + 1] * 14}s`,
            animationDelay: `${-r[i * 4 + 2] * 20}s`,
            animationDirection: r[i * 4 + 3] > 0.5 ? "reverse" : "normal",
          }}
        >
          <FlutterButterfly tone={tones[(i + seed) % 3]} className="h-7 w-9 sm:h-8 sm:w-11" />
        </span>
      ))}
    </div>
  )
}

/** A pair of white doves gliding across the sky of the opening scene. */
export function Doves({ className }: { className?: string }) {
  const dove = (
    <svg viewBox="0 0 60 36" className="h-full w-full drop-shadow-[0_3px_3px_rgb(74_46_59/0.2)]">
      <path d="M8 22C16 16 30 16 40 19L52 14L48 21C46 27 36 30 24 28C16 27 10 25 8 22Z" fill="#fdf8f8" stroke="#d9bcc4" strokeWidth="1" />
      <path d="M52 14l6-1-5 4z" fill="#c9a874" />
      <circle cx="49" cy="16" r=".9" fill="#3b2d33" />
      <g className="dove-wing" style={{ transformOrigin: "30px 20px" }}>
        <path d="M22 20C20 8 26 2 36 0C34 8 34 14 34 20Z" fill="#ffffff" stroke="#d9bcc4" strokeWidth="1" />
      </g>
    </svg>
  )
  return (
    <div className={cn("motion-layer pointer-events-none absolute inset-x-0 z-10 h-28 overflow-hidden", className)} aria-hidden>
      <span className="dove-fly absolute left-0 top-6 block h-7 w-12" style={{ animationDuration: "22s" }}>
        {dove}
      </span>
      <span className="dove-fly absolute left-0 top-14 block h-5 w-9" style={{ animationDuration: "26s", animationDelay: "-9s" }}>
        {dove}
      </span>
    </div>
  )
}

/** Water drops arcing out of the château fountain (positioned over it). */
export function FountainSpray({ className }: { className?: string }) {
  const drops = seq(14, 5.3)
  return (
    <div className={cn("motion-layer pointer-events-none absolute", className)} aria-hidden>
      {drops.map((d, i) => (
        <span
          key={i}
          className="fountain-drop absolute left-1/2 top-0 block h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_4px_rgb(255_255_255/0.9)]"
          style={{ "--dx": `${(i % 2 ? 1 : -1) * (6 + d * 22)}px`, animationDelay: `${-d * 1.6}s`, animationDuration: `${1.3 + d * 0.6}s` } as Style}
        />
      ))}
    </div>
  )
}

/** Little hearts floating up and fading (e.g. between the swans). */
export function RisingHearts({ count = 6, className }: { count?: number; className?: string }) {
  const r = seq(count * 3, 8.1)
  return (
    <div className={cn("motion-layer pointer-events-none absolute", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="heart-rise absolute bottom-0 left-1/2 h-4 w-4"
          style={{ "--dx": `${(r[i * 3] - 0.5) * 70}px`, animationDelay: `${-r[i * 3 + 1] * 5}s`, animationDuration: `${4 + r[i * 3 + 2] * 2.5}s` } as Style}
        >
          <path d="M12 20.5s-7.5-4.6-7.5-10.2C4.5 7.4 6.6 5.5 9 5.5c1.4 0 2.5.7 3 1.7.5-1 1.6-1.7 3-1.7 2.4 0 4.5 1.9 4.5 4.8 0 5.6-7.5 10.2-7.5 10.2z" fill={i % 2 ? "#c4849a" : "#e8b4c2"} />
        </svg>
      ))}
    </div>
  )
}

/** Twinkling four-point stars scattered over the parent. */
export function Twinkles({ count = 8, seed = 2, className, color = "#ffffff" }: { count?: number; seed?: number; className?: string; color?: string }) {
  const r = seq(count * 4, seed + 0.77)
  return (
    <div className={cn("motion-layer pointer-events-none absolute inset-0 z-10", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="twinkle absolute"
          style={{
            left: `${r[i * 4] * 96}%`,
            top: `${r[i * 4 + 1] * 92}%`,
            width: 8 + r[i * 4 + 2] * 10,
            height: 8 + r[i * 4 + 2] * 10,
            animationDelay: `${-r[i * 4 + 3] * 4}s`,
            animationDuration: `${2.4 + r[i * 4 + 2] * 2}s`,
          }}
        >
          <path d="M12 1c.7 6 2.4 8.6 10 11-7.6 2.4-9.3 5-10 11-.7-6-2.4-8.6-10-11 7.6-2.4 9.3-5 10-11z" fill={color} stroke="#c9a874" strokeWidth=".8" />
        </svg>
      ))}
    </div>
  )
}
