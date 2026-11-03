import type { Metadata } from "next";
import { de } from "@/content/de";
import { Meldungen } from "./ansicht";

export const metadata: Metadata = { title: de.meldungen.title };

export default function Seite() {
  return <Meldungen />;
}
