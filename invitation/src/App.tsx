import { Toaster } from "@/components/ui/sonner"
import { Countdown } from "@/components/site/Countdown"
import { Directions } from "@/components/site/Directions"
import { Footer } from "@/components/site/Footer"
import { GlitterField } from "@/components/site/Decor"
import { Gallery } from "@/components/site/Gallery"
import { GuestList } from "@/components/site/GuestList"
import { Header } from "@/components/site/Header"
import { Milestones } from "@/components/site/Milestones"
import { Hero } from "@/components/site/Hero"
import { PhotosPage } from "@/components/site/PhotosPage"
import { Rsvp } from "@/components/site/Rsvp"
import { useRoute } from "@/lib/route"

export default function App() {
  const route = useRoute()

  return (
    <>
      <GlitterField />
      <Header route={route} />
      {route === "photos" ? (
        <div className="relative z-[1]">
          <PhotosPage />
        </div>
      ) : (
        <main className="relative z-[1]">
          <Hero />
          <Countdown />
          <Milestones />
          <Rsvp />
          <Gallery />
          <Directions />
          <GuestList />
        </main>
      )}
      <div className="relative z-[1]">
        <Footer />
      </div>
      <Toaster position="top-center" />
    </>
  )
}
