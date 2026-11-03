import type { Metadata } from "next";
import { de } from "@/content/de";
import { KofferListe } from "./liste";

export const metadata: Metadata = { title: de.koffer.title };

export default function Seite() {
  return <KofferListe />;
}
