import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import invitationCard from "@/assets/invitationCard"
import { eventTitle } from "@/lib/event"
import { cn } from "@/lib/utils"
import { Heart } from "./Decor"

/** A blush-pink envelope that opens to reveal the printed invitation. */
export function Envelope() {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(false)

  return (
    <div className="relative mx-auto w-[300px] sm:w-[340px]">
      <button
        type="button"
        onClick={() => (open ? setZoom(true) : setOpen(true))}
        className={cn(
          "group relative block h-[210px] w-full transition-[margin] duration-700 focus-visible:outline-none sm:h-[236px]",
          open ? "mt-[230px] sm:mt-[250px]" : "mt-6 md:mt-[120px]",
        )}
        aria-label={open ? "View the full invitation" : "Open the envelope"}
      >
        {/* back of envelope */}
        <span className="absolute inset-0 rounded-[3px] bg-[var(--env-back)] shadow-[0_18px_40px_-18px_rgb(var(--c-ink)/0.55)]" />

        {/* the card */}
        <span
          className={cn(
            "absolute left-1/2 bottom-3 w-[200px] sm:w-[226px] aspect-[2/3] origin-bottom transition-transform duration-700 ease-out",
            open
              ? "-translate-x-1/2 -translate-y-[120px] rotate-[-2deg] delay-300 group-hover:-translate-y-[130px] group-hover:rotate-0"
              : "-translate-x-1/2 translate-y-0 scale-[0.62]",
          )}
        >
          <img
            src={invitationCard}
            alt={`Invitation: ${eventTitle}`}
            className="h-full w-full rounded-[2px] object-cover shadow-[0_10px_30px_-10px_rgb(var(--c-ink)/0.5)] ring-1 ring-white"
          />
        </span>

        {/* front pocket */}
        <span
          className="absolute inset-0 rounded-[3px] bg-[var(--env-pocket)]"
          style={{ clipPath: "polygon(0 34%, 50% 66%, 100% 34%, 100% 100%, 0 100%)" }}
        />
        <span
          className="absolute inset-0 bg-[var(--env-sides)]"
          style={{ clipPath: "polygon(0 34%, 50% 66%, 0 100%)" }}
        />
        <span
          className="absolute inset-0 bg-[var(--env-sides)]"
          style={{ clipPath: "polygon(100% 34%, 50% 66%, 100% 100%)" }}
        />

        {/* flap */}
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-[62%] origin-top bg-[var(--env-flap)] transition-transform duration-500 [backface-visibility:hidden]",
            open ? "[transform:rotateX(180deg)] -z-0 opacity-0 delay-150" : "z-10",
          )}
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />

        {/* wax seal */}
        <span
          className={cn(
            "absolute left-1/2 top-[54%] z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-md transition-all duration-300",
            open ? "scale-0 opacity-0" : "group-hover:scale-110",
          )}
        >
          <Heart className="h-6 w-6 text-white" filled />
        </span>
      </button>

      <p className="mt-4 text-center font-serif italic text-brand">
        {open ? "Tap the card to see it up close" : "Tap the seal to open your invitation"}
      </p>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-[min(92vw,560px)] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Invitation</DialogTitle>
          <img
            src={invitationCard}
            alt={`Invitation: ${eventTitle}`}
            className="max-h-[88vh] w-full rounded-[2px] object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
