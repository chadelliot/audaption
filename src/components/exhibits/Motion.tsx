"use client";

/*
  06 — Strategy: how do sales and marketing run this together?

  The crux of the page, and it is drawn as the thing itself: two teams that
  overlap. At each stage of the journey there are two circles, marketing and
  sales, and where they overlap sits the one measure they share. The circles are
  not the same size from stage to stage, on purpose: marketing leads when the
  goal is to attract, sales leads when the goal is to decide, and the two even
  out where the account is being expanded. Who leads changes; that the two
  overlap, around a number both own, never does.

  Under each pair, the one thing each team does at that stage, so the picture is
  not asked to carry the whole argument.
*/

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const STAGES = [
  {
    k: "Attract",
    lead: 0.7,
    mkt: "Reach Tier A accounts with the message written for their market.",
    sales: "Warm the named list. Connect first; pitch later.",
    measure: "Tier A accounts engaged",
    owner: "Marketing lead",
  },
  {
    k: "Qualify",
    lead: 0.54,
    mkt: "Score on fit and signal, and pass the account over with its full context.",
    sales: "Respond inside the promise and confirm the problem.",
    measure: "Qualified pipeline",
    owner: "Revenue operations",
  },
  {
    k: "Decide",
    lead: 0.34,
    mkt: "Supply the proof each buying role needs, in the order they need it.",
    sales: "Multi-thread: engage every decider and every influencer.",
    measure: "Win rate",
    owner: "Sales lead",
  },
  {
    k: "Expand",
    lead: 0.5,
    mkt: "Drive adoption and open the case for the next use.",
    sales: "Run the account plan toward the second purchase.",
    measure: "Net revenue retention",
    owner: "Customer success",
  },
] as const;

/* Venn geometry, in a 240 × 170 box. Centres sit a fixed distance apart, so the
   overlap is the same size every stage and only who leads moves. */
const D = 64;
const CY = 82;
const rM = (lead: number) => 34 + 42 * lead;
const rS = (lead: number) => 34 + 42 * (1 - lead);

export default function Motion() {
  const still = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label>One plan for</Label>
          <Chip tone="solid">Tier A accounts</Chip>
          <Chip tone="good">One message per market</Chip>
          <Chip tone="good">One scoreboard</Chip>
        </div>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* phones: pick a stage, see its pair */}
      <div className="lg:hidden">
        <div className="flex gap-1.5" role="tablist" aria-label="Stage">
          {STAGES.map((st, k) => (
            <button
              key={st.k}
              type="button"
              role="tab"
              aria-selected={stage === k}
              onClick={() => setStage(k)}
              className="font-mono flex-1 px-1 py-2 text-[0.64rem] uppercase tracking-[0.08em]"
              style={{
                background: stage === k ? "#29a587" : "rgba(38,38,38,0.06)",
                color: stage === k ? "#fff" : "#56605a",
              }}
            >
              {st.k}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <StageCard key={stage} s={STAGES[stage]} i={stage} still={still} />
        </div>
      </div>

      {/* desktop: four pairs of circles */}
      <div className="hidden grid-cols-4 gap-x-2 lg:grid">
        {STAGES.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.22} className="min-w-0">
            <StageCard s={s} i={i} still={still} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={1.8}>
        <p className="text-[0.92rem] leading-snug text-slate">
          <span className="font-semibold text-graphite">One scoreboard, three numbers:</span> pipeline
          created, win rate and net revenue retention, reported to both teams and owned by both. Who
          leads changes by stage; the overlap does not.
        </p>
      </Reveal>
    </div>
  );
}

/** One stage: a pair of circles, the number they share, and one line each. */
function StageCard({ s, i, still }: { s: (typeof STAGES)[number]; i: number; still: boolean }) {
  const cxM = 120 - D / 2;
  const cxS = 120 + D / 2;
  const rm = rM(s.lead);
  const rs = rS(s.lead);
  const id = `venn-${i}`;
  return (
    <Card className="flex h-full flex-col px-3 pb-4 pt-3">
      <div className="flex items-baseline justify-between px-1">
        <p className="font-display-mixed text-[1.15rem] leading-none text-graphite">{s.k}</p>
        <span className="annot text-[0.58rem]">Stage {i + 1}</span>
      </div>

      <svg viewBox="0 0 240 170" className="mx-auto mt-1 block h-auto w-full max-w-[22rem]" aria-hidden>
        <defs>
          <clipPath id={`${id}-m`}>
            <circle cx={cxM} cy={CY} r={rm} />
          </clipPath>
        </defs>
        <motion.circle
          cx={cxM}
          cy={CY}
          r={rm}
          fill="rgba(38,38,38,0.07)"
          stroke="#262626"
          strokeWidth={1.6}
          initial={still ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          transition={{ delay: 0.3 + i * 0.22, type: "spring", stiffness: 160, damping: 17 }}
        />
        <motion.circle
          cx={cxS}
          cy={CY}
          r={rs}
          fill="rgba(41,165,135,0.14)"
          stroke="#29a587"
          strokeWidth={1.6}
          initial={still ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          transition={{ delay: 0.45 + i * 0.22, type: "spring", stiffness: 160, damping: 17 }}
        />
        {/* where they overlap: the number both own */}
        <motion.circle
          cx={cxS}
          cy={CY}
          r={rs}
          fill="#29a587"
          fillOpacity={0.55}
          clipPath={`url(#${id}-m)`}
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + i * 0.22, duration: 0.5 }}
        />
        <text x={cxM - rm * 0.5} y={CY + 4} textAnchor="middle" fontSize="10" letterSpacing="1.6" className="font-mono" fill="#262626">
          MKTG
        </text>
        <text x={cxS + rs * 0.5} y={CY + 4} textAnchor="middle" fontSize="10" letterSpacing="1.6" className="font-mono" fill="#1d7a63">
          SALES
        </text>
      </svg>

      {/* the measure they share */}
      <motion.div
        className="mx-auto -mt-1 w-full max-w-[13rem] bg-jade px-3 py-2 text-center"
        style={{ borderRadius: 999 }}
        initial={still ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 + i * 0.22 }}
      >
        <p className="text-[0.86rem] font-semibold leading-tight text-white">{s.measure}</p>
      </motion.div>
      <p className="mt-1 text-center text-[0.7rem] text-mute">{s.owner}</p>

      <dl className="mt-3 space-y-2 border-t border-[var(--line-ink)] px-1 pt-3 text-[0.82rem] leading-snug">
        <div>
          <dt className="annot text-[0.56rem]">Marketing</dt>
          <dd className="text-graphite">{s.mkt}</dd>
        </div>
        <div>
          <dt className="annot text-[0.56rem] text-jade-deep!">Sales</dt>
          <dd className="text-graphite">{s.sales}</dd>
        </div>
      </dl>
    </Card>
  );
}
