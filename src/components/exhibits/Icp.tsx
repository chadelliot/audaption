"use client";

/*
  01 — Market: who are we selling to?

  A field of accounts. Every dot is an account, placed by how closely it fits the
  ideal customer profile (across) and how large it could be (up). They arrive
  grey and low, then sort themselves: most of the base is a cloud at the bottom
  left, and a small bright cluster sits top right. That cluster is the point,
  and the bars on the right say it in numbers — a small share of accounts, most
  of the revenue — followed by what the cluster has in common.

  A scatter, not a table, because the claim is about shape: the base is not an
  even spread, it is a few strong accounts and a long tail, and a picture of
  that does what a column of percentages cannot.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, CountUp, Illustrative, Label, Reveal } from "./ui";

/* A small seeded generator, so the field is the same on the server and the
   client and on every visit. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Tier = "A" | "B" | "C";
interface Dot {
  x: number; // fit, 0–100
  y: number; // size, 0–1
  t: Tier;
}

const dots: Dot[] = (() => {
  const r = rng(11);
  const out: Dot[] = [];
  const make = (n: number, t: Tier, x0: number, x1: number, yc: number, amp: number) => {
    for (let i = 0; i < n; i++) {
      const x = x0 + (x1 - x0) * r();
      const y = Math.max(0.05, Math.min(0.95, yc + (r() - 0.5) * amp));
      out.push({ x, y, t });
    }
  };
  make(92, "C", 3, 49, 0.27, 0.46);
  make(40, "B", 52, 76, 0.42, 0.55);
  make(8, "A", 79, 97, 0.74, 0.3);
  return out;
})();

const W = 640;
const H = 330;
const PAD = { l: 14, r: 14, t: 34, b: 40 };
const px = (x: number) => PAD.l + (x / 100) * (W - PAD.l - PAD.r);
const py = (y: number) => H - PAD.b - y * (H - PAD.t - PAD.b);

const STYLE = {
  A: { r: 7.5, fill: "#29a587", stroke: "#fff", delay: 1.7, step: 0.07 },
  B: { r: 5.2, fill: "rgba(41,165,135,0.45)", stroke: "#fff", delay: 0.95, step: 0.012 },
  C: { r: 3.6, fill: "rgba(38,38,38,0.26)", stroke: "none", delay: 0.2, step: 0.005 },
} as const;

const SHARE = [
  { k: "Share of accounts", a: 6, b: 28, c: 66 },
  { k: "Share of revenue", a: 46, b: 41, c: 13 },
] as const;

const TRAITS = [
  { k: "Multi-site operations", lift: 4.1 },
  { k: "Runs ERP and e-procurement", lift: 4.1 },
  { k: "Industrial distribution", lift: 3.6 },
  { k: "New commercial leader this year", lift: 3.4 },
] as const;

export default function Icp() {
  const still = usePrefersReducedMotion();
  let ia = 0;
  let ib = 0;
  let ic = 0;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>7,000 accounts · placed by fit and by potential size</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <Card className="px-3 pb-2 pt-3">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto block h-auto max-h-[21rem] w-full"
            role="img"
            aria-label="Accounts plotted by fit and size: most are a low cloud, a few form a bright cluster at top right."
          >
            {/* tier zones */}
            <rect x={px(0)} y={PAD.t} width={px(50) - px(0)} height={H - PAD.t - PAD.b} fill="none" />
            <rect x={px(50)} y={PAD.t} width={px(77) - px(50)} height={H - PAD.t - PAD.b} fill="rgba(38,38,38,0.035)" />
            <motion.rect
              x={px(77)}
              y={PAD.t}
              width={px(100) - px(77)}
              height={H - PAD.t - PAD.b}
              fill="rgba(41,165,135,0.09)"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            />
            {[50, 77].map((x) => (
              <line key={x} x1={px(x)} x2={px(x)} y1={PAD.t} y2={H - PAD.b} stroke="rgba(38,38,38,0.2)" strokeDasharray="3 4" />
            ))}
            {[
              ["TIER C", 25],
              ["TIER B", 63.5],
              ["TIER A", 88.5],
            ].map(([k, x]) => (
              <text
                key={k as string}
                x={px(x as number)}
                y={PAD.t - 12}
                textAnchor="middle"
                fontSize="11"
                letterSpacing="2"
                className="font-mono"
                fill={k === "TIER A" ? "#1d7a63" : "#8a8b84"}
                fontWeight={k === "TIER A" ? 600 : 400}
              >
                {k as string}
              </text>
            ))}

            {/* the axes */}
            <line x1={px(0)} x2={px(100)} y1={H - PAD.b} y2={H - PAD.b} stroke="rgba(38,38,38,0.3)" />
            <text x={px(100)} y={H - 12} textAnchor="end" fontSize="10.5" letterSpacing="1.6" className="font-mono" fill="#8a8b84">
              FIT WITH THE IDEAL CUSTOMER PROFILE →
            </text>
            <text
              x={PAD.l + 2}
              y={H - PAD.b - 8}
              fontSize="10.5"
              letterSpacing="1.6"
              className="font-mono"
              fill="#8a8b84"
              transform={`rotate(-90 ${PAD.l + 2} ${H - PAD.b - 8})`}
            >
              POTENTIAL SIZE →
            </text>

            {/* the accounts */}
            {dots.map((d, i) => {
              const s = STYLE[d.t];
              const n = d.t === "A" ? ia++ : d.t === "B" ? ib++ : ic++;
              return (
                <motion.circle
                  key={i}
                  cx={px(d.x)}
                  cy={py(d.y)}
                  r={s.r}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={d.t === "A" ? 1.5 : 1}
                  initial={still ? false : { opacity: 0, scale: 0.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  transition={{
                    delay: s.delay + n * s.step,
                    type: d.t === "A" ? "spring" : "tween",
                    stiffness: 260,
                    damping: 16,
                    duration: 0.35,
                  }}
                />
              );
            })}

            {/* the ring round the cluster that matters */}
            <motion.ellipse
              cx={px(88)}
              cy={py(0.74)}
              rx={62}
              ry={52}
              fill="none"
              stroke="#1d7a63"
              strokeWidth={1.8}
              strokeDasharray="5 5"
              initial={still ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              transition={{ delay: 2.3, duration: 0.6 }}
            />
          </svg>
        </Card>

        <div className="flex flex-col gap-3">
          <Reveal delay={0.4}>
            <Card className="px-5 py-4">
              <Label>Where the revenue comes from</Label>
              <div className="mt-3 space-y-3">
                {SHARE.map((row, ri) => (
                  <div key={row.k}>
                    <p className="mb-1 text-[0.8rem] text-mute">{row.k}</p>
                    <div className="flex h-7 overflow-hidden">
                      {(
                        [
                          ["a", row.a, "#29a587", "#fff"],
                          ["b", row.b, "rgba(41,165,135,0.45)", "#262626"],
                          ["c", row.c, "rgba(38,38,38,0.16)", "#56605a"],
                        ] as const
                      ).map(([key, v, bg, fg], si) => (
                        <motion.div
                          key={key}
                          className="font-display flex items-center justify-center text-[0.95rem] leading-none"
                          style={{ background: bg, color: fg }}
                          initial={still ? false : { width: 0 }}
                          animate={{ width: `${v}%` }}
                          transition={{ duration: 0.8, delay: 1.2 + ri * 0.25 + si * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {v >= 9 ? `${v}%` : ""}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.9rem] leading-snug text-graphite">
                <span className="font-display text-[1.5rem] text-jade-deep">
                  <CountUp to={6} delay={1.4} />%
                </span>{" "}
                of accounts, <span className="font-display text-[1.5rem] text-jade-deep">
                  <CountUp to={46} delay={1.5} />%
                </span>{" "}
                of revenue.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={2.0}>
            <Card tone="good" className="px-5 py-4">
              <Label tone="good">What Tier A has in common</Label>
              <ul className="mt-2 space-y-1.5">
                {TRAITS.map((t) => (
                  <li key={t.k} className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.92rem] text-graphite">{t.k}</span>
                    <span className="font-display text-[1.15rem] leading-none text-jade-deep">{t.lift.toFixed(1)}×</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[0.76rem] text-mute">times as common as in the rest of the base</p>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
