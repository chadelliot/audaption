import RevealText from "./RevealText";
import FadeIn from "./FadeIn";
import { solutions } from "@/lib/content";

export default function Solutions() {
  return (
    <section id="solutions" className="bg-paper px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-jade">
          {solutions.eyebrow}
        </p>
        <RevealText
          text={solutions.heading}
          as="h2"
          className="font-display italic leading-tight text-ink text-3xl sm:text-4xl lg:text-5xl"
        />
        <p className="mt-6 text-lg text-ink-soft">{solutions.body}</p>
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {solutions.categories.map((category, i) => (
          <FadeIn key={category} delay={i * 0.06}>
            <div className="group flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-paper-alt/60 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-jade hover:bg-paper">
              <span className="h-2 w-2 rounded-full bg-jade transition-transform duration-300 group-hover:scale-150" />
              <span className="text-sm font-medium text-ink">{category}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
