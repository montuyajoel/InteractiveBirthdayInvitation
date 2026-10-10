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
import { ContactUs } from "@/components/site/ContactUs"
import { ShowcaseBar } from "@/components/site/ShowcaseBar"

export default function App() {
  const route = useRoute()

  if (route === "share-card") return <ShareCard />

  return (
    <>
      <Header route={route} />
      {route === "photos" ? (
        <PhotosPage />
      ) : (
        <main>
          <Hero />
          <Countdown />
          <Rsvp />
          <Gallery />
          <Directions />
          <GuestList />
        </main>
      )}
      <ContactUs />
      <Footer />
      <ShowcaseBar />
      <Toaster position="top-center" />
    </>
  )
}
