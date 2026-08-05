"use client";

/*
  Sheet 01 — the opening.

  One uninterrupted scroll rather than a hero followed by a second scene. The
  cubes are on screen from the first frame, out of position; the opening claim
  sits over them, hands off to the second claim as they start to move, and the
  stack sets under it. Nothing cuts, nothing reloads, and the reader is never
  moved between two ideas by a hard edge.

  Everything here is driven by one scroll progress value, so the type, the
  geometry and the caption can never disagree about how far through we are.
*/

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Cube, GhostCube, Tag } from "@/components/iso/Cube";
import { LayerCards } from "@/components/mobile/Cards";
import { box, rightVertex, type Box } from "@/lib/iso";
import { TIERS } from "@/lib/systems";

const S = 92;
const W = 2.2;
const H = 0.72;
const PITCH = 0.8;

/*
  Where each layer waits. Kept inside the frame: a layer half off the sheet
  while it waits reads as a rendering fault rather than as something out of
  position.
*/
const SCATTER: { x: number; y: number }[] = [
  { x: -158, y: 112 },
  { x: 146, y: 132 },
  { x: -134, y: -58 },
  { x: 150, y: -126 },
];

/* Value rises with the layer; jade anchors the one that carries the rest. */
const SKIN = ["jade", "glass", "timber", "chalk"] as const;

const boxes: Box[] = TIERS.map((_, i) => box(0, 0, i * PITCH, W, W, H));

/* Landing windows. The first does not start until the opening claim has had
   the screen to itself for a beat. */
const window_ = (i: number) => {
  const start = 0.14 + i * 0.14;
  return { start, end: start + 0.22 };
};

export default function Opening() {
  const ref = useRef<HTMLDivElement>(null);
  const [landed, setLanded] = useState(-1);
  const [wide, setWide] = useState(true);

  /* Below lg the stack drawing is dropped and the four layers are read as
     cards. The drawing was the only thing a phone got here — its labels
     render around 6px at that width — while the list that explains it was
     hidden. That is exactly backwards. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let n = -1;
    for (let i = 0; i < TIERS.length; i++) if (v >= window_(i).end - 0.05) n = i;
    setLanded(n);
  });

  /* The drawing drifts up and settles as the stack completes, so the frame
     itself is never still while the reader is scrolling. */
  const stageY = useTransform(scrollYProgress, [0, 0.26, 0.9], [46, 8, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 0.9], [0.94, 1]);

  const axisOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.82, 0.92],
    [0.1, 0.26, 0.26, 0.8],
  );
  const sealOpacity = useTransform(scrollYProgress, [0.84, 0.94], [0, 1]);

  const complete = landed === TIERS.length - 1;

  return (
    <section
      id="opening"
      ref={ref}
      className="sheet-dark relative lg:h-[460vh]"
    >
      <div className="px-5 pb-16 pt-24 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden lg:pb-8">
        <div className="relative mx-auto w-full max-w-[1500px]">
          {/* One headline, and it stays put. The reader should be able to
              look away and back without the page having changed its mind. */}
          <div>
            <p className="annot">Audaption · The growth system</p>
            <h1 className="font-display mt-4 max-w-[24rem] text-[clamp(1.9rem,3.6vw,3rem)] text-chalk sm:max-w-[46rem]">
              Companies hire roles.
              <span className="mt-1 block text-glass">
                What they actually need is a{" "}
                <span className="text-emerald">system</span>.
              </span>
            </h1>
            <p className="mt-5 max-w-[40rem] leading-relaxed text-glass">
              Every company has the same four layers. Almost none of them line
              up — which is why the hire lands, works hard, and still can&rsquo;t
              move the number.
            </p>
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          {!wide && <LayerCards tiers={TIERS} />}
        </div>

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,1fr)] items-center gap-6 lg:flex-1 lg:grid-cols-[minmax(0,31rem)_minmax(0,1fr)] lg:gap-14">
          {/* The readable copy of the animation. Present from the first frame:
              it is the argument, not a reward for scrolling. */}
          <ol className="order-2 hidden lg:order-1 lg:block">
            {TIERS.map((t, i) => {
              const on = landed >= i;
              return (
                <li
                  key={t.id}
                  className="border-t py-5 transition-colors duration-500 first:border-t-0"
                  style={{ borderColor: on ? "rgba(53,214,169,0.28)" : "var(--line)" }}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-mono text-[0.82rem] tracking-[0.16em] transition-colors duration-500"
                      style={{ color: on ? "var(--color-emerald)" : "var(--color-glass-dim)" }}
                    >
                      {t.n}
                    </span>
                    <span
                      className="font-display-mixed text-[1.55rem] leading-tight transition-colors duration-500"
                      style={{ color: on ? "var(--color-chalk)" : "var(--color-glass-dim)" }}
                    >
                      {t.name}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-[1.1rem] leading-relaxed transition-colors duration-500"
                    style={{ color: on ? "var(--color-glass)" : "var(--color-glass-dim)" }}
                  >
                    {t.line}
                  </p>
                </li>
              );
            })}
          </ol>

          <motion.div
            style={{ y: stageY, scale: stageScale }}
            className="order-1 hidden min-w-0 items-center justify-center lg:order-2 lg:flex"
          >
            <svg viewBox="-340 -440 1000 800" className="h-full max-h-[58vh] w-full" aria-hidden>
              <motion.g style={{ opacity: axisOpacity }}>
                <line
                  x1={0}
                  y1={-352}
                  x2={0}
                  y2={236}
                  stroke="var(--color-emerald)"
                  strokeWidth={1}
                  strokeDasharray="2 6"
                />
              </motion.g>

              <GhostCube
                b={box(0, 0, -0.02, W, W, 0.02)}
                s={S}
                stroke="rgba(125,143,137,0.28)"
                fill="rgba(125,143,137,0.03)"
                dashed
              />

              {TIERS.map((t, i) => (
                <Layer key={t.id} i={i} n={t.n} label={t.name} progress={scrollYProgress} />
              ))}

              <motion.g style={{ opacity: sealOpacity }}>
                <line x1={-206} y1={-300} x2={-206} y2={196} stroke="var(--color-emerald)" strokeWidth={1} />
                <line x1={-212} y1={-300} x2={-200} y2={-300} stroke="var(--color-emerald)" strokeWidth={1} />
                <line x1={-212} y1={196} x2={-200} y2={196} stroke="var(--color-emerald)" strokeWidth={1} />
                <text
                  x={-218}
                  y={-52}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={11}
                  letterSpacing="0.18em"
                  fill="var(--color-emerald)"
                  transform="rotate(-90 -218 -52)"
                >
                  ONE SYSTEM
                </text>
              </motion.g>
            </svg>
          </motion.div>
        </div>

        <div className="mx-auto hidden w-full max-w-[1500px] lg:block">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-[var(--line)] pt-4">
            <p
              className="annot transition-colors duration-500"
              style={{ color: complete ? "var(--color-emerald)" : undefined }}
            >
              {complete
                ? "Lined up · four layers, one set of definitions"
                : landed < 0
                  ? "Four layers, out of line · keep scrolling"
                  : `${TIERS[landed].n} ${TIERS[landed].name} · set`}
            </p>
            <a
              href="#symptoms"
              className="annot border-b border-transparent pb-1 transition-colors hover:text-chalk"
            >
              Skip ahead ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Layer({
  i,
  n,
  label,
  progress,
}: {
  i: number;
  n: string;
  label: string;
  progress: MotionValue<number>;
}) {
  const { start, end } = window_(i);
  const from = SCATTER[i];

  const x = useTransform(progress, [start, end], [from.x, 0], { clamp: true });
  const y = useTransform(progress, [start, end], [from.y, 0], { clamp: true });

  /* Mass arrives last. A layer that is already solid while it is still out of
     position reads as two solids intersecting; kept as intent until it is on
     the line, it reads as something being set. */
  const ghost = useTransform(progress, [end - 0.11, end - 0.02], [1, 0], { clamp: true });
  const solid = useTransform(progress, [end - 0.09, end], [0, 1], { clamp: true });
  /* The name arrives with the block and then stays at full strength — these
     are the four things the whole page is about, not annotation. */
  const tag = useTransform(progress, [end - 0.1, end - 0.03], [0, 1], { clamp: true });

  const b = boxes[i];
  const v = rightVertex(b, S);

  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ opacity: ghost }}>
        <GhostCube b={b} s={S} dashed />
      </motion.g>
      <motion.g style={{ opacity: solid }}>
        <Cube b={b} s={S} skin={SKIN[i]} />
      </motion.g>
      <motion.g style={{ opacity: tag }}>
        <Tag at={v} n={n} label={label} reach={62} size={15} />
      </motion.g>
    </motion.g>
  );
}
