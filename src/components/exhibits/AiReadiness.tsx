"use client";

/*
  07 — What makes it scale.

  The claim is that AI stands on the layers beneath it, and the exhibit lets the
  reader check it. Along the top, the four layers and which of them this
  company has in place. Down the side, four things people ask AI to do. A dot
  means "needs this layer". A use case is ready only if every layer it needs is
  in place — and the pills on the right say which ones are not, by name.

  Pilots stall here. Not on the model: on the layer underneath it.
*/

import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const LAYERS = [
  { k: "Customer Data", ready: true },
  { k: "Customer Journey", ready: true },
  { k: "Go-to-Market Strategy", ready: false },
  { k: "Customer Experience", ready: false },
] as const;

/** Which layers each use case needs, by index into LAYERS. */
const CASES: { name: string; ask: string; needs: number[] }[] = [
  { name: "Lead scoring", ask: "Rank accounts by likelihood to buy", needs: [0, 1] },
  { name: "Forecast assist", ask: "Call the quarter with a reason", needs: [0, 2] },
  { name: "Next-best-action", ask: "Tell a seller what to do next", needs: [0, 1, 3] },
  { name: "Personalized content", ask: "Say the right thing per buyer", needs: [0, 1, 2, 3] },
];

export default function AiReadiness() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>What AI needs underneath it · and what this company has</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* phones: one card per use case, since a six-column matrix does not fit */}
      <div className="space-y-3 lg:hidden">
        <div className="flex flex-wrap gap-1.5">
          {LAYERS.map((l) => (
            <Chip key={l.k} tone={l.ready ? "good" : "leak"}>
              {l.ready ? "●" : "○"} {l.k}
            </Chip>
          ))}
        </div>
        {CASES.map((c) => {
          const missing = c.needs.filter((n) => !LAYERS[n].ready);
          return (
            <Card key={c.name} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1rem] font-medium text-graphite">{c.name}</p>
                  <p className="text-[0.82rem] text-mute">{c.ask}</p>
                </div>
                <Chip tone={missing.length ? "leak" : "solid"}>{missing.length ? "Blocked" : "Ready"}</Chip>
              </div>
              <p className="mt-2 text-[0.84rem] leading-snug text-slate">
                Needs {c.needs.map((n) => LAYERS[n].k).join(", ")}.
                {missing.length ? (
                  <span className="text-timber-ink"> Missing: {missing.map((m) => LAYERS[m].k).join(", ")}.</span>
                ) : null}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="hidden overflow-hidden lg:block">
        <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_minmax(0,1.5fr)] items-stretch">
          {/* header row: the layers and whether they are in place */}
          <div className="border-b border-[var(--line-ink)] px-4 py-3">
            <Label>Use case</Label>
          </div>
          {LAYERS.map((l) => (
            <div
              key={l.k}
              className="border-b border-l border-[var(--line-ink)] px-3 py-3 text-center"
              style={{ background: l.ready ? "rgba(41,165,135,0.09)" : "rgba(180,136,90,0.1)" }}
            >
              <p className="font-display-mixed text-[0.98rem] leading-tight text-graphite">{l.k}</p>
              <p
                className="annot mt-1 text-[0.6rem]"
                style={{ color: l.ready ? "var(--color-jade-deep)" : "var(--color-timber-ink)" }}
              >
                {l.ready ? "● In place" : "○ Not yet"}
              </p>
            </div>
          ))}
          <div className="border-b border-l border-[var(--line-ink)] px-4 py-3">
            <Label>Can it run today?</Label>
          </div>

          {CASES.map((c, r) => {
            const missing = c.needs.filter((n) => !LAYERS[n].ready);
            const ok = missing.length === 0;
            const last = r === CASES.length - 1;
            const border = last ? "" : "border-b";
            return (
              <Row key={c.name} delay={0.15 + r * 0.08}>
                <div className={`${border} border-[var(--line-ink)] px-4 py-3`}>
                  <p className="text-[1rem] font-medium leading-tight text-graphite">{c.name}</p>
                  <p className="mt-0.5 text-[0.8rem] text-mute">{c.ask}</p>
                </div>
                {LAYERS.map((l, n) => {
                  const needs = c.needs.includes(n);
                  return (
                    <div
                      key={l.k}
                      className={`${border} flex items-center justify-center border-l border-[var(--line-ink)]`}
                    >
                      {needs ? (
                        <span
                          aria-label={l.ready ? "needed, in place" : "needed, missing"}
                          className="block h-3.5 w-3.5 rounded-full"
                          style={{
                            background: l.ready ? "var(--color-jade)" : "transparent",
                            border: l.ready
                              ? "none"
                              : "2px solid var(--color-timber)",
                          }}
                        />
                      ) : (
                        <span aria-hidden className="block h-px w-3 bg-[var(--line-ink-strong)]" />
                      )}
                    </div>
                  );
                })}
                <div
                  className={`${border} flex flex-wrap content-center items-center gap-1.5 border-l border-[var(--line-ink)] px-4 py-3`}
                >
                  {ok ? (
                    <Chip tone="solid">Ready</Chip>
                  ) : (
                    <>
                      <Chip tone="leak">Blocked</Chip>
                      <span className="text-[0.8rem] leading-tight text-timber-ink">
                        needs {missing.map((m) => LAYERS[m].k.replace("Go-to-Market ", "GTM ")).join(" + ")}
                      </span>
                    </>
                  )}
                </div>
              </Row>
            );
          })}
        </div>
      </Card>

      <p className="annot text-[0.66rem]">
        One of four runs today. The other three are not waiting on a better model; they
        are waiting on a layer.
      </p>
    </div>
  );
}

/** A row of grid cells that fades in together without breaking the grid. */
function Row({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="contents">
      {children}
    </Reveal>
  );
}
