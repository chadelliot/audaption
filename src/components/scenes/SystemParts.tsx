"use client";

/*
  What we build.

  Scenes are managed by explicit state, not by blending opacity.

  The previous version gave every scene an overlapping scroll window and faded
  between them, which meant two diagrams were partially visible through each
  other at every handover and nothing was ever properly hidden. Now the scroll
  position picks exactly one active index; the active scene is visible and
  interactive, every other scene is `visibility: hidden` and inert. The only
  animation between scenes is a short fixed cross-dissolve on that state
  change — short enough that the outgoing scene is gone before the incoming
  one is readable.

  Each scene owns a band of the scroll. Because nothing bleeds into its
  neighbours any more, effectively the whole band is stable active time: the
  drawing assembles on arrival, then holds until the reader scrolls out of it.

  Below `lg` the drawings are dropped entirely, not merely unpinned. At phone
  width an isometric face label renders around 6.7px and the drawing still
  needs sideways scrolling — it needs roughly twice the width it can ever get
  there. The four scenes become cards carrying the same content instead. See
  components/mobile/Cards.tsx.
*/

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { GRAPHICS } from "@/components/iso/SystemGraphics";
import { PartCard } from "@/components/mobile/Cards";
import { lenisRef } from "@/lib/lenisInstance";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { SYSTEMS, type SystemPart } from "@/lib/systems";

const N = SYSTEMS.length;
const BAND = 1 / N;
/** How long the cross-dissolve between two scenes takes. */
const SWAP = 0.18;

export default function SystemParts() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);

  /* The pin only exists on wide screens. Checked here rather than in CSS
     because the scroll maths has to agree with the layout. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /*
    Hysteresis. Switching exactly on the band edge makes the scene flicker
    when the reader rests on the boundary, so a scene keeps the screen until
    the progress is clearly inside the next band.
  */
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
    const el = ref.current;
    if (!el) return;
    const y = el.offsetTop + (el.offsetHeight - window.innerHeight) * (BAND * (n + 0.4));
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="system" ref={ref} className="sheet-light relative lg:h-[520vh]">
      <div className="px-5 pb-20 pt-24 sm:px-8 sm:pt-28 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden lg:pb-6">
        <div className="mx-auto w-full max-w-[1500px]">
          <p className="annot">What we build</p>
          <p className="mt-3 max-w-[46rem] text-[1.05rem] leading-relaxed text-slate">
            The four layers, and what we actually do to each one. Customer
            experience isn&rsquo;t listed separately — it&rsquo;s the finish on
            all of them, and it shows up inside the last drawing.
          </p>
        </div>

        {/* Breathing room between the section intro, the chooser and the
            active capability. Responsive so it doesn't eat a short screen. */}
        <div className="h-[clamp(2rem,4.5vw,3.75rem)] shrink-0" aria-hidden />

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,1fr)] gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
          {/* The chooser is for the pinned run only. With the cards stacked
              in order and each one titled, it would be a scrolling row of
              links to things already on screen. */}
          <nav aria-label="What we build" className="hidden lg:block lg:self-start">
            <ul className="flex gap-2 overflow-x-auto lg:block lg:gap-0 lg:overflow-visible">
              {SYSTEMS.map((s, n) => {
                const on = pinned && n === active;
                return (
                  <li key={s.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => goto(n)}
                      aria-current={on ? "true" : undefined}
                      className="group w-full whitespace-nowrap border-l px-3 py-2.5 text-left transition-colors duration-300 lg:px-4 lg:py-4"
                      style={{
                        borderColor: on ? "var(--color-jade)" : "var(--line-ink)",
                        background: on ? "rgba(41,165,135,0.07)" : "transparent",
                      }}
                    >
                      <span
                        className="font-mono block text-[0.72rem] tracking-[0.16em] transition-colors duration-300"
                        style={{ color: on ? "var(--color-jade-deep)" : "var(--color-mute)" }}
                      >
                        {s.ref}
                      </span>
                      <span
                        className="font-display-mixed mt-0.5 block text-[1.1rem] transition-colors duration-300 lg:text-[1.4rem]"
                        style={{ color: on ? "var(--color-graphite)" : "var(--color-mute)" }}
                      >
                        {s.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {pinned ? (
            <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
              {/* One cell, one visible scene. */}
              <div className="grid min-h-[9rem] min-w-0">
                {SYSTEMS.map((part, n) => (
                  <SceneCopy key={part.id} part={part} on={n === active} />
                ))}
              </div>
              <div className="-mx-5 grid min-h-0 min-w-0 no-bar px-5 sm:mx-0 sm:px-0">
                {SYSTEMS.map((part, n) => (
                  <SceneStage key={part.id} part={part} on={n === active} />
                ))}
              </div>
            </div>
          ) : (
            <div className="min-w-0 space-y-8">
              {SYSTEMS.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pinned scenes                                                       */
/* ------------------------------------------------------------------ */

/**
 * Hidden means hidden. `visibility` collapses the scene out of the paint and
 * out of hit-testing, so a finished diagram can never show through the one in
 * front of it.
 */
const sceneState = (on: boolean, still: boolean) => ({
  animate: { opacity: on ? 1 : 0 },
  transition: { duration: still ? 0 : SWAP, ease: "easeOut" as const },
  style: {
    visibility: (on ? "visible" : "hidden") as "visible" | "hidden",
    pointerEvents: (on ? "auto" : "none") as "auto" | "none",
  },
});

function SceneCopy({ part, on }: { part: SystemPart; on: boolean }) {
  const still = usePrefersReducedMotion();
  const s = sceneState(on, still);
  return (
    <motion.div
      initial={false}
      animate={s.animate}
      transition={s.transition}
      style={s.style}
      aria-hidden={!on}
      className="col-start-1 row-start-1 min-w-0"
    >
      <h2 className="font-display-mixed text-[clamp(1.6rem,3vw,2.5rem)] text-graphite">
        {part.claim}
      </h2>
      <p className="mt-3 hidden max-w-[46rem] leading-relaxed text-slate sm:block">
        {part.body}
      </p>
    </motion.div>
  );
}

function SceneStage({ part, on }: { part: SystemPart; on: boolean }) {
  const still = usePrefersReducedMotion();
  const s = sceneState(on, still);
  const Graphic = GRAPHICS[part.id];

  /* The drawing only exists while its scene owns the screen. Unmounting is
     what resets its internal timeline, so scrolling back replays it cleanly
     instead of revealing an already-finished diagram. */
  return (
    <motion.div
      initial={false}
      animate={s.animate}
      transition={s.transition}
      style={s.style}
      aria-hidden={!on}
      className="col-start-1 row-start-1 flex min-h-0 min-w-0 items-center"
    >
      <div className="mx-auto flex h-full w-full max-w-[62rem] items-center">
        <div className="w-full">
          {on ? <Graphic play /> : null}
          <p className="annot mt-2 hidden border-t border-[var(--line-ink)] pt-3 sm:block">
            {part.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
