import { CARS, type CarModel } from "@/lib/cars"
import { SportsCar } from "./Decor"

// Two lanes, three cars each, spread evenly by their start offsets.
const LINEUP: { model: CarModel; duration: string; delay: string; lane: string }[] = [
  { model: "rosso", duration: "12s", delay: "0s", lane: "top-1" },
  { model: "giallo", duration: "12s", delay: "-4s", lane: "top-1" },
  { model: "blu", duration: "12s", delay: "-8s", lane: "top-1" },
  { model: "blu", duration: "15s", delay: "-2.5s", lane: "top-[4.9rem]" },
  { model: "rosso", duration: "15s", delay: "-7.5s", lane: "top-[4.9rem]" },
  { model: "arancio", duration: "15s", delay: "-12.5s", lane: "top-[4.9rem]" },
]

/** A strip of orange toy track with supercars racing across it. */
export function Parade() {
  return (
    <section aria-label="The supercar lineup" className="relative h-40 overflow-hidden bg-gradient-to-b from-[#ffb35c] via-[#ff7a00] to-[#c94a00] shadow-[inset_0_6px_0_rgb(255_255_255/0.25),inset_0_-8px_0_rgb(0_0_0/0.25)]">
      {/* orange toy track: two lanes, joints every so often */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_236px,rgb(0_0_0/0.18)_236px_240px)]" />
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.8)_0_40px,transparent_40px_70px)]" />
      {LINEUP.map((c, i) => (
        <div
          key={i}
          className={`absolute left-[45%] ${c.lane} animate-drive`}
          style={{ animationDuration: c.duration, animationDelay: c.delay }}
        >
          <SportsCar model={c.model} className="h-12 w-40" />
          <p className="mt-0.5 pl-8 text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#061a5c]">{CARS[c.model].label}</p>
        </div>
      ))}
    </section>
  )
}
