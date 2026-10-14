"use client";

/*
  The approach, one decision per screen.

  This is the part of the page that used to be two pinned scroll runs of
  isometric drawings. Those were as large as their own artwork — 854px tall in a
  780px viewport — so on a 13" laptop they overran the screen and sat on top of
  their own copy. They have been replaced by flat working exhibits (see
  components/exhibits), and the layout rule is inverted: the deck is exactly one
  viewport tall, the copy takes the room it needs, and the exhibit is given what
  is left and *fitted* to it — it is scaled down if it would be taller, never
  allowed to be. Nothing can overlap and nothing can run off the screen.

  The reader moves with Next and Back, the rail, or the arrow keys. An exhibit
  mounts when its chapter opens and unmounts when it closes, which is also what
  replays its build each time.

  Below `lg` the deck is not paged: each chapter is a plain section carrying the
  same argument and the same exhibit, stacked.
*/

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { EXHIBITS, type ExhibitId } from "@/components/exhibits";
import MobileDeck from "@/components/deck/MobileDeck";
import { FitBox } from "@/components/exhibits/ui";
import {
  GROUPS,
  ROADMAP,
  STEPS,
  SUMMARY,
  stepMeta,
  type Chapter,
  type Step,
} from "@/lib/approach";
import { CAPABILITY } from "@/lib/capabilities";
import { lenisRef } from "@/lib/lenisInstance";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

const LAST = STEPS.length - 1;
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));

/** Viewport-heights of scroll each step is given. */
const BAND = 0.8;

export default function Deck() {
  const ref = useRef<HTMLElement>(null);
  const still = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [pinned, setPinned] = useState(true);
  /* While a Next / rail click is scrolling the page to a chapter, the chapters
     it passes on the way are not shown — only where it lands. */
  const travelling = useRef(false);

  /* The pin only exists on wide screens; checked here and not in CSS because
     the scroll maths has to agree with the layout. */
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

  /* Scroll position picks the chapter. A little hysteresis at each edge keeps
     the page from flickering between two chapters when the reader rests on the
     boundary. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned || travelling.current) return;
    const raw = v * STEPS.length;
    setI((cur) => {
      const next = Math.min(LAST, Math.max(0, Math.floor(raw)));
      if (next === cur) return cur;
      const into = raw - next;
      /* Only damp the edge between neighbours. A jump of several chapters is a
         jump, and should land where it lands. */
      if (next === cur + 1 && into < 0.1) return cur;
      if (next === cur - 1 && into > 0.9) return cur;
      return next;
    });
  });

  /* Next, Back, the rail and the arrow keys all do the same thing: scroll to
     the middle of a chapter's band, so the page and the chapter never disagree. */
  const releaseTimer = useRef<number | undefined>(undefined);
  const release = useCallback(() => {
    travelling.current = false;
    window.clearTimeout(releaseTimer.current);
  }, []);

  const go = useCallback(
    (n: number) => {
      const el = ref.current;
      if (!el) return;
      const target = Math.min(LAST, Math.max(0, n));
      const r = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const y = r.top + window.scrollY + ((target + 0.5) / STEPS.length) * range;

      travelling.current = true;
      setI(target);
      /* The lock must never outlive the trip. The scroll library's completion
         callback is not guaranteed — an interrupted or zero-length scroll never
         fires it — so a timer always lets go as well, and so does the reader's
         own input. A lock that stuck would freeze the chapter while the page
         kept scrolling. */
      window.clearTimeout(releaseTimer.current);
      releaseTimer.current = window.setTimeout(release, 1400);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(y, { duration: 0.9, onComplete: release });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [release],
  );

  /* The reader taking the wheel back ends any trip in progress. */
  useEffect(() => {
    const events = ["wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, release, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, release));
  }, [release]);

  /* Arrow keys page the deck, but only while it is what the reader is looking
     at, and never while they are typing in the form further down. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 0.4 || r.bottom < innerHeight * 0.6) return;
      e.preventDefault();
      go(i + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i]);

  const step = STEPS[i];
  const meta = stepMeta(step);

  return (
    <section
      id="approach"
      ref={ref}
      className="sheet-light relative lg:h-[calc(max(640px,100svh)_+_var(--deck-scroll))]"
      style={{ "--deck-scroll": `${STEPS.length * BAND * 100}svh` } as CSSProperties}
    >
      {/* ---------------------------------------------------------- desktop */}
      <div className="hidden lg:sticky lg:top-0 lg:block">
        <DeepDiveTab step={step} />
        <div className="mx-auto flex h-[max(640px,100svh)] max-w-[1600px] pt-[57px]">
          <Rail current={i} onPick={go} />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1 pb-3 pl-10 pr-[4.25rem] pt-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={meta.id}
                  initial={still ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={still ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: still ? 0 : 0.26, ease: "easeOut" }}
                  className="h-full min-h-0"
                >
                  <StepView step={step} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- mobile */}
      <MobileDeck />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rail and controls                                                   */
/* ------------------------------------------------------------------ */

function Rail({ current, onPick }: { current: number; onPick: (n: number) => void }) {
  return (
    <div className="flex w-[13.5rem] shrink-0 flex-col border-r border-[var(--line-ink)] xl:w-[15rem]">
    <nav
      aria-label="The approach"
      className="min-h-0 flex-1 overflow-y-auto px-5 pb-2 pt-6 no-bar [@media(max-height:780px)]:pt-4"
    >
      {GROUPS.map((g) => (
        <div key={g.id} className="mb-6 [@media(max-height:820px)]:mb-3.5 [@media(max-height:760px)]:mb-2.5">
          <p className="annot mb-2 [@media(max-height:820px)]:mb-1">{g.label}</p>
          <ul>
            {STEPS.map((s, n) => {
              const m = stepMeta(s);
              if (m.group !== g.id) return null;
              const on = n === current;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onPick(n)}
                    aria-current={on ? "step" : undefined}
                    className="group flex w-full items-baseline gap-2.5 py-1.5 text-left [@media(max-height:820px)]:py-1 [@media(max-height:720px)]:py-0.5"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.15rem] h-[7px] w-[7px] shrink-0 self-center rounded-full border transition-colors duration-300"
                      style={{
                        background: on ? "var(--color-jade)" : "transparent",
                        borderColor: on ? "var(--color-jade)" : "var(--line-ink-strong)",
                      }}
                    />
                    <span
                      className="text-[0.92rem] leading-snug transition-colors duration-300 group-hover:text-graphite"
                      style={{
                        color: on ? "var(--color-graphite)" : "var(--color-mute)",
                        fontWeight: on ? 500 : 400,
                      }}
                    >
                      {m.num ? <span className="annot mr-1.5">{m.num}</span> : null}
                      {m.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
    <Controls i={current} onGo={onPick} />
    </div>
  );
}

function Controls({ i, onGo }: { i: number; onGo: (n: number) => void }) {
  const first = i === 0;
  const last = i === LAST;
  return (
    <div className="shrink-0 border-t border-[var(--line-ink)] px-5 py-3.5">
      <p className="annot mb-1">
        {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
      </p>
      <p className="annot mb-3 text-[0.6rem] text-mute! [@media(max-height:780px)]:hidden">
        {last ? "Keep scrolling" : "Scroll, or use Next"}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onGo(i - 1)}
          disabled={first}
          aria-label="Previous"
          className="font-mono border border-[var(--line-ink-strong)] px-3 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-slate transition-colors enabled:hover:border-jade enabled:hover:text-jade disabled:opacity-35"
        >
          ←
        </button>
        {last ? (
          <a
            href="#start"
            className="font-mono flex-1 whitespace-nowrap bg-jade px-2 py-2 text-center text-[0.72rem] uppercase tracking-[0.1em] text-white transition-colors hover:bg-jade-deep"
          >
            Talk to us ↓
          </a>
        ) : (
          <button
            type="button"
            onClick={() => onGo(i + 1)}
            className="font-mono flex-1 bg-jade px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-jade-deep"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

function StepView({ step }: { step: Step }) {
  if (step.kind === "summary") return <SummaryView />;
  if (step.kind === "roadmap") return <RoadmapView />;
  return <ChapterView chapter={step.chapter} n={step.n} />;
}

function Recommendation({ text, label = "Recommendation" }: { text: string; label?: string }) {
  return (
    <div className="border-l-2 border-jade pl-4">
      <p className="annot text-jade-deep!">{label}</p>
      <p className="mt-1.5 text-[0.95rem] leading-snug text-graphite">{text}</p>
    </div>
  );
}

/**
 * The docked tab: a solid jade spine on the right edge of the screen, set
 * sideways, that carries the reader from this chapter into its deep-dive page.
 * It is deliberately narrow — present on every chapter that has a page, never
 * competing with the exhibit — and it slides in as the chapter does.
 */
function DeepDiveTab({ step }: { step: Step }) {
  let href: string | undefined;
  let label = "";
  if (step.kind === "chapter" && step.chapter.deepDive) {
    const p = CAPABILITY[step.chapter.deepDive];
    if (p) {
      href = `/capabilities/${p.slug}/`;
      label = p.title;
    }
  } else if (step.kind === "roadmap") {
    href = "/capabilities/";
    label = "All deep dives";
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {href ? (
        <motion.div
          key={href}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2"
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 48, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Link
            href={href}
            aria-label={`Learn more: ${label}`}
            className="group flex items-center gap-2.5 bg-jade px-2.5 py-5 text-white shadow-[-6px_8px_24px_-12px_rgba(29,122,99,0.55)] transition-colors hover:bg-jade-deep"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em]">
              Learn more <span className="opacity-60">·</span> {label}
            </span>
            <span aria-hidden className="text-[1rem] leading-none transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ChapterView({ chapter: c, n }: { chapter: Chapter; n: number }) {
  const num = String(n).padStart(2, "0");
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid shrink-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,15rem)] items-start gap-x-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,17rem)] xl:gap-x-10">
        <div>
          <p className="annot">
            {num} · {GROUP_LABEL[c.group]} · {c.question}
          </p>
          <h2 className="font-display-mixed mt-3 text-[clamp(1.25rem,1.8vw,1.8rem)] text-graphite">
            {c.claim}
          </h2>
        </div>
        <p className="pt-[1.55rem] text-[0.95rem] leading-relaxed text-slate">{c.body}</p>
        <div className="pt-[1.55rem]">
          <Recommendation text={c.rec} />
        </div>
      </div>
      <Stage id={c.exhibit} />
    </div>
  );
}

function SummaryView() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center">
      <p className="annot">{SUMMARY.eyebrow}</p>
      <h2 className="font-display mt-4 max-w-[58rem] text-[clamp(1.9rem,3.4vw,3.1rem)] text-graphite">
        Build the <span className="text-jade">go-to-market strategy</span> sales and marketing can
        run together.
      </h2>
      <p className="mt-5 max-w-[46rem] text-[1.08rem] leading-relaxed text-slate">{SUMMARY.lede}</p>

      <ol className="mt-8 grid max-w-[64rem] grid-cols-3 gap-8 xl:gap-12">
        {SUMMARY.layers.map((p, i) => (
          <li key={p.name} className="border-t-2 border-jade pt-4">
            <span className="annot text-[0.62rem]">Layer {i + 1}</span>
            <span className="font-display-mixed mt-1 block text-[1.6rem] leading-tight text-graphite">
              {p.name}
            </span>
            <span className="mt-2 block text-[0.98rem] leading-relaxed text-slate">{p.line}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex max-w-[64rem] items-center gap-4 bg-graphite px-5 py-3.5 text-chalk">
        <span aria-hidden className="text-[1.3rem] text-emerald">
          ↓
        </span>
        <p className="text-[1rem] leading-snug">{SUMMARY.result}</p>
      </div>

      <p className="annot mt-6">Scroll to build it, one layer at a time</p>
    </div>
  );
}

function RoadmapView() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center">
      <p className="annot">{ROADMAP.eyebrow}</p>
      <h2 className="font-display mt-4 max-w-[52rem] text-[clamp(2rem,3.7vw,3.3rem)] text-graphite">
        Map it, align it, build it, <span className="text-jade">run it</span>.
      </h2>

      <ol className="mt-9 grid max-w-[68rem] grid-cols-4">
        {ROADMAP.steps.map((s, i) => (
          <li key={s.name} className="pr-5">
            {/* each step points to the next */}
            <div
              className="flex items-center gap-2.5 py-3 pl-5 pr-8"
              style={{
                background: ["rgba(41,165,135,0.16)", "rgba(41,165,135,0.34)", "rgba(41,165,135,0.6)", "#1d7a63"][i],
                color: i > 1 ? "#fff" : "#262626",
                clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 14px 50%)",
                marginLeft: i ? "-0.5rem" : 0,
                paddingLeft: i ? "2rem" : "1.25rem",
              }}
            >
              <span className="font-mono text-[0.72rem] opacity-70">{s.n}</span>
              <span className="font-display-mixed text-[1.4rem] leading-none">{s.name}</span>
            </div>
            <p className="mt-3 pl-1 text-[0.95rem] leading-relaxed text-slate">{s.line}</p>
          </li>
        ))}
      </ol>

      <div className="mt-9 max-w-[46rem]">
        <Recommendation label="Where to start" text={ROADMAP.ask} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The stage                                                           */
/* ------------------------------------------------------------------ */

/**
 * Where an exhibit lives: a box of definite size, ruled off from the copy
 * above it, with the exhibit fitted inside. The box is the guarantee — see
 * FitBox for why an exhibit cannot be taller than it.
 */
function Stage({ id }: { id: ExhibitId }) {
  const Exhibit = EXHIBITS[id];
  return (
    <div className="relative min-h-0 min-w-0 flex-1 border-t border-[var(--line-ink)] pt-4">
      <FitBox>
        <Exhibit />
      </FitBox>
    </div>
  );
}
