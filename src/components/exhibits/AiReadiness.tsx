"use client";

/*
  Readiness (the AI Readiness deep dive): can it run today?

  Four pillars along the bottom are the layers AI stands on, each either in
  place or not yet. Above them, every use case is a span laid across exactly the
  pillars it needs, with a drop down to each. A span is solid and jade if every
  pillar beneath it is in place; if any pillar under it is missing, it is dashed
  and timber and says which. You can read the whole argument off the shape: the
  use cases that need the missing pillars are the ones that cannot stand.

  Pilots stall here. Not on the model: on the pillar underneath it.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, Illustrative, Label } from "./ui";

const LAYERS = [
  { k: "Customer Data", ready: true },
  { k: "Customer Journey", ready: true },
  { k: "Go-to-Market Strategy", ready: false },
  { k: "Customer Experience", ready: false },
] as const;

/** Which layers each use case needs, by index into LAYERS. */
const CASES: { name: string; ask: string; needs: number[] }[] = [
  { name: "Lead scoring", ask: "Rank accounts by likelihood to buy", needs: [0, 1] },
  { name: "Forecast assist", ask: "Call the quarter with a reason", needs: [0, 2] },
  { name: "Next-best-action", ask: "Tell a seller what to do next", needs: [0, 1, 3] },
  { name: "Personalized content", ask: "Say the right thing per buyer", needs: [0, 1, 2, 3] },
];

/* geometry */
const W = 900;
const PX = [112, 337, 562, 787]; // pillar centres
const PW = 170;
const PTOP = 318;
const PH = 70;
const BAR_Y = [278, 212, 146, 80]; // lead scoring lowest, personalization highest
const ready = (needs: number[]) => needs.every((n) => LAYERS[n].ready);

export default function AiReadiness() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>What AI needs underneath it · and what this company has</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* phones: one card per use case */}
      <div className="space-y-3 lg:hidden">
        <div className="flex flex-wrap gap-1.5">
          {LAYERS.map((l) => (
            <Chip key={l.k} tone={l.ready ? "good" : "leak"}>
              {l.ready ? "●" : "○"} {l.k}
            </Chip>
          ))}
        </div>
        {CASES.map((c) => {
          const missing = c.needs.filter((n) => !LAYERS[n].ready);
          return (
            <Card key={c.name} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1rem] font-medium text-graphite">{c.name}</p>
                  <p className="text-[0.82rem] text-mute">{c.ask}</p>
                </div>
                <Chip tone={missing.length ? "leak" : "solid"}>{missing.length ? "Blocked" : "Ready"}</Chip>
              </div>
              <p className="mt-2 text-[0.84rem] leading-snug text-slate">
                Needs {c.needs.map((n) => LAYERS[n].k).join(", ")}.
                {missing.length ? (
                  <span className="text-timber-ink"> Missing: {missing.map((m) => LAYERS[m].k).join(", ")}.</span>
                ) : null}
              </p>
            </Card>
          );
        })}
      </div>

      {/* desktop: pillars and the spans across them */}
      <Card className="hidden px-3 pb-2 pt-3 lg:block">
        <svg
          viewBox={`0 0 ${W} 410`}
          className="mx-auto block h-auto max-h-[26rem] w-full"
          role="img"
          aria-label="Four pillars with spans across them: only the span resting wholly on pillars that are in place can stand."
        >
          {/* drops, from each span down to each pillar it needs */}
          {CASES.map((c, ci) =>
            c.needs.map((n) => {
              const ok = LAYERS[n].ready;
              const y0 = BAR_Y[ci];
              return (
                <motion.line
                  key={`${c.name}-${n}`}
                  x1={PX[n]}
                  x2={PX[n]}
                  y1={y0}
                  y2={PTOP}
                  stroke={ready(c.needs) ? "#29a587" : ok ? "rgba(41,165,135,0.55)" : "#b4885a"}
                  strokeWidth={2}
                  strokeDasharray={ok ? undefined : "5 5"}
                  initial={still ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 + (3 - ci) * 0.35 }}
                />
              );
            }),
          )}

          {/* the pillars */}
          {LAYERS.map((l, i) => (
            <motion.g
              key={l.k}
              initial={still ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.14, duration: 0.5 }}
            >
              <rect
                x={PX[i] - PW / 2}
                y={PTOP}
                width={PW}
                height={PH}
                rx={4}
                fill={l.ready ? "rgba(41,165,135,0.16)" : "rgba(180,136,90,0.07)"}
                stroke={l.ready ? "#29a587" : "#b4885a"}
                strokeWidth={l.ready ? 1.6 : 1.6}
                strokeDasharray={l.ready ? undefined : "6 5"}
              />
              <text x={PX[i]} y={PTOP + 29} textAnchor="middle" fontSize="15.5" fontWeight={600} fill="#262626">
                {l.k}
              </text>
              <text
                x={PX[i]}
                y={PTOP + 52}
                textAnchor="middle"
                fontSize="11"
                letterSpacing="2"
                className="font-mono"
                fill={l.ready ? "#1d7a63" : "#8a6234"}
              >
                {l.ready ? "● IN PLACE" : "○ NOT YET"}
              </text>
            </motion.g>
          ))}

          {/* the spans */}
          {CASES.map((c, ci) => {
            const x0 = PX[Math.min(...c.needs)];
            const x1 = PX[Math.max(...c.needs)];
            const ok = ready(c.needs);
            const missing = c.needs.filter((n) => !LAYERS[n].ready);
            const delay = 1.0 + (3 - ci) * 0.35;
            return (
              <g key={c.name}>
                <motion.line
                  x1={x0}
                  x2={x1}
                  y1={BAR_Y[ci]}
                  y2={BAR_Y[ci]}
                  stroke={ok ? "#29a587" : "#b4885a"}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeDasharray={ok ? undefined : "1 13"}
                  initial={still ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay }}
                />
                <motion.g
                  initial={still ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.35 }}
                >
                  <text x={x0 - 6} y={BAR_Y[ci] - 16} fontSize="15" fontWeight={600} fill="#262626">
                    {c.name}
                    <tspan dx="12" fontSize="12.5" fontWeight={500} fill={ok ? "#1d7a63" : "#8a6234"}>
                      {ok
                        ? "Ready: every layer under it is in place"
                        : `Blocked: needs ${missing
                            .map((m) => LAYERS[m].k.replace("Go-to-Market ", "GTM "))
                            .join(" + ")}`}
                    </tspan>
                  </text>
                </motion.g>
              </g>
            );
          })}
        </svg>
      </Card>

      <p className="annot text-[0.66rem]">
        One of four runs today. The other three are not waiting on a better model; they are waiting
        on a layer.
      </p>
    </div>
  );
}
