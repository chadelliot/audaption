"use client";

/*
  08 — What did the dollar do?

  Three ways to credit the same $1.5M. Each platform reports what it can see and
  takes the credit; added up, they claim 138% of the revenue the company actually
  booked, because the same sale is counted by every platform that touched it.
  Last-touch hands the sale to the final click and is wrong in the other
  direction. The reconciled column is modelled and then forced to sum to the
  finance number — which is the thing that makes it one number leadership can
  repeat.

  Credit is shown as a range between the two honest methods for the same reason:
  attribution is evidence for the next allocation, not a verdict on the last one.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, CountUp, Illustrative, Label, Reveal } from "./ui";

/** Credit in $K, by method, for the same booked revenue. */
const CHANNELS = [
  { k: "Paid search", platform: 780, last: 540, rec: 430 },
  { k: "Paid social", platform: 610, last: 190, rec: 320 },
  { k: "Email", platform: 330, last: 430, rec: 260 },
  { k: "Events", platform: 170, last: 90, rec: 220 },
  { k: "Content + organic", platform: 180, last: 250, rec: 270 },
] as const;

const sum = (f: (c: (typeof CHANNELS)[number]) => number) => CHANNELS.reduce((s, c) => s + f(c), 0);
const BOOKED = sum((c) => c.rec); // finance's number
const CLAIMED = sum((c) => c.platform);
const OVER = Math.round((CLAIMED / BOOKED) * 100);
const MAX = Math.max(...CHANNELS.map((c) => c.platform));

const METHODS = [
  { key: "platform", label: "Platform-reported", color: "#b4885a" },
  { key: "last", label: "Last-touch", color: "rgba(38,38,38,0.32)" },
  { key: "rec", label: "Reconciled", color: "#29a587" },
] as const;

export default function Prove() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Credit for ${(BOOKED / 1000).toFixed(1)}M of booked revenue · three methods</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card className="px-5 pb-3 pt-4">
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1">
            {METHODS.map((m) => (
              <span key={m.key} className="flex items-center gap-2 text-[0.8rem] text-slate">
                <span className="inline-block h-2.5 w-5" style={{ background: m.color }} />
                {m.label}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            {CHANNELS.map((c, ci) => (
              <div key={c.k} className="grid grid-cols-[6.2rem_minmax(0,1fr)] items-center gap-3">
                <p className="text-[0.88rem] font-medium leading-tight text-graphite">{c.k}</p>
                <div className="space-y-1">
                  {METHODS.map((m, mi) => {
                    const v = c[m.key];
                    return (
                      <div key={m.key} className="flex items-center gap-2">
                        <motion.div
                          className="h-3"
                          style={{ background: m.color }}
                          initial={still ? false : { width: 0 }}
                          animate={{ width: `${(v / MAX) * 100}%` }}
                          transition={{
                            duration: 0.7,
                            delay: 0.25 + ci * 0.16 + mi * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                        <span className="text-[0.74rem] tabular-nums text-mute">${v}K</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Reveal delay={1.2}>
            <Card tone="leak" className="px-5 py-4">
              <Label tone="leak">What the platforms claim, added up</Label>
              <p className="font-display mt-1 text-[3.2rem] leading-none text-graphite">
                <CountUp to={OVER} delay={1.3} />%
              </p>
              <p className="mt-1 text-[0.88rem] leading-snug text-slate">
                of the revenue the company booked. The same sale is counted by every platform that
                touched it.
              </p>
              <div className="mt-3 space-y-1.5">
                <Bar w={OVER} color="#b4885a" label={`Platforms ${OVER}%`} />
                <Bar w={100} color="#29a587" label="Finance 100%" />
              </div>
            </Card>
          </Reveal>

          <Reveal delay={1.7}>
            <Card tone="ink" className="px-5 py-4">
              <Label tone="light">The one number</Label>
              <p className="font-display mt-1 text-[2.3rem] leading-none text-chalk">
                $<CountUp to={BOOKED / 1000} delay={1.8} format={(v) => v.toFixed(2)} />M
              </p>
              <p className="mt-1.5 text-[0.88rem] leading-snug text-glass">
                Credit modelled, then forced to sum to finance. Shown as a range between last-touch
                and reconciled, never as a verdict.
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Bar({ w, color, label }: { w: number; color: string; label: string }) {
  const still = usePrefersReducedMotion();
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="h-2.5"
        style={{ background: color }}
        initial={still ? false : { width: 0 }}
        animate={{ width: `${(w / 140) * 100}%` }}
        transition={{ duration: 0.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="annot whitespace-nowrap text-[0.6rem]">{label}</span>
    </div>
  );
}
