/*
  The opening's small-screen presentation.

  The four-layer drawing does not survive a phone: its labels render around 6px
  at that width. So below `lg` the same four layers are read as cards instead,
  out of the same data. The approach that follows has its own phone layout, in
  components/deck/Deck.tsx.
*/

import type { TierBand } from "@/lib/systems";

const TIER_TINT = [
  "var(--color-jade)",
  "#5b7fb0",
  "var(--color-timber)",
  "var(--color-mute)",
];

export function LayerCards({ tiers }: { tiers: TierBand[] }) {
  return (
    <ol className="space-y-3">
      {tiers.map((t, i) => (
        <li
          key={t.id}
          className="border-l-2 bg-[rgba(38,38,38,0.04)] py-3 pl-4 pr-3"
          style={{ borderColor: TIER_TINT[i] }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[0.78rem] tracking-[0.16em] text-jade-deep">
              {t.n}
            </span>
            <span className="font-display-mixed text-[1.35rem] leading-tight text-graphite">
              {t.name}
            </span>
          </div>
          <p className="mt-1.5 text-[1rem] leading-relaxed text-slate">{t.line}</p>
        </li>
      ))}
    </ol>
  );
}
