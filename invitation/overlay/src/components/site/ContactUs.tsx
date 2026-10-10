// Showcase-only: "Contact us" section at the bottom of every sample event.
import { useState } from "react"
import { Mail, Send } from "lucide-react"
import { CONTACT_EMAIL, SHOWCASE_EVENTS, SLUG } from "@/lib/showcase"
import { SYSTEM_FONT } from "./ShowcaseBar"

const input =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[17px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/15"

export function ContactUs() {
  const [name, setName] = useState("")
  const [type, setType] = useState<string>(SHOWCASE_EVENTS.find((e) => e.slug === SLUG)?.label ?? "Birthday")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a short message.")
      return
    }
    setError("")
    const q = new URLSearchParams({
      subject: `${type} invitation inquiry from ${name.trim()}`,
      body: `${message.trim()}\n\nName: ${name.trim()}\nEvent: ${type}\nSeen on: ${location.href}`,
    })
    location.href = `mailto:${CONTACT_EMAIL}?${q.toString().replace(/\+/g, "%20")}`
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      style={{ fontFamily: SYSTEM_FONT }}
      className="scroll-mt-16 bg-[#f5f5f7] px-4 py-20 text-[#1d1d1f] sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[17px] font-semibold text-[#0071e3]">Contact us</p>
        <h2 id="contact-title" className="mt-2 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[48px]">
          Want an invitation like this?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[19px] font-medium leading-snug text-[#6e6e73] sm:text-[21px]">
          This is a sample site. Tell us about your birthday, wedding, graduation or christening and we'll make one for
          you, with registration, photo gallery and email confirmations.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Custom invitation inquiry")}`}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0071e3] px-6 text-[17px] font-medium text-white transition hover:bg-[#0077ed]"
        >
          <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
        </a>
      </div>

      <form
        onSubmit={submit}
        noValidate
        className="mx-auto mt-12 grid max-w-2xl gap-4 rounded-[22px] bg-white p-6 text-left shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.06)] sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[#6e6e73]">
            Your name
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#6e6e73]">
            Event
            <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
              {SHOWCASE_EVENTS.map((e) => (
                <option key={e.slug}>{e.label}</option>
              ))}
              <option>Something else</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-[#6e6e73]">
          Message
          <textarea
            className={`${input} min-h-28 resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            placeholder="Date, number of guests, the look you have in mind…"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d1d1f] px-6 text-[17px] font-medium text-white transition hover:bg-black"
          >
            <Send className="h-4 w-4" /> Send message
          </button>
          <p className="text-sm text-[#d70015]" role="alert">
            {error}
          </p>
        </div>
      </form>
    </section>
  )
}
