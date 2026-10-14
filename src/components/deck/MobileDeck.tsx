"use client";

/*
  The approach, on a phone: one screen, one chapter, two panes.

  The laptop deck is a pinned run of full-screen chapters. On a phone the first
  version of this was a tall page — chapter tabs pinned over a column of text and
  graphic, with Back and Next somewhere under it — and the controls and the story
  were never on screen together. So this is one fixed screen, exactly as tall as
  the part of the phone you can see.

  From the top: a strip of chapter tabs; the chapter, in two panes; and a dark
  control bar docked to the bottom. The first pane is the idea, and all of it fits
  without scrolling: the question, the claim, the point in a short paragraph, the
  recommendation and the way into the deep dive. The second pane is the picture.
  A single button in the dock, just above Back and Next, moves between them, so
  the whole story is a tap away and the button never moves. Swiping sideways
  changes chapter. Vertical swipes scroll the pane if a graphic is taller than the
  screen, and carry on to the page when it is not.

  The dock is dark on purpose. It is the one place on the screen that is controls
  and nothing else, and it stops the buttons being lost among the green of the
  content. The contact section that follows is a different ground again, so it is
  always clear when the deck has ended.

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
import { Icon, IconTile } from "@/components/exhibits/icons";
import { CAPABILITY } from "@/lib/capabilities";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

const LAYER_ICON = { Data: "data", Journey: "journey", Experience: "experience" } as const;
const STEP_ICON = ["map", "align", "build", "run"] as const;
const LAST = STEPS.length - 1;
const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));

/** The fixed header's height, which the screen sits under. */
const HEADER = 58;

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
  const scroller = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  /** The height of one pane: the visible height of the scroller. */
  const [pane, setPane] = useState(0);
  const [onPicture, setOnPicture] = useState(false);

  const step = STEPS[i];
  const meta = stepMeta(step);
  const hasPicture = step.kind === "chapter";

  const go = useCallback(
    (n: number) => {
      const t = Math.min(LAST, Math.max(0, n));
      if (t === i) return;
      setDir(t > i ? 1 : -1);
      setI(t);
      setOnPicture(false);
      /* The new chapter starts at its own beginning, and the screen is brought
         fully into view if the reader had it half scrolled away. */
      scroller.current?.scrollTo({ top: 0 });
      const el = root.current;
      if (el) {
        const off = el.getBoundingClientRect().top - HEADER;
        if (Math.abs(off) > 4) window.scrollTo({ top: window.scrollY + off, behavior: "auto" });
      }
    },
    [i],
  );

  /* Measure one pane, so each can be exactly one screen tall. */
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const fit = () => setPane(el.clientHeight);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  const flip = () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: onPicture ? 0 : pane, behavior: still ? "auto" : "smooth" });
  };

  return (
    <div
      ref={root}
      className="flex flex-col lg:hidden"
      style={{
        height: `calc(100svh - ${HEADER}px)`,
        minHeight: "33rem",
        scrollSnapAlign: "start",
      }}
    >
      {/* ------------------------------------------------------------- the tabs */}
      <div className="shrink-0 border-b border-[var(--line-ink)] bg-sheet">
        <div
          ref={strip}
          role="tablist"
          aria-label="The approach"
          className="no-bar flex gap-1.5 overflow-x-auto px-5 py-2.5 sm:px-8"
        >
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

      {/* --------------------------------------------------- the chapter, in panes */}
      <div
        ref={scroller}
        className="no-bar min-h-0 flex-1 overflow-y-auto bg-sheet"
        style={{ scrollSnapType: "y proximity" }}
        onScroll={(e) => {
          const t = e.currentTarget.scrollTop;
          setOnPicture((was) => (was ? t > pane * 0.35 : t > pane * 0.65));
        }}
      >
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
            <StepView step={step} pane={pane} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --------------------------------------------------------- the control dock */}
      <div className="shrink-0 bg-graphite px-5 pb-3 pt-3 text-chalk sm:px-8">
        <div className="mx-auto max-w-[40rem] space-y-2.5">
          {hasPicture ? (
            <button
              type="button"
              onClick={flip}
              aria-label={onPicture ? "Back to the idea" : "See the graphic"}
              className="font-mono flex w-full items-center justify-center gap-2.5 border border-white/35 px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.14em] text-chalk transition-colors active:bg-white/10"
            >
              {onPicture ? "↑ Back to the idea" : "See the graphic ↓"}
            </button>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(i - 1)}
              disabled={i === 0}
              aria-label="Previous chapter"
              className="font-mono border border-white/35 px-4 py-3 text-[0.72rem] uppercase tracking-[0.12em] text-chalk disabled:opacity-30"
            >
              ← Back
            </button>
            <p className="annot flex-1 text-center text-[0.62rem] text-glass!">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One step                                                            */
/* ------------------------------------------------------------------ */

function StepView({ step, pane }: { step: Step; pane: number }) {
  if (step.kind === "summary") return <Summary pane={pane} />;
  if (step.kind === "roadmap") return <Roadmap pane={pane} />;
  return <ChapterView chapter={step.chapter} n={step.n} pane={pane} />;
}

/** Each pane is one screen tall and is a point the scroller comes to rest on. */
function Pane({ pane, children, className = "" }: { pane: number; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`px-5 sm:px-8 ${className}`}
      style={{ minHeight: pane || undefined, scrollSnapAlign: "start" }}
    >
      <div className="mx-auto max-w-[40rem]">{children}</div>
    </div>
  );
}

function Callout({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-2 border-jade bg-[rgba(41,165,135,0.07)] py-2.5 pl-4 pr-3">
      <p className="annot text-jade-deep!">{label}</p>
      <p className="mt-1 text-[0.95rem] leading-snug text-graphite">{text}</p>
    </div>
  );
}

function Badge({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono inline-flex items-center gap-2.5 bg-jade px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.12em] text-white transition-colors hover:bg-jade-deep"
    >
      {children}
      <span aria-hidden>↗</span>
    </Link>
  );
}

function ChapterView({ chapter: c, n, pane }: { chapter: Chapter; n: number; pane: number }) {
  const page = c.deepDive ? CAPABILITY[c.deepDive] : undefined;
  const Exhibit = EXHIBITS[c.exhibit as ExhibitId];
  return (
    <article>
      {/* the idea: all of it fits on one screen */}
      <Pane pane={pane} className="flex flex-col justify-center py-5">
        <p className="annot">
          {String(n).padStart(2, "0")} · {GROUP_LABEL[c.group]}
        </p>
        <p className="mt-1.5 text-[0.9rem] font-medium text-jade-deep">{c.question}</p>
        <h3 className="font-display-mixed mt-1.5 text-[1.7rem] leading-[1.08] text-graphite">{c.claim}</h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-slate">{c.body}</p>
        <div className="mt-4">
          <Callout label="Recommendation" text={c.rec} />
        </div>
        {page ? (
          <div className="mt-4">
            <Badge href={`/capabilities/${page.slug}/`}>Learn more · {page.title}</Badge>
          </div>
        ) : null}
      </Pane>

      {/* the picture */}
      <Pane pane={pane} className="py-5">
        <p className="annot mb-3">The picture · {c.title}</p>
        <Exhibit key={c.id} />
        <p className="annot mt-5 text-center text-[0.6rem]">Tap Back to the idea, or Next for the next chapter</p>
      </Pane>
    </article>
  );
}

function Summary({ pane }: { pane: number }) {
  return (
    <Pane pane={pane} className="flex flex-col justify-center py-5">
      <p className="annot">{SUMMARY.eyebrow}</p>
      <h3 className="font-display mt-2.5 text-[clamp(1.7rem,7.4vw,2.2rem)] text-graphite">
        Build the <span className="text-jade">go-to-market strategy</span> sales and marketing can run
        together.
      </h3>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-slate">{SUMMARY.lede}</p>

      <ol className="mt-4 grid grid-cols-3 gap-3">
        {SUMMARY.layers.map((p, k) => (
          <li key={p.name} className="border-t-2 border-jade pt-2">
            <IconTile name={LAYER_ICON[p.name as keyof typeof LAYER_ICON]} size={26} />
            <span className="annot mt-1.5 block text-[0.56rem]">Layer {k + 1}</span>
            <span className="font-display-mixed block text-[1.15rem] leading-tight text-graphite">{p.name}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 bg-graphite px-4 py-2.5 text-[0.92rem] leading-snug text-chalk">{SUMMARY.result}</p>
      <p className="annot mt-3 text-center text-[0.6rem]">Swipe or tap Next to build it, one layer at a time</p>
    </Pane>
  );
}

function Roadmap({ pane }: { pane: number }) {
  return (
    <Pane pane={pane} className="flex flex-col justify-center py-5">
      <p className="annot">{ROADMAP.eyebrow}</p>
      <h3 className="font-display mt-2.5 text-[clamp(1.7rem,7.4vw,2.1rem)] text-graphite">
        Map it, align it, build it, <span className="text-jade">run it</span>.
      </h3>
      <ol className="mt-4 space-y-2.5">
        {ROADMAP.steps.map((s, k) => (
          <li key={s.name} className="flex gap-3.5">
            <span
              className="font-display flex h-8 w-8 shrink-0 items-center justify-center gap-0 text-[0.95rem]"
              style={{
                background: ["rgba(41,165,135,0.18)", "rgba(41,165,135,0.38)", "rgba(41,165,135,0.66)", "#1d7a63"][k],
                color: k > 1 ? "#fff" : "#262626",
              }}
            >
              <Icon name={STEP_ICON[k]} size={17} />
            </span>
            <span>
              <span className="font-display-mixed block text-[1.15rem] leading-tight text-graphite">{s.name}</span>
              <span className="mt-0.5 block text-[0.88rem] leading-snug text-slate">{s.line}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <Callout label="Where to start" text={ROADMAP.ask} />
      </div>
      <div className="mt-3.5">
        <Badge href="/capabilities/">All deep dives</Badge>
      </div>
    </Pane>
  );
}
