/*
  The small-screen presentation.

  The isometric drawings do not survive a phone. Their whole purpose is type
  set into the face of a solid, and at 390px a face label renders around 6.7px
  and the drawing still needs sideways scrolling to be seen at all. Shrinking
  it further only makes it worse; it needs roughly twice the width it can ever
  get. So on mobile the drawings are replaced rather than reduced.

  What replaces them is not a fallback. Every card carries the same content the
  drawing carried — the same sources, phases, blocks, inputs and outcomes, out
  of the same data — in the one arrangement a narrow screen is actually good
  at: a single column you scroll.

  The drawing set's language survives the translation. Graphite hairlines, the
  tan grounds, mono annotation, jade as the single accent, and a 3px offset
  plate behind each card so it still reads as something with a thickness to it
  — dimension without projection.
*/

import type { Capability, SystemPart, TierBand } from "@/lib/systems";

/* The three accents, in the same order the blueprint assigns them, so a
   reader moving between a phone and a desktop meets the same colour on the
   same block. */
const BLOCK_TINT = ["var(--color-jade)", "#5b7fb0", "var(--color-timber)"];

/** A card with a plate behind it — the drawing set's thickness, flattened. */
function Plate({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 translate-x-[3px] translate-y-[3px] border border-[var(--line-ink)]"
      />
      <div
        className={`relative border border-[var(--line-ink-strong)] bg-card ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/** A labelled chip. The card equivalent of a box with a name on its face. */
function Chip({ text, tint }: { text: string; tint?: string }) {
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5 border border-[var(--line-ink)] bg-sheet px-2.5 py-1.5 text-[0.78rem] uppercase tracking-[0.08em] text-graphite"
      style={tint ? { borderLeftColor: tint, borderLeftWidth: 3 } : undefined}
    >
      {text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* The opening — four layers                                           */
/* ------------------------------------------------------------------ */

const TIER_TINT = [
  "var(--color-jade)",
  "#5b7fb0",
  "var(--color-timber)",
  "var(--color-chalk)",
];

export function LayerCards({ tiers }: { tiers: TierBand[] }) {
  return (
    <ol className="space-y-3">
      {tiers.map((t, i) => (
        <li
          key={t.id}
          className="border-l-2 bg-[rgba(232,234,231,0.04)] py-3 pl-4 pr-3"
          style={{ borderColor: TIER_TINT[i] }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[0.78rem] tracking-[0.16em] text-emerald">
              {t.n}
            </span>
            <span className="font-display-mixed text-[1.35rem] leading-tight text-chalk">
              {t.name}
            </span>
          </div>
          <p className="mt-1.5 text-[1rem] leading-relaxed text-glass">{t.line}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* What we build                                                       */
/* ------------------------------------------------------------------ */

export function PartCard({ part }: { part: SystemPart }) {
  return (
    <Plate className="px-5 py-6">
      <p className="font-mono text-[0.75rem] tracking-[0.16em] text-jade-deep">
        {part.ref} · {part.name}
      </p>
      <h3 className="font-display-mixed mt-2 text-[1.5rem] leading-tight text-graphite">
        {part.claim}
      </h3>
      <p className="mt-3 leading-relaxed text-slate">{part.body}</p>

      <p className="annot mt-6">{part.pointsLabel}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {part.points.map((p) => (
          <Chip key={p} text={p} />
        ))}
      </div>

      {part.pointsResult ? (
        <p className="mt-5 border-t border-[var(--line-ink)] pt-4 text-[1.05rem] leading-snug text-jade-deep">
          {part.pointsResult}
        </p>
      ) : null}
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Capabilities                                                        */
/* ------------------------------------------------------------------ */

/*
  The blueprint, read top to bottom instead of left to right. Inputs, then the
  three blocks that turn them into a capability, then outcomes, all sitting on
  the same named foundation — the same grammar the drawing uses, in the only
  direction a phone has room for.

  The block descriptions are printed rather than hidden behind a tooltip. A
  tooltip is a reasonable way to keep a wide drawing uncluttered; on a card
  with room beneath each block it is just something else to tap.
*/
export function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <Plate className="overflow-hidden">
      <div className="border-b border-[var(--line-ink)] bg-stone px-5 py-4">
        <p className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-chalk">
          {capability.bar}
        </p>
      </div>

      <div className="px-5 py-6">
        <p className="annot">Business inputs</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {capability.inputs.map((i) => (
            <Chip key={i} text={i} />
          ))}
        </div>

        <ol className="mt-7 space-y-5">
          {capability.blocks.map((b, i) => (
            <li
              key={b.title}
              className="border-l-[3px] pl-4"
              style={{ borderColor: BLOCK_TINT[i] }}
            >
              <p className="font-display-mixed text-[1.2rem] leading-tight text-graphite">
                {b.title}
              </p>
              <p className="mt-1 text-[0.98rem] leading-relaxed text-slate">
                {b.tooltip}
              </p>
            </li>
          ))}
        </ol>

        <p className="annot mt-7">Business outcomes</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {capability.outcomes.map((o) => (
            <Chip key={o} text={o} tint="var(--color-jade)" />
          ))}
        </div>

        <p className="mt-6 border-t border-[var(--line-ink)] pt-4 text-[0.98rem] leading-relaxed text-slate">
          {capability.feeds}
        </p>
      </div>

      {/* the one thing that never changes between capabilities */}
      <div className="border-t border-[var(--line-ink-strong)] bg-sheet px-5 py-3.5">
        <p className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-graphite">
          Unified data layer
        </p>
      </div>
    </Plate>
  );
}
