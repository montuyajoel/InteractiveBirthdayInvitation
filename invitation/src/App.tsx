import { Toaster } from "@/components/ui/sonner"
import { ArtDefs } from "@/components/site/Embroidery"
import { Celebrate, DayAfter, DressCode, Gifts, Invitation, OurStory, Timeline, Welcome } from "@/components/site/Wedding"
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

export default function App() {
  const route = useRoute()

  if (route === "share-card")
    return (
      <>
        <ArtDefs />
        <ShareCard />
      </>
    )

  return (
    <>
      <ArtDefs />
      <Header route={route} />
      {route === "photos" ? (
        <PhotosPage />
      ) : (
        <main>
          <Hero />
          <Welcome />
          <Countdown />
          <Invitation />
          <Celebrate />
          <DressCode />
          <OurStory />
          <Timeline />
          <DayAfter />
          <Gifts />
          <Rsvp />
          <Gallery />
          <Directions />
          <GuestList />
        </main>
      )}
      <Footer />
      <Toaster position="top-center" />
    </>
  )
}
