import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/Chrome";
import { CAPABILITIES, LAYERS } from "@/lib/capabilities";

export const metadata: Metadata = {
  title: "Deep dives | Audaption",
  description:
    "Go deeper on any part of the go-to-market strategy: data, journey, experience and strategy, and how we ensure the value of each.",
};

/*
  The index of deep dives, grouped by the four layers the opening names. The
  same four, in the same order, so the way into a page is the way the approach
  is built.
*/
export default function Capabilities() {
  return (
    <>
      <SiteHeader home={false} />
      <main>
        <section className="sheet-tan px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-[1180px]">
            <nav aria-label="Breadcrumb" className="annot flex items-center gap-2">
              <Link href="/#approach" className="transition-colors hover:text-jade!">
                The approach
              </Link>
              <span aria-hidden>/</span>
              <span className="text-graphite">Deep dives</span>
            </nav>
            <h1 className="font-display mt-10 max-w-[48rem] text-[clamp(2.1rem,4.6vw,3.7rem)] text-graphite">
              Go deeper on any part of the strategy.
            </h1>
            <p className="mt-6 max-w-[44rem] text-[1.12rem] leading-relaxed text-slate">
              Each page takes one part of the go-to-market strategy, shows where its value leaks,
              and sets out how we make sure it is held: a baseline, a standing control, and proof.
            </p>
          </div>
        </section>

        {LAYERS.map((layer, li) => {
          const pages = CAPABILITIES.filter((c) => c.layer === layer.id);
          return (
            <section
              key={layer.id}
              className={`${li % 2 ? "sheet-card" : "sheet-light"} px-5 py-14 sm:px-8 sm:py-16`}
            >
              <div className="mx-auto max-w-[1180px]">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <h2 className="font-display text-[clamp(1.6rem,2.8vw,2.3rem)] text-graphite">
                    {layer.id}
                  </h2>
                  <p className="text-[1rem] text-slate">{layer.line}</p>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/capabilities/${p.slug}/`}
                      className="group flex flex-col border border-[var(--line-ink)] bg-white px-6 pb-5 pt-5 transition-colors hover:border-jade"
                    >
                      <span className="font-display-mixed text-[1.4rem] leading-tight text-graphite">
                        {p.title}
                      </span>
                      <span className="mt-2 text-[0.98rem] leading-snug text-slate">{p.claim}</span>
                      <span className="annot mt-auto pt-5 text-jade-deep! transition-transform group-hover:translate-x-1">
                        Read →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter home={false} />
    </>
  );
}
