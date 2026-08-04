import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import Outcomes from "@/components/Outcomes";
import HowItWorks from "@/components/HowItWorks";
import Solutions from "@/components/Solutions";
import Insights from "@/components/Insights";
import ClosingCta from "@/components/ClosingCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WhatWeDo />
        <Outcomes />
        <HowItWorks />
        <Solutions />
        <Insights />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
