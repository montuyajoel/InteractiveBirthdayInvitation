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
import { EVENT } from "@/config"
import { AlreadyRegisteredError, submitRegistration, type Registration } from "@/lib/registrations"
import { supabaseConfigured } from "@/lib/supabase"
import { BabysBreath, Butterfly, Heart, HeartRule, SectionTitle } from "./Decor"
import { eventDateLabel, eventTimeLabel } from "./Hero"

const WISH_MAX = 500

const schema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  email: z.string().trim().email("Please enter a valid email address"),
  wishes: z
    .string()
    .trim()
    .min(1, `Leave a little wish for ${EVENT.celebrant.split(" ")[0]}`)
    .max(WISH_MAX, `Please keep it under ${WISH_MAX} characters`),
})

const fieldClass =
  "rounded-none border-0 border-b border-mauve/40 bg-transparent px-0 text-lg shadow-none focus-visible:border-mauve focus-visible:ring-0"

export function Rsvp() {
  const [done, setDone] = useState<Registration | null>(null)
  const form = useForm<Registration>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", wishes: "" },
  })
  const wishLength = form.watch("wishes").length

  async function onSubmit(values: Registration) {
    try {
      await submitRegistration(values)
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
          <SectionTitle eyebrow="Kindly register" title="Save your seat" />
          <p className="mt-6 max-w-sm text-xl italic leading-relaxed text-plum/90">
            Let us know you're coming so we can plan the surprise. Leave a birthday wish for{" "}
            {EVENT.celebrant.split(" ")[0]} too: we'll gather them all for her.
          </p>
          <ul className="mt-8 space-y-2 text-sm uppercase tracking-[0.2em] text-mauve">
            <li>{eventDateLabel}</li>
            <li>{eventTimeLabel}</li>
            <li>{EVENT.venue}</li>
          </ul>
          <BabysBreath className="pointer-events-none mt-10 hidden w-28 md:block" />
        </div>

        <div className="relative">
          <div className="paper relative border border-mauve/25 p-6 shadow-[0_30px_60px_-40px_rgb(92_58_99/0.6)] sm:p-10">
            {/* folded corner */}
            <span
              className="absolute right-0 top-0 h-10 w-10 bg-lilac"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              aria-hidden
            />
            {done ? (
              <ThankYou r={done} onAnother={() => { form.reset(); setDone(null) }} />
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
                          <FormLabel className="eyebrow text-[0.7rem]">Birthday wishes</FormLabel>
                          <span
                            className={`text-xs tabular-nums ${wishLength > WISH_MAX ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {wishLength}/{WISH_MAX}
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder={`Dear ${EVENT.celebrant.split(" ")[0]}, happy sweet sixteen…`}
                            className="resize-none rounded-none border-mauve/40 bg-white/60 text-lg italic placeholder:text-mauve/50 focus-visible:ring-mauve/40"
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
                    {!supabaseConfigured && (
                      <p className="text-xs italic text-muted-foreground">
                        Preview mode: registrations are saved in this browser only.
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
      <p className="mx-auto mt-6 max-w-md text-xl italic text-plum/90">
        You're on the list. We can't wait to celebrate with you on {eventDateLabel}.
      </p>
      <blockquote className="mx-auto mt-8 max-w-md border-l-2 border-mauve/50 pl-4 text-left italic text-mauve">
        “{r.wishes}”
      </blockquote>
      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-mauve">Remember: not a word to {EVENT.celebrant.split(" ")[0]}!</p>
      <Button variant="link" className="mt-4 text-mauve" onClick={onAnother}>
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
          <Heart className="text-mauve" filled style={{ width: h.size, height: h.size }} />
        </span>
      ))}
    </div>
  )
}
