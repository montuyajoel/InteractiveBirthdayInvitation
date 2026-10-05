import { Toaster } from "@/components/ui/sonner"
import { Countdown } from "@/components/site/Countdown"
import { Directions } from "@/components/site/Directions"
import { Footer } from "@/components/site/Footer"
import { Gallery } from "@/components/site/Gallery"
import { Header } from "@/components/site/Header"
import { Hero } from "@/components/site/Hero"
import { Rsvp } from "@/components/site/Rsvp"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Countdown />
        <Rsvp />
        <Gallery />
        <Directions />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </>
  )
}
