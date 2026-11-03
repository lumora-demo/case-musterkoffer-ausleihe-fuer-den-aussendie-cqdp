"use client";

// Zustand der Vorschau im Browser (localStorage). Im Zielbild ersetzen die Aufrufe der FastAPI (backend/) diese Funktionen.
import { useSyncExternalStore } from "react";
import { ICH, KOFFER, MELDUNGEN, RESERVIERUNGEN, HEUTE, type MeldungArt } from "./demo-daten";
import { abholbar, offeneMeldungen, type Zustand } from "./ausleihe";

const SCHLUESSEL = "lumora-musterkoffer-v1";
const START: Zustand = { koffer: KOFFER, reservierungen: RESERVIERUNGEN, meldungen: MELDUNGEN };

let zustand: Zustand | null = null;
const hoerer = new Set<() => void>();

function lesen(): Zustand {
  if (zustand) return zustand;
  try {
    const roh = window.localStorage.getItem(SCHLUESSEL);
    zustand = roh ? (JSON.parse(roh) as Zustand) : START;
  } catch {
    zustand = START;
  }
  return zustand;
}

function schreiben(neu: Zustand) {
  zustand = neu;
  try {
    window.localStorage.setItem(SCHLUESSEL, JSON.stringify(neu));
  } catch {
    // Speicher voll oder gesperrt: Zustand gilt dann nur bis zum Neuladen.
  }
  hoerer.forEach((h) => h());
}

function abonnieren(h: () => void) {
  hoerer.add(h);
  return () => hoerer.delete(h);
}

export function useAusleihe() {
  return useSyncExternalStore(abonnieren, lesen, () => START);
}

const neueId = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

/** Jede Aktion gibt eine Funktion zurück, die sie rückgängig macht (für „Rückgängig“ in der Rückmeldung). */
type Rueckweg = () => void;

function aendern(f: (z: Zustand) => Zustand): Rueckweg {
  const vorher = lesen();
  schreiben(f(vorher));
  return () => schreiben(vorher);
}

export function reservieren(w: { kofferId: string; von: string; bis: string; zweck: string }): Rueckweg {
  return aendern((z) => ({
    ...z,
    reservierungen: [...z.reservierungen, { id: neueId("r"), personId: ICH.id, status: "geplant", ...w, zweck: w.zweck.trim() }],
  }));
}

export function stornieren(reservierungId: string): Rueckweg {
  return aendern((z) => ({
    ...z,
    reservierungen: z.reservierungen.map((r) => (r.id === reservierungId ? { ...r, status: "storniert" } : r)),
  }));
}

/** Koffer zur Reservierung aus dem Lager mitnehmen: Koffer gilt ab jetzt als verliehen. */
export function abholen(reservierungId: string): Rueckweg | undefined {
  const z = lesen();
  const r = z.reservierungen.find((x) => x.id === reservierungId);
  if (!r || !abholbar(z, r)) return undefined;
  return aendern((z) => ({
    ...z,
    reservierungen: z.reservierungen.map((x) => (x.id === r.id ? { ...x, status: "aktiv" } : x)),
    koffer: z.koffer.map((k) => (k.id === r.kofferId ? { ...k, status: "verliehen", inhaberId: r.personId, rueckgabeAm: r.bis } : k)),
  }));
}

/** Rückgabe ins Lager. Sind Muster als fehlend gemeldet, geht der Koffer zuerst in die Musterpflege. */
export function zurueckgeben(kofferId: string): Rueckweg {
  return aendern((z) => {
    const offen = offeneMeldungen(z, kofferId).length > 0;
    return {
      ...z,
      reservierungen: z.reservierungen.map((r) => (r.kofferId === kofferId && r.status === "aktiv" ? { ...r, status: "abgeschlossen", bis: r.bis < HEUTE ? HEUTE : r.bis } : r)),
      koffer: z.koffer.map((k) => (k.id === kofferId ? { ...k, status: offen ? "pflege" : "verfuegbar", inhaberId: undefined, rueckgabeAm: undefined } : k)),
    };
  });
}

/** Ein Tipp: Muster als fehlend, veraltet oder beschädigt melden. */
export function melden(kofferId: string, musterId: string, art: MeldungArt): Rueckweg {
  return aendern((z) => ({
    ...z,
    meldungen: [{ id: neueId("g"), kofferId, musterId, art, personId: ICH.id, gemeldetAm: HEUTE, status: "offen" }, ...z.meldungen],
  }));
}

/** Musterpflege hat nachgelegt. Ist danach nichts mehr offen, ist der Koffer wieder verfügbar. */
export function meldungErledigen(meldungId: string): Rueckweg {
  return aendern((z) => {
    const meldungen = z.meldungen.map((m) => (m.id === meldungId ? { ...m, status: "erledigt" as const } : m));
    const kofferId = z.meldungen.find((m) => m.id === meldungId)?.kofferId;
    const nochOffen = meldungen.some((m) => m.kofferId === kofferId && m.status === "offen");
    return {
      ...z,
      meldungen,
      koffer: z.koffer.map((k) => (k.id === kofferId && k.status === "pflege" && !nochOffen ? { ...k, status: "verfuegbar", zuletztGeprueft: HEUTE } : k)),
    };
  });
}

export function zuruecksetzen(): Rueckweg {
  return aendern(() => START);
}
