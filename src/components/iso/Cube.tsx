/*
  The cube, and the small vocabulary that goes with it.

  One primitive, drawn the same way on every sheet: three faces, a hairline on
  every visible edge, and — where it earns it — a plate of mono type lying flat
  on the top face. Labels never skew with the projection. A skewed word is a
  texture; an upright word is a name, and these are names.
*/

import {
  faces,
  poly,
  topCentre,
  rightVertex,
  leftVertex,
  monoWidth,
  project,
  SKINS,
  type Box,
  type SkinName,
  type P,
} from "@/lib/iso";

export function Cube({
  b,
  s = 1,
  skin = "chalk",
  label,
  labelSize = 11,
  opacity = 1,
  edgeWidth = 1,
  edgeColor,
}: {
  b: Box;
  s?: number;
  skin?: SkinName;
  label?: string;
  labelSize?: number;
  opacity?: number;
  edgeWidth?: number;
  /** Overrides the skin's own edge — the light ground wants graphite. */
  edgeColor?: string;
}) {
  const f = faces(b, s);
  const k = SKINS[skin];
  const c = topCentre(b, s);

  return (
    <g opacity={opacity}>
      <polygon points={poly(f.left)} fill={k.left} />
      <polygon points={poly(f.right)} fill={k.right} />
      <polygon points={poly(f.top)} fill={k.top} />
      <g
        fill="none"
        stroke={edgeColor ?? k.edge}
        strokeWidth={edgeWidth}
        strokeLinejoin="round"
      >
        <polygon points={poly(f.top)} />
        <polygon points={poly(f.left)} />
        <polygon points={poly(f.right)} />
      </g>
      {label ? (
        <text
          x={c.x}
          y={c.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono"
          fontSize={labelSize}
          letterSpacing="0.1em"
          fill={k.ink}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/**
 * A cube drawn as intent rather than fact — edges only, no mass.
 * Used for anything not built yet, and for the ground a scene sits on.
 */
export function GhostCube({
  b,
  s = 1,
  stroke = "rgba(125,143,137,0.45)",
  fill = "rgba(125,143,137,0.04)",
  dashed = false,
  opacity = 1,
}: {
  b: Box;
  s?: number;
  stroke?: string;
  fill?: string;
  dashed?: boolean;
  opacity?: number;
}) {
  const f = faces(b, s);
  return (
    <g
      opacity={opacity}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
      strokeLinejoin="round"
      strokeDasharray={dashed ? "3 4" : undefined}
    >
      <polygon points={poly(f.left)} />
      <polygon points={poly(f.right)} />
      <polygon points={poly(f.top)} />
    </g>
  );
}

/**
 * The annotation chip. A leader line out of a cube corner to a name — the
 * drawing-set convention, and the thing that makes an isometric readable
 * instead of decorative.
 */
export function Tag({
  at,
  n,
  label,
  dir = "right",
  reach = 74,
  ink = "#e8eae7",
  accent = "#35d6a9",
  dim = "rgba(232,234,231,0.35)",
  size = 11,
}: {
  at: P;
  n?: string;
  label: string;
  dir?: "right" | "left";
  reach?: number;
  ink?: string;
  accent?: string;
  dim?: string;
  size?: number;
}) {
  const sign = dir === "right" ? 1 : -1;
  const elbow = { x: at.x + sign * 22, y: at.y - 22 };
  const end = { x: elbow.x + sign * reach, y: elbow.y };
  const w = monoWidth(label, size) + 18;
  const boxX = dir === "right" ? end.x + 6 : end.x - 6 - w;

  return (
    <g>
      <polyline
        points={`${at.x},${at.y} ${elbow.x},${elbow.y} ${end.x},${end.y}`}
        fill="none"
        stroke={dim}
        strokeWidth={1}
      />
      <circle cx={at.x} cy={at.y} r={2.5} fill={accent} />
      {n ? (
        <text
          x={boxX}
          y={end.y - 13}
          className="font-mono"
          fontSize={size - 1}
          letterSpacing="0.16em"
          fill={accent}
        >
          {n}
        </text>
      ) : null}
      <text
        x={boxX}
        y={end.y + 4}
        className="font-mono"
        fontSize={size}
        letterSpacing="0.08em"
        fill={ink}
      >
        {label}
      </text>
    </g>
  );
}

/** Corner helpers re-exported so scenes don't reach past this module. */
export { rightVertex, leftVertex };

/*
  Type set into a face of the cube rather than floating in front of it.

  A label drawn flat reads as a caption sitting near an object; the same label
  sheared into the plane of the face reads as printing on the object, and that
  is the whole difference between a diagram that looks three-dimensional and
  one that looks like clip art with words next to it.

  Two planes are supported. `left` is the face that turns toward the viewer's
  left — the one a crate carries its stencil on — and `top` is the ground
  plane, used for anything lying flat. Both matrices have a positive
  determinant, so nothing is mirrored.
*/
export function FaceLabel({
  b,
  s = 1,
  text,
  side = "left",
  size = 13,
  color = "#06231c",
  pad = 9,
}: {
  b: Box;
  s?: number;
  text: string;
  /**
   * Which plane the type is printed on. `up` runs it vertically up the same
   * left-hand face — for a tall column, that is the only way a long name fits
   * on the front of the object instead of floating beside it.
   */
  side?: "left" | "top" | "up";
  size?: number;
  color?: string;
  pad?: number;
}) {
  /* Anchors: the corner the type starts from, and the axes it runs along. */
  const anchor =
    side === "left"
      ? project(b.x, b.y + b.d, b.z + b.h, s)
      : side === "up"
        ? project(b.x, b.y + b.d, b.z, s)
        : project(b.x, b.y, b.z + b.h, s);

  /*
    All three matrices have a positive determinant, so type is sheared into
    the plane without ever being mirrored. `up` rotates the baseline to run
    along +z while keeping the glyph descent in the face's own horizontal.
  */
  const matrix =
    side === "left"
      ? `matrix(0.866 0.5 0 1 ${anchor.x} ${anchor.y})`
      : side === "up"
        ? `matrix(0 -1 0.866 0.5 ${anchor.x} ${anchor.y})`
        : `matrix(0.866 0.5 -0.866 0.5 ${anchor.x} ${anchor.y})`;

  /* The usable run of the face, in the same units the matrix works in. */
  const run = (side === "up" ? b.h : b.w) * s - pad * 2;
  const maxChars = Math.max(4, Math.floor(run / (size * 0.62)));

  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else cur = `${cur} ${w}`;
  }
  if (cur.trim()) lines.push(cur.trim());

  const lh = size * 1.2;

  return (
    <g transform={matrix} aria-hidden>
      {lines.map((t, i) => (
        <text
          key={i}
          x={pad}
          y={pad + size + i * lh}
          className="font-mono"
          fontSize={size}
          letterSpacing="0.04em"
          fill={color}
        >
          {t}
        </text>
      ))}
    </g>
  );
}
