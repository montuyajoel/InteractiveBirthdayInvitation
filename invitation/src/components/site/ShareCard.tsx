import invitationCard from "@/assets/invitationCard"
import { EVENT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { eventDateLabel, eventTimeLabel } from "@/lib/event"
import { cn } from "@/lib/utils"
import { BabysBreath, Butterfly, HeartRule } from "./Decor"

// The 1200×630 picture that link previews show (WhatsApp, Messenger,
// iMessage, Facebook…). Not linked from the site: scripts/share_image.mjs
// screenshots #/share-card into public/share.jpg, which index.html points
// og:image at. Re-run it whenever the names, date, venue or design change.
export function ShareCard() {
  const long = EVENT.honoree.length > 20
  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--c-highlight))_0%,transparent_60%)]" />
      {/* Swap these for the event's own motif (e.g. a FloralBand) when Decor.tsx is redrawn. */}
      <BabysBreath className="absolute -left-4 bottom-[-30px] w-36" />
      <BabysBreath className="absolute left-[560px] top-[-40px] w-32 rotate-180" />
      <Butterfly className="absolute left-[110px] top-[90px] h-12 w-14" />

      <div className="absolute left-[70px] top-[150px] w-[640px] text-center">
        <p className="script text-[96px] leading-none text-brand">{fill(COPY.shareHeadline)}</p>
        <p className="eyebrow mt-5 text-[15px]">{fill(COPY.celebrationFor)}</p>
        <p className={cn("script mt-1 leading-tight text-ink", long ? "text-[64px]" : "text-[80px]")}>
          {EVENT.honoree}
        </p>
        <HeartRule className="mt-3 justify-center" />
        <p className="mt-4 text-[22px] uppercase tracking-[0.22em] text-ink">
          {eventDateLabel} · {eventTimeLabel}
        </p>
        <p className="mt-1 text-[19px] uppercase tracking-[0.22em] text-brand">{EVENT.venue}</p>
      </div>

      <div className="absolute right-[70px] top-1/2 w-[340px] -translate-y-1/2 rotate-[3deg] bg-white p-3 shadow-[0_30px_60px_-20px_rgb(var(--c-ink)/0.45)]">
        <img src={invitationCard} alt="" className="block w-full" />
      </div>
    </div>
  )
}
