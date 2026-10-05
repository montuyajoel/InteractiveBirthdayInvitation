import { useState } from "react"
import { Loader2, Lock, LockOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  GuestListNotSetUpError,
  WrongPasswordError,
  fetchGuestList,
  registrationsConnected,
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
              <div className="flex items-center gap-4">
                <p className="text-lg italic text-plum">
                  {state.guests.length} {state.guests.length === 1 ? "guest has" : "guests have"} confirmed
                </p>
                <Button variant="ghost" onClick={lock} className="gap-2 rounded-none text-mauve hover:bg-blush/50">
                  <Lock /> Lock
                </Button>
              </div>
            </div>

            {state.guests.length === 0 ? (
              <p className="mt-10 border border-dashed border-mauve/40 py-12 text-center italic text-mauve">
                No one has registered yet.
              </p>
            ) : (
              <ol className="paper mt-10 divide-y divide-mauve/15 border border-mauve/25">
                {state.guests.map((g, i) => (
                  <li key={`${g.email}-${i}`} className="grid gap-1 px-5 py-4 sm:grid-cols-[2.5rem_minmax(0,14rem)_1fr_auto] sm:gap-6">
                    <span className="hidden text-sm tabular-nums text-mauve sm:block">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-lg text-plum">
                        {g.first_name} {g.last_name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{g.email}</p>
                    </div>
                    <p className="italic text-plum/80">“{g.wishes}”</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-mauve sm:text-right">
                      {registeredOn(g.created_at)}
                    </p>
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
