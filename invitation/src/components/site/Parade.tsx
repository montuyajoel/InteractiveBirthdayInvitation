import { CARS, type CarModel } from "@/lib/cars"
import { SportsCar } from "./Decor"

// Two lanes, three cars each, spread evenly by their start offsets.
const LINEUP: { model: CarModel; duration: string; delay: string; lane: string }[] = [
  { model: "rosso", duration: "12s", delay: "0s", lane: "top-2" },
  { model: "giallo", duration: "12s", delay: "-4s", lane: "top-2" },
  { model: "bleu", duration: "12s", delay: "-8s", lane: "top-2" },
  { model: "bleu", duration: "15s", delay: "-2.5s", lane: "top-[4.5rem]" },
  { model: "rosso", duration: "15s", delay: "-7.5s", lane: "top-[4.5rem]" },
  { model: "giallo", duration: "15s", delay: "-12.5s", lane: "top-[4.5rem]" },
]

/** A strip of track with the supercar lineup racing across it. */
export function Parade() {
  return (
    <section aria-label="The supercar lineup" className="relative h-36 overflow-hidden border-y border-white/10 bg-[#101115]">
      {/* asphalt lanes and kerbs */}
      <div className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,#d90f0f_0_28px,#f4f4f5_28px_56px)]" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-[repeating-linear-gradient(90deg,#d90f0f_0_28px,#f4f4f5_28px_56px)]" />
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#ffc400_0_36px,transparent_36px_72px)] opacity-70" />
      {LINEUP.map((c, i) => (
        <div
          key={i}
          className={`absolute left-[45%] ${c.lane} animate-drive`}
          style={{ animationDuration: c.duration, animationDelay: c.delay }}
        >
          <SportsCar model={c.model} className="h-12 w-40" />
          <p className="-mt-0.5 pl-6 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/70">{CARS[c.model].label}</p>
        </div>
      ))}
    </section>
  )
}
