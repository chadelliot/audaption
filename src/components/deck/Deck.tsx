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

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EXHIBITS, type ExhibitId } from "@/components/exhibits";
import { FitBox } from "@/components/exhibits/ui";
import {
  CHAPTERS,
  GROUPS,
  ROADMAP,
  STEPS,
  SUMMARY,
  stepMeta,
  type Chapter,
  type Step,
} from "@/lib/approach";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

const LAST = STEPS.length - 1;
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));

export default function Deck() {
  const ref = useRef<HTMLElement>(null);
  const still = usePrefersReducedMotion();
  const [i, setI] = useState(0);

  const go = useCallback(
    (n: number) => setI(Math.min(LAST, Math.max(0, n))),
    [],
  );

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
      const seen = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      if (seen < innerHeight * 0.6) return;
      setI((n) => Math.min(LAST, Math.max(0, n + (e.key === "ArrowRight" ? 1 : -1))));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const step = STEPS[i];
  const meta = stepMeta(step);

  return (
    <section id="approach" ref={ref} className="sheet-light">
      {/* ---------------------------------------------------------- desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-[max(640px,100svh)] max-w-[1600px] pt-[57px]">
          <Rail current={i} onPick={go} />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1 px-10 pb-3 pt-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={meta.id}
                  initial={still ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={still ? undefined : { opacity: 0 }}
                  transition={{ duration: still ? 0 : 0.28, ease: "easeOut" }}
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
      <div className="px-5 py-20 sm:px-8 lg:hidden">
        <MobileList />
      </div>
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
      className="min-h-0 flex-1 overflow-y-auto px-5 pb-2 pt-6 no-bar"
    >
      {GROUPS.map((g) => (
        <div key={g.id} className="mb-6 [@media(max-height:720px)]:mb-3.5">
          <p className="annot mb-2">{g.label}</p>
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
                    className="group flex w-full items-baseline gap-2.5 py-1.5 text-left [@media(max-height:720px)]:py-0.5"
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
    <div className="shrink-0 border-t border-[var(--line-ink)] px-5 py-4">
      <p className="annot mb-3">
        {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
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

function ChapterView({ chapter: c, n }: { chapter: Chapter; n: number }) {
  const num = String(n).padStart(2, "0");
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid shrink-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,15rem)] items-start gap-x-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,17rem)] xl:gap-x-10">
        <div>
          <p className="annot">
            {num} · {GROUP_LABEL[c.group]} · {c.question}
          </p>
          <h2 className="font-display-mixed mt-3 text-[clamp(1.4rem,2.1vw,2.1rem)] text-graphite">
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
      <h2 className="font-display mt-4 max-w-[52rem] text-[clamp(2.2rem,4.4vw,3.9rem)] text-graphite">
        A plan to stop growth from <span className="text-jade">leaking</span>.
      </h2>
      <p className="mt-5 max-w-[46rem] text-[1.1rem] leading-relaxed text-slate">
        {SUMMARY.lede}
      </p>

      <ol className="mt-10 grid max-w-[64rem] grid-cols-3 gap-8 xl:gap-12">
        {SUMMARY.plan.map((p) => (
          <li key={p.name} className="border-t-2 border-jade pt-4">
            <span className="font-display-mixed block text-[1.6rem] leading-tight text-graphite">
              {p.name}
            </span>
            <span className="mt-2 block text-[0.98rem] leading-relaxed text-slate">
              {p.line}
            </span>
          </li>
        ))}
      </ol>

      <p className="annot mt-10">
        {CHAPTERS.length} decisions, in order · use Next, the rail, or the arrow keys
      </p>
    </div>
  );
}

function RoadmapView() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center">
      <p className="annot">{ROADMAP.eyebrow}</p>
      <h2 className="font-display mt-4 max-w-[52rem] text-[clamp(2.2rem,4.4vw,3.9rem)] text-graphite">
        Align, activate, <span className="text-jade">optimize</span>.
      </h2>

      <ol className="mt-10 grid max-w-[64rem] grid-cols-3 gap-8 xl:gap-12">
        {ROADMAP.steps.map((s) => (
          <li key={s.name} className="border-t-2 border-jade pt-4">
            <span className="annot">{s.days}</span>
            <span className="font-display-mixed mt-2 block text-[1.6rem] leading-tight text-graphite">
              {s.name}
            </span>
            <span className="mt-2 block text-[0.98rem] leading-relaxed text-slate">
              {s.line}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10 max-w-[46rem]">
        <Recommendation label="The ask" text={ROADMAP.ask} />
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

/* ------------------------------------------------------------------ */
/* Phones: the same argument, no paging, no drawings                   */
/* ------------------------------------------------------------------ */

function MobileExhibit({ id }: { id: ExhibitId }) {
  const Exhibit = EXHIBITS[id];
  return <Exhibit />;
}

function MobileList() {
  return (
    <div className="mx-auto max-w-[40rem] space-y-14">
      <div>
        <p className="annot">{SUMMARY.eyebrow}</p>
        <h2 className="font-display mt-4 text-[clamp(2rem,9vw,2.6rem)] text-graphite">
          A plan to stop growth from <span className="text-jade">leaking</span>.
        </h2>
        <p className="mt-4 leading-relaxed text-slate">{SUMMARY.lede}</p>
        <ul className="mt-6 space-y-4">
          {SUMMARY.plan.map((p) => (
            <li key={p.name} className="border-t-2 border-jade pt-3">
              <span className="font-display-mixed block text-[1.4rem] text-graphite">
                {p.name}
              </span>
              <span className="mt-1 block text-[1rem] leading-relaxed text-slate">
                {p.line}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {CHAPTERS.map((c, n) => (
        <article key={c.id}>
          <p className="annot">
            {String(n + 1).padStart(2, "0")} · {GROUP_LABEL[c.group]} · {c.question}
          </p>
          <h3 className="font-display-mixed mt-3 text-[1.7rem] text-graphite">{c.claim}</h3>
          <p className="mt-3 leading-relaxed text-slate">{c.body}</p>
          <div className="mt-5">
            <MobileExhibit id={c.exhibit} />
          </div>
          <div className="mt-5">
            <Recommendation text={c.rec} />
          </div>
        </article>
      ))}

      <div>
        <p className="annot">{ROADMAP.eyebrow}</p>
        <h3 className="font-display mt-4 text-[clamp(1.8rem,8vw,2.3rem)] text-graphite">
          Align, activate, <span className="text-jade">optimize</span>.
        </h3>
        <ol className="mt-6 space-y-4">
          {ROADMAP.steps.map((s) => (
            <li key={s.name} className="border-t-2 border-jade pt-3">
              <span className="annot">{s.days}</span>
              <span className="font-display-mixed mt-1 block text-[1.4rem] text-graphite">
                {s.name}
              </span>
              <span className="mt-1 block text-[1rem] leading-relaxed text-slate">
                {s.line}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Recommendation label="The ask" text={ROADMAP.ask} />
        </div>
        <a
          href="#start"
          className="font-mono mt-6 inline-block bg-jade px-5 py-3 text-[0.75rem] uppercase tracking-[0.14em] text-white"
        >
          Talk with us ↓
        </a>
      </div>
    </div>
  );
}
