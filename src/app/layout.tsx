import type { Metadata } from "next";
import { IBM_Plex_Mono, Jost } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import GrainOverlay from "@/components/GrainOverlay";

const anton = localFont({
  src: "../../public/fonts/Anton-Regular.ttf",
  variable: "--font-anton",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Audaption | The system behind the role you're hiring for",
  description:
    "Companies hire roles. What they're really trying to build are capabilities. Audaption designs and builds the commercial system behind the role you're hiring for.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${jost.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-sheet text-graphite">
        <GrainOverlay />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
