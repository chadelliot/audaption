"use client";

/*
  One blueprint, four capabilities.

  The grammar never changes and that is the whole argument: business inputs on
  the left, the unified data layer underneath everything, three building blocks
  that turn intelligence into an operating capability, the capability named on
  the bar above it, and business outcomes on the right. Learn one of these
  diagrams and you can read all four.

  Both sides take a variable number of boxes — three or four — because some
  capabilities genuinely need a fourth input and forcing them all to three
  would be the diagram lying to make the layout easier.
*/

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cube, FaceLabel } from "@/components/iso/Cube";
import {
  TooltipBubble,
  useDismiss,
  useTooltip,
} from "@/components/iso/Tooltip";
import {
  box,
  KX,
  KY,
  faces,
  poly,
  project,
  type Box,
  type P,
} from "@/lib/iso";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { FOUNDATION_LABEL, type Capability } from "@/lib/systems";

const S = 50;

/** Shared with the carousel, so the rails it draws sit in this same space. */
export const BP_VIEWBOX = "-700 -556 1400 796";
const INK = "#262626";
const EASE = [0.22, 1, 0.36, 1] as const;
const BEAT = 200;

/* The three building blocks always take the same three accents, so a reader
   tracking "the green one" is tracking the same position every time. */
const BLOCK_SKINS = ["jade", "lapis", "timber"] as const;

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const BASE = box(-5.6, -2.4, -1.0, 11.0, 4.8, 1.0);

/*
  One size for every block, chosen so the longest label in the whole section —
  "Commercial Orchestration" — sets on two lines inside the face with room to
  spare. Sizing each block to its own text would make the diagram a bar chart
  of word lengths.
*/
const BLOCK_W = 3.0;
const BLOCK_H = 2.0;

const BLOCKS: Box[] = [0, 1, 2].map((i) =>
  box(-4.7 + i * 3.1, -1.3, 0, BLOCK_W, BLOCK_W, BLOCK_H),
);

/** The floating bar that names the capability. */
const BAR = box(-3.9, -4.4, 3.5, 6.6, 1.6, 0.7);

/** Stacked left and right, and every one of them the same size. */
const IN_W = 3.2;
const stack = (n: number, x: number, y: number, lift: number): Box[] => {
  const h = 1.25;
  const gap = h + 0.08;
  return Array.from({ length: n }, (_, i) =>
    box(x, y, (n - 1 - i) * gap + lift, IN_W, IN_W, h),
  );
};

const line = (pts: P[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

/* ------------------------------------------------------------------ */

const STEP = {
  BASE: 1,
  INPUTS: 2,
  BLOCK_1: 3,
  BLOCK_2: 4,
  BLOCK_3: 5,
  BAR: 6,
  LINES: 7,
  OUTCOMES: 8,
} as const;
const LAST = STEP.OUTCOMES;

export default function Blueprint({
  capability,
  play,
}: {
  capability: Capability;
  play: boolean;
}) {
  const still = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [openBlock, setOpenBlock] = useState<number | null>(null);

  /* Restarting the assembly on a capability change is derived from props, not
     an effect: keeping it in render means the new blueprint's first painted
     frame is already step zero rather than the previous one's finished state. */
  const [builtFor, setBuiltFor] = useState(capability.id);
  if (builtFor !== capability.id) {
    setBuiltFor(capability.id);
    setStep(0);
    setOpenBlock(null);
  }

  const inputs = useMemo(
    () => stack(capability.inputs.length, -12.4, -1.6, 0.2),
    [capability.inputs.length],
  );
  const outcomes = useMemo(
    () => stack(capability.outcomes.length, 8.0, -4.4, 0.9),
    [capability.outcomes.length],
  );

  useEffect(() => {
    if (still || !play || step >= LAST) return;
    const t = setTimeout(() => setStep((n) => n + 1), BEAT);
    return () => clearTimeout(t);
  }, [play, step, still]);

  useDismiss(() => setOpenBlock(null), openBlock !== null);

  const at = (n: number) => (still && play) || step >= n;

  const FEEDS = inputs.map((b) =>
    line([
      project(b.x + b.w, b.y + b.d / 2, b.z + b.h / 2, S),
      project(-7.2, b.y + b.d / 2, b.z + b.h / 2, S),
      project(-7.2, b.y + b.d / 2, 0.12, S),
      project(-5.2, 0, 0.12, S),
    ]),
  );

  const RESULTS = outcomes.map((b, i) =>
    line([
      project(4.4, 0, 0.12, S),
      project(5.6 + i * 0.4, 0, 0.12, S),
      project(5.6 + i * 0.4, 0, b.z + b.h / 2, S),
      project(5.6 + i * 0.4, b.y + b.d / 2, b.z + b.h / 2, S),
      project(b.x, b.y + b.d / 2, b.z + b.h / 2, S),
    ]),
  );

  const STALKS = [0, 1, 2].map((i) =>
    line([
      project(BAR.x + 1.1 + i * 2.2, BAR.y + BAR.d, BAR.z, S),
      project(BLOCKS[i].x + BLOCKS[i].w / 2, BLOCKS[i].y, BLOCKS[i].h, S),
    ]),
  );

  return (
    <svg
      viewBox={BP_VIEWBOX}
      className="h-auto w-full min-w-[720px]"
      role="img"
      aria-label={`${capability.name}: ${capability.inputs.join(", ")} feed ${capability.blocks
        .map((b) => b.title)
        .join(", ")} on the unified data layer, producing ${capability.outcomes.join(", ")}.`}
    >
      <defs>
        <pattern
          id="bpHatch"
          width="7"
          height="7"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(38,38,38,0.5)" strokeWidth="1" />
        </pattern>
        <marker
          id="bpTip"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 1 L9 5 L0 9 z" fill={INK} />
        </marker>
      </defs>

      {/* inputs, painted bottom-up so the box above never buries the label
          of the box below */}
      {[...inputs.keys()]
        .sort((a, b) => inputs[a].z - inputs[b].z)
        .map((i) => (
          <Arrive key={`in-${i}`} on={at(STEP.INPUTS)} delay={(inputs.length - i) * 0.08}>
            <Outline b={inputs[i]} label={capability.inputs[i]} />
          </Arrive>
        ))}

      {/* the foundation every capability is built on */}
      <Arrive on={at(STEP.BASE)}>
        <Cube b={BASE} s={S} skin="paper" edgeColor={INK} />
        <FaceLabel
          b={BASE}
          s={S}
          text={FOUNDATION_LABEL}
          size={15}
          color={INK}
          pad={16}
        />
      </Arrive>

      <motion.g
        initial={false}
        animate={{ opacity: at(STEP.LINES) ? 1 : 0 }}
        transition={{ duration: 0.45 }}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
        strokeLinejoin="round"
        markerEnd="url(#bpTip)"
      >
        {FEEDS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </motion.g>

      {/* the three building blocks */}
      {capability.blocks.map((blk, i) => {
        const dim = openBlock !== null && openBlock !== i;
        return (
          <Arrive key={blk.title} on={at(STEP.BLOCK_1 + i)}>
            <motion.g
              animate={{ opacity: dim ? 0.45 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <Cube
                b={BLOCKS[i]}
                s={S}
                skin={BLOCK_SKINS[i]}
                edgeColor={INK}
                edgeWidth={openBlock === i ? 2 : 1}
              />
              <FaceLabel
                b={BLOCKS[i]}
                s={S}
                text={blk.title.toUpperCase()}
                size={13}
                color={i === 1 ? "#0d1b2c" : "#06231c"}
              />
            </motion.g>
          </Arrive>
        );
      })}

      <motion.g
        initial={false}
        animate={{ opacity: at(STEP.BAR) ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        fill="none"
        stroke={INK}
        strokeWidth={1.3}
      >
        {STALKS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </motion.g>

      <Arrive on={at(STEP.BAR)} from={-30}>
        <Cube b={BAR} s={S} skin="stone" edgeColor={INK} />
        <FaceLabel
          b={BAR}
          s={S}
          side="top"
          text={capability.bar}
          size={14}
          color="#e8eae7"
          pad={12}
        />
      </Arrive>

      <motion.g
        initial={false}
        animate={{ opacity: at(STEP.OUTCOMES) ? 1 : 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
        strokeLinejoin="round"
        markerEnd="url(#bpTip)"
      >
        {RESULTS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </motion.g>

      {[...outcomes.keys()]
        .sort((a, b) => outcomes[a].z - outcomes[b].z)
        .map((i) => (
          <Arrive
            key={`out-${i}`}
            on={at(STEP.OUTCOMES)}
            delay={(outcomes.length - i) * 0.08}
          >
            <Outline b={outcomes[i]} label={capability.outcomes[i]} />
          </Arrive>
        ))}

      {/* Triggers sit above the blocks so hover and focus land on a real
          target; the cubes themselves are decorative once labelled. */}
      {capability.blocks.map((blk, i) => (
        <BlockTrigger
          key={`t-${blk.title}`}
          b={BLOCKS[i]}
          text={blk.tooltip}
          title={blk.title}
          open={openBlock === i}
          onOpen={() => setOpenBlock(i)}
          onClose={() => setOpenBlock(null)}
          onToggle={() => setOpenBlock((v) => (v === i ? null : i))}
        />
      ))}

      <text
        x={-676}
        y={-522}
        className="font-mono"
        fontSize={15}
        letterSpacing="0.18em"
        fill="var(--color-mute)"
      >
        BUSINESS INPUTS
      </text>
      <text
        x={470}
        y={-522}
        className="font-mono"
        fontSize={15}
        letterSpacing="0.18em"
        fill="var(--color-mute)"
      >
        BUSINESS OUTCOMES
      </text>
    </svg>
  );
}

function BlockTrigger({
  b,
  title,
  text,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  b: Box;
  title: string;
  text: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const tip = useTooltip();
  const top = project(b.x + b.w / 2, b.y + b.d / 2, b.h, S);
  const f = faces(b, S);

  return (
    <g data-tip-trigger>
      <g
        role="button"
        tabIndex={0}
        aria-describedby={open ? tip.id : undefined}
        aria-label={`${title}. ${text}`}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onFocus={onOpen}
        onBlur={onClose}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        style={{ cursor: "pointer", outline: "none" }}
      >
        {/* invisible hit area covering the whole solid */}
        <polygon points={poly(f.top)} fill="transparent" />
        <polygon points={poly(f.left)} fill="transparent" />
        <polygon points={poly(f.right)} fill="transparent" />
      </g>
      <TooltipBubble id={tip.id} open={open} x={top.x} y={top.y} text={text} />
    </g>
  );
}

function Arrive({
  on,
  delay = 0,
  from = 28,
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

/*
  Anything that isn't ours is drawn as hatched linework rather than filled —
  the inputs belong to the client and the outcomes belong to the business.
*/
function Outline({ b, label }: { b: Box; label: string }) {
  return (
    <g>
      <Cube b={b} s={S} skin="paper" edgeColor={INK} />
      <polygon
        points={poly(faces(b, S).right)}
        fill="url(#bpHatch)"
        stroke={INK}
        strokeWidth={1}
      />
      <FaceLabel b={b} s={S} text={label.toUpperCase()} size={12} color={INK} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The road                                                            */
/* ------------------------------------------------------------------ */

/*
  Two rails running out past both edges of the frame along the ground axis
  that reads as right-and-up on screen, so the road climbs to the upper right
  and falls away to the lower left. The platform's long side sits across it,
  which is what makes the platform look like it is standing *on* the road
  rather than lying along it.

  They belong to the carousel rather than to the blueprint, and that is the
  whole point: the rails hold still while one platform slides down the road to
  the lower left and the next arrives from the upper right, so the movement
  reads as one foundation travelling rather than as two pictures being
  swapped. A rail that slid with its platform would say nothing at all.
*/
const RAIL_RUN = 34;
const RAIL_Z = BASE.z;

/*
  The screen direction of one world unit along +y — down and to the left. The
  carousel moves each platform along this vector so the slide and the road
  agree; if they disagreed the drawing would look like it was sliding across
  its own perspective.
*/
const yLen = Math.hypot(KX, KY);
export const ROAD_STEP = { x: -KX / yLen, y: KY / yLen };

export function BlueprintRails({ ink = "rgba(38,38,38,0.3)" }: { ink?: string }) {
  const rail = (x: number) => ({
    a: project(x, -RAIL_RUN, RAIL_Z, S),
    b: project(x, RAIL_RUN, RAIL_Z, S),
  });

  const left = rail(BASE.x);
  const right = rail(BASE.x + BASE.w);

  /* Sleepers across the road, cleared from under the platform so the surface
     stays quiet where the drawing is doing its work. */
  const ties = Array.from({ length: 31 }, (_, i) => {
    const y = -30 + i * 2;
    const clear = Math.abs(y) > 3.6;
    return {
      y,
      a: project(BASE.x, y, RAIL_Z, S),
      b: project(BASE.x + BASE.w, y, RAIL_Z, S),
      o: clear ? Math.max(0, 0.46 - Math.abs(y) / 105) : 0,
    };
  });

  return (
    <g aria-hidden>
      <g stroke={ink} strokeWidth={1}>
        {ties
          .filter((t) => t.o > 0)
          .map((t) => (
            <line key={t.y} x1={t.a.x} y1={t.a.y} x2={t.b.x} y2={t.b.y} opacity={t.o} />
          ))}
      </g>
      <g stroke={ink} strokeWidth={1.25} strokeDasharray="14 9">
        <line x1={left.a.x} y1={left.a.y} x2={left.b.x} y2={left.b.y} />
        <line x1={right.a.x} y1={right.a.y} x2={right.b.x} y2={right.b.y} />
      </g>
    </g>
  );
}
