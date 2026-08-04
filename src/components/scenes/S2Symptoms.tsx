/*
  What brought you here.

  This used to be a picker feeding an assessment. The assessment is gone, so
  these are now a statement — four ways the same problem shows up, one of which
  will sound like the reader's last board meeting. The panels keep their hover
  because recognising yourself in one of them is the point; they no longer hold
  a selected state, because nothing downstream is listening for it.
*/

import { SYMPTOMS } from "@/lib/system";

export default function S2Symptoms() {
  return (
    <section id="symptoms" className="sheet-card px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="max-w-[52rem]">
          <p className="annot">What brought you here</p>
          <h2 className="font-display mt-6 text-[clamp(2rem,4.6vw,3.4rem)] text-graphite">
            Growth is a system you can build.
          </h2>
          <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-slate">
            Almost nobody arrives asking for one. They arrive with a symptom —
            usually one of these four, and usually the one that came up in the
            last board meeting.
          </p>
        </div>

        <ul className="mt-16 grid gap-px border-t border-[var(--line-ink)] bg-[var(--line-ink)] md:grid-cols-2 xl:grid-cols-4">
          {SYMPTOMS.map((s) => (
            <li
              key={s.id}
              className="group relative flex h-full flex-col items-start gap-4 bg-card p-7 transition-colors duration-500 hover:bg-sheet"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-[2px] w-0 bg-jade transition-all duration-500 group-hover:w-full"
              />
              <span className="annot transition-colors duration-500 group-hover:text-jade!">
                {s.ref}
              </span>
              <span className="font-display-mixed text-[1.55rem] leading-tight text-graphite">
                {s.title}
              </span>
              <span className="text-[1.05rem] leading-relaxed text-slate">
                {s.body}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[44rem] text-lg leading-relaxed text-slate">
          All four are the same problem seen from different chairs. What follows
          is what that problem looks like once the whole system is laid out.
        </p>
      </div>
    </section>
  );
}
