import RevealText from "./RevealText";
import FadeIn from "./FadeIn";
import { insights } from "@/lib/content";

export default function Insights() {
  return (
    <section id="insights" className="bg-paper px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-jade">
          {insights.eyebrow}
        </p>
        <RevealText
          text={insights.heading}
          as="h2"
          className="font-display italic leading-tight text-ink text-3xl sm:text-4xl lg:text-5xl"
        />
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 md:grid-cols-3">
        {insights.posts.map((post, i) => (
          <FadeIn key={post.title} delay={i * 0.1}>
            <a
              href="#"
              className="group flex h-full flex-col rounded-2xl border border-line bg-paper-alt/60 p-8 transition-colors duration-300 hover:border-jade hover:bg-paper"
            >
              <span className="font-mono text-xs uppercase tracking-wide text-jade">
                {post.tag}
              </span>
              <h3 className="mt-4 font-display text-xl leading-snug text-ink">
                {post.title}
              </h3>
              <p className="mt-4 flex-1 text-sm text-ink-soft">{post.teaser}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink transition-transform duration-300 group-hover:translate-x-1">
                Read More →
              </span>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
