import { LayoutGrid, List, type LucideIcon } from "lucide-react";
import { de } from "./de";

// Bereiche der App: Seitenleiste am Rechner, Leiste unten am Handy (höchstens 4). Das erste Symbol ist das Zeichen der App.
export const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: de.nav.uebersicht, icon: LayoutGrid },
  { href: "/eintraege", label: de.nav.eintraege, icon: List },
];
