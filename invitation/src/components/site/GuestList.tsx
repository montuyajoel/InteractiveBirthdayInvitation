import { useState } from "react"
import { Check, Loader2, Lock, LockOpen, Mail, Send, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  EmailNotConfiguredError,
  GuestListNotSetUpError,
  SendingUnavailableError,
  WrongPasswordError,
  fetchGuestList,
  registrationsConnected,
  sendInvitations,
  type GuestListEntry,
} from "@/lib/registrations"
import { SectionTitle } from "./Decor"

type State =
  | { status: "locked"; error?: string }
  | { status: "checking" }
  | { status: "open"; guests: GuestListEntry[] }

const registeredOn = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })

/** Hosts-only list of everyone who registered, behind a password. */
export function GuestList() {
  const [expanded, setExpanded] = useState(false)
  const [password, setPassword] = useState("")
  const [state, setState] = useState<State>({ status: "locked" })
  // emails currently being sent, and the outcome of the last send
  const [sending, setSending] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null)

  async function send(emails: string[]) {
    if (emails.length === 0 || state.status !== "open") return
    setNotice(null)
    setSending(new Set(emails))
    setProgress(emails.length > 1 ? `Sending 0 of ${emails.length}…` : null)
    try {
      const { sent, failed } = await sendInvitations(password, emails, (done, total) =>
        setProgress(total > 1 ? `Sending ${done} of ${total}…` : null),
      )
      const now = new Date().toISOString()
      const sentSet = new Set(sent)
      setState((st) =>
        st.status === "open"
          ? {
              ...st,
              guests: st.guests.map((g) =>
                sentSet.has(g.email.toLowerCase()) ? { ...g, invite_sent_at: now } : g,
              ),
            }
          : st,
      )
      setNotice(
        failed.length
          ? { tone: "error", text: `Sent ${sent.length}, but ${failed.length} failed: ${failed.join(", ")}. Try those again.` }
          : { tone: "ok", text: `Invitation sent to ${sent.length === 1 ? sent[0] : `${sent.length} guests`}.` },
      )
    } catch (err) {
      setNotice({
        tone: "error",
        text:
          err instanceof SendingUnavailableError
            ? "Sending only works on the live site (Vercel), not in this preview."
            : err instanceof EmailNotConfiguredError
              ? "Email isn't set up yet: add GMAIL_USER and GMAIL_APP_PASSWORD in Vercel, then redeploy."
              : err instanceof WrongPasswordError
                ? "The password was rejected. Lock and unlock again."
                : "Couldn't send right now. Please try again.",
      })
    } finally {
      setSending(new Set())
      setProgress(null)
    }
  }

  function sendToAllUnsent() {
    if (state.status !== "open") return
    const unsent = state.guests.filter((g) => !g.invite_sent_at).map((g) => g.email)
    if (unsent.length === 0) return
    const ok = window.confirm(
      unsent.length === 1
        ? "Email the invitation to the 1 guest who hasn't received it yet?"
        : `Email the invitation to the ${unsent.length} guests who haven't received it yet?`,
    )
    if (ok) send(unsent)
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault()
    if (!password) return
    setState({ status: "checking" })
    try {
      const guests = await fetchGuestList(password)
      setState({ status: "open", guests })
    } catch (err) {
      setState({
        status: "locked",
        error:
          err instanceof WrongPasswordError
            ? "That password isn't right."
            : err instanceof GuestListNotSetUpError
              ? "The guest list isn't set up in the database yet."
              : "Couldn't load the guest list. Please try again.",
      })
    }
  }

  function lock() {
    setNotice(null)
    setPassword("")
    setState({ status: "locked" })
    setExpanded(false)
  }

  return (
    <section id="guests" aria-label="Guest list" className="relative border-t border-mauve/20 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {!expanded ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" aria-hidden /> For the hosts
            </p>
            <Button
              variant="outline"
              onClick={() => setExpanded(true)}
              className="gap-2 rounded-none border-mauve/50 bg-transparent uppercase tracking-[0.18em] text-plum hover:bg-white/60"
            >
              <Users /> See who's coming
            </Button>
          </div>
        ) : state.status !== "open" ? (
          <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end">
            <SectionTitle eyebrow="For the hosts" title="Guest list" />
            {registrationsConnected ? (
              <form onSubmit={unlock} className="paper border border-mauve/25 p-5 sm:p-6">
                <label htmlFor="guest-list-password" className="eyebrow text-[0.7rem]">
                  Password
                </label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="guest-list-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={state.status === "locked" && !!state.error}
                    className="rounded-none border-0 border-b border-mauve/40 bg-transparent px-0 text-lg shadow-none focus-visible:border-mauve focus-visible:ring-0"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    disabled={!password || state.status === "checking"}
                    className="gap-2 rounded-none uppercase tracking-[0.18em]"
                  >
                    {state.status === "checking" ? <Loader2 className="animate-spin" /> : <LockOpen />}
                    Unlock
                  </Button>
                </div>
                {state.status === "locked" && state.error && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {state.error}
                  </p>
                )}
              </form>
            ) : (
              <p className="italic text-muted-foreground">The guest list is available once the database is connected.</p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionTitle eyebrow="For the hosts" title="Guest list" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-lg italic text-plum">
                  {state.guests.length} {state.guests.length === 1 ? "guest has" : "guests have"} confirmed
                </p>
                <Button variant="ghost" onClick={lock} className="gap-2 rounded-none text-mauve hover:bg-blush/50">
                  <Lock /> Lock
                </Button>
              </div>
            </div>

            {state.guests.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                {(() => {
                  const unsent = state.guests.filter((g) => !g.invite_sent_at).length
                  return (
                    <Button
                      onClick={sendToAllUnsent}
                      disabled={unsent === 0 || sending.size > 0}
                      className="gap-2 rounded-none px-6 uppercase tracking-[0.18em]"
                    >
                      {sending.size > 1 ? <Loader2 className="animate-spin" /> : <Send />}
                      {unsent === 0 ? "Everyone has been invited" : `Send to ${unsent} not yet invited`}
                    </Button>
                  )
                })()}
                <p className="text-sm italic text-muted-foreground">
                  Each guest gets an email confirming their seat, with the address, directions and an add-to-calendar
                  invite.
                </p>
              </div>
            )}

            {(progress || notice) && (
              <p
                role="status"
                className={`mt-4 text-sm ${notice?.tone === "error" && !progress ? "text-destructive" : "text-plum"}`}
              >
                {progress ?? notice?.text}
              </p>
            )}

            {state.guests.length === 0 ? (
              <p className="mt-10 border border-dashed border-mauve/40 py-12 text-center italic text-mauve">
                No one has registered yet.
              </p>
            ) : (
              <ol className="paper mt-10 divide-y divide-mauve/15 border border-mauve/25">
                {state.guests.map((g, i) => (
                  <li
                    key={`${g.email}-${i}`}
                    className="grid gap-1 px-5 py-4 sm:grid-cols-[2.5rem_minmax(0,14rem)_1fr_auto_10.5rem] sm:items-start sm:gap-6"
                  >
                    <span className="hidden text-sm tabular-nums text-mauve sm:block">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-lg text-plum">
                        {g.first_name} {g.last_name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{g.email}</p>
                    </div>
                    <p className="italic text-plum/80">“{g.wishes}”</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-mauve sm:pt-1.5 sm:text-right">
                      {registeredOn(g.created_at)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 sm:mt-0 sm:justify-end">
                      {g.invite_sent_at && (
                        <span className="flex items-center gap-1 text-xs text-mauve" title={new Date(g.invite_sent_at).toString()}>
                          <Check className="h-3.5 w-3.5" aria-hidden /> Sent {registeredOn(g.invite_sent_at)}
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant={g.invite_sent_at ? "ghost" : "outline"}
                        disabled={sending.size > 0}
                        onClick={() => send([g.email])}
                        className="gap-1.5 rounded-none border-mauve/50 bg-transparent text-plum hover:bg-blush/50"
                        aria-label={`${g.invite_sent_at ? "Resend" : "Send"} invitation to ${g.first_name} ${g.last_name}`}
                      >
                        {sending.has(g.email) ? <Loader2 className="animate-spin" /> : <Mail />}
                        {g.invite_sent_at ? "Resend" : "Send invitation"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
