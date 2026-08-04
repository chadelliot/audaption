"use client";

import { motion, useReducedMotion } from "framer-motion";

const CENTER = { x: 400, y: 280 };

const nodes = [
  { label: "Marketing", x: 400, y: 70, anchor: "middle" as const, dx: 0, dy: -16 },
  { label: "Sales", x: 581.9, y: 175, anchor: "start" as const, dx: 14, dy: 4 },
  { label: "Finance", x: 581.9, y: 385, anchor: "start" as const, dx: 14, dy: 4 },
  { label: "Service", x: 400, y: 490, anchor: "middle" as const, dx: 0, dy: 28 },
  { label: "Ops", x: 218.1, y: 385, anchor: "end" as const, dx: -14, dy: 4 },
  { label: "Data", x: 218.1, y: 175, anchor: "end" as const, dx: -14, dy: 4 },
];

export default function HeroSchematic() {
  const reduceMotion = useReducedMotion();
  const lineDuration = reduceMotion ? 0 : 0.9;
  const stagger = reduceMotion ? 0 : 0.1;

  return (
    <svg
      viewBox="0 0 800 560"
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label="Diagram showing marketing, sales, finance, service, operations, and data converging into one Audaption system."
    >
      {nodes.map((node, i) => (
        <motion.line
          key={node.label}
          x1={node.x}
          y1={node.y}
          x2={CENTER.x}
          y2={CENTER.y}
          stroke="var(--color-emerald)"
          strokeOpacity={0.45}
          strokeWidth={1.25}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.45 }}
          transition={{ duration: lineDuration, delay: 0.15 + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {nodes.map((node, i) => (
        <motion.g
          key={node.label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 + i * stagger }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        >
          <rect
            x={node.x - 4}
            y={node.y - 4}
            width={8}
            height={8}
            fill="var(--color-obsidian)"
            stroke="var(--color-emerald)"
            strokeWidth={1.25}
          />
          <text
            x={node.x + node.dx}
            y={node.y + node.dy}
            textAnchor={node.anchor}
            className="font-mono"
            fontSize="15"
            fill="var(--color-paper)"
            fillOpacity={0.7}
            letterSpacing="0.02em"
          >
            {node.label}
          </text>
        </motion.g>
      ))}

      <motion.circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={58}
        fill="var(--color-obsidian)"
        stroke="var(--color-emerald)"
        strokeOpacity={0.5}
        strokeWidth={1.25}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 + nodes.length * stagger + 0.25 }}
        style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
      />
      <motion.foreignObject
        x={CENTER.x - 30}
        y={CENTER.y - 30}
        width={60}
        height={60}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 + nodes.length * stagger + 0.25 }}
      >
        <img src="/audaption-mark.svg" alt="" className="h-full w-full" />
      </motion.foreignObject>
    </svg>
  );
}
