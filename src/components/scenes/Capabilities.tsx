"use client";

/*
  Capabilities built on one foundation.

  Four things a client actually asks for, each drawn with the same blueprint on
  the same unified data layer. The repetition is the argument: by the second
  diagram the reader has stopped decoding the picture and started reading the
  labels, and by the fourth they can see that the base has never changed.

  Tabs sit above the drawing and the drawing advances on its own. Only the
  platform and what stands on it travel — off down the road to the lower left,
  with the next arriving from the upper right into exactly the same place. The
  inputs and outcomes on either side just fade, because they belong to their
  own capability rather than to the system underneath it.

  Both blueprints are on screen together during the handover, stacked in one
  grid cell, so you actually see the next foundation coming in behind the one
  leaving. That is the whole point of the road. That replaced a scroll-locked version: a section
  that both advances on a timer *and* derives its index from scroll position
  has two authorities for one piece of state, and they fight. A carousel is
  honest about which one is in charge.

  It holds while the pointer is anywhere in the frame and while focus is inside
  it — nothing should slide out from under somebody who is reading it. One
  deliberate tab click stops the rotation for good.

  That hold is read live from the DOM on each tick rather than tracked in
  state. A `pointerenter` whose matching `pointerleave` never arrives — which
  happens whenever the pointer leaves the window abruptly, or the element under
  it unmounts — would otherwise latch the carousel off permanently.
*/

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Blueprint, { BP_VIEWBOX, BlueprintRails } from "@/components/iso/Blueprint";
import { CapabilityCard } from "@/components/mobile/Cards";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { CAPABILITIES } from "@/lib/systems";

/** Long enough to assemble and still be read before it leaves. */
const DWELL = 4500;



export default function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [seen, setSeen] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [wide, setWide] = useState(true);
  const plateRef = useRef<HTMLDivElement>(null);
  /* When the current slide last became eligible to advance. Pushed forward
     for as long as somebody is reading, so leaving the frame never causes an
     immediate jump. Seeded in an effect rather than at render — reading the
     clock during render is not pure. */
  const settled = useRef(0);
  const still = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The blueprint only exists above lg. Below it the section is a stack of
     cards, and nothing rotates — a diagram that slides away on its own while
     somebody is reading it on a phone is just an interruption. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    settled.current = Date.now();
  }, [tab]);

  /* Rotation runs only while the section is on screen and the visitor hasn't
     taken over. The poll is short; the dwell is enforced by the clock. */
  useEffect(() => {
    if (!seen || stopped || still || !wide) return;
    const id = setInterval(() => {
      const el = plateRef.current;
      const busy =
        !!el && (el.matches(":hover") || el.contains(document.activeElement));
      if (busy) {
        settled.current = Date.now();
        return;
      }
      if (Date.now() - settled.current < DWELL) return;
      setTab((n) => (n + 1) % CAPABILITIES.length);
    }, 250);
    return () => clearInterval(id);
  }, [seen, stopped, still, wide]);

  const choose = (n: number) => {
    setTab(n);
    setStopped(true);
  };

  const c = CAPABILITIES[tab];

  return (
    <section id="capabilities" ref={ref} className="sheet-card px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <p className="annot">Capabilities built on one foundation</p>
        <h2 className="font-display mt-5 max-w-[52rem] text-[clamp(2rem,4.4vw,3.2rem)] text-graphite">
          Built on one foundation.
          <span className="mt-1 block text-slate">Designed to work as one system.</span>
        </h2>
        <p className="mt-6 max-w-[46rem] text-lg leading-relaxed text-slate">
          Audaption can build the capability your organization needs next
          without treating it as an isolated initiative. Content Marketing
          strengthens Website Experience. Website behavior improves Marketing
          Analytics. Marketing Analytics sharpens the Go-to-Market Motion. The
          Go-to-Market Motion produces better customer and prospect intelligence.
        </p>

        {/* tabs, above the drawing */}
        <div
          role="tablist"
          hidden={!wide}
          aria-label="Capabilities"
          className={`mt-14 gap-7 overflow-x-auto border-b border-[var(--line-ink)] sm:gap-12 ${
            wide ? "flex" : "hidden"
          }`}
        >
          {CAPABILITIES.map((s, n) => {
            const on = n === tab;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => choose(n)}
                className="font-display-mixed relative whitespace-nowrap pb-4 text-[clamp(1.05rem,1.9vw,1.5rem)] transition-colors duration-300"
                style={{ color: on ? "var(--color-graphite)" : "var(--color-mute)" }}
              >
                {s.name}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left transition-transform duration-500"
                  style={{
                    background: "var(--color-jade)",
                    transform: on ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {wide ? (
          /* The drawing sits on its own lighter plate, so the solids have
             something to separate from and the frame reads as a viewport. */
          <div
            ref={plateRef}
            className="relative mt-8 overflow-hidden border border-[var(--line-ink)]"
            style={{ background: "#fbf9f5" }}
          >
            <div className="px-4 pb-4 pt-8 sm:px-8 sm:pb-6 sm:pt-10">
              <p className="annot leading-relaxed">{c.feeds}</p>

              <div className="no-bar mt-4 overflow-x-auto">
                <div className="relative min-w-[720px]">
                  {/* The road, in the blueprint's own coordinate space and
                      outside the travelling group so it never moves with it. */}
                  <svg
                    viewBox={BP_VIEWBOX}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    aria-hidden
                  >
                    <motion.g
                      key={`rail-${c.id}`}
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: still ? 0 : -92 }}
                      transition={{ duration: still ? 0 : 0.7, ease: [0.32, 0, 0.2, 1] }}
                    >
                      <BlueprintRails />
                    </motion.g>
                  </svg>

                  {/* One cell, both blueprints — the outgoing one in front so
                      the arriving platform reads as coming up behind it. */}
                  <div className="grid">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={c.id}
                        initial={still ? "show" : "enter"}
                        animate="show"
                        exit={still ? "show" : "leave"}
                        transition={{
                          duration: still ? 0 : 0.62,
                          ease: [0.32, 0, 0.2, 1],
                        }}
                        className="col-start-1 row-start-1"
                      >
                        <Blueprint capability={c} play />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-ink)] px-4 py-3 sm:px-8">
              <p className="annot">
                Hover, tap or tab to a building block for what it means
              </p>
              <div className="flex items-center gap-2" aria-hidden>
                {CAPABILITIES.map((s, n) => (
                  <span
                    key={s.id}
                    className="h-[3px] w-7 transition-colors duration-300"
                    style={{
                      background:
                        n === tab ? "var(--color-jade)" : "var(--line-ink-strong)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* One column, all four, nothing moving. */
          <div className="mt-10 space-y-8">
            {CAPABILITIES.map((cap) => (
              <CapabilityCard key={cap.id} capability={cap} />
            ))}
          </div>
        )}

        <p className="mt-10 max-w-[19rem] border-l-2 border-jade/50 px-4 py-1 text-[0.95rem] leading-relaxed text-slate">
          Built separately when necessary. Designed to work together from the
          beginning.
        </p>

        <p className="mt-14 max-w-[46rem] text-[1.3rem] font-medium leading-snug text-graphite sm:text-[1.5rem]">
          Each capability creates value on its own. Together they become an
          Enterprise Growth System.
          <span className="mt-3 block text-lg font-normal leading-relaxed text-slate">
            These four are examples of that work, not the limit of it.
          </span>
        </p>
      </div>
    </section>
  );
}
