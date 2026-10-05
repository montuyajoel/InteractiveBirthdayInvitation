import celebrantPortrait from "@/assets/celebrantPortrait"
import { EVENT } from "@/config"
import { BabysBreath, Butterfly, Heart, Sparkle } from "./Decor"

/** The birthday girl, cut out and set in a soft lilac arch. */
export function Portrait() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* arch backdrop */}
      <div
        aria-hidden
        className="absolute inset-x-[6%] bottom-0 top-[10%] rounded-t-full border border-white/70 shadow-[0_40px_80px_-50px_rgb(92_58_99/0.7)]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 20%, rgb(255 255 255 / 0.85), transparent 60%), linear-gradient(180deg, #efdff4 0%, #e6d2ee 55%, #f6dde8 100%)",
        }}
      />
      <div aria-hidden className="absolute inset-x-[9%] bottom-0 top-[12%] rounded-t-full border border-mauve/25" />

      <img
        src={celebrantPortrait}
        alt={`${EVENT.celebrant}`}
        className="relative z-10 mx-auto block w-[88%] select-none"
        style={{
          // let the gown melt into the page instead of ending on a hard edge
          maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
        }}
        draggable={false}
      />

      <BabysBreath className="pointer-events-none absolute -left-4 bottom-6 z-20 w-24 sm:w-28" />
      <BabysBreath className="pointer-events-none absolute -right-2 bottom-10 z-20 w-20 -scale-x-100 sm:w-24" />
      <Butterfly className="absolute right-[4%] top-[14%] z-20 h-9 w-11 animate-drift" />
      <Sparkle className="absolute left-[8%] top-[22%] z-20 h-5 w-5 opacity-80" />
      <Heart className="absolute right-[12%] top-[46%] z-20 h-4 w-4 opacity-70" filled />
    </div>
  )
}
