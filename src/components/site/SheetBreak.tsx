/*
  The match line.

  Drawing sets don't separate sheets with a rule — they mark where one sheet
  stops and name the sheet that continues it. That's the match line, with a
  section-reference bubble: cut letter above, sheet number below, and a pointer
  showing which way you're looking.

  Used at act breaks only, never between every section. A device that appears
  six times is a border; a device that appears twice is a signature.
*/

export default function SheetBreak({
  cut = "A",
  sheet,
  label,
  tone = "light",
}: {
  cut?: string;
  sheet: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const line = tone === "dark" ? "var(--line-strong)" : "var(--line-ink-strong)";
  const ink = tone === "dark" ? "var(--color-glass)" : "var(--color-mute)";
  const accent = tone === "dark" ? "var(--color-emerald)" : "var(--color-forest)";

  return (
    <div
      className={`px-5 py-14 sm:px-8 sm:py-16 ${
        tone === "dark" ? "sheet-dark" : "sheet-light"
      }`}
      aria-hidden
    >
      <div className="mx-auto flex max-w-[1500px] items-center gap-5 sm:gap-8">
        <span
          className="h-px flex-1"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, ${line} 0 8px, transparent 8px 16px)`,
          }}
        />

        <svg width="82" height="52" viewBox="0 0 82 52" className="shrink-0" fill="none">
          {/* section-reference bubble */}
          <circle cx="26" cy="26" r="17" stroke={line} strokeWidth="1" />
          <line x1="9" y1="26" x2="43" y2="26" stroke={line} strokeWidth="1" />
          <text
            x="26"
            y="21"
            textAnchor="middle"
            className="font-mono"
            fontSize="11"
            letterSpacing="0.06em"
            fill={accent}
          >
            {cut}
          </text>
          <text
            x="26"
            y="38"
            textAnchor="middle"
            className="font-mono"
            fontSize="11"
            letterSpacing="0.06em"
            fill={ink}
          >
            {sheet}
          </text>
          {/* direction of view */}
          <line x1="43" y1="26" x2="66" y2="26" stroke={line} strokeWidth="1" />
          <path d="M66 20 L78 26 L66 32 Z" fill={accent} />
        </svg>

        <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.18em] sm:text-[0.65rem]" style={{ color: ink }}>
          {label}
        </span>

        <span
          className="h-px flex-1"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, ${line} 0 8px, transparent 8px 16px)`,
          }}
        />
      </div>
    </div>
  );
}
