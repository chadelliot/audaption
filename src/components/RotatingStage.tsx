"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

type Accent = "emerald";

const dotColor: Record<Accent, string> = {
  emerald: "bg-emerald",
};

const strokeColor: Record<Accent, string> = {
  emerald: "var(--color-emerald)",
};

// Stage is authored in a fixed 900x520 coordinate space; the container keeps
// that aspect ratio so the SVG connector lines and the rectangle's CSS
// percentages always line up regardless of rendered size.
const CX = 450;
const CY = 260;
const HALF_W = 300;
const HALF_H = 150;

const CORNERS = {
  tl: { sx: -1, sy: -1, anchor: { x: 50, y: 60 } },
  tr: { sx: 1, sy: -1, anchor: { x: 850, y: 60 } },
  bl: { sx: -1, sy: 1, anchor: { x: 50, y: 460 } },
  br: { sx: 1, sy: 1, anchor: { x: 850, y: 460 } },
} as const;

function useCorner(
  rotateDeg: MotionValue<number>,
  scale: MotionValue<number>,
  sx: number,
  sy: number
) {
  const x = useTransform([rotateDeg, scale], (v: number[]) => {
    const [r, s] = v;
    const rad = (r * Math.PI) / 180;
    const px = HALF_W * sx * s;
    const py = HALF_H * sy * s;
    return CX + (px * Math.cos(rad) - py * Math.sin(rad));
  });
  const y = useTransform([rotateDeg, scale], (v: number[]) => {
    const [r, s] = v;
    const rad = (r * Math.PI) / 180;
    const px = HALF_W * sx * s;
    const py = HALF_H * sy * s;
    return CY + (px * Math.sin(rad) + py * Math.cos(rad));
  });
  return { x, y };
}

export default function RotatingStage({
  rotateDeg,
  scale,
  opacity,
  counterRotate,
  labels,
  activeKey,
  children,
}: {
  rotateDeg: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  counterRotate: MotionValue<number>;
  labels: { key: string; label: string; accent: Accent; corner: keyof typeof CORNERS }[];
  activeKey: string;
  children: React.ReactNode;
}) {
  const corners = {
    tl: useCorner(rotateDeg, scale, CORNERS.tl.sx, CORNERS.tl.sy),
    tr: useCorner(rotateDeg, scale, CORNERS.tr.sx, CORNERS.tr.sy),
    bl: useCorner(rotateDeg, scale, CORNERS.bl.sx, CORNERS.bl.sy),
    br: useCorner(rotateDeg, scale, CORNERS.br.sx, CORNERS.br.sy),
  };

  return (
    <div className="relative aspect-[900/520] w-full">
      <svg
        viewBox="0 0 900 520"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        {labels.map((item) => {
          const anchor = CORNERS[item.corner].anchor;
          const corner = corners[item.corner];
          const active = item.key === activeKey;
          return (
            <motion.line
              key={item.key}
              x1={anchor.x}
              y1={anchor.y}
              x2={corner.x}
              y2={corner.y}
              stroke={strokeColor[item.accent]}
              strokeOpacity={active ? 0.55 : 0.15}
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {labels.map((item) => {
        const anchor = CORNERS[item.corner].anchor;
        const active = item.key === activeKey;
        return (
          <div
            key={item.key}
            className="absolute hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:flex"
            style={{ left: `${(anchor.x / 900) * 100}%`, top: `${(anchor.y / 520) * 100}%` }}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 transition-opacity duration-300 ${dotColor[item.accent]} ${
                active ? "opacity-100" : "opacity-30"
              }`}
            />
            <span
              className={`whitespace-nowrap text-sm transition-colors duration-300 ${
                active ? "text-paper" : "text-paper/30"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}

      {/* positioned to match the 300/150 half-extents around the 450/260 center
          (600/900 = 66.7% wide, 300/520 = 57.7% tall) */}
      <motion.div
        style={{
          rotate: rotateDeg,
          scale,
          opacity,
          left: "16.67%",
          right: "16.67%",
          top: "21.15%",
          bottom: "21.15%",
        }}
        className="absolute rounded-3xl border border-paper/15 bg-[radial-gradient(circle_at_30%_20%,rgba(41,165,135,0.1),transparent_60%)]"
      >
        <motion.div style={{ rotate: counterRotate }} className="h-full w-full">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
