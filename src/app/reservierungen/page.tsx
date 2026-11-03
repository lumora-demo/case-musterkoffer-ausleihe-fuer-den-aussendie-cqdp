import type { Metadata } from "next";
import { de } from "@/content/de";
import { Reservierungen } from "./ansicht";

export const metadata: Metadata = { title: de.reservierungen.title };

export default function Seite() {
  return <Reservierungen />;
}
