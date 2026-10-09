import { EVENT } from "@/config"
import { icsContent } from "@/lib/event"

export { googleCalendarUrl } from "@/lib/event"

export function downloadIcs() {
  const url = URL.createObjectURL(new Blob([icsContent()], { type: "text/calendar" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `${EVENT.id}-invitation.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
