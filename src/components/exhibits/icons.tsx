/*
  Icons, and the one logo.

  A single hand-drawn set: 24px grid, 1.6 stroke, square caps, no fills, so they
  read as the same family as the hairline rules around them and take their colour
  from the text they sit in. They stand in for words only where the word is a
  *kind of thing* (a channel, a source, a step) — never for a sentence.

  Northbridge Supply is the invented manufacturer in the illustrative exhibits.
  It is not a real company, so its mark is drawn here, kept to the simplest shape
  that reads as a brand: a square, and a bridge. Real companies' logos are not
  drawn or imitated anywhere in the site.
*/

import type { ReactNode } from "react";

const PATHS = {
  /* channels */
  social: "M4 11v3h3l6 4V7L7 11H4Zm12-1.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10",
  report: "M6 3h8l4 4v14H6V3Zm8 0v4h4M9 17v-3m3 3v-6m3 6v-4",
  web: "M3 5h18v14H3V5Zm0 4h18M6.5 7h.01M9 7h.01",
  mail: "M3 6h18v12H3V6Zm0 1 9 7 9-7",
  calc: "M6 3h12v18H6V3Zm3 4h6M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M12 14.5h.01M15 14.5h.01M9 18h.01M12 18h6",
  seller: "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9a7 7 0 0 1 14 0",
  proposal: "M6 3h12v18H6V3Zm3 5h6M9 11.5h6M9 15h3m3.5 3.5 1.5 1.5 3-3",
  review: "M4 20V10m6 10V4m6 16v-7m5 7H3",
  text: "M4 5h16v11H11l-5 4v-4H4V5Zm4 5h8M8 12.5h5",
  /* stages */
  alert: "M12 4 3 20h18L12 4Zm0 6v5m0 3h.01",
  compare: "M12 4v16M5 7h14M5 7l-2.5 6a2.5 2.5 0 0 0 5 0L5 7Zm14 0-2.5 6a2.5 2.5 0 0 0 5 0L19 7ZM8 20h8",
  case: "M3 8h18v12H3V8Zm6 0V5h6v3M3 13h18",
  decide: "M5 12.5 10 17.5 19.5 7",
  expand: "M4 17 10 11l4 4 6-7m0 0h-5m5 0v5",
  /* buyers */
  building: "M5 21V4h9v17M14 9h5v12M5 21h15M8 8h3M8 11.5h3M8 15h3",
  person: "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9a7 7 0 0 1 14 0",
  /* signals */
  signal: "M12 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm3-4.5a4.2 4.2 0 0 1 0 6M9 8.5a4.2 4.2 0 0 0 0 6M18 6a8 8 0 0 1 0 11.5M6 6a8 8 0 0 0 0 11.5",
  /* sources */
  sheet: "M4 4h16v16H4V4Zm0 5.3h16M4 14.7h16M9.3 4v16",
  form: "M5 3h14v18H5V3Zm3 5h8M8 12h8M8 16h4",
  event: "M4 5h16v15H4V5Zm0 5h16M8 3v4m8-4v4",
  support: "M4 13v-2a8 8 0 0 1 16 0v2M4 13h3v5H4v-5Zm13 0h3v5h-3v-5Zm1 5c0 2-2 3-5 3",
  /* layers and steps */
  data: "M12 10c4.4 0 8-1.1 8-2.5S16.4 5 12 5 4 6.1 4 7.5 7.6 10 12 10Zm8 0v4.5c0 1.4-3.6 2.5-8 2.5s-8-1.1-8-2.5V7.5m16 4.5v4.5c0 1.4-3.6 2.5-8 2.5s-8-1.1-8-2.5V12",
  journey: "M5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm14-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM7.5 16.5h6a3 3 0 0 0 0-6h-3a3 3 0 0 1 0-6H16.5",
  experience: "M4 5h16v11H11l-5 4v-4H4V5Zm4 4 2 2 4-4",
  map: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Zm6-2v14m6-12v14",
  align: "M4 7h10M4 12h16M4 17h10M18 5v4m0 6v4",
  build: "M14 4a4 4 0 0 0-4.7 5.2L3.5 15a2.1 2.1 0 0 0 3 3l5.8-5.8A4 4 0 0 0 17.5 7.5l-2.7 2.7-2.3-.7-.7-2.3L14.5 4",
  run: "M7 4v16l13-8L7 4Z",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  /* misc */
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 16,
  className = "",
  stroke = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  stroke?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Icon for a channel chip, by the name the exhibit uses. */
export const CHANNEL_ICON: Record<string, IconName> = {
  "Paid social": "social",
  "Industry report": "report",
  Website: "web",
  Email: "mail",
  "ROI calculator": "calc",
  Seller: "seller",
  Proposal: "proposal",
  "Success reviews": "review",
  Text: "text",
};

/** A tile that holds an icon, for places where it leads a line of text. */
export function IconTile({
  name,
  tone = "plain",
  size = 28,
}: {
  name: IconName;
  tone?: "plain" | "jade" | "ink";
  size?: number;
}): ReactNode {
  const look =
    tone === "jade"
      ? "bg-jade text-white"
      : tone === "ink"
        ? "bg-graphite text-white"
        : "bg-[rgba(41,165,135,0.12)] text-jade-deep";
  return (
    <span className={`flex shrink-0 items-center justify-center ${look}`} style={{ width: size, height: size }}>
      <Icon name={name} size={Math.round(size * 0.58)} />
    </span>
  );
}

/**
 * Northbridge Supply: a graphite square, a jade bridge deck and its arch.
 * It is deliberately plain — if it looks like a logo at 16px it is doing its job.
 */
export function NorthbridgeMark({ size = 24, rounded = false }: { size?: number; rounded?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label="Northbridge Supply"
      className="shrink-0"
      style={rounded ? { borderRadius: "22%" } : undefined}
    >
      <rect width="32" height="32" fill="#262626" />
      <path d="M0 20.5h32" stroke="#29a587" strokeWidth="3" />
      <path d="M5 20.5a11 11 0 0 1 22 0" fill="none" stroke="#fbfbf9" strokeWidth="2.4" />
      <path d="M16 9.5v11" stroke="#fbfbf9" strokeWidth="2.4" />
      <path d="M0 25.5h32" stroke="#fbfbf9" strokeOpacity=".28" strokeWidth="1.4" />
    </svg>
  );
}

/** The mark with the name beside it. */
export function NorthbridgeLockup({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <NorthbridgeMark size={size} />
      <span className="font-semibold leading-none tracking-[-0.01em]">Northbridge Supply</span>
    </span>
  );
}
