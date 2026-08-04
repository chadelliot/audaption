"use client";

/*
  Capabilities built on one foundation.

  Four things a client actually asks for, each drawn with the same blueprint on
  the same unified data layer. The repetition is the argument: by the second
  diagram the reader has stopped decoding the picture and started reading the
  labels, and by the fourth they can see that the base has never changed.

  This section locks the same way "what we build" does, and for the same
  reason: a blueprint this wide can't be read while the page is still moving,
  and asking the reader to find each one themselves means most of them see one
  and leave. Scrolling steps between capabilities; each one assembles on
  arrival. Exactly one is ever mounted, so no diagram is visible behind another.

  Below `lg` the pin is dropped entirely — four ordinary blocks, each starting
  its own timeline when it comes into view.
*/

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Blueprint from "@/components/iso/Blueprint";
import { lenisRef } from "@/lib/lenisInstance";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { CAPABILITIES, type Capability } from "@/lib/systems";

const N = CAPABILITIES.length;
const BAND = 1 / N;
const SWAP = 0.18;

export default function Capabilities() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);
  const still = usePrefersReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const raw = v * N;
    setActive((cur) => {
      const next = Math.min(N - 1, Math.max(0, Math.floor(raw)));
      if (next === cur) return cur;
      const into = raw - next;
      if (next > cur && into < 0.12) return cur;
      if (next < cur && into > 0.88) return cur;
      return next;
    });
  });

  const goto = (n: number) => {
    const el = trackRef.current;
    if (!el) return;
    const y = el.offsetTop + (el.offsetHeight - window.innerHeight) * (BAND * (n + 0.4));
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="capabilities" className="sheet-card">
      <div ref={trackRef} className="relative lg:h-[520vh]">
        <div className="px-5 pb-16 pt-24 sm:px-8 sm:pt-32 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden lg:pb-6">
          <div className="mx-auto w-full max-w-[1500px]">
            <p className="annot">Capabilities built on one foundation</p>
            <h2 className="font-display mt-4 max-w-[52rem] text-[clamp(1.8rem,3.6vw,2.8rem)] text-graphite">
              Built on one foundation.
              <span className="mt-1 block text-slate">
                Designed to work as one system.
              </span>
            </h2>
          </div>

          <div className="h-[clamp(1.5rem,3.5vw,2.75rem)] shrink-0" aria-hidden />

          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,1fr)] gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-14">
            <div className="lg:self-start">
              <div
                role="tablist"
                aria-label="Capabilities"
                aria-orientation="vertical"
                className="flex gap-2 overflow-x-auto lg:block lg:gap-0 lg:overflow-visible"
              >
                {CAPABILITIES.map((s, n) => {
                  const on = pinned && n === active;
                  return (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={on}
                      type="button"
                      onClick={() => goto(n)}
                      className="font-display-mixed w-full shrink-0 whitespace-nowrap border-l px-4 py-3 text-left text-[1.05rem] leading-tight transition-colors duration-300 lg:whitespace-normal lg:py-4 lg:text-[1.3rem]"
                      style={{
                        borderColor: on ? "var(--color-jade)" : "var(--line-ink)",
                        background: on ? "rgba(41,165,135,0.07)" : "transparent",
                        color: on ? "var(--color-graphite)" : "var(--color-mute)",
                      }}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>

              {/* A principle, not a headline. */}
              <p className="mt-8 hidden max-w-[19rem] border-l-2 border-jade/50 bg-sheet/70 px-4 py-3 text-[0.95rem] leading-relaxed text-slate lg:block">
                Built separately when necessary. Designed to work together from
                the beginning.
              </p>
            </div>

            {pinned ? (
              <div className="grid min-h-0 min-w-0 pt-[60px]">
                {CAPABILITIES.map((c, n) => (
                  <Stage key={c.id} capability={c} on={n === active} still={still} />
                ))}
              </div>
            ) : (
              <div className="min-w-0 space-y-24 pt-8">
                {CAPABILITIES.map((c) => (
                  <FlowStage key={c.id} capability={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The conclusion sits after the locked run, aligned to the diagram
          column rather than to the chooser beside it. */}
      <div className="px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="lg:pl-[calc(19rem+3.5rem)]">
            <p className="max-w-[46rem] text-[1.3rem] font-medium leading-snug text-graphite sm:text-[1.5rem]">
              Each capability creates value on its own. Together they become an
              Enterprise Growth System.
              <span className="mt-3 block text-lg font-normal leading-relaxed text-slate">
                These four are examples of that work, not the limit of it.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** The relationship line, set in the same annotation face the diagram's own
    BUSINESS INPUTS / BUSINESS OUTCOMES headers use. */
function Relationship({ text }: { text: string }) {
  return <p className="annot leading-relaxed">{text}</p>;
}

function Stage({
  capability,
  on,
  still,
}: {
  capability: Capability;
  on: boolean;
  still: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: still ? 0 : SWAP, ease: "easeOut" }}
      style={{
        visibility: on ? "visible" : "hidden",
        pointerEvents: on ? "auto" : "none",
      }}
      aria-hidden={!on}
      className="col-start-1 row-start-1 flex min-h-0 min-w-0 flex-col justify-center"
    >
      <Relationship text={capability.feeds} />
      <div className="-mx-5 mt-3 min-w-0 px-5 sm:mx-0 sm:px-0">
        {on ? <Blueprint capability={capability} play /> : null}
      </div>
      <p className="annot mt-2 border-t border-[var(--line-ink)] pt-3">
        Hover, tap or tab to a building block for what it means
      </p>
    </motion.div>
  );
}

function FlowStage({ capability }: { capability: Capability }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="font-display-mixed text-[1.4rem] leading-tight text-graphite">
        {capability.name}
      </p>
      <div className="mt-2">
        <Relationship text={capability.feeds} />
      </div>
      <div className="-mx-5 mt-5 overflow-x-auto no-bar px-5">
        <div className="min-w-[680px]">
          <Blueprint capability={capability} play={seen} />
        </div>
      </div>
      <p className="annot mt-2 border-t border-[var(--line-ink)] pt-3">
        Tap a building block for what it means
      </p>
    </div>
  );
}
