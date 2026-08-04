"use client";

/*
  Your next stage of growth.

  The last sheet, and the only one that asks for anything.

  It is built as one card in two halves so both columns are the same height by
  construction — the previous version put a short card beside a tall form and
  the mismatch was the first thing you saw. Both halves stay on the tan
  grounds the rest of the page uses; green is an accent here, not a plane, the
  same way it is everywhere else on the site.

  No claim is made about where this particular visitor should begin. The page
  hasn't diagnosed anything, so the card offers the three ways this work
  normally starts and invites the conversation that decides between them.
*/

import { useState } from "react";
import { useAssessment } from "@/lib/assessment";

const PATHS = [
  {
    name: "Design before the hire",
    line: "Decide what the capability owns, and what it gets measured against, before you advertise the role.",
  },
  {
    name: "Accelerate alongside the hire",
    line: "Bring capacity around a leader who owns the mandate and has ninety days to show it moving.",
  },
  {
    name: "Operate the capability",
    line: "Run it as an embedded capability while building it internally isn't yet the right move.",
  },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function StartHere() {
  const { symptom } = useAssessment();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          company: fd.get("company"),
          role: fd.get("role"),
          situation: fd.get("situation"),
          symptom,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "That didn't send.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "That didn't send.");
    }
  }

  return (
    <section id="start" className="sheet-light px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="max-w-[52rem]">
          <p className="annot">Your next stage of growth</p>
          <h2 className="font-display mt-6 text-[clamp(2rem,4.6vw,3.4rem)] text-graphite">
            Build what your next stage of growth requires.
          </h2>
          <p className="mt-6 max-w-[44rem] leading-relaxed text-slate">
            Your organization may already have some of these capabilities in
            place. Others may be missing, underdeveloped, or disconnected.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden border border-[var(--line-ink-strong)] lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
          {/* the argument */}
          <div className="bg-card px-7 py-10 sm:px-10 sm:py-12">
            <p className="text-[1.15rem] leading-relaxed text-graphite">
              Audaption helps identify where each capability stands, what should
              be strengthened next, and whether the right path is to design it
              before a hire, accelerate it alongside internal leadership, or
              operate it as an embedded capability.
            </p>

            <dl className="mt-9 space-y-7 border-t border-[var(--line-ink)] pt-8">
              {PATHS.map((p) => (
                <div key={p.name} className="grid gap-1.5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-display-mixed border-l-2 border-jade pl-3 text-[1.2rem] leading-tight text-jade-deep sm:border-l-0 sm:pl-0">
                    {p.name}
                  </dt>
                  <dd className="text-[0.98rem] leading-relaxed text-slate">
                    {p.line}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* the ask */}
          <div className="bg-sheet px-7 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-[var(--line-ink)]">
            {status === "sent" ? (
              <div>
                <p className="annot text-jade!">Received</p>
                <p className="font-display-mixed mt-4 text-[1.6rem] leading-tight text-graphite">
                  We&rsquo;ll come back with the drawing, not a deck.
                </p>
                <p className="mt-4 leading-relaxed text-slate">
                  Someone will reply within two working days.
                </p>
                <a
                  href="#capabilities"
                  className="mt-6 inline-flex items-center gap-2 border-b border-jade pb-1 text-[0.98rem] text-graphite transition-colors hover:text-jade"
                >
                  Explore how we work <span aria-hidden>↑</span>
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <p className="font-display-mixed text-[1.45rem] leading-tight text-graphite">
                  Talk with us about your growth system.
                </p>

                {/* Paired rows keep the form the same height as the panel
                    beside it instead of running on down the page. */}
                <div className="mt-7 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                  <Field name="name" label="Name" required />
                  <Field name="email" label="Work email" type="email" required />
                  <Field name="company" label="Company" required />
                  <Field name="role" label="Your role" />
                </div>
                <div className="mt-4">
                  <Field
                    name="situation"
                    label="One line on the situation"
                    textarea
                    placeholder="e.g. new CRO, ninety days in, no analytics team"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-display mt-8 w-full bg-jade px-6 py-4 text-[1.2rem] tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Discuss your growth system"}
                </button>

                {error && (
                  <p role="alert" className="mt-3 text-[0.9rem] text-timber-ink">
                    {error} You can also email hello@audaption.com directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  const cls =
    "w-full border-0 border-b border-[var(--line-ink-strong)] bg-transparent px-0 py-2 text-[1rem] text-graphite placeholder:text-mute focus:border-jade focus:outline-none";
  return (
    <label className="block">
      <span className="annot">
        {label}
        {required && <span className="text-timber-ink"> *</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={2}
          placeholder={placeholder}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  );
}
