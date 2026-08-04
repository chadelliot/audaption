import RevealText from "./RevealText";
import FadeIn from "./FadeIn";
import { outcomes } from "@/lib/content";

export default function Outcomes() {
  return (
    <section className="bg-obsidian px-6 py-28 text-paper lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-emerald">
          {outcomes.eyebrow}
        </p>
        <RevealText
          text={outcomes.heading}
          as="h2"
          className="font-display italic leading-tight text-paper text-3xl sm:text-4xl lg:text-5xl"
        />
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
        <FadeIn className="flex flex-col items-center justify-center rounded-2xl border border-obsidian-line bg-paper/[0.03] p-10 text-center">
          <span className="font-display text-6xl text-emerald sm:text-7xl">
            {outcomes.stat.value}
          </span>
          <span className="mt-4 max-w-xs text-paper/70">{outcomes.stat.label}</span>
        </FadeIn>

        <FadeIn delay={0.15} className="rounded-2xl border border-obsidian-line bg-paper/[0.03] p-10">
          <p className="font-display text-xl italic leading-relaxed text-paper/90">
            &ldquo;{outcomes.quote.text}&rdquo;
          </p>
          <div className="mt-6 border-t border-obsidian-line pt-6">
            <p className="text-sm font-medium text-paper">{outcomes.quote.name}</p>
            <p className="text-sm text-paper/50">{outcomes.quote.title}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
