import { BriefcaseBusiness, CalendarRange, LayoutGrid, MessageSquareWarning, type LucideIcon } from "lucide-react";
import { de } from "./de";

// Bereiche der App: Seitenleiste am Rechner, Leiste unten am Handy (höchstens 4). Das Zeichen der App steht in ZEICHEN.
export const ZEICHEN: LucideIcon = BriefcaseBusiness;

export const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: de.nav.uebersicht, icon: LayoutGrid },
  { href: "/koffer", label: de.nav.koffer, icon: BriefcaseBusiness },
  { href: "/reservierungen", label: de.nav.reservierungen, icon: CalendarRange },
  { href: "/meldungen", label: de.nav.meldungen, icon: MessageSquareWarning },
];
