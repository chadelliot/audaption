import { AssessmentProvider } from "@/lib/assessment";
import { SiteFooter, SiteHeader } from "@/components/site/Chrome";
import Opening from "@/components/scenes/Opening";
import Deck from "@/components/deck/Deck";
import StartHere from "@/components/scenes/StartHere";

/*
  A cold open, the approach, and a close.

  The opening is the one scroll-driven drawing on the page: four layers that
  start out of line and set into one stack. After it, the approach is a deck of
  decisions read one screen at a time (see components/deck/Deck.tsx), each with
  its own drawing sized to fit the stage it is in. The page used to be a long
  run of pinned scenes, each of which let its drawing grow past the viewport.
*/
export default function Home() {
  return (
    <AssessmentProvider>
      <SiteHeader />
      <main>
        <Opening />
        <Deck />
        <StartHere />
      </main>
      <SiteFooter />
    </AssessmentProvider>
  );
}
