import RevealText from "./RevealText";
import FadeIn from "./FadeIn";
import { whatWeDo } from "@/lib/content";

export default function WhatWeDo() {
  return (
    <section id="system" className="bg-paper px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-jade">
          {whatWeDo.eyebrow}
        </p>
        <RevealText
          text={whatWeDo.heading}
          as="h2"
          className="font-display italic leading-tight text-ink text-3xl sm:text-4xl lg:text-5xl"
        />
        <FadeIn delay={0.15}>
          <p className="mt-6 text-lg text-ink-soft">{whatWeDo.body}</p>
        </FadeIn>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-3">
        {whatWeDo.pillars.map((pillar, i) => (
          <FadeIn key={pillar.title} delay={i * 0.12}>
            <div className="group h-full rounded-2xl border border-line bg-paper-alt/60 p-8 transition-colors duration-300 hover:border-jade hover:bg-paper">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-ink-soft/60">
                  Ref. {pillar.tag}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-jade transition-transform duration-300 group-hover:scale-150" />
              </div>
              <h3 className="font-display text-xl text-ink">{pillar.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{pillar.description}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {pillar.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
