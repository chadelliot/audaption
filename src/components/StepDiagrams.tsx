function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-paper/60">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
        <div
          className="h-full rounded-full bg-emerald"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs text-paper/40">{value}%</span>
    </div>
  );
}

function Panel({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-paper/10 bg-paper/[0.04] p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur-sm ${className}`}
    >
      <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-paper/40">
        {title}
      </p>
      {children}
    </div>
  );
}

export function DiagnosisDiagram() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-8">
      <Panel title="Systems Assessed" className="w-full max-w-sm">
        <div className="space-y-4">
          <Bar label="CRM" value={82} />
          <Bar label="Advertising" value={64} />
          <Bar label="Analytics" value={45} />
          <Bar label="Support" value={70} />
        </div>
      </Panel>

      <Panel title="Signals Mapped" className="hidden sm:block">
        <svg width="120" height="100" viewBox="0 0 120 100" className="overflow-visible">
          <g stroke="var(--color-paper)" strokeOpacity="0.15" strokeWidth="1">
            <line x1="60" y1="50" x2="15" y2="12" />
            <line x1="60" y1="50" x2="60" y2="8" />
            <line x1="60" y1="50" x2="105" y2="12" />
            <line x1="60" y1="50" x2="15" y2="88" />
            <line x1="60" y1="50" x2="105" y2="88" />
          </g>
          <circle cx="60" cy="50" r="8" fill="var(--color-emerald)" />
          {[
            [15, 12],
            [60, 8],
            [105, 12],
            [15, 88],
            [105, 88],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="var(--color-paper)" fillOpacity="0.3" />
          ))}
        </svg>
      </Panel>
    </div>
  );
}

export function DesignDiagram() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Panel title="Capability Architecture" className="w-full max-w-lg">
        <svg width="100%" height="140" viewBox="0 0 400 140" className="overflow-visible">
          <g stroke="var(--color-paper)" strokeOpacity="0.15" strokeWidth="1">
            <line x1="200" y1="34" x2="70" y2="96" />
            <line x1="200" y1="34" x2="200" y2="96" />
            <line x1="200" y1="34" x2="330" y2="96" />
          </g>
          <rect x="130" y="6" width="140" height="30" rx="8" fill="var(--color-emerald)" fillOpacity="0.15" stroke="var(--color-emerald)" strokeOpacity="0.5" />
          <text x="200" y="25" textAnchor="middle" fontSize="11" fill="var(--color-paper)" fillOpacity="0.85">
            Growth System
          </text>

          {[
            { x: 10, label: "Strategy" },
            { x: 140, label: "Capability" },
            { x: 270, label: "Roadmap" },
          ].map((n, i) => (
            <g key={i}>
              <rect
                x={n.x}
                y="96"
                width="120"
                height="34"
                rx="8"
                fill="var(--color-paper)"
                fillOpacity="0.05"
                stroke="var(--color-paper)"
                strokeOpacity="0.15"
              />
              <text x={n.x + 60} y="117" textAnchor="middle" fontSize="11" fill="var(--color-paper)" fillOpacity="0.7">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </Panel>
    </div>
  );
}

export function ImplementationDiagram() {
  const nodes = ["Ops", "Automation", "Analytics", "Live"];
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Panel title="Build Sequence" className="w-full max-w-lg">
        <svg width="100%" height="90" viewBox="0 0 400 90" className="overflow-visible">
          <line x1="35" y1="34" x2="365" y2="34" stroke="var(--color-paper)" strokeOpacity="0.15" strokeWidth="1" />
          {nodes.map((label, i) => {
            const x = 35 + i * (330 / (nodes.length - 1));
            const last = i === nodes.length - 1;
            return (
              <g key={label}>
                <rect
                  x={x - 16}
                  y="18"
                  width="32"
                  height="32"
                  rx="6"
                  fill={last ? "var(--color-emerald)" : "none"}
                  fillOpacity={last ? 1 : 1}
                  stroke="var(--color-emerald)"
                  strokeOpacity={last ? 1 : 0.6}
                  strokeDasharray={last ? "0" : "3 3"}
                />
                <text x={x} y="70" textAnchor="middle" fontSize="11" fill="var(--color-paper)" fillOpacity="0.6">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </Panel>
    </div>
  );
}

export function GovernanceDiagram() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-8">
      <Panel title="System Maturity" className="flex flex-col items-center">
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(var(--color-emerald) 0% 82%, rgba(244,241,232,0.08) 82% 100%)",
          }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-obsidian">
            <span className="font-display text-2xl text-paper">82%</span>
          </div>
        </div>
      </Panel>

      <Panel title="Continuous Feedback" className="hidden sm:block">
        <svg width="110" height="100" viewBox="0 0 110 100" className="overflow-visible">
          <path
            d="M 55 15 A 35 35 0 1 1 22 65"
            fill="none"
            stroke="var(--color-emerald)"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-emerald)" fillOpacity="0.6" />
            </marker>
          </defs>
          {[
            [55, 15],
            [90, 45],
            [22, 65],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="var(--color-paper)" fillOpacity="0.3" />
          ))}
        </svg>
      </Panel>
    </div>
  );
}
