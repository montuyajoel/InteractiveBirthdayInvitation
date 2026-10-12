import { WEDDING } from "@/config"
import { useCurtainOpen } from "@/lib/curtain"
import { cn } from "@/lib/utils"
import { Curtain } from "./Curtain"
import { Chateau } from "./Embroidery"
import { Butterflies, Doves, FountainSpray, Twinkles } from "./Motion"

import { eventDateLabel, eventTimeLabel } from "@/lib/event"

export { eventDateLabel, eventTimeLabel }

/** The opening stage: curtains with the monogram seal, then the names over the château. */
export function Hero() {
  const open = useCurtainOpen()
  const [one, amp, two] = WEDDING.heroNames

  return (
    <section
      id="invitation"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#fbf3f5_0%,#f3e2e8_55%,#ead3db_100%)]"
    >
      <Curtain />
      {open && <Doves className="top-[9vh]" />}
      {open && <Twinkles count={10} seed={4} className="bottom-1/2" />}

      <div
        className={cn(
          "relative z-10 mx-auto mt-[clamp(110px,22vh,220px)] px-6 text-center transition-all delay-700 [transition-duration:1400ms]",
          open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <h1 className="font-serif text-[clamp(2.6rem,10vw,4.5rem)] leading-[1.02] text-ink">
          <span className="block">{one}</span>
          <span className="block text-[0.6em] italic text-brand">{amp}</span>
          <span className="block">{two}</span>
        </h1>
        <p className="mt-3 text-sm italic tracking-[0.2em] text-ink/80">{WEDDING.heroDate}</p>
      </div>

      <div className="relative z-0 mx-auto mt-auto w-full max-w-[560px] translate-y-1">
        <Chateau className="w-full" />
        <FountainSpray className="left-1/2 top-[66%] h-0 w-0" />
        {open && <Butterflies count={3} seed={2} className="-inset-x-4 bottom-1/4 top-[-30%]" />}
      </div>

      <a
        href="#welcome"
        className={cn(
          "absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/60 px-4 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-ink backdrop-blur transition-opacity [transition-delay:1800ms] duration-700",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        Scroll ↓
      </a>
    </section>
  )
}
