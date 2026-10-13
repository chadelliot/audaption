"use client";

/*
  Four drawings, one projection, printed on paper.

  Each one plays its own contained timeline the moment its part of the scroll
  arrives. The reader never scrubs a component into place and never lands on a
  half-assembled drawing: entering the part starts the sequence, and the
  sequence finishes on its own whether the reader keeps scrolling or not.

  Every solid takes a graphite edge, the same treatment the capability
  blueprints use, so the whole page reads as one drawing set. These are printed
  on the darker tan ground, so the paper solids are the lifted variant — on the
  darker sheet the standard paper face is almost the same value as the ground
  and the objects stop reading as objects.

  Depth is painter's order: anything with a larger (x + y) is nearer the
  viewer, so it is drawn last.
*/

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cube, FaceLabel, GhostCube } from "@/components/iso/Cube";
import { box, faces, poly, project, type Box, type P } from "@/lib/iso";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

export interface GraphicProps {
  /** True once this part owns the screen. Starts its timeline. */
  play: boolean;
}

export const INK = "#262626";
const HAIR = "rgba(38,38,38,0.22)";
const MUTE = "var(--color-mute)";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A contained timeline. Advances one step per beat once `play` is true, and
 * jumps straight to the finished state for anyone who asked for less motion.
 */
function useTimeline(play: boolean, steps: number, beat = 300) {
  const still = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (still) return;
    if (!play) return;
    if (step >= steps) return;
    const t = setTimeout(() => setStep((n) => n + 1), beat);
    return () => clearTimeout(t);
  }, [play, step, steps, beat, still]);

  return still && play ? steps : step;
}

/** Everything enters the same way: up, and slightly late. */
function Arrive({
  on,
  delay = 0,
  from = 26,
  children,
}: {
  on: boolean;
  delay?: number;
  from?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.g
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: from }}
      transition={{ duration: 0.5, delay: on ? delay : 0, ease: EASE }}
    >
      {children}
    </motion.g>
  );
}

const Note = ({
  t,
  at,
  size = 15,
  fill = INK,
  anchor = "middle",
  weight,
}: {
  t: string;
  at: P;
  size?: number;
  fill?: string;
  anchor?: "middle" | "start" | "end";
  weight?: number;
}) => (
  <text
    x={at.x}
    y={at.y}
    textAnchor={anchor}
    className="font-mono"
    fontSize={size}
    fontWeight={weight}
    letterSpacing="0.12em"
    fill={fill}
  >
    {t}
  </text>
);

/** The hatch every outline box on the page shares. */
export function Hatch({ id = "sysHatch" }: { id?: string }) {
  return (
    <pattern
      id={id}
      width="7"
      height="7"
      patternTransform="rotate(45)"
      patternUnits="userSpaceOnUse"
    >
      <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(38,38,38,0.5)" strokeWidth="1" />
    </pattern>
  );
}

/** Paper box with a hatched right face — anything that isn't ours. */
function Outline({ b, s, hatch = "sysHatch" }: { b: Box; s: number; hatch?: string }) {
  return (
    <g>
      <Cube b={b} s={s} skin="paperLift" edgeColor={INK} />
      <polygon
        points={poly(faces(b, s).right)}
        fill={`url(#${hatch})`}
        stroke={INK}
        strokeWidth={1}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Customer Data                                                  */
/* ------------------------------------------------------------------ */

/*
  Six sources arrive one at a time, and the block in the middle grows on each
  arrival. The claim is literal: the single view is made of them, so it cannot
  be taller than the number of sources that have actually landed.
*/
const SOURCES = ["CRM", "WEBSITE", "ADS", "SUPPORT", "BILLING", "PRODUCT"];

/** Where the six outside blocks stand, as world (x, y) centres. */
const SPOTS: [number, number][] = [
  [3.6, -1.8],
  [3.6, 0],
  [3.6, 1.8],
  [1.8, 3.6],
  [0, 3.6],
  [-1.8, 3.6],
];

/*
  The same drawing carries a second claim. Customer Data says every source feeds
  one view; Signals says every signal lands on one record, which is why a play
  can fire on it. Same geometry, different names — the six outside blocks are
  not ours either way, so they keep the hatched face.
*/
const SIGNALS = ["FUNDING", "NEW EXEC", "INTENT", "CHAMPION", "RIVAL", "SPEND ↓"];

interface DataProps extends GraphicProps {
  sources?: string[];
  centre?: string;
  note?: string;
  /** Which face carries each outside block's name. */
  labelSide?: "left" | "top";
}

export function DataGraphic({
  play,
  sources = SOURCES,
  centre: centreLabel = "ONE VIEW",
  note = "ONE CUSTOMER, DEFINED ONCE",
  labelSide = "left",
}: DataProps) {
  const S = 60;
  const landed = useTimeline(play, sources.length + 1, 300);

  const h = 0.8 + Math.min(landed, sources.length) * 0.22;
  const centre = box(-1.4, -1.4, 0, 2.8, 2.8, h);

  /* Two rows of three, one down each flank of the block, both in front of it.
     A ring around the block hid the two behind it — their labels, and so their
     part of the claim, were simply not visible. */
  const sats = sources.map((name, i) => {
    const [cx, cy] = SPOTS[i];
    return {
      name,
      i,
      depth: cx + cy,
      b: box(cx - 0.8, cy - 0.8, 0, 1.6, 1.6, 0.8),
      hub: project(cx, cy, 0.8, S),
    };
  });

  const top = project(0, 0, h, S);
  const ordered = [...sats].sort((a, b) => a.depth - b.depth);

  /* The highest point anywhere in the drawing: the rear corner of the centre
     block's lid, or of a source behind it. The caption is hung from this, not
     from the lid's centre, which sits some 70 units lower and put the label
     straight through the top of the block. */
  const ceiling = Math.min(
    project(centre.x, centre.y, h, S).y,
    ...sats.map((s) => project(s.b.x, s.b.y, s.b.h, S).y),
  );

  return (
    <svg viewBox="-480 -270 960 540" className="h-auto max-h-full w-full" aria-hidden>
      <defs>
        <Hatch />
      </defs>

      <GhostCube
        b={box(-4.4, -4.4, -0.34, 8.8, 8.8, 0.34)}
        s={S}
        stroke={INK}
        fill="rgba(38,38,38,0.05)"
      />

      <g stroke={HAIR} strokeWidth={1} strokeDasharray="3 5" fill="none">
        {sats.slice(0, landed).map((s) => (
          <line key={s.name} x1={s.hub.x} y1={s.hub.y} x2={0} y2={top.y + 10} />
        ))}
      </g>

      {ordered
        .filter((s) => s.depth < 0)
        .map((s) => (
          <Arrive key={s.name} on={landed > s.i} from={46}>
            <Outline b={s.b} s={S} />
            <FaceLabel b={s.b} s={S} side={labelSide} text={s.name} size={12} color={INK} />
          </Arrive>
        ))}

      <Cube b={centre} s={S} skin="jade" edgeColor={INK} />
      <FaceLabel b={centre} s={S} text={centreLabel} size={14} />

      {ordered
        .filter((s) => s.depth >= 0)
        .map((s) => (
          <Arrive key={s.name} on={landed > s.i} from={46}>
            <Outline b={s.b} s={S} />
            <FaceLabel b={s.b} s={S} side={labelSide} text={s.name} size={12} color={INK} />
          </Arrive>
        ))}

      <Arrive on={landed > sources.length}>
        <line
          x1={0}
          y1={ceiling - 6}
          x2={0}
          y2={ceiling - 30}
          stroke="var(--color-jade)"
          strokeWidth={1}
        />
        <Note
          t={note}
          at={{ x: 0, y: ceiling - 40 }}
          fill="var(--color-jade-deep)"
        />
      </Arrive>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Customer Journey                                               */
/* ------------------------------------------------------------------ */

/*
  A progression model. Five phases laid out as a rising track, and customer
  units moving along it: some reach the end, others stop partway and drop out
  of the flow. Where they stop is marked, because that is the whole product of
  the drawing — a map of real progression with the leaks named.

  Deliberately not a conveyor. Rungs and a belt made it read as a warehouse;
  a stepped track with phase names printed on each segment reads as a journey.
*/
const PHASES = ["DISCOVER", "CONSIDER", "ENGAGE", "CONVERT", "RETAIN"];

/*
  Where each unit stops. `5` means it came through the whole journey; `slot`
  keeps units that stop in the same phase side by side instead of stacked on
  one another.

  The shape is the claim: opportunity gets in, a little drops at the top, and
  the biggest loss is late, at the point of conversion. That is what the Funnel
  chapter says and what the approach page's funnel finds — qualified opportunity
  is not the problem, deals are lost late.
*/
const UNITS: { stop: number; slot: number }[] = [
  { stop: 5, slot: 0 },
  { stop: 2, slot: 0 },
  { stop: 4, slot: 0 },
  { stop: 5, slot: 1 },
  { stop: 4, slot: 1 },
  { stop: 3, slot: 0 },
  { stop: 4, slot: 2 },
  { stop: 5, slot: 2 },
];

const SEG_W = 2.4;
/* Deep enough that the phase name sits inside the face with clearance above
   and below it. A thin slab cut the type with its own top and bottom edges. */
const SEG_H = 0.95;
const SEG_X = (n: number) => -6.0 + n * SEG_W;
/** The track rises as the customer progresses. */
const SEG_Z = (n: number) => n * 0.3;

export function JourneyGraphic({ play }: GraphicProps) {
  const S = 52;
  const step = useTimeline(play, UNITS.length + 2, 300);

  /* Which phases lost somebody, for the diagnostic marks. */
  const leaks = PHASES.map((_, n) =>
    UNITS.filter((u, i) => u.stop === n + 1 && u.stop < PHASES.length && step > i)
      .length,
  );
  /* The phase that loses the most is the leak; it is named as one. */
  const worst = Math.max(...leaks);

  return (
    <svg viewBox="-470 -250 920 430" className="h-auto max-h-full w-full" aria-hidden>
      <defs>
        <Hatch id="jHatch" />
      </defs>

      {PHASES.map((name, n) => {
        const b = box(SEG_X(n), -0.9, SEG_Z(n), SEG_W, 1.8, SEG_H);
        return (
          <g key={name}>
            <Cube b={b} s={S} skin={n === PHASES.length - 1 ? "jade" : "paperLift"} edgeColor={INK} />
            <FaceLabel
              b={b}
              s={S}
              text={name}
              size={13}
              color={n === PHASES.length - 1 ? "#06231c" : INK}
              pad={13}
            />
          </g>
        );
      })}

      {UNITS.map((u, i) => (
        <Unit key={i} u={u} i={i} S={S} step={step} />
      ))}

      {/* the diagnostic: where progression breaks down */}
      {leaks.map((n, i) =>
        n > 0 ? (
          <Arrive key={`leak-${i}`} on delay={0.1}>
            <line
              x1={project(SEG_X(i) + SEG_W / 2, 1.0, SEG_Z(i) + SEG_H, S).x}
              y1={project(SEG_X(i) + SEG_W / 2, 1.0, SEG_Z(i) + SEG_H, S).y}
              x2={project(SEG_X(i) + SEG_W / 2, 2.6, SEG_Z(i), S).x}
              y2={project(SEG_X(i) + SEG_W / 2, 2.6, SEG_Z(i), S).y}
              stroke="var(--color-timber-ink)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <Note
              t={`${n} LOST HERE`}
              at={project(SEG_X(i) + SEG_W / 2, 3.5, SEG_Z(i), S)}
              size={n === worst && n > 1 ? 15 : 13}
              weight={n === worst && n > 1 ? 600 : undefined}
              fill="var(--color-timber-ink)"
            />
          </Arrive>
        ) : null,
      )}

      <Arrive on={step > UNITS.length}>
        <Note
          t="DEALS ARE LOST LATE, NOT AT THE TOP"
          at={{ x: -440, y: project(0.4, 5.4, 0, S).y }}
          anchor="start"
          fill="var(--color-jade-deep)"
        />
      </Arrive>

      <Note t="IN" at={project(-7.0, 0.4, 0.3, S)} size={14} fill={MUTE} />
      <Note t="RETAINED" at={project(7.0, -1.4, 2.4, S)} size={14} fill={MUTE} />
    </svg>
  );
}

function Unit({
  u,
  i,
  S,
  step,
}: {
  u: { stop: number; slot: number };
  i: number;
  S: number;
  step: number;
}) {
  const on = step > i;
  const done = u.stop === PHASES.length;
  /* Units that stop step out of the flow and sit in front of the phase that
     lost them; units that finish rest on the last segment. */
  const n = done ? PHASES.length - 1 : u.stop - 1;
  /* Three side by side must fit a 2.4-wide segment without touching. */
  const x = SEG_X(n) + 0.04 + u.slot * 0.8;
  const y = done ? -0.3 : 1.5;
  const b = box(x, y, SEG_Z(n) + (done ? SEG_H : 0), 0.64, 0.64, 0.46);

  return (
    <motion.g
      initial={false}
      animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
      transition={{ duration: 0.6, delay: on ? i * 0.05 : 0, ease: EASE }}
    >
      <Cube b={b} s={S} skin={done ? "jade" : "timber"} edgeColor={INK} />
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Go-to-Market Strategy                                          */
/* ------------------------------------------------------------------ */

/*
  Markets sized by what they are worth rather than by who argues hardest for
  them. The names are written on the columns themselves, running up the face
  in the drawing's own perspective — floating labels collided with each other
  and read as a chart legend rather than as part of the object.
*/
/*
  The heights are illustrative and the drawing says so. It used to print dollar
  figures on the two picked columns; those were not Audaption's to claim. What
  the drawing argues is the order — the biggest open pool is funded first, the
  next after it, and the rest wait — so that is what is printed.
*/
const MARKETS: { name: string; v: number; pick: boolean; spend?: string }[] = [
  { name: "SMB", v: 1.1, pick: false },
  { name: "PARTNER", v: 1.6, pick: false },
  { name: "APAC", v: 2.0, pick: false },
  { name: "MID-MARKET", v: 2.8, pick: true, spend: "2ND" },
  { name: "EMEA", v: 2.2, pick: false },
  { name: "ENTERPRISE", v: 3.6, pick: true, spend: "1ST" },
];

export function StrategyGraphic({ play }: GraphicProps) {
  const S = 54;
  const step = useTimeline(play, MARKETS.length + 1, 260);
  const a0 = project(-4.6, -1.8, 0, S);

  return (
    <svg viewBox="-340 -200 760 400" className="h-auto max-h-full w-full" aria-hidden>
      <g stroke={HAIR} strokeWidth={1} fill="none">
        <line
          x1={a0.x}
          y1={a0.y}
          x2={project(6.4, -1.8, 0, S).x}
          y2={project(6.4, -1.8, 0, S).y}
        />
        <line
          x1={a0.x}
          y1={a0.y}
          x2={project(-4.6, 2.2, 0, S).x}
          y2={project(-4.6, 2.2, 0, S).y}
        />
      </g>

      {MARKETS.map((m, i) => (
        <Market key={m.name} m={m} i={i} S={S} on={step > i} />
      ))}

      <Arrive on={step > MARKETS.length}>
        <Note
          t="FUND THE BIGGEST OPEN POOL FIRST · HEIGHTS ILLUSTRATIVE"
          at={{ x: -330, y: 168 }}
          anchor="start"
          size={13}
          fill="var(--color-jade-deep)"
        />
      </Arrive>
    </svg>
  );
}

function Market({
  m,
  i,
  S,
  on,
}: {
  m: { name: string; v: number; pick: boolean; spend?: string };
  i: number;
  S: number;
  on: boolean;
}) {
  const b = box(-3.7 + i * 1.55, -0.6, 0, 1.25, 1.25, m.v);

  return (
    <motion.g
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: on ? i * 0.05 : 0, ease: EASE }}
    >
      <Cube b={b} s={S} skin={m.pick ? "jade" : "paperLift"} edgeColor={INK} />
      {/* Printed up the column's front face rather than on the narrow side
          plane, so the name belongs to the object it names. */}
      <FaceLabel
        b={b}
        s={S}
        side="up"
        text={m.name}
        size={12.5}
        color={m.pick ? "#06231c" : INK}
        pad={11}
      />
      {/* Set flat on the top face in white. Nothing on these drawings floats
          beside the object it belongs to. */}
      {m.spend ? (
        <FaceLabel
          b={b}
          s={S}
          side="top"
          text={m.spend}
          size={15}
          color="#ffffff"
          pad={10}
        />
      ) : null}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Artificial Intelligence                                        */
/* ------------------------------------------------------------------ */

/*
  The three layers set first, in order. Then one green slab drops onto them —
  customer experience, the finish on everything underneath — and the AI block
  rises up through it from the middle. Reversing that order would be a nicer
  animation and a false claim.
*/
const AI_LAYERS = ["CUSTOMER DATA", "CUSTOMER JOURNEY", "GO-TO-MARKET STRATEGY"];
const SLAB = 0.78;
const W = 4.6;

export function AiGraphic({ play }: GraphicProps) {
  const S = 62;
  const step = useTimeline(play, AI_LAYERS.length + 3, 340);
  const zTop = AI_LAYERS.length * SLAB;

  return (
    <svg viewBox="-360 -420 720 620" className="h-auto max-h-full w-full" aria-hidden>
      <defs>
        <Hatch id="aiHatch" />
      </defs>

      <GhostCube
        b={box(-W / 2 - 0.7, -W / 2 - 0.7, -0.16, W + 1.4, W + 1.4, 0.16)}
        s={S}
        stroke={HAIR}
        fill="none"
        dashed
      />

      {AI_LAYERS.map((name, i) => {
        const b = box(-W / 2, -W / 2, i * SLAB, W, W, SLAB - 0.06);
        return (
          <Arrive key={name} on={step > i} from={40}>
            <Outline b={b} s={S} hatch="aiHatch" />
            <FaceLabel b={b} s={S} text={name} size={13} color={INK} pad={12} />
          </Arrive>
        );
      })}

      {/* customer experience — one slab, dropping in from above */}
      <Arrive on={step > AI_LAYERS.length} from={-110}>
        <Cube
          b={box(-1.9, -1.9, zTop, 3.8, 3.8, 0.55)}
          s={S}
          skin="jade"
          edgeColor={INK}
        />
        <FaceLabel
          b={box(-1.9, -1.9, zTop, 3.8, 3.8, 0.55)}
          s={S}
          text="CUSTOMER EXPERIENCE"
          size={12}
          pad={7}
        />
      </Arrive>

      {/* and AI rises up through the middle of it */}
      <motion.g
        initial={false}
        animate={
          step > AI_LAYERS.length + 1
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 54 }
        }
        transition={{ duration: 0.65, ease: EASE }}
      >
        <Cube
          b={box(-0.95, -0.95, zTop + 0.55, 1.9, 1.9, 1.0)}
          s={S}
          skin="jade"
          edgeColor={INK}
        />
        <FaceLabel
          b={box(-0.95, -0.95, zTop + 0.55, 1.9, 1.9, 1.0)}
          s={S}
          text="AI"
          size={16}
        />
      </motion.g>

      <Arrive on={step > AI_LAYERS.length + 2}>
        <Note
          t="STANDS ON EVERYTHING BELOW IT"
          at={project(0, 0, zTop + 2.3, S)}
          fill="var(--color-jade-deep)"
        />
      </Arrive>
    </svg>
  );
}

/** The Signals chapter's drawing: every signal lands on one record. */
export function SignalsGraphic({ play }: GraphicProps) {
  return (
    <DataGraphic
      play={play}
      sources={SIGNALS}
      centre="ONE RECORD"
      note="EVERY SIGNAL LANDS ON ONE RECORD"
      labelSide="top"
    />
  );
}

export const GRAPHICS = {
  data: DataGraphic,
  signals: SignalsGraphic,
  journey: JourneyGraphic,
  strategy: StrategyGraphic,
  ai: AiGraphic,
};
