// Fachlogik der Musterkoffer-Ausleihe: reine Funktionen ohne Zustand, damit sie im Backend gleich nachgebaut werden können.
import { HEUTE, PERSONEN, type Koffer, type Meldung, type Reservierung } from "./demo-daten";

export interface Zustand {
  koffer: Koffer[];
  reservierungen: Reservierung[];
  meldungen: Meldung[];
}

/** Längste Ausleihe am Stück in Tagen. Danach muss der Koffer zurück, damit andere ihn bekommen. */
export const MAX_TAGE = 21;
/** Ab so vielen Tagen vor der Rückgabe gilt sie als „bald fällig“. */
export const BALD_TAGE = 3;

const TAG = 86_400_000;
const zeit = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Tage von a bis b (b − a), ganzzahlig. */
export function tage(a: string, b: string) {
  return Math.round((zeit(b) - zeit(a)) / TAG);
}

/** ISO-Datum → „06.11.2026“ (ohne Zeitzone, damit Server und Browser gleich rechnen). */
export function datum(iso: string) {
  const [j, m, t] = iso.split("-");
  return `${t}.${m}.${j}`;
}

/** ISO-Datum → „06.11.“ */
export function datumKurz(iso: string) {
  const [, m, t] = iso.split("-");
  return `${t}.${m}.`;
}

export function person(id?: string) {
  return PERSONEN.find((p) => p.id === id);
}

export function ueberschneiden(a: { von: string; bis: string }, b: { von: string; bis: string }) {
  return a.von <= b.bis && b.von <= a.bis;
}

/** Reservierungen, die den Koffer noch belegen (geplant oder unterwegs), nach Datum sortiert. */
export function belegungen(z: Zustand, kofferId: string) {
  return z.reservierungen
    .filter((r) => r.kofferId === kofferId && (r.status === "geplant" || r.status === "aktiv"))
    .sort((a, b) => a.von.localeCompare(b.von));
}

export function offeneMeldungen(z: Zustand, kofferId?: string) {
  return z.meldungen.filter((m) => m.status === "offen" && (!kofferId || m.kofferId === kofferId));
}

export function offeneMeldungZuMuster(z: Zustand, musterId: string) {
  return z.meldungen.find((m) => m.status === "offen" && m.musterId === musterId);
}

export type Frist = "ueberfaellig" | "bald" | "ok";

/** Rückgabefrist eines verliehenen Koffers. */
export function frist(k: Koffer): Frist | undefined {
  if (k.status !== "verliehen" || !k.rueckgabeAm) return undefined;
  const rest = tage(HEUTE, k.rueckgabeAm);
  if (rest < 0) return "ueberfaellig";
  if (rest <= BALD_TAGE) return "bald";
  return "ok";
}

/** Nächster freier Tag ab heute, an dem keine Belegung liegt. */
export function freiAb(z: Zustand, kofferId: string) {
  let tag = HEUTE;
  const koffer = z.koffer.find((k) => k.id === kofferId);
  if (koffer?.status === "verliehen" && koffer.rueckgabeAm && koffer.rueckgabeAm >= tag) tag = plusTage(koffer.rueckgabeAm, 1);
  for (const r of belegungen(z, kofferId)) {
    if (ueberschneiden(r, { von: tag, bis: tag })) tag = plusTage(r.bis, 1);
  }
  return tag;
}

/** Vorschlag für die Rückgabe: wunschTage nach dem Start, aber spätestens am Tag vor der nächsten Belegung. */
export function vorschlagBis(z: Zustand, kofferId: string, von: string, wunschTage = 4) {
  const naechste = belegungen(z, kofferId).find((r) => r.von > von);
  const wunsch = plusTage(von, wunschTage);
  return naechste && naechste.von <= wunsch ? plusTage(naechste.von, -1) : wunsch;
}

export function plusTage(iso: string, n: number) {
  return new Date(zeit(iso) + n * TAG).toISOString().slice(0, 10);
}

export type ReservierungsFehler = "vonFehlt" | "bisFehlt" | "vergangen" | "bisVorVon" | "zuLang" | "belegt" | "zweckFehlt";

/** Prüft einen Reservierungswunsch. Liefert je Feld höchstens einen Fehler und die Belegung, die im Weg ist. */
export function pruefeReservierung(z: Zustand, w: { kofferId: string; von: string; bis: string; zweck: string }) {
  const fehler: { von?: ReservierungsFehler; bis?: ReservierungsFehler; zweck?: ReservierungsFehler } = {};
  let konflikt: Reservierung | undefined;
  if (!w.von) fehler.von = "vonFehlt";
  else if (w.von < HEUTE) fehler.von = "vergangen";
  if (!w.bis) fehler.bis = "bisFehlt";
  else if (w.von && w.bis < w.von) fehler.bis = "bisVorVon";
  else if (w.von && tage(w.von, w.bis) + 1 > MAX_TAGE) fehler.bis = "zuLang";
  if (!w.zweck.trim()) fehler.zweck = "zweckFehlt";
  if (!fehler.von && !fehler.bis) {
    konflikt = belegungen(z, w.kofferId).find((r) => ueberschneiden(r, w));
    const k = z.koffer.find((x) => x.id === w.kofferId);
    const verliehenBis = k?.status === "verliehen" ? k.rueckgabeAm : undefined;
    if (konflikt || (verliehenBis && w.von <= verliehenBis)) fehler.von = "belegt";
  }
  return { fehler, konflikt, ok: Object.keys(fehler).length === 0 };
}

/** Darf diese Reservierung jetzt abgeholt werden? Nur am Starttag oder später und wenn der Koffer im Lager liegt. */
export function abholbar(z: Zustand, r: Reservierung) {
  const k = z.koffer.find((x) => x.id === r.kofferId);
  return r.status === "geplant" && r.von <= HEUTE && k?.status === "verfuegbar";
}
