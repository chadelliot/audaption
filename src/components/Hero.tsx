"use client";

import { motion } from "framer-motion";
import HeroSchematic from "./HeroSchematic";
import Marquee from "./Marquee";
import { hero, trustedBy } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-t-[28px] bg-obsidian px-6 pb-10 pt-40 lg:px-10 lg:pt-48">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-obsidian-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-obsidian-line)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

      <div className="relative mx-auto max-w-3xl">
        <HeroSchematic />
      </div>

      <div className="relative mx-auto mt-4 max-w-2xl text-center lg:-mt-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-emerald"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 font-display text-3xl italic leading-[1.25] text-paper sm:text-4xl lg:text-5xl"
        >
          {hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base text-paper/60"
        >
          {hero.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#contact"
            className="rounded-full bg-emerald px-7 py-3.5 font-mono text-sm text-obsidian transition-colors hover:bg-paper"
          >
            {hero.cta} →
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="relative mt-20 border-t border-obsidian-line pt-8"
      >
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
          {trustedBy.label}
        </p>
        <Marquee items={trustedBy.logos} />
      </motion.div>
    </section>
  );
}
