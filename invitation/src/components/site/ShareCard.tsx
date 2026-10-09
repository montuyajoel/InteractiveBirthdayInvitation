import invitationCard from "@/assets/invitationCard"
import { EVENT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { churchName, eventDateLabel, eventTimeLabel } from "@/lib/event"
import { Balloons, Butterfly, Cross, FloralSpray, HeartRule, garland } from "./Decor"

// The 1200×630 picture that link previews show (WhatsApp, Messenger,
// iMessage, Facebook…). Not linked from the site: scripts/share_image.mjs
// screenshots #/share-card into public/share.jpg, which index.html points
// og:image at. Re-run it whenever the names, date, venue or design change.

const LEFT = garland([[30, 560], [70, 600], [10, 510], [110, 610], [40, 460], [150, 620]], 51, 1.4)
const RIGHT = garland([[1170, 40], [1130, 10], [1190, 90], [1090, 20], [1180, 140]], 57, 1.3)

export function ShareCard() {
  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--c-highlight))_0%,transparent_60%),radial-gradient(ellipse_at_85%_90%,rgb(var(--c-soft))_0%,transparent_55%)]" />
      <Balloons balloons={LEFT} viewBox="0 0 1200 630" bob={false} className="absolute inset-0 h-full w-full" />
      <Balloons balloons={RIGHT} viewBox="0 0 1200 630" bob={false} className="absolute inset-0 h-full w-full" />
      <FloralSpray className="absolute left-[-10px] top-[-10px] w-44" />
      <Butterfly className="absolute left-[640px] top-[60px] h-14 w-16" flutter={false} />
      <Butterfly className="absolute left-[90px] top-[300px] h-10 w-12" flutter={false} />

      <div className="absolute left-[90px] top-[80px] w-[620px] text-center">
        <Cross className="mx-auto h-9 w-7" />
        <p className="script foil mt-2 text-[92px] leading-none">{fill(COPY.shareHeadline)}</p>
        <p className="eyebrow mt-4 text-[15px]">to the christening of</p>
        <p className="script mt-1 text-[78px] leading-tight text-ink">{EVENT.honoree}</p>
        <HeartRule className="mt-2 justify-center" />
        <p className="mt-4 text-[22px] uppercase tracking-[0.22em] text-ink">
          {eventDateLabel} · {eventTimeLabel}
        </p>
        <p className="mt-2 text-[17px] uppercase tracking-[0.2em] text-brand">
          {COPY.churchLabel}: {churchName}
        </p>
        <p className="mt-1 text-[17px] uppercase tracking-[0.2em] text-brand">
          {COPY.receptionLabel}: {EVENT.venue}
        </p>
      </div>

      <div className="absolute right-[90px] top-1/2 w-[300px] -translate-y-1/2 rotate-[3deg] bg-white p-3 shadow-[0_30px_60px_-20px_rgb(var(--c-ink)/0.45)]">
        <img src={invitationCard} alt="" className="block w-full" />
      </div>
    </div>
  )
}
