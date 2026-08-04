"use client";

import Image from "next/image";

/*
  The header keeps the paper ground the whole way down. It used to fade in on
  scroll and pick up whatever sheet was behind it, which meant the one fixed
  element on the page was the least stable thing on it.
*/
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-sheet">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">
        <a href="#opening" className="block" aria-label="Audaption, home">
          <Image
            src="/audaption-logo.svg"
            alt="Audaption"
            width={5505}
            height={1062}
            className="h-[26px] w-auto sm:h-[30px]"
            priority
          />
        </a>

        <a
          href="#start"
          className="font-mono border border-[var(--line-ink-strong)] px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-slate transition-colors hover:border-jade hover:text-jade"
        >
          Chat with an expert
        </a>
      </div>
      <div className="h-px w-full bg-[var(--line-ink)]" />
    </header>
  );
}

export function SiteFooter() {
  return (
    // Continues the dark ground of sheet 07 rather than flipping back to paper
    // for a footer nobody asked to read.
    <footer className="sheet-dark border-t border-[var(--line)] px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Image
            src="/audaption-logo-light.svg"
            alt="Audaption"
            width={5505}
            height={1062}
            className="h-[30px] w-auto"
          />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-glass">
            Enterprise Growth Systems. We design and build the commercial system
            behind the role you&rsquo;re hiring for.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <a href="#start" className="annot hover:text-chalk!">
            Chat with an expert
          </a>
          <a href="/legacy" className="annot hover:text-chalk!">
            Previous site
          </a>
          <p className="annot text-glass-dim!">
            Enterprise Growth System
          </p>
        </div>
      </div>
    </footer>
  );
}
