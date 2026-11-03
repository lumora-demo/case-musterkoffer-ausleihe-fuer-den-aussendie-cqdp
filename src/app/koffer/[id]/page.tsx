import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KOFFER } from "@/lib/demo-daten";
import { KofferDetail } from "./detail";

// Statisch gebaut: eine Seite je Koffer aus den Testdaten.
export const dynamicParams = false;

export function generateStaticParams() {
  return KOFFER.map((k) => ({ id: k.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const k = KOFFER.find((x) => x.id === id);
  return { title: k ? `${k.nummer} ${k.name}` : undefined };
}

export default async function Seite({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!KOFFER.some((k) => k.id === id)) notFound();
  return <KofferDetail id={id} />;
}
