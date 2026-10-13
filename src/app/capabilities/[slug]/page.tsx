import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CapabilityPage from "@/components/capability/CapabilityPage";
import { CAPABILITIES, CAPABILITY } from "@/lib/capabilities";

/*
  One static page per deep dive. The site is exported statically, so every slug
  is generated at build time and anything else is a 404 rather than a runtime
  miss. Next 16 hands `params` over as a promise.
*/
export const dynamicParams = false;

export function generateStaticParams() {
  return CAPABILITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = CAPABILITY[slug];
  if (!c) return {};
  return {
    title: `${c.title} | Audaption`,
    description: c.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!CAPABILITY[slug]) notFound();
  return <CapabilityPage slug={slug} />;
}
