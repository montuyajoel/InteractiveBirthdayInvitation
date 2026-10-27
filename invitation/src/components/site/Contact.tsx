import { useState } from "react"
import { Check, Link, Mail, MessageCircle, MessageSquare, Phone, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONTACT, type ContactPerson } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { eventTitle } from "@/lib/event"
import { SectionTitle } from "./Decor"

const digits = (phone: string) => phone.replace(/[^\d+]/g, "")

const messengerUrl = (m: string) => (/^https?:\/\//.test(m) ? m : `https://m.me/${m.replace(/^@/, "")}`)

/** The "f" mark, drawn inline (lucide has no brand icons). */
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="fill-current">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z" />
    </svg>
  )
}

function ContactCard({ person }: { person: ContactPerson }) {
  const links = [
    person.phone && { href: `tel:${digits(person.phone)}`, label: "Call", icon: <Phone /> },
    person.phone && { href: `sms:${digits(person.phone)}`, label: "Text", icon: <MessageSquare /> },
    person.viber && { href: `viber://chat?number=${encodeURIComponent(digits(person.viber))}`, label: "Viber", icon: <MessageCircle /> },
    person.messenger && { href: messengerUrl(person.messenger), label: "Messenger", icon: <MessageCircle />, external: true },
    person.email && { href: `mailto:${person.email}`, label: "Email", icon: <Mail /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; external?: boolean }[]

  return (
    <li className="paper border border-brand/25 p-5 sm:p-6">
      {person.role && <p className="eyebrow">{person.role}</p>}
      <p className="mt-1 text-2xl font-semibold text-ink">{person.name}</p>
      {person.phone && <p className="mt-1 tabular-nums tracking-wider text-ink/80">{person.phone}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <Button
            key={l.label}
            asChild
            size="sm"
            variant="outline"
            className="gap-2 rounded-none border-brand/50 bg-transparent uppercase tracking-[0.15em] text-ink hover:bg-white/10"
          >
            <a href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
              {l.icon} {l.label}
            </a>
          </Button>
        ))}
      </div>
    </li>
  )
}

/** Share the invitation: the phone's share sheet when there is one, else copy the link. */
function ShareInvite() {
  const [copied, setCopied] = useState(false)
  const url = typeof window === "undefined" ? "" : window.location.href.split("#")[0]
  const canShare = typeof navigator !== "undefined" && "share" in navigator

  async function share() {
    try {
      if (canShare) {
        await navigator.share({ title: eventTitle, text: fill(COPY.metaDescription), url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // share sheet dismissed or clipboard blocked; nothing else to do
    }
  }

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3">
      <p className="eyebrow mr-2 w-full sm:w-auto">Spread the word</p>
      <Button size="lg" onClick={share} className="gap-3 rounded-none uppercase tracking-[0.18em]">
        {copied ? <Check /> : canShare ? <Share2 /> : <Link />}
        {copied ? "Link copied!" : "Share invitation"}
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="gap-3 rounded-none border-brand/50 bg-transparent uppercase tracking-[0.18em] text-ink hover:bg-white/10"
      >
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
          <FacebookIcon /> Share on Facebook
        </a>
      </Button>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-16 border-t border-brand/20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {CONTACT.people.length > 0 && (
          <>
            <SectionTitle eyebrow={CONTACT.eyebrow} title={CONTACT.title} />
            <p className="mt-4 max-w-xl text-lg italic text-ink/90">{fill(CONTACT.intro)}</p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {CONTACT.people.map((p) => (
                <ContactCard key={p.name} person={p} />
              ))}
            </ul>
          </>
        )}
        <ShareInvite />
      </div>
    </section>
  )
}
