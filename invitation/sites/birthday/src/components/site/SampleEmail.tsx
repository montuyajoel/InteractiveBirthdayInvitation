// Showcase-only: after registering, a guest can get a real sample
// confirmation email, or just preview it here.
import { useState } from "react"
import { Check, Eye, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Registration } from "@/lib/registrations"
import { sendSampleConfirmation } from "@/lib/demoDb"
import { siteUrl } from "@/lib/showcase"
import { invitationEmail } from "../../../api/_lib/invitationEmail"

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; text: string }

export function SampleEmail({ guest }: { guest: Registration }) {
  const [status, setStatus] = useState<Status>({ state: "idle" })
  const [open, setOpen] = useState(false)

  async function send() {
    setStatus({ state: "sending" })
    const r = await sendSampleConfirmation(guest)
    setStatus(r.ok ? { state: "sent" } : { state: "error", text: r.error })
  }

  const email = open
    ? invitationEmail(
        { first_name: guest.firstName, last_name: guest.lastName, email: guest.email, wishes: guest.wishes },
        siteUrl(),
      )
    : null

  return (
    <div className="mt-10 border-t border-mauve/20 pt-8">
      <p className="eyebrow">Sample confirmation email</p>
      <p className="mx-auto mt-2 max-w-md text-base italic text-plum/80">
        See what your guests receive: we'll send it to <span className="not-italic text-plum">{guest.email}</span>.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button
          onClick={send}
          disabled={status.state === "sending" || status.state === "sent"}
          className="gap-2 rounded-none uppercase tracking-[0.18em]"
        >
          {status.state === "sending" ? <Loader2 className="animate-spin" /> : status.state === "sent" ? <Check /> : <Mail />}
          {status.state === "sent" ? "Sent" : "Email it to me"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="gap-2 rounded-none border-mauve/50 bg-transparent uppercase tracking-[0.18em] text-plum hover:bg-white/60"
        >
          <Eye /> Preview
        </Button>
      </div>
      <p className="mt-3 min-h-5 text-sm" role="status">
        {status.state === "sent" && <span className="text-mauve">Sent! Check your inbox (and the spam folder, just in case).</span>}
        {status.state === "error" && <span className="text-destructive">{status.text}</span>}
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] w-[min(640px,96vw)] max-w-none gap-3 p-3 sm:p-4">
          <DialogHeader className="px-2 pt-1 text-left">
            <DialogTitle className="text-lg">{email?.subject}</DialogTitle>
            <DialogDescription>To: {guest.email}</DialogDescription>
          </DialogHeader>
          {email && (
            <iframe
              title="Confirmation email preview"
              srcDoc={email.html}
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              className="h-[70vh] w-full rounded border border-mauve/20 bg-white"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
