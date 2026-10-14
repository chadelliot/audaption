"use client";

/*
  01 — Where the first dollar goes.

  Four channels drawn as response curves: revenue returned for each level of
  monthly spend. Every curve bends, because every channel saturates. The point
  the exhibit makes is that the *average* return — the number most dashboards
  report — tells you nothing about the next dollar; the *slope* at the current
  spend does. Search has the best average and the flattest slope, so it is
  capped; social has a worse average and a far steeper slope, so it is funded.

  The reallocation arithmetic is computed from the same curves the chart draws,
  so the number in the callout cannot disagree with the picture.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, CountUp, Illustrative, Label, Reveal } from "./ui";

/** Revenue ($K a month) returned at spend x ($K a month): A · (1 − e^(−x/B)). */
const rev = (A: number, B: number, x: number) => A * (1 - Math.exp(-x / B));
/** The slope of that curve — what the next dollar returns. */
const slope = (A: number, B: number, x: number) => (A / B) * Math.exp(-x / B);

const CHANNELS = [
  { k: "Paid search", A: 800, B: 40, spend: 90, color: "#b4885a", call: "cap" },
  { k: "Paid social", A: 900, B: 130, spend: 40, color: "#29a587", call: "fund" },
  { k: "Online video", A: 500, B: 120, spend: 60, color: "#56605a", call: "hold" },
  { k: "Display", A: 300, B: 70, spend: 30, color: "#8a8b84", call: "hold" },
] as const;

const MOVE = 25;
const search = CHANNELS[0];
const social = CHANNELS[1];
const lost =
  rev(search.A, search.B, search.spend) - rev(search.A, search.B, search.spend - MOVE);
const gained =
  rev(social.A, social.B, social.spend + MOVE) - rev(social.A, social.B, social.spend);
const NET = Math.round(gained - lost);

/* chart geometry */
const W = 560;
const H = 290;
const PAD = { l: 44, r: 16, t: 14, b: 34 };
const XMAX = 140;
const YMAX = 900;
const px = (x: number) => PAD.l + (x / XMAX) * (W - PAD.l - PAD.r);
const py = (y: number) => H - PAD.b - (y / YMAX) * (H - PAD.t - PAD.b);

const curve = (A: number, B: number) =>
  Array.from({ length: 36 }, (_, i) => {
    const x = (i / 35) * XMAX;
    return `${i ? "L" : "M"}${px(x).toFixed(1)} ${py(rev(A, B, x)).toFixed(1)}`;
  }).join(" ");

const CALL = {
  cap: { label: "Cap", tone: "leak" as const },
  fund: { label: "Fund", tone: "solid" as const },
  hold: { label: "Hold", tone: "plain" as const },
};

export default function Allocate() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Revenue returned for each level of monthly spend</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="px-3 pb-2 pt-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto max-h-[22rem] w-full" role="img"
            aria-label="Response curves: paid search is flat at its current spend, paid social is steep.">
            {/* grid + axes */}
            {[0, 300, 600, 900].map((y) => (
              <g key={y}>
                <line x1={PAD.l} x2={W - PAD.r} y1={py(y)} y2={py(y)} stroke="rgba(38,38,38,0.1)" />
                <text x={PAD.l - 8} y={py(y) + 4} textAnchor="end" fontSize="11" className="font-mono" fill="#8a8b84">
                  ${y}K
                </text>
              </g>
            ))}
            {[0, 35, 70, 105, 140].map((x) => (
              <text key={x} x={px(x)} y={H - 12} textAnchor="middle" fontSize="11" className="font-mono" fill="#8a8b84">
                ${x}K
              </text>
            ))}
            <text x={W - PAD.r} y={H - 1} textAnchor="end" fontSize="10" letterSpacing="1.5" className="font-mono" fill="#8a8b84">
              MONTHLY SPEND
            </text>

            {/* the four curves, drawn in one after another */}
            {CHANNELS.map((c, i) => (
              <motion.path
                key={c.k}
                d={curve(c.A, c.B)}
                fill="none"
                stroke={c.color}
                strokeWidth={c.call === "hold" ? 2 : 2.6}
                strokeLinecap="round"
                initial={still ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}

            {/* slope at today's spend — the number that decides the call */}
            {[search, social].map((c, i) => {
              const m = slope(c.A, c.B, c.spend);
              const x0 = c.spend - 17;
              const x1 = c.spend + 17;
              const y0 = rev(c.A, c.B, c.spend) + m * (x0 - c.spend);
              const y1 = rev(c.A, c.B, c.spend) + m * (x1 - c.spend);
              return (
                <motion.line
                  key={c.k}
                  x1={px(x0)} y1={py(y0)} x2={px(x1)} y2={py(y1)}
                  stroke={c.color} strokeWidth={2} strokeDasharray="3 3"
                  initial={still ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.15 }}
                />
              );
            })}

            {/* today's spend, as a solid dot on each curve */}
            {CHANNELS.map((c, i) => (
              <motion.circle
                key={c.k}
                cx={px(c.spend)} cy={py(rev(c.A, c.B, c.spend))} r={5}
                fill={c.color} stroke="#fff" strokeWidth={1.5}
                initial={still ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 300, damping: 18 }}
              />
            ))}

            {/* the proposed move, hollow dots joined to today's */}
            {[
              { c: search, to: search.spend - MOVE },
              { c: social, to: social.spend + MOVE },
            ].map(({ c, to }, i) => (
              <motion.g
                key={c.k}
                initial={still ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1 + i * 0.15 }}
              >
                <line
                  x1={px(c.spend)} y1={py(rev(c.A, c.B, c.spend))}
                  x2={px(to)} y2={py(rev(c.A, c.B, to))}
                  stroke={c.color} strokeWidth={1.5} strokeDasharray="2 3"
                />
                <circle cx={px(to)} cy={py(rev(c.A, c.B, to))} r={5.5} fill="#fff" stroke={c.color} strokeWidth={2.2} />
              </motion.g>
            ))}

            {/* direct labels, so there is no legend to decode */}
            {CHANNELS.map((c) => (
              <text
                key={c.k}
                x={px(XMAX) - 4}
                y={py(rev(c.A, c.B, XMAX)) - 7}
                textAnchor="end"
                fontSize="11.5"
                fontWeight={600}
                fill={c.color}
              >
                {c.k}
              </text>
            ))}
          </svg>
          <p className="annot px-2 pb-1 text-[0.62rem]">
            ● Today &nbsp; ○ After the move &nbsp; ┄ Slope at today’s spend
          </p>
        </Card>

        <div className="flex flex-col gap-3">
          <Card className="px-5 pb-4 pt-4">
            <div className="flex items-baseline justify-between">
              <Label>Average return vs the next dollar</Label>
              <p className="annot text-[0.6rem]">
                <span className="mr-3">○ avg</span>
                <span>● next $1</span>
              </p>
            </div>

            <div className="mt-3 space-y-3.5">
              {CHANNELS.map((c, i) => {
                const avg = rev(c.A, c.B, c.spend) / c.spend;
                const m = slope(c.A, c.B, c.spend);
                const lo = Math.min(avg, m);
                const hi = Math.max(avg, m);
                const tone =
                  c.call === "fund"
                    ? "var(--color-jade-deep)"
                    : c.call === "cap"
                      ? "var(--color-timber-ink)"
                      : "var(--color-slate)";
                return (
                  <Reveal key={c.k} delay={0.5 + i * 0.12}>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-[0.9rem] font-medium text-graphite">
                          <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                          {c.k}
                          <span className="text-[0.74rem] font-normal text-mute">${c.spend}K</span>
                        </span>
                        <Chip tone={CALL[c.call].tone}>{CALL[c.call].label}</Chip>
                      </div>
                      <div className="relative mt-1.5 h-6">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(38,38,38,0.12)]" />
                        {/* the gap between what it averaged and what the next dollar earns */}
                        <motion.div
                          className="absolute top-1/2 h-[5px] -translate-y-1/2"
                          style={{
                            left: `${(lo / 9) * 100}%`,
                            width: `${((hi - lo) / 9) * 100}%`,
                            background: c.color,
                            opacity: 0.4,
                            transformOrigin: "left",
                          }}
                          initial={still ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.7, delay: 0.8 + i * 0.12 }}
                        />
                        <span
                          className="absolute top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white"
                          style={{ left: `${(avg / 9) * 100}%`, borderColor: c.color }}
                        />
                        <span
                          className="absolute top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                          style={{ left: `${(m / 9) * 100}%`, background: c.color }}
                        />
                      </div>
                      <p className="mt-0.5 flex justify-between text-[0.76rem] text-mute">
                        <span>averages {avg.toFixed(1)}×</span>
                        <span className="font-semibold" style={{ color: tone }}>
                          next dollar returns ${m.toFixed(1)}
                        </span>
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Card>

          <Reveal delay={1.9}>
            <Card tone="ink" className="px-5 py-4">
              <Label tone="light">Move ${MOVE}K a month from search to social</Label>
              <p className="font-display mt-1.5 text-[2.3rem] leading-none text-chalk">
                +$<CountUp to={NET} delay={2.0} />K
                <span className="font-sans ml-3 align-middle text-[0.95rem] normal-case tracking-normal text-glass">
                  revenue a month · same total spend
                </span>
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
