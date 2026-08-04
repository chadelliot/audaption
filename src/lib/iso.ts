/*
  Isometric projection, for the drawing set.

  True isometric — 30° off the horizontal, equal foreshortening on both
  ground axes — rather than the flatter 2:1 game projection. It is the
  projection an architect's axonometric already uses, so the cube sheets and
  the section drawing read as the same document.

  World axes:
    +x  runs to screen-right and down
    +y  runs to screen-left and down
    +z  is up, and is never foreshortened

  Everything is expressed in world units where 1 unit = 1 cube edge. Scale is
  applied once at projection time so a scene can be laid out in whole numbers.
*/

const KX = Math.cos(Math.PI / 6); // 0.8660…
const KY = Math.sin(Math.PI / 6); // 0.5

export interface P {
  x: number;
  y: number;
}

export function project(x: number, y: number, z: number, s = 1): P {
  return { x: (x - y) * KX * s, y: ((x + y) * KY - z) * s };
}

/** Box origin is its lowest corner in every axis. */
export interface Box {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

export const box = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h = 0.5,
): Box => ({ x, y, z, w, d, h });

const r2 = (n: number) => Math.round(n * 100) / 100;

export const poly = (pts: P[]) =>
  pts.map((p) => `${r2(p.x)},${r2(p.y)}`).join(" ");

export const path = (pts: P[], close = false) =>
  pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${r2(p.x)} ${r2(p.y)}`)
    .join(" ") + (close ? " Z" : "");

/**
 * The three faces a cube shows when seen from above.
 * `right` faces screen-right (+x), `left` faces screen-left (+y).
 */
export function faces(b: Box, s = 1) {
  const { x, y, z, w, d, h } = b;
  const p = (px: number, py: number, pz: number) => project(px, py, pz, s);
  return {
    top: [
      p(x, y, z + h),
      p(x + w, y, z + h),
      p(x + w, y + d, z + h),
      p(x, y + d, z + h),
    ],
    right: [
      p(x + w, y, z + h),
      p(x + w, y + d, z + h),
      p(x + w, y + d, z),
      p(x + w, y, z),
    ],
    left: [
      p(x, y + d, z + h),
      p(x + w, y + d, z + h),
      p(x + w, y + d, z),
      p(x, y + d, z),
    ],
  };
}

/** Centre of the top face, in screen units. Where a plate or a label sits. */
export const topCentre = (b: Box, s = 1) =>
  project(b.x + b.w / 2, b.y + b.d / 2, b.z + b.h, s);

/** Centre of a vertical face, for edge-mounted annotation. */
export const faceCentre = (b: Box, side: "left" | "right", s = 1) =>
  side === "left"
    ? project(b.x + b.w / 2, b.y + b.d, b.z + b.h / 2, s)
    : project(b.x + b.w, b.y + b.d / 2, b.z + b.h / 2, s);

/** The corner a leader line should leave from: top face, screen-right vertex. */
export const rightVertex = (b: Box, s = 1) =>
  project(b.x + b.w, b.y, b.z + b.h, s);

/** Top face, screen-left vertex. */
export const leftVertex = (b: Box, s = 1) =>
  project(b.x, b.y + b.d, b.z + b.h, s);

/* ------------------------------------------------------------------ */
/* Skins                                                               */
/* ------------------------------------------------------------------ */

/*
  Three solids and one ghost. The palette is the site's own — jade from the
  mark, timber for anything inherited or unowned, chalk for the neutral
  structure. Each face is a fixed value rather than an opacity, so cubes can
  overlap without the stack going muddy.
*/

export interface Skin {
  top: string;
  left: string;
  right: string;
  edge: string;
  /** Type set on the top face. */
  ink: string;
}

export const SKINS = {
  jade: {
    top: "#3fd3ab",
    left: "#25a184",
    right: "#166d59",
    edge: "#7bf0cf",
    ink: "#06231c",
  },
  timber: {
    top: "#d3a26e",
    left: "#b4885a",
    right: "#7d5a34",
    edge: "#e8c49b",
    ink: "#2a1d0f",
  },
  chalk: {
    top: "#eef0ed",
    left: "#c3cac5",
    right: "#8e9a95",
    edge: "#ffffff",
    ink: "#12211d",
  },
  /* Light-ground skins. The diagram on the paper sheet takes graphite edges
     rather than light ones, which is what stops it reading as a screenshot of
     the dark sheets. */
  lapis: {
    top: "#7d9fce",
    left: "#5b7fb0",
    right: "#3f5c85",
    edge: "#262626",
    ink: "#0d1b2c",
  },
  /* For the cream ground. Faces sit just below the sheet so the solid reads
     as an object on paper rather than a hole cut in it. */
  paper: {
    top: "#efeae2",
    left: "#ded8cc",
    right: "#c6bfb1",
    edge: "#262626",
    ink: "#262626",
  },
  /* For the darker tan ground. Same object, lifted so it still separates. */
  paperLift: {
    top: "#fbf9f5",
    left: "#eae4d9",
    right: "#d3ccbe",
    edge: "#262626",
    ink: "#262626",
  },
  glass: {
    top: "#7d8f89",
    left: "#5e6e69",
    right: "#41504b",
    edge: "#a4b3ad",
    ink: "#0b0f0d",
  },
  stone: {
    top: "#2a3733",
    left: "#1d2723",
    right: "#141a17",
    edge: "#46564f",
    ink: "#e8eae7",
  },
  ghost: {
    top: "rgba(125,143,137,0.05)",
    left: "rgba(125,143,137,0.04)",
    right: "rgba(125,143,137,0.03)",
    edge: "rgba(125,143,137,0.5)",
    ink: "#7d8f89",
  },
} satisfies Record<string, Skin>;

export type SkinName = keyof typeof SKINS;

/*
  Approximate width of IBM Plex Mono at a given size, tracking included.
  Deterministic on purpose — measuring text would make the drawings depend on
  fonts having loaded, and these are laid out on the server. The factor is
  generous: a tag that reserves too much space loses nothing, a tag that
  reserves too little runs off the sheet.
*/
export const monoWidth = (text: string, size: number) => text.length * size * 0.68;
