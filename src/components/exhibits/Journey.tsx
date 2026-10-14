"use client";

/*
  03 — Journey: how do they get to a decision, and to the next one?

  The buying path as a river. It starts wide with everyone who noticed a
  problem and narrows stage by stage as buyers drop out; the width at each stage
  is the share still in. What leaves does not vanish, it falls out of the
  riverbed as a tail, so the losses are as visible as what remains, and the
  biggest — the step into comparing options — is drawn heavier and in timber,
  the colour this site uses for what leaks.

  Beneath it, the road back: repeat purchase is a journey of its own, with its
  own stages and its own drop-off, so it gets its own lane and its own number.

  The widths come from the same numbers the phone cards print, so the picture
  and the text cannot disagree.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, CountUp, Illustrative, Label, Reveal } from "./ui";

const STAGES = [
  { k: "Notice a problem", left: 100, who: ["Operations"], time: "3 weeks", stall: "No shared problem statement", short: "No shared problem" },
  { k: "Compare options", left: 64, who: ["Operations", "Procurement"], time: "5 weeks", stall: "Hard to tell options apart", short: "Options look alike" },
  { k: "Build the case", left: 41, who: ["Finance", "IT"], time: "6 weeks", stall: "No business case to sign", short: "No business case" },
  { k: "Decide", left: 29, who: ["Executive sponsor"], time: "2 weeks", stall: "Terms and approvals", short: "Terms and approvals" },
  { k: "Adopt and expand", left: 24, who: ["Operations", "Success"], time: "Ongoing", stall: "Low adoption", short: "Low adoption" },
] as const;

const RETURN = ["Adopt", "Expand", "Renew", "Buy again"] as const;

const drops = STAGES.map((s, i) => (i ? STAGES[i - 1].left - s.left : 0));
const WORST = drops.indexOf(Math.max(...drops));

/* river geometry */
const VW = 1000;
const VH = 398;
const CY = 174;
const SCALE = 0.7; // half-height per percentage point
const XS = [118, 308, 498, 688, 878];
const X0 = 30;
const X1 = 968;
const half = (pct: number) => pct * SCALE;

/** A smooth S between two points: horizontal tangents at both ends. */
const seg = (x0: number, y0: number, x1: number, y1: number) => {
  const m = (x0 + x1) / 2;
  return `C ${m} ${y0}, ${m} ${y1}, ${x1} ${y1}`;
};

const stops = [
  { x: X0, h: half(STAGES[0].left) },
  ...STAGES.map((s, i) => ({ x: XS[i], h: half(s.left) })),
  { x: X1, h: half(STAGES[4].left) },
];

const top =
  `M ${stops[0].x} ${CY - stops[0].h} ` +
  stops
    .slice(1)
    .map((p, i) => seg(stops[i].x, CY - stops[i].h, p.x, CY - p.h))
    .join(" ");
/* The lower bank, drawn right to left so the outline closes. */
const rev = stops.slice().reverse();
const bottom = rev
  .slice(1)
  .map((p, i) => seg(rev[i].x, CY + rev[i].h, p.x, CY + p.h))
  .join(" ");
const river = `${top} L ${stops[stops.length - 1].x} ${CY + stops[stops.length - 1].h} ${bottom} Z`;

/** What fell out between stage i and i+1, as a tail hanging off the riverbed. */
function tail(i: number) {
  const a = STAGES[i];
  const b = STAGES[i + 1];
  const xm = (XS[i] + XS[i + 1]) / 2;
  const by = CY + (half(a.left) + half(b.left)) / 2;
  const w = Math.max(7, (a.left - b.left) * SCALE * 1.15);
  const drop = 26 + (a.left - b.left) * 1.05;
  return {
    xm,
    by,
    drop,
    d:
      `M ${xm - w / 2} ${by - 2} ` +
      `C ${xm - w / 2} ${by + drop * 0.45}, ${xm + 6} ${by + drop * 0.6}, ${xm + 10} ${by + drop} ` +
      `L ${xm + 10 + w * 0.7} ${by + drop} ` +
      `C ${xm + w / 2 + 6} ${by + drop * 0.6}, ${xm + w / 2} ${by + drop * 0.4}, ${xm + w / 2} ${by - 2} Z`,
    lost: a.left - b.left,
  };
}

export default function Journey() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The buying path · built from what customers did</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* phones: one card per stage */}
      <div className="space-y-2.5 lg:hidden">
        {STAGES.map((s, i) => (
          <Card key={s.k} tone={i === WORST ? "leak" : "plain"} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[1rem] font-semibold text-graphite">
                <span className="annot mr-2 text-[0.6rem]">Stage {i + 1}</span>
                {s.k}
              </p>
              <p className="font-display text-[1.5rem] leading-none text-graphite">{s.left}%</p>
            </div>
            <div className="mt-2 h-1.5 bg-[rgba(38,38,38,0.08)]">
              <div
                className="h-full"
                style={{ width: `${s.left}%`, background: i === WORST ? "var(--color-timber)" : "var(--color-jade)" }}
              />
            </div>
            <p className="mt-2 text-[0.84rem] text-slate">
              {s.who.join(" + ")} · {s.time}
            </p>
            <p className="mt-0.5 text-[0.84rem]" style={{ color: i === WORST ? "var(--color-timber-ink)" : "var(--color-mute)" }}>
              Stalls on: {s.stall.toLowerCase()}
            </p>
          </Card>
        ))}
      </div>

      {/* desktop: the river */}
      <Card className="hidden px-3 pb-1 pt-3 lg:block">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="mx-auto block h-auto max-h-[21.5rem] w-full"
          role="img"
          aria-label="A river narrowing from 100% to 24% across five stages, with the biggest loss between noticing a problem and comparing options."
        >
          <defs>
            <clipPath id="journeyReveal">
              <motion.rect
                x={0}
                y={0}
                height={VH}
                initial={still ? false : { width: 0 }}
                animate={{ width: VW }}
                transition={{ duration: 1.7, delay: 0.2, ease: [0.45, 0, 0.2, 1] }}
              />
            </clipPath>
          </defs>

          {/* stage labels */}
          {STAGES.map((s, i) => (
            <motion.g
              key={s.k}
              initial={still ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.28 }}
            >
              <text x={XS[i]} y={22} textAnchor="middle" fontSize="10.5" letterSpacing="2" className="font-mono" fill="#8a8b84">
                STAGE {i + 1}
              </text>
              <text x={XS[i]} y={44} textAnchor="middle" fontSize="16" fontWeight={600} fill="#262626">
                {s.k}
              </text>
              <text x={XS[i]} y={63} textAnchor="middle" fontSize="12.5" fill="#8a8b84">
                {s.time}
              </text>
            </motion.g>
          ))}

          {/* the river itself */}
          <g clipPath="url(#journeyReveal)">
            <path d={river} fill="rgba(41,165,135,0.26)" stroke="#29a587" strokeWidth="1.6" strokeLinejoin="round" />
            {/* a faint centreline gives the water a direction */}
            <path
              d={`M ${X0} ${CY} L ${X1} ${CY}`}
              stroke="#29a587"
              strokeOpacity="0.35"
              strokeDasharray="2 7"
              strokeWidth="1.4"
            />
          </g>

          {/* what is left at each stage */}
          {STAGES.map((s, i) => (
            <motion.text
              key={`n${i}`}
              x={XS[i]}
              y={CY + 9}
              textAnchor="middle"
              fontSize={i === 0 ? 30 : 26}
              fontWeight={600}
              fill={i === WORST ? "#6b4f33" : "#262626"}
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.3 }}
            >
              {s.left}%
            </motion.text>
          ))}

          {/* what fell out */}
          {STAGES.slice(0, -1).map((_, i) => {
            const t = tail(i);
            const worst = i + 1 === WORST;
            return (
              <motion.g
                key={`t${i}`}
                initial={still ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.3, duration: 0.5 }}
              >
                <path d={t.d} fill="#b4885a" fillOpacity={worst ? 0.7 : 0.3} stroke={worst ? "#8a6234" : "none"} strokeWidth={worst ? 1.2 : 0} />
                <text
                  x={t.xm + 12}
                  y={t.by + t.drop + 20}
                  textAnchor="middle"
                  fontSize={worst ? 20 : 14}
                  fontWeight={worst ? 700 : 500}
                  fill="#8a6234"
                >
                  −{t.lost}
                </text>
                {worst ? (
                  <text x={t.xm + 12} y={t.by + t.drop + 38} textAnchor="middle" fontSize="11" letterSpacing="1.6" className="font-mono" fill="#8a6234">
                    BIGGEST LEAK
                  </text>
                ) : null}
              </motion.g>
            );
          })}

          {/* who joins, and where they stall */}
          {STAGES.map((s, i) => (
            <motion.g
              key={`w${i}`}
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 + i * 0.12 }}
            >
              <text x={XS[i]} y={VH - 30} textAnchor="middle" fontSize="12" fill="#8a8b84">
                {s.who.join(" + ")}
              </text>
              <text
                x={XS[i]}
                y={VH - 10}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight={500}
                fill={i === WORST ? "#8a6234" : "#56605a"}
              >
                {s.short}
              </text>
            </motion.g>
          ))}
        </svg>
      </Card>

      <Reveal delay={2.0}>
        <Card tone="good" className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5">
          <Label tone="good">The road back</Label>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {RETURN.map((r, i) => (
              <li key={r} className="flex items-center gap-2">
                <span className="text-[0.95rem] font-medium text-graphite">{r}</span>
                {i < RETURN.length - 1 ? <span className="text-mute">→</span> : <span className="text-jade-deep">↺</span>}
              </li>
            ))}
          </ol>
          <p className="ml-auto flex items-baseline gap-2 text-[0.9rem] text-graphite">
            <span className="font-display text-[1.5rem] text-jade-deep">
              <CountUp to={34} delay={2.1} />%
            </span>
            buy again within 18 months
          </p>
        </Card>
      </Reveal>
    </div>
  );
}
