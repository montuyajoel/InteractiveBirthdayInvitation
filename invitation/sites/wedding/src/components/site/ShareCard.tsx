import { CARDS } from "@/assets/cards"
import { EVENT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { eventDateLabel, eventTimeLabel, hasSchedule, stops } from "@/lib/event"
import { cn } from "@/lib/utils"
import { FloralBand, HeartRule } from "./Decor"

// The 1200×630 picture that link previews show (WhatsApp, Messenger,
// iMessage, Facebook…). Not linked from the site: scripts/share_image.mjs
// screenshots #/share-card into public/share.jpg, which index.html points
// og:image at. Re-run it whenever the names, date, venue or design change.
export function ShareCard() {
  const long = EVENT.honoree.length > 20
  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--c-highlight))_0%,transparent_60%)]" />
      <FloralBand edge="top" className="absolute -top-6 left-[-40px] w-[760px]" />

      <div className="absolute left-[70px] top-[250px] w-[640px] text-center">
        <p className="script text-[96px] leading-none text-brand">{fill(COPY.shareHeadline)}</p>
        <p className="eyebrow mt-5 text-[15px]">{fill(COPY.celebrationFor)}</p>
        <p className={cn("script mt-1 leading-tight text-ink", long ? "text-[64px]" : "text-[80px]")}>
          {EVENT.honoree}
        </p>
        <HeartRule className="mt-3 justify-center" />
        {hasSchedule ? (
          <>
            <p className="mt-4 text-[22px] uppercase tracking-[0.22em] text-ink">{eventDateLabel}</p>
            {stops.map((s) => (
              <p key={s.venue} className="mt-1 text-[17px] uppercase tracking-[0.18em] text-brand">
                {s.label} {s.time} · {s.venue}
              </p>
            ))}
          </>
        ) : (
          <>
            <p className="mt-4 text-[22px] uppercase tracking-[0.22em] text-ink">
              {eventDateLabel} · {eventTimeLabel}
            </p>
            <p className="mt-1 text-[19px] uppercase tracking-[0.22em] text-brand">{stops[0].venue}</p>
          </>
        )}
      </div>

      {/* the printed card(s), fanned out like prints on a table */}
      <div className="absolute right-[60px] top-1/2 h-[520px] w-[360px] -translate-y-1/2">
        {CARDS.slice(0, 3).map((c, i, all) => {
          const spread = all.length === 1 ? [3] : all.length === 2 ? [-6, 5] : [-10, 0, 10]
          return (
            <div
              key={c.src}
              className="absolute left-1/2 top-1/2 w-[300px] bg-white p-2.5 shadow-[0_30px_60px_-20px_rgb(var(--c-ink)/0.45)]"
              style={{
                transform: `translate(-50%, -50%) translateX(${(i - (all.length - 1) / 2) * 62}px) rotate(${spread[i]}deg)`,
                zIndex: all.length - Math.abs(i - (all.length - 1) / 2) * 2,
              }}
            >
              <img src={c.src} alt="" className="block aspect-[2/3] w-full object-cover" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
