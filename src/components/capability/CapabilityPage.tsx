"use client";

/*
  One deep-dive page, from data.

  Every capability page is this component fed a different entry from
  lib/capabilities.ts, so they read as one family and a new one is a data entry
  rather than a build. It is a client component only because the exhibits are:
  the registry holds components, and a server component cannot reach into it.

  The anatomy is fixed on purpose — leaks, the exhibit, how we ensure the value,
  what you get, how it connects — and the third of those is the reason the pages
  exist. Everything else could be a service page; "how we ensure the value" is
  the argument that this is a method and not a menu.
*/

import Link from "next/link";
import { EXHIBITS } from "@/components/exhibits";
import { SiteFooter, SiteHeader } from "@/components/site/Chrome";
import { CAPABILITY } from "@/lib/capabilities";

export default function CapabilityPage({ slug }: { slug: string }) {
  const c = CAPABILITY[slug];
  if (!c) return null;

  return (
    <>
      <SiteHeader home={false} />
      <main>
        {/* ------------------------------------------------------------- hero */}
        <section className="sheet-tan px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-[1180px]">
            <nav aria-label="Breadcrumb" className="annot flex flex-wrap items-center gap-2">
              <Link href="/#approach" className="transition-colors hover:text-jade!">
                The approach
              </Link>
              <span aria-hidden>/</span>
              <Link href="/capabilities/" className="transition-colors hover:text-jade!">
                Deep dives
              </Link>
              <span aria-hidden>/</span>
              <span className="text-graphite">{c.title}</span>
            </nav>

            <p className="annot mt-10 text-jade-deep!">
              {c.layer} layer · extends “{c.chapter}” in the approach
            </p>
            <h1 className="font-display mt-4 max-w-[54rem] text-[clamp(2.1rem,4.6vw,3.7rem)] text-graphite">
              {c.claim}
            </h1>
            <p className="mt-6 max-w-[44rem] text-[1.12rem] leading-relaxed text-slate">{c.lede}</p>
          </div>
        </section>

        {/* ------------------------------------------------------------ leaks */}
        <section className="sheet-light px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[1180px]">
            <p className="annot">Where the value leaks</p>
            <h2 className="font-display mt-3 max-w-[40rem] text-[clamp(1.6rem,2.8vw,2.3rem)] text-graphite">
              Three ways it goes missing.
            </h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {c.leaks.map((l, i) => (
                <li key={l.k} className="border-t-2 border-jade bg-white px-6 pb-6 pt-5">
                  <span className="annot">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-display-mixed mt-2 text-[1.35rem] leading-tight text-graphite">{l.k}</p>
                  <p className="mt-3 text-[1rem] leading-relaxed text-slate">{l.v}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------------- exhibits */}
        <section className="sheet-card px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[1180px]">
            <p className="annot">The leak, shown</p>
            <p className="mt-3 max-w-[40rem] text-[1.05rem] leading-relaxed text-slate">
              {c.exhibitNote}
            </p>
            <div className="mt-10 space-y-14">
              {c.exhibits.map((id) => {
                const Exhibit = EXHIBITS[id];
                return (
                  <div key={id}>
                    <Exhibit />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- ensure */}
        <section className="sheet-light px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[1180px]">
            <p className="annot">How we ensure the value</p>
            <h2 className="font-display mt-3 max-w-[44rem] text-[clamp(1.6rem,2.8vw,2.3rem)] text-graphite">
              A baseline, a standing control, and proof.
            </h2>
            <p className="mt-4 max-w-[40rem] text-[1rem] leading-relaxed text-slate">
              The same three moves on every engagement, so a gain is a number against a starting
              point, held by a rule with an owner, and reported whether or not it flatters us.
            </p>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {c.ensure.map((e, i) => (
                <li key={e.k} className="border border-[var(--line-ink)] bg-white px-6 pb-6 pt-5">
                  <span className="font-display flex h-9 w-9 items-center justify-center bg-jade text-[1.1rem] text-white">
                    {i + 1}
                  </span>
                  <p className="font-display-mixed mt-4 text-[1.4rem] leading-tight text-graphite">{e.k}</p>
                  <p className="mt-2.5 text-[1rem] leading-relaxed text-slate">{e.v}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------------- gets */}
        <section className="sheet-card px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
            <div>
              <p className="annot">What you get</p>
              <h2 className="font-display mt-3 text-[clamp(1.6rem,2.8vw,2.3rem)] text-graphite">
                What we hand over.
              </h2>
            </div>
            <ul className="divide-y divide-[var(--line-ink)] border-y border-[var(--line-ink)]">
              {c.gets.map((g) => (
                <li key={g} className="flex gap-4 py-4">
                  <span aria-hidden className="mt-0.5 text-jade-deep">
                    ✓
                  </span>
                  <span className="text-[1.02rem] leading-snug text-graphite">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------- related */}
        <section className="sheet-light px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[1180px]">
            <p className="annot">How it connects</p>
            <h2 className="font-display mt-3 max-w-[40rem] text-[clamp(1.6rem,2.8vw,2.3rem)] text-graphite">
              No part of this works alone.
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.related.map((r) => {
                const x = CAPABILITY[r];
                if (!x) return null;
                return (
                  <Link
                    key={r}
                    href={`/capabilities/${x.slug}/`}
                    className="group flex flex-col border border-[var(--line-ink)] bg-white px-5 pb-5 pt-4 transition-colors hover:border-jade"
                  >
                    <span className="annot">{x.layer}</span>
                    <span className="font-display-mixed mt-2 text-[1.3rem] leading-tight text-graphite">
                      {x.title}
                    </span>
                    <span className="mt-2 text-[0.92rem] leading-snug text-slate">{x.claim}</span>
                    <span className="annot mt-auto pt-4 text-jade-deep! transition-transform group-hover:translate-x-1">
                      Read →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- cta */}
        <section className="sheet-dark px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="annot">Next</p>
              <h2 className="font-display mt-3 max-w-[36rem] text-[clamp(1.6rem,2.8vw,2.3rem)] text-chalk">
                Talk with us about {c.title}.
              </h2>
            </div>
            <Link
              href="/#start"
              className="font-mono self-start bg-jade px-6 py-3.5 text-[0.76rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-jade-deep sm:self-auto"
            >
              Chat with an expert →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter home={false} />
    </>
  );
}

