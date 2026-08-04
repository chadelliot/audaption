import RevealText from "./RevealText";
import FadeIn from "./FadeIn";
import { closingCta } from "@/lib/content";

export default function ClosingCta() {
  return (
    <section id="contact" className="bg-obsidian px-6 py-28 text-center lg:px-10">
      <div className="mx-auto max-w-5xl">
        <RevealText
          text={closingCta.heading}
          as="h2"
          className="font-display italic leading-tight text-paper text-3xl sm:text-4xl lg:text-6xl"
        />
        <FadeIn delay={0.2} className="mt-10 flex justify-center">
          <a
            href="mailto:hello@audaption.com"
            className="rounded-full bg-emerald px-8 py-4 font-mono text-sm text-obsidian transition-colors hover:bg-paper"
          >
            {closingCta.cta} →
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
