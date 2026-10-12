import { useState } from "react"
import { WEDDING } from "@/config"
import { openCurtain, useCurtainOpen } from "@/lib/curtain"
import { cn } from "@/lib/utils"
import { MonogramSeal, PearlString, SILK } from "./Embroidery"

// Pleated fabric: light ridges and shaded folds, darker towards the floor.
const FABRIC = {
  backgroundImage: [
    "linear-gradient(180deg, rgb(255 255 255 / 0.18), transparent 30%, rgb(74 46 59 / 0.18))",
    "repeating-linear-gradient(90deg, #dcbcc6 0px, #f2dfe4 10px, #f8ebee 13px, #e5c8d1 20px, #d2adb9 26px)",
  ].join(","),
}

// Same number of points in both states so the shape animates smoothly.
const CLOSED_LEFT = "polygon(0 0, 100% 0, 100% 58%, 100% 100%, 0 100%)"
const OPEN_LEFT = "polygon(0 0, 44% 0, 13% 60%, 24% 100%, 0 100%)"
const CLOSED_RIGHT = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 58%)"
const OPEN_RIGHT = "polygon(56% 0, 100% 0, 100% 100%, 76% 100%, 87% 60%)"

/** Swagged valance with pearl trim along the top of the stage. */
function Valance() {
  const swags = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="absolute inset-x-0 top-0 z-30 h-[clamp(64px,11vh,110px)] w-full" aria-hidden>
      <rect x="0" y="0" width="400" height="14" fill="#ecd5dc" filter="url(#relief)" />
      {swags.map((i) => {
        const x = i * 100
        return (
          <g key={i} filter="url(#relief)">
            <path d={`M${x - 4} 10Q${x + 50} 70 ${x + 104} 10Z`} fill="#efd9df" />
            {[18, 30, 42].map((d) => (
              <path key={d} d={`M${x + 8} 12Q${x + 50} ${d + 12} ${x + 92} 12`} fill="none" stroke="#d3b0bb" strokeWidth="1.4" />
            ))}
          </g>
        )
      })}
      {swags.map((i) => (
        <PearlString key={i} from={[i * 100 + 2, 12]} to={[i * 100 + 98, 12]} sag={64} r={2.1} gap={0.5} />
      ))}
      <PearlString from={[0, 4]} to={[400, 4]} sag={0} r={2} gap={0.6} />
    </svg>
  )
}

export function Curtain() {
  const open = useCurtainOpen()
  const [pressed, setPressed] = useState(false)

  const start = () => {
    if (pressed) return
    setPressed(true)
    setTimeout(openCurtain, 450)
  }

  const panel = "absolute inset-y-0 z-20 w-1/2 transition-[clip-path] [transition-duration:1600ms] [transition-timing-function:cubic-bezier(.6,.05,.25,1)]"

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden={open}>
      <Valance />
      <div className={panel} style={{ left: 0, ...FABRIC, clipPath: open ? OPEN_LEFT : CLOSED_LEFT }}>
        {/* pearl trim on the leading edge */}
        <span
          className={cn("absolute inset-y-0 right-0 w-3 transition-opacity duration-500", open && "opacity-0")}
          style={{ background: "radial-gradient(circle at 50% 50%, #fff 0 2.5px, #dcc3ca 3.5px, transparent 4.5px) 0 0 / 12px 11px repeat-y" }}
        />
      </div>
      <div className={panel} style={{ right: 0, ...FABRIC, clipPath: open ? OPEN_RIGHT : CLOSED_RIGHT }}>
        <span
          className={cn("absolute inset-y-0 left-0 w-3 transition-opacity duration-500", open && "opacity-0")}
          style={{ background: "radial-gradient(circle at 50% 50%, #fff 0 2.5px, #dcc3ca 3.5px, transparent 4.5px) 0 0 / 12px 11px repeat-y" }}
        />
      </div>

      {/* pearl tie-backs, once drawn open */}
      {[
        "left-[6.5%] -rotate-[14deg]",
        "right-[6.5%] rotate-[14deg]",
      ].map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 60 20"
          className={cn(
            "absolute top-[58%] z-30 w-[11%] min-w-[44px] max-w-[90px] transition-opacity delay-1000 duration-700",
            pos,
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <PearlString from={[2, 8]} to={[58, 8]} sag={10} r={2.6} gap={0.4} />
          <circle cx="30" cy="12" r="4" fill={SILK.gold} filter="url(#puffy)" />
        </svg>
      ))}

      {!open && (
        <button
          type="button"
          onClick={start}
          className={cn(
            "pointer-events-auto absolute left-1/2 top-1/2 z-40 w-[min(46vw,190px)] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
            pressed ? "scale-75 opacity-0" : "animate-[sealBreathe_3.2s_ease-in-out_infinite] hover:scale-105",
          )}
          aria-label="Open the invitation"
        >
          <MonogramSeal text={WEDDING.monogram} className="w-full drop-shadow-[0_10px_18px_rgb(74_46_59/0.35)]" />
          <span className="mt-3 block text-center text-[0.7rem] uppercase tracking-[0.32em] text-ink/80">Tap to open</span>
        </button>
      )}
    </div>
  )
}
