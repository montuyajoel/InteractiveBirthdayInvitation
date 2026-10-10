import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { COPY, fill } from "@/lib/copy"
import {
  AlreadyRegisteredError,
  registrationsConnected,
  submitRegistration,
  type Registration,
} from "@/lib/registrations"
import { BabysBreath, Butterfly, Heart, HeartRule, SectionTitle } from "./Decor"
import { PhotoUpload } from "./PhotoUpload"
import { SampleEmail } from "./SampleEmail"
import { rememberGuest, rememberedGuest } from "@/lib/guest"
import { eventDateLabel, eventTimeLabel } from "./Hero"
import { hasSchedule, stops } from "@/lib/event"

const WISH_MAX = 500
const schema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  email: z.string().trim().email("Please enter a valid email address"),
  wishes: z
    .string()
    .trim()
    .min(1, fill(COPY.wishRequired))
    .max(WISH_MAX, `Please keep it under ${WISH_MAX} characters`),
})

const fieldClass =
  "rounded-none border-0 border-b border-brand/40 bg-transparent px-0 text-lg shadow-none focus-visible:border-brand focus-visible:ring-0"

export function Rsvp() {
  const [done, setDone] = useState<Registration | null>(rememberedGuest)
  const form = useForm<Registration>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", wishes: "" },
  })
  const wishLength = form.watch("wishes").length

  async function onSubmit(values: Registration) {
    try {
      await submitRegistration(values)
      rememberGuest(values)
      setDone(values)
    } catch (err) {
      if (err instanceof AlreadyRegisteredError) {
        form.setError("email", { message: "This email is already registered. See you there!" })
      } else {
        toast.error("Sorry, we couldn't save your registration. Please try again in a moment.")
      }
    }
  }

  return (
    <section id="rsvp" className="relative scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="relative">
          <SectionTitle eyebrow={fill(COPY.rsvpEyebrow)} title={fill(COPY.rsvpTitle)} />
          <p className="mt-6 max-w-sm text-xl italic leading-relaxed text-ink/90">
            {fill(COPY.rsvpIntro)}
          </p>
          <ul className="mt-8 space-y-2 text-sm uppercase tracking-[0.2em] text-brand">
            <li>{eventDateLabel}</li>
            {hasSchedule ? (
              stops.map((s) => (
                <li key={s.venue}>
                  {s.label} · {s.time}
                  <span className="block text-ink/80">{s.venue}</span>
                </li>
              ))
            ) : (
              <>
                <li>{eventTimeLabel}</li>
                <li>{stops[0].venue}</li>
              </>
            )}
          </ul>
          <BabysBreath className="pointer-events-none mt-10 hidden w-44 md:block" />
        </div>

        <div className="relative">
          <div className="paper relative border border-brand/25 p-6 shadow-[0_30px_60px_-40px_rgb(var(--c-ink)/0.6)] sm:p-10">
            {/* folded corner */}
            <span
              className="absolute right-0 top-0 h-10 w-10 bg-soft"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              aria-hidden
            />
            {done ? (
              <ThankYou
                r={done}
                onAnother={() => {
                  rememberGuest(null)
                  form.reset()
                  setDone(null)
                }}
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-7" noValidate>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="eyebrow text-[0.7rem]">First name</FormLabel>
                          <FormControl>
                            <Input autoComplete="given-name" className={fieldClass} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="eyebrow text-[0.7rem]">Last name</FormLabel>
                          <FormControl>
                            <Input autoComplete="family-name" className={fieldClass} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="eyebrow text-[0.7rem]">Email</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" className={fieldClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wishes"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="eyebrow text-[0.7rem]">{fill(COPY.wishLabel)}</FormLabel>
                          <span
                            className={`text-xs tabular-nums ${wishLength > WISH_MAX ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {wishLength}/{WISH_MAX}
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder={fill(COPY.wishPlaceholder)}
                            className="resize-none rounded-none border-brand/40 bg-white/60 text-lg italic placeholder:text-brand/50 focus-visible:ring-brand/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={form.formState.isSubmitting}
                      className="rounded-none px-10 uppercase tracking-[0.2em]"
                    >
                      {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Heart className="text-white" filled />}
                      Count me in
                    </Button>
                    {!registrationsConnected && (
                      <p className="text-xs italic text-muted-foreground">
                        Sample site: registrations are saved in this browser only.
                      </p>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ThankYou({ r, onAnother }: { r: Registration; onAnother: () => void }) {
  return (
    <div className="relative py-6 text-center" role="status">
      <HeartBurst />
      <Butterfly className="mx-auto h-12 w-14" />
      <p className="script mt-2 text-6xl">Thank you, {r.firstName}!</p>
      <HeartRule className="mt-4 justify-center" />
      <p className="mx-auto mt-6 max-w-md text-xl italic text-ink/90">
        {fill(COPY.thankYou)}
      </p>
      <blockquote className="mx-auto mt-8 max-w-md border-l-2 border-brand/50 pl-4 text-left italic text-brand">
        “{r.wishes}”
      </blockquote>
      {COPY.surprise && (
        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-brand">{fill(COPY.surpriseReminder)}</p>
      )}
      <SampleEmail guest={r} />
      <PhotoUpload guestName={`${r.firstName} ${r.lastName}`} className="mt-10 border-t border-brand/20 pt-8" />
      <Button variant="link" className="mt-6 text-brand" onClick={onAnother}>
        Register another guest
      </Button>
    </div>
  )
}

/** A short burst of floating hearts when someone registers. */
function HeartBurst() {
  const hearts = Array.from({ length: 14 }, (_, i) => ({
    left: 8 + ((i * 37) % 84),
    dx: ((i * 53) % 80) - 40,
    rot: ((i * 71) % 60) - 30,
    delay: (i % 7) * 0.12,
    size: 14 + ((i * 7) % 14),
  }))
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-visible" aria-hidden>
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-float-up opacity-0"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            ["--dx" as string]: `${h.dx}px`,
            ["--rot" as string]: `${h.rot}deg`,
          }}
        >
          <Heart className="text-brand" filled style={{ width: h.size, height: h.size }} />
        </span>
      ))}
    </div>
  )
}
