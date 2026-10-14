"use client";

/*
  The approach, on a phone: one chapter at a time.

  The laptop deck is a pinned run of full-screen chapters. On a phone that became
  nine chapters stacked end to end, which is just a long scroll of artifacts with
  nothing to tell one from the next. This keeps the deck's shape instead. A strip
  of chapter tabs is pinned under the header with a progress line; below it is
  exactly one chapter, and Back and Next dock to the bottom of the screen. You
  can also swipe sideways. Changing chapter swaps the content and brings the top
  of the deck back into view, so every chapter starts at its beginning.

  Each chapter is text first and graphic second — the claim, the point in a
  short paragraph, the recommendation — because on a small screen the sentence
  is what lands and the picture is what confirms it. A tall graphic starts as a
  peek with a fade and a button, so no single exhibit can flood the screen, and
  the two exhibits that are most useful at a glance (touchpoints and motion) are
  built to show one buyer or one stage at a time instead.

  Only below `lg`. The laptop deck in Deck.tsx is untouched.
*/

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { EXHIBITS, type ExhibitId } from "@/components/exhibits";
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
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

const LAST = STEPS.length - 1;
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));

/** The fixed header's height, which the pinned strip sits under. */
const HEADER = 58;

/** Exhibits that are already built for a small screen, one piece at a time. */
const SELF_PACED: ExhibitId[] = ["touchpoints", "motion"];

const tabLabel = (s: Step) => {
  const m = stepMeta(s);
  if (s.kind === "summary") return "Overview";
  if (s.kind === "roadmap") return "How we build it";
  return `${m.num} ${m.title}`;
};

export default function MobileDeck() {
  const still = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (n: number) => {
      const t = Math.min(LAST, Math.max(0, n));
      if (t === i) return;
      setDir(t > i ? 1 : -1);
      setI(t);
      /* Every chapter starts at its own beginning. */
      const el = root.current;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER;
        if (window.scrollY > top) window.scrollTo({ top, behavior: "auto" });
      }
    },
    [i],
  );

  /* Keep the active tab centred in the strip, without moving the page. */
  useEffect(() => {
    const s = strip.current;
    const b = s?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!s || !b) return;
    s.scrollTo({
      left: b.offsetLeft - s.clientWidth / 2 + b.clientWidth / 2,
      behavior: still ? "auto" : "smooth",
    });
  }, [i, still]);

  const step = STEPS[i];
  const meta = stepMeta(step);

  return (
    <div ref={root} className="lg:hidden">
      {/* ---------------------------------------------------- pinned tab strip */}
      <div
        className="sticky z-30 border-b border-[var(--line-ink)] bg-[rgba(251,251,249,0.96)] backdrop-blur"
        style={{ top: HEADER }}
      >
        <div ref={strip} role="tablist" aria-label="The approach" className="no-bar flex gap-1.5 overflow-x-auto px-5 py-2.5 sm:px-8">
          {STEPS.map((s, n) => {
            const on = n === i;
            return (
              <button
                key={stepMeta(s).id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => go(n)}
                className="font-mono shrink-0 whitespace-nowrap px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.1em] transition-colors"
                style={{
                  background: on ? "var(--color-jade)" : "rgba(38,38,38,0.05)",
                  color: on ? "#fff" : "var(--color-slate)",
                }}
              >
                {tabLabel(s)}
              </button>
            );
          })}
        </div>
        <div className="h-[2px] bg-[rgba(38,38,38,0.08)]">
          <div
            className="h-full bg-jade transition-[width] duration-300"
            style={{ width: `${((i + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------ the chapter */}
      <div className="px-5 pb-6 pt-6 sm:px-8" style={{ minHeight: "68svh" }}>
        <div className="mx-auto max-w-[40rem]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={meta.id}
              custom={dir}
              initial={still ? false : { opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={still ? undefined : { opacity: 0, x: dir * -28 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onPanEnd={(_, info) => {
                const { x, y } = info.offset;
                if (Math.abs(x) > 80 && Math.abs(x) > Math.abs(y) * 1.6) go(i + (x < 0 ? 1 : -1));
              }}
              style={{ touchAction: "pan-y" }}
            >
              <StepView step={step} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ------------------------------------------------------------ docked nav */}
      <div className="sticky bottom-0 z-30 border-t border-[var(--line-ink)] bg-[rgba(251,251,249,0.96)] px-5 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[40rem] items-center gap-3">
          <button
            type="button"
            onClick={() => go(i - 1)}
            disabled={i === 0}
            aria-label="Previous chapter"
            className="font-mono border border-[var(--line-ink-strong)] px-4 py-3 text-[0.72rem] uppercase tracking-[0.12em] text-slate disabled:opacity-30"
          >
            ← Back
          </button>
          <p className="annot flex-1 text-center text-[0.62rem]">
            {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </p>
          {i === LAST ? (
            <a
              href="#start"
              className="font-mono bg-jade px-5 py-3 text-[0.72rem] uppercase tracking-[0.12em] text-white"
            >
              Talk to us ↓
            </a>
          ) : (
            <button
              type="button"
              onClick={() => go(i + 1)}
              className="font-mono bg-jade px-5 py-3 text-[0.72rem] uppercase tracking-[0.12em] text-white"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One step                                                            */
/* ------------------------------------------------------------------ */

function StepView({ step }: { step: Step }) {
  if (step.kind === "summary") return <Summary />;
  if (step.kind === "roadmap") return <Roadmap />;
  return <ChapterView chapter={step.chapter} n={step.n} />;
}

function Callout({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-2 border-jade bg-[rgba(41,165,135,0.06)] py-3 pl-4 pr-3">
      <p className="annot text-jade-deep!">{label}</p>
      <p className="mt-1 text-[0.98rem] leading-snug text-graphite">{text}</p>
    </div>
  );
}

function Badge({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono inline-flex items-center gap-2.5 bg-jade px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.12em] text-white transition-colors hover:bg-jade-deep"
    >
      {children}
      <span aria-hidden>↗</span>
    </Link>
  );
}

function ChapterView({ chapter: c, n }: { chapter: Chapter; n: number }) {
  const page = c.deepDive ? CAPABILITY[c.deepDive] : undefined;
  return (
    <article>
      <p className="annot">
        {String(n).padStart(2, "0")} · {GROUP_LABEL[c.group]}
      </p>
      <p className="mt-2 text-[0.92rem] font-medium text-jade-deep">{c.question}</p>
      <h3 className="font-display-mixed mt-2 text-[1.85rem] leading-[1.08] text-graphite">{c.claim}</h3>
      <p className="mt-3.5 text-[1.02rem] leading-relaxed text-slate">{c.body}</p>

      <div className="mt-5">
        <Callout label="Recommendation" text={c.rec} />
      </div>

      <div className="mt-7">
        <Graphic id={c.exhibit} key={c.id} />
      </div>

      {page ? (
        <div className="mt-6">
          <Badge href={`/capabilities/${page.slug}/`}>Learn more · {page.title}</Badge>
        </div>
      ) : null}
    </article>
  );
}

function Summary() {
  return (
    <article>
      <p className="annot">{SUMMARY.eyebrow}</p>
      <h3 className="font-display mt-3 text-[clamp(1.9rem,8vw,2.4rem)] text-graphite">
        Build the <span className="text-jade">go-to-market strategy</span> sales and marketing can run
        together.
      </h3>
      <p className="mt-4 text-[1.02rem] leading-relaxed text-slate">{SUMMARY.lede}</p>

      <ol className="mt-6 space-y-3">
        {SUMMARY.layers.map((p, k) => (
          <li key={p.name} className="border-t-2 border-jade pt-2.5">
            <span className="annot text-[0.6rem]">Layer {k + 1}</span>
            <span className="font-display-mixed block text-[1.35rem] leading-tight text-graphite">{p.name}</span>
            <span className="mt-0.5 block text-[0.95rem] leading-snug text-slate">{p.line}</span>
          </li>
        ))}
      </ol>

      <p className="mt-6 bg-graphite px-4 py-3 text-[0.98rem] leading-snug text-chalk">{SUMMARY.result}</p>

      <p className="annot mt-5 text-center">Swipe or tap Next to build it, one layer at a time</p>
    </article>
  );
}

function Roadmap() {
  return (
    <article>
      <p className="annot">{ROADMAP.eyebrow}</p>
      <h3 className="font-display mt-3 text-[clamp(1.8rem,8vw,2.3rem)] text-graphite">
        Map it, align it, build it, <span className="text-jade">run it</span>.
      </h3>
      <ol className="mt-6 space-y-3.5">
        {ROADMAP.steps.map((s, k) => (
          <li key={s.name} className="flex gap-4">
            <span
              className="font-display flex h-9 w-9 shrink-0 items-center justify-center text-[1.05rem]"
              style={{
                background: ["rgba(41,165,135,0.18)", "rgba(41,165,135,0.38)", "rgba(41,165,135,0.66)", "#1d7a63"][k],
                color: k > 1 ? "#fff" : "#262626",
              }}
            >
              {s.n}
            </span>
            <span>
              <span className="font-display-mixed block text-[1.3rem] leading-tight text-graphite">{s.name}</span>
              <span className="mt-0.5 block text-[0.96rem] leading-snug text-slate">{s.line}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6">
        <Callout label="Where to start" text={ROADMAP.ask} />
      </div>
      <div className="mt-6">
        <Badge href="/capabilities/">All deep dives</Badge>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* The graphic                                                         */
/* ------------------------------------------------------------------ */

/** Past this height a graphic starts as a peek. */
const PEEK_REM = 27;

function Graphic({ id }: { id: ExhibitId }) {
  const Exhibit = EXHIBITS[id];
  const box = useRef<HTMLDivElement>(null);
  const [tall, setTall] = useState(false);
  const [open, setOpen] = useState(false);
  const selfPaced = SELF_PACED.includes(id);

  /* Measured, not assumed: whether a graphic needs a peek depends on what is in
     it, and some of them grow as they build in. */
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || selfPaced) return;
    const measure = () => setTall(el.scrollHeight > PEEK_REM * 16 + 24);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.firstElementChild as Element);
    return () => ro.disconnect();
  }, [selfPaced]);

  const clipped = tall && !open && !selfPaced;

  return (
    <div>
      <div
        ref={box}
        className="relative overflow-hidden"
        style={{ maxHeight: clipped ? `${PEEK_REM}rem` : undefined }}
      >
        <div>
          <Exhibit />
        </div>
        {clipped ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
            style={{ background: "linear-gradient(to bottom, rgba(251,251,249,0), #fbfbf9 82%)" }}
          />
        ) : null}
      </div>
      {tall && !selfPaced ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="font-mono mx-auto mt-3 flex items-center gap-2 border border-[var(--line-ink-strong)] bg-white px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.12em] text-graphite"
        >
          {open ? "Show less ↑" : "Show the whole picture ↓"}
        </button>
      ) : null}
    </div>
  );
}

