import { useState } from "react"
import { AlertCircle, Check, History, Loader2, Lock, LockOpen, Mail, Send, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  EmailNotConfiguredError,
  GuestListNotSetUpError,
  InviteLogNotSetUpError,
  SendFunctionError,
  SendingUnavailableError,
  WrongPasswordError,
  fetchGuestList,
  fetchInviteHistory,
  registrationsConnected,
  sendInvitations,
  type GuestListEntry,
  type InviteLogEntry,
} from "@/lib/registrations"
import { DEMO_PASSWORD } from "@/lib/showcase"
import { SectionTitle } from "./Decor"

type State =
  | { status: "locked"; error?: string }
  | { status: "checking" }
  | { status: "open"; guests: GuestListEntry[] }

const registeredOn = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
const sentOn = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })

type History =
  | { status: "closed" }
  | { status: "loading" }
  | { status: "open"; entries: InviteLogEntry[] }
  | { status: "error"; text: string }

/** Hosts-only list of everyone who registered, behind a password. */
export function GuestList() {
  const [expanded, setExpanded] = useState(false)
  const [password, setPassword] = useState("")
  const [state, setState] = useState<State>({ status: "locked" })
  // emails currently being sent, and the outcome of the last send
  const [sending, setSending] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null)
  const [history, setHistory] = useState<History>({ status: "closed" })

  async function loadHistory() {
    setHistory({ status: "loading" })
    try {
      setHistory({ status: "open", entries: await fetchInviteHistory(password) })
    } catch (err) {
      setHistory({
        status: "error",
        text:
          err instanceof InviteLogNotSetUpError
            ? "The send history isn't set up yet: run supabase/setup.sql in Supabase."
            : err instanceof WrongPasswordError
              ? "The password was rejected. Lock and unlock again."
              : "Couldn't load the send history. Please try again.",
      })
    }
  }

  async function send(emails: string[]) {
    if (emails.length === 0 || state.status !== "open") return
    setNotice(null)
    setSending(new Set(emails))
    setProgress(emails.length > 1 ? `Sending 0 of ${emails.length}…` : null)
    try {
      const { sent, failed, errors } = await sendInvitations(password, emails, (done, total) =>
        setProgress(total > 1 ? `Sending ${done} of ${total}…` : null),
      )
      const now = new Date().toISOString()
      const sentSet = new Set(sent)
      const failedSet = new Set(failed)
      setState((st) =>
        st.status === "open"
          ? {
              ...st,
              guests: st.guests.map((g) => {
                const key = g.email.toLowerCase()
                if (sentSet.has(key))
                  return {
                    ...g,
                    invite_sent_at: now,
                    invite_count: (g.invite_count ?? (g.invite_sent_at ? 1 : 0)) + 1,
                    last_invite_status: "sent",
                    last_invite_error: null,
                    last_invite_at: now,
                  }
                if (failedSet.has(key))
                  return { ...g, last_invite_status: "failed", last_invite_error: errors[key] ?? null, last_invite_at: now }
                return g
              }),
            }
          : st,
      )
      if (history.status === "open") loadHistory()
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
            ? "Sending only works on the live site (Vercel), not on this computer's preview."
            : err instanceof SendFunctionError
              ? err.status === 404
                ? "The email function isn't deployed (404). Check that Vercel's Root Directory is \"invitation\" and redeploy."
                : `The email function failed (${err.status || "no response"}). Check Vercel → Logs for /api/send-invitations.`
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
    setHistory({ status: "closed" })
    setExpanded(false)
  }

  return (
    <section id="guests" aria-label="Guest list" className="relative border-t border-brand/20 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {!expanded ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" aria-hidden /> For the hosts
            </p>
            <Button
              variant="outline"
              onClick={() => setExpanded(true)}
              className="gap-2 rounded-none border-brand/50 bg-transparent uppercase tracking-[0.18em] text-ink hover:bg-soft/60"
            >
              <Users /> See who's coming
            </Button>
          </div>
        ) : state.status !== "open" ? (
          <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end">
            <SectionTitle eyebrow="For the hosts" title="Guest list" />
            {registrationsConnected || DEMO_PASSWORD ? (
              <form onSubmit={unlock} className="paper border border-brand/25 p-5 sm:p-6">
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
                    className="rounded-none border-0 border-b border-brand/40 bg-transparent px-0 text-lg shadow-none focus-visible:border-brand focus-visible:ring-0"
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
                {!registrationsConnected && (
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    Sample site: the password is <strong className="not-italic text-ink">{DEMO_PASSWORD}</strong>. Sends to
                    the made-up guests are simulated; your own registration gets a real sample email.
                  </p>
                )}
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
                <p className="text-lg italic text-ink">
                  {state.guests.length} {state.guests.length === 1 ? "guest has" : "guests have"} confirmed
                  {state.guests.length > 0 && (
                    <span className="text-brand">
                      {" "}· {state.guests.filter((g) => g.invite_sent_at).length} invited
                    </span>
                  )}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => (history.status === "closed" ? loadHistory() : setHistory({ status: "closed" }))}
                  className="gap-2 rounded-none text-brand hover:bg-highlight/50"
                  aria-expanded={history.status !== "closed"}
                >
                  <History /> {history.status === "closed" ? "Send history" : "Hide history"}
                </Button>
                <Button variant="ghost" onClick={lock} className="gap-2 rounded-none text-brand hover:bg-highlight/50">
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
                className={`mt-4 text-sm ${notice?.tone === "error" && !progress ? "text-destructive" : "text-ink"}`}
              >
                {progress ?? notice?.text}
              </p>
            )}

            {history.status !== "closed" && <SendHistory history={history} />}

            {state.guests.length === 0 ? (
              <p className="mt-10 border border-dashed border-brand/40 py-12 text-center italic text-brand">
                No one has registered yet.
              </p>
            ) : (
              <ol className="paper mt-10 divide-y divide-brand/15 border border-brand/25">
                {state.guests.map((g, i) => (
                  <li
                    key={`${g.email}-${i}`}
                    className="grid gap-1 px-5 py-4 sm:grid-cols-[2.5rem_minmax(0,14rem)_1fr_auto_auto] sm:items-start sm:gap-6"
                  >
                    <span className="hidden text-sm tabular-nums text-brand sm:block">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-lg text-ink">
                        {g.first_name} {g.last_name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{g.email}</p>
                    </div>
                    <p className="italic text-ink/80">“{g.wishes}”</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-brand sm:pt-1.5 sm:text-right">
                      {registeredOn(g.created_at)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 sm:mt-0 sm:justify-end">
                      {g.last_invite_status === "failed" && g.last_invite_at ? (
                        <span
                          className="flex items-center gap-1 whitespace-nowrap text-xs text-destructive"
                          title={g.last_invite_error ?? undefined}
                        >
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden /> Failed {registeredOn(g.last_invite_at)}
                        </span>
                      ) : (
                        g.invite_sent_at && (
                          <span className="flex items-center gap-1 whitespace-nowrap text-xs text-brand" title={new Date(g.invite_sent_at).toString()}>
                            <Check className="h-3.5 w-3.5" aria-hidden /> Sent {registeredOn(g.invite_sent_at)}
                            {(g.invite_count ?? 0) > 1 && <span className="text-muted-foreground"> · {g.invite_count}×</span>}
                          </span>
                        )
                      )}
                      <Button
                        size="sm"
                        variant={g.invite_sent_at ? "ghost" : "outline"}
                        disabled={sending.size > 0}
                        onClick={() => send([g.email])}
                        className="gap-1.5 rounded-none border-brand/50 bg-transparent text-ink hover:bg-highlight/50"
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

/** Every send attempt, newest first, from the invite_log table. */
function SendHistory({ history }: { history: History }) {
  return (
    <div className="paper mt-8 border border-brand/25 p-5 sm:p-6" aria-live="polite">
      <p className="eyebrow flex items-center gap-2">
        <History className="h-3.5 w-3.5" aria-hidden /> Send history
      </p>
      {history.status === "loading" ? (
        <p className="mt-4 flex items-center gap-2 text-sm italic text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
        </p>
      ) : history.status === "error" ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {history.text}
        </p>
      ) : history.status === "open" && history.entries.length === 0 ? (
        <p className="mt-4 text-sm italic text-muted-foreground">No invitations have been sent yet.</p>
      ) : history.status === "open" ? (
        <ol className="mt-4 max-h-80 divide-y divide-brand/10 overflow-y-auto text-sm">
          {history.entries.map((e, i) => (
            <li key={`${e.sent_at}-${e.email}-${i}`} className="grid gap-x-4 gap-y-0.5 py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)_auto]">
              <span className="tabular-nums text-muted-foreground">{sentOn(e.sent_at)}</span>
              <span className="min-w-0">
                <span className="text-ink">{e.guest_name || e.email}</span>
                {e.guest_name && <span className="ml-2 break-all text-muted-foreground">{e.email}</span>}
                {e.error && <span className="block text-xs text-destructive">{e.error}</span>}
              </span>
              <span
                className={`flex items-center gap-1 text-xs uppercase tracking-[0.18em] ${e.status === "sent" ? "text-brand" : "text-destructive"}`}
              >
                {e.status === "sent" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <AlertCircle className="h-3.5 w-3.5" aria-hidden />}
                {e.status}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
