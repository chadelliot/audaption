"use client";

/*
  Reach (the Content & Creative deep dive): what does it say, and to whom?

  A bubble chart of message against audience. Each circle is the share of that
  audience who booked a meeting after seeing that message, and its size is the
  number — so the answer is visible before it is read. The winners are filled and
  ringed; everything else is a quiet grey; a retired combination is only an
  empty, dashed outline.

  An earlier version shaded every cell by intensity and read as a heat map, which
  is a chart for analysts. Size is easier to read than shade, and leaving most of
  the grid grey means the eye goes to the few combinations that matter.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, CountUp, Illustrative, Label, Reveal } from "./ui";

const AUDIENCES = ["Procurement", "Operations", "Finance", "Executive"] as const;

const MESSAGES = [
  { k: "Cut total cost", v: [4.1, 1.2, 3.8, 1.9] },
  { k: "Reduce supplier risk", v: [3.2, 2.0, 2.7, 4.6] },
  { k: "Faster delivery", v: [1.4, 5.2, 0.9, 2.1] },
  { k: "One vendor for everything", v: [4.9, 2.2, 2.4, 3.3] },
] as const;

const BAR = 4.5; // clears the bar
const RETIRE = 1.5; // below this the combination is retired
const MAX = 5.4;

const wins = MESSAGES.flatMap((m) =>
  m.v.map((v, c) => ({ v, msg: m.k, aud: AUDIENCES[c] })),
)
  .filter((x) => x.v >= BAR)
  .sort((a, b) => b.v - a.v);

const best = MESSAGES[2]; // “Faster delivery” has the widest spread
const hi = Math.max(...best.v);
const lo = Math.min(...best.v);

/** Diameter in px: area, not width, tracks the value. */
const dia = (v: number) => 18 + Math.sqrt(v / MAX) * 52;

export default function Reach() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Meetings booked per 100 who saw it · message × audience</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="px-4 pb-4 pt-3">
          <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))] items-center gap-y-1">
            <div />
            {AUDIENCES.map((a) => (
              <Label key={a} className="pb-1 text-center tracking-[0.04em]!">
                {a}
              </Label>
            ))}

            {MESSAGES.map((m, r) => (
              <Row key={m.k} m={m} r={r} still={still} />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[var(--line-ink)] pt-2.5 text-[0.78rem] text-slate">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-jade ring-2 ring-jade-deep/40" />
              Clears the bar ({BAR}+)
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-[rgba(38,38,38,0.14)]" />
              Keep testing
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rounded-full border border-dashed border-[var(--line-ink-strong)]" />
              Retired (under {RETIRE})
            </span>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Reveal delay={1.0}>
            <Card className="px-5 py-4">
              <Label>Fund these three</Label>
              <ol className="mt-2 space-y-2">
                {wins.slice(0, 3).map((w, i) => (
                  <li key={w.msg + w.aud} className="flex items-baseline gap-3">
                    <span className="font-display w-14 text-[1.5rem] leading-none text-jade-deep">
                      <CountUp to={w.v} delay={1.1 + i * 0.12} format={(v) => v.toFixed(1)} />
                    </span>
                    <span className="text-[0.92rem] leading-snug text-graphite">
                      <span className="font-medium">{w.msg}</span>
                      <span className="text-mute"> → </span>
                      {w.aud}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>

          <Reveal delay={1.5}>
            <Card className="px-5 py-4">
              <Label>Same message, different reader</Label>
              <p className="mt-1.5 text-[0.95rem] leading-snug text-graphite">
                “{best.k}” books <span className="font-semibold text-jade-deep">{hi.toFixed(1)}</span>{" "}
                per 100 with Operations and{" "}
                <span className="font-semibold text-slate">{lo.toFixed(1)}</span> with Finance: a{" "}
                <span className="font-semibold">{(hi / lo).toFixed(1)}×</span> spread from the audience
                alone.
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Row({ m, r, still }: { m: (typeof MESSAGES)[number]; r: number; still: boolean }) {
  return (
    <>
      <p className="flex items-center pr-2 text-[0.92rem] font-medium leading-tight text-graphite">{m.k}</p>
      {m.v.map((v, c) => {
        const win = v >= BAR;
        const retired = v < RETIRE;
        const d = dia(v);
        return (
          <div key={c} className="flex h-[4.2rem] items-center justify-center">
            <motion.span
              className="font-display flex items-center justify-center rounded-full leading-none"
              style={{
                width: d,
                height: d,
                fontSize: win ? "1.15rem" : "0.9rem",
                background: win ? "#29a587" : retired ? "transparent" : "rgba(38,38,38,0.12)",
                color: win ? "#fff" : retired ? "#8a8b84" : "#262626",
                border: retired ? "1px dashed rgba(38,38,38,0.3)" : "none",
                boxShadow: win ? "0 0 0 4px rgba(29,122,99,0.2)" : undefined,
              }}
              initial={still ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 + (r * 4 + c) * 0.06, type: "spring", stiffness: 240, damping: 16 }}
            >
              {v.toFixed(1)}
            </motion.span>
          </div>
        );
      })}
    </>
  );
}
