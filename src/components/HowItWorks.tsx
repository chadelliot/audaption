"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import RevealText from "./RevealText";
import FadeIn from "./FadeIn";
import RotatingStage from "./RotatingStage";
import {
  DiagnosisDiagram,
  DesignDiagram,
  ImplementationDiagram,
  GovernanceDiagram,
} from "./StepDiagrams";
import { howItWorks } from "@/lib/content";

const diagrams = [DiagnosisDiagram, DesignDiagram, ImplementationDiagram, GovernanceDiagram];
const corners = ["tl", "tr", "bl", "br"] as const;

const accentBg = {
  emerald: "bg-emerald text-obsidian",
};

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const steps = howItWorks.steps;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, steps.length - 1]);
  useMotionValueEvent(rawIndex, "change", (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.round(v)));
    setActive(next);
  });

  // The frame tumbles into place once, early in the section, then holds
  // steady while the diagram inside crossfades per step.
  const entry = useTransform(scrollYProgress, [0, 0.16], [0, 1], { clamp: true });
  const rotateDeg = useTransform(entry, [0, 1], [13, 0]);
  const counterRotate = useTransform(rotateDeg, (r) => -r);
  const scale = useTransform(entry, [0, 1], [0.82, 1]);
  const opacity = useTransform(entry, [0, 1], [0, 1]);

  const step = steps[active];
  const Diagram = diagrams[active];

  const labels = steps.map((s, i) => ({
    key: s.number,
    label: s.leader,
    accent: s.accent,
    corner: corners[i],
  }));

  return (
    <section id="how-it-works" className="bg-obsidian py-28">
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-emerald">
          {howItWorks.eyebrow}
        </p>
        <RevealText
          text={howItWorks.heading}
          as="h2"
          className="font-display italic text-3xl leading-tight text-paper sm:text-4xl lg:text-5xl"
        />
      </div>

      <div ref={containerRef} className="relative mt-16" style={{ height: `${steps.length * 100}vh` }}>
        <div className="grid gap-16 px-6 lg:grid-cols-2 lg:gap-10 lg:px-10">
          <div className="sticky top-0 flex h-screen items-center">
            <RotatingStage
              rotateDeg={rotateDeg}
              scale={scale}
              opacity={opacity}
              counterRotate={counterRotate}
              labels={labels}
              activeKey={step.number}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full w-full"
                >
                  <Diagram />
                </motion.div>
              </AnimatePresence>
            </RotatingStage>
          </div>

          <div className="flex flex-col py-24 lg:py-0">
            {steps.map((s) => (
              <div key={s.number} className="flex min-h-screen items-center py-10">
                <FadeIn amount={0.6} className="w-full">
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl text-paper">{s.title}</h3>
                      <span
                        className={`inline-flex h-7 w-10 items-center justify-center rounded-full text-xs font-medium ${accentBg[s.accent]}`}
                      >
                        {s.number}
                      </span>
                    </div>
                    <p className="mt-4 text-paper/60">{s.description}</p>
                    <ul className="mt-6 space-y-2.5">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-paper/80">
                          <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${accentBg[s.accent].split(" ")[0]}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
