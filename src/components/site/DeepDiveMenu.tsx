"use client";

/*
  The deep-dive menu.

  A panel that drops from the header with every page in it, grouped by the four
  layers the opening names, and a live preview on the right of whichever one the
  reader is pointing at. The preview is the page's own exhibit, scaled down and
  built in as it appears, so the menu shows what a page is about instead of
  describing it.

  The panel is a child of the header and positions against it, so it is exactly
  as wide as the header and always sits flush underneath it. Because the panel is
  a descendant of the element that listens for the pointer, moving from the
  button down into the panel never counts as leaving it; a short delay forgives
  the few pixels of header between them.

  It opens on hover, on click and on keyboard focus, closes on Escape, on a click
  elsewhere and on choosing a page, and is a disclosure of real links throughout,
  so it works without the preview. On a phone it is the same list without the
  preview, scrolling inside the panel.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EXHIBITS } from "@/components/exhibits";
import { Thumb } from "@/components/exhibits/ui";
import { CAPABILITIES, CAPABILITY, LAYERS } from "@/lib/capabilities";

export default function DeepDiveMenu() {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState(CAPABILITIES[0].slug);
  const timer = useRef<number | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(true);
  }, []);
  const hideSoon = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 220);
  }, []);
  const hideNow = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hideNow();
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) hideNow();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open, hideNow]);

  const current = CAPABILITY[slug];
  const Preview = current ? EXHIBITS[current.exhibits[0]] : null;

  return (
    <div ref={root} onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="deep-dive-menu"
        onClick={() => (open ? hideNow() : show())}
        className="font-mono flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-slate transition-colors hover:text-jade aria-expanded:text-jade"
      >
        Deep dives
        <span
          aria-hidden
          className="inline-block text-[0.6rem] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          id="deep-dive-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-3.6rem)] overflow-y-auto border-b border-[var(--line-ink-strong)] bg-sheet shadow-[0_28px_48px_-24px_rgba(38,38,38,0.35)]"
        >
          <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
            {/* every page, by layer */}
            <div>
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {LAYERS.map((layer) => (
                  <div key={layer.id}>
                    <p className="annot text-jade-deep!">{layer.id}</p>
                    <p className="mt-0.5 text-[0.78rem] text-mute">{layer.line}</p>
                    <ul className="mt-2.5">
                      {CAPABILITIES.filter((c) => c.layer === layer.id).map((c) => {
                        const on = c.slug === slug;
                        return (
                          <li key={c.slug}>
                            <Link
                              href={`/capabilities/${c.slug}/`}
                              onClick={hideNow}
                              onMouseEnter={() => setSlug(c.slug)}
                              onFocus={() => setSlug(c.slug)}
                              className="block border-l-2 px-3 py-2 transition-colors"
                              style={{
                                borderColor: on ? "var(--color-jade)" : "var(--line-ink)",
                                background: on ? "rgba(41,165,135,0.08)" : "transparent",
                              }}
                            >
                              <span className="font-display-mixed block text-[1.12rem] leading-tight text-graphite">
                                {c.title}
                              </span>
                              <span className="mt-0.5 block text-[0.82rem] leading-snug text-slate">
                                {c.claim}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
              <Link
                href="/capabilities/"
                onClick={hideNow}
                className="annot mt-6 inline-block border-b border-transparent pb-0.5 text-jade-deep! transition-colors hover:border-jade-deep"
              >
                All deep dives →
              </Link>
            </div>

            {/* a live preview of the one under the pointer */}
            {current && Preview ? (
              <div className="hidden lg:block">
                <div className="sticky top-0 border border-[var(--line-ink)] bg-white">
                  <div className="border-b border-[var(--line-ink)] px-5 py-3.5">
                    <p className="annot">{current.layer} layer</p>
                    <p className="font-display mt-1 text-[1.5rem] leading-tight text-graphite">
                      {current.title}
                    </p>
                  </div>
                  <Thumb key={current.slug} className="h-[17rem] bg-[var(--color-card)]">
                    <div className="px-5 py-5">
                      <Preview />
                    </div>
                  </Thumb>
                  <div className="flex items-center justify-between gap-4 border-t border-[var(--line-ink)] bg-[rgba(41,165,135,0.06)] px-5 py-3">
                    <p className="text-[0.84rem] leading-snug text-slate">{current.description}</p>
                    <span className="annot shrink-0 text-jade-deep!">Open →</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
