import { Toaster } from "@/components/ui/sonner"
import { Countdown } from "@/components/site/Countdown"
import { Directions } from "@/components/site/Directions"
import { Footer } from "@/components/site/Footer"
import { Gallery } from "@/components/site/Gallery"
import { GuestList } from "@/components/site/GuestList"
import { Header } from "@/components/site/Header"
import { Hero } from "@/components/site/Hero"
import { PhotosPage } from "@/components/site/PhotosPage"
import { Rsvp } from "@/components/site/Rsvp"
import { ShareCard } from "@/components/site/ShareCard"
import { useRoute } from "@/lib/route"
import { PAGE_OPTIONS } from "@/config"

export default function App() {
  const route = useRoute()

  if (route === "share-card") return <ShareCard />

  return (
    <>
      <Header route={route} />
      {route === "photos" && PAGE_OPTIONS.gallery ? (
        <PhotosPage />
      ) : (
        <main>
          <Hero />
          <Countdown />
          <Rsvp />
          {PAGE_OPTIONS.gallery && <Gallery />}
          <Directions />
          <GuestList />
        </main>
      )}
      <Footer />
      <Toaster position="top-center" />
    </>
  )
}
