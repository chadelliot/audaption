import { AssessmentProvider } from "@/lib/assessment";
import { SiteFooter, SiteHeader } from "@/components/site/Chrome";
import Opening from "@/components/scenes/Opening";
import S2Symptoms from "@/components/scenes/S2Symptoms";
import SystemParts from "@/components/scenes/SystemParts";
import Capabilities from "@/components/scenes/Capabilities";
import StartHere from "@/components/scenes/StartHere";

/*
  Four sections and a close.

  Two lists of four run through this page and they are not the same list. The
  opening names the layers every company already has; "what we build" shows
  what we do to each of them; "capabilities" shows the four things a client
  actually asks for, each assembled on top of all of it. Both middle sections
  say which of the two they are in their own intro copy, because a reader who
  hits eight named things in a row will otherwise assume they are one list.
*/
export default function Home() {
  return (
    <AssessmentProvider>
      <SiteHeader />
      <main>
        <Opening />
        <S2Symptoms />
        <SystemParts />
        <Capabilities />
        <StartHere />
      </main>
      <SiteFooter />
    </AssessmentProvider>
  );
}
