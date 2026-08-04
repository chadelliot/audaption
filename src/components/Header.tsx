"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { nav } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full overflow-hidden rounded-t-[28px] transition-colors duration-300 ${
        scrolled
          ? "border-b border-obsidian-line bg-obsidian/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#" className="flex items-center">
          <Image
            src="/audaption-logo-light.svg"
            alt="Audaption"
            width={140}
            height={27}
            priority
            className="h-6 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wide text-paper/50 transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-emerald px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-obsidian transition-colors hover:bg-paper"
        >
          Book a Strategy Session
        </a>
      </div>
    </motion.header>
  );
}
