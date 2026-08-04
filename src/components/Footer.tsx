import Image from "next/image";
import { footer } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="overflow-hidden rounded-b-[28px] border-t border-obsidian-line bg-obsidian">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/audaption-logo-light.svg"
              alt="Audaption"
              width={140}
              height={27}
              className="h-6 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-paper/50">{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs uppercase tracking-wide text-paper/70">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-paper/50 transition-colors hover:text-paper"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-obsidian-line pt-8 font-mono text-xs text-paper/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Audaption. All rights reserved.</p>
          <p>audaption.com</p>
        </div>
      </div>
    </footer>
  );
}
