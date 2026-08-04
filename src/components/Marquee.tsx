"use client";

import { motion } from "framer-motion";

export default function Marquee({
  items,
  duration = 28,
}: {
  items: string[];
  duration?: number;
}) {
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex w-max gap-16 pr-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-display text-2xl italic text-paper/35 md:text-3xl"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
