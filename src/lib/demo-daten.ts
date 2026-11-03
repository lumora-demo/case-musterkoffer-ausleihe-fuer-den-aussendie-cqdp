// Testdaten der erfundenen Lumora Systeme AG. Keine echten Firmen, Personen oder Zahlen.
// Personen sind pseudonymisiert (Kürzel + Gebiet), wie später im Data Lake vorgeschrieben.

/** Stichtag der Testdaten. Die Vorschau rechnet immer mit diesem Tag, damit Fristen stabil bleiben. */
export const HEUTE = "2026-11-03";

/** Angemeldete Person in der Vorschau (im Zielbild aus Entra ID). */
export const ICH = { id: "p1", name: "J. Brandner", gebiet: "Außendienst Süd" } as const;

export interface Person {
  id: string;
  name: string;
  gebiet: string;
}

export const PERSONEN: Person[] = [
  ICH,
  { id: "p2", name: "S. Okafor", gebiet: "Außendienst Nord" },
  { id: "p3", name: "M. Lindqvist", gebiet: "Außendienst West" },
  { id: "p4", name: "A. Petrović", gebiet: "Außendienst Ost" },
  { id: "p5", name: "Musterpflege Werk 1", gebiet: "Innendienst" },
];

export type MusterArt = "profil" | "beschlag" | "dichtung" | "glas";
/** Stand laut Produktdaten (PIM): aktuell oder von einer neueren Ausführung abgelöst. */
export type MusterStand = "aktuell" | "veraltet";

export interface Muster {
  id: string;
  bezeichnung: string;
  sapNummer: string;
  art: MusterArt;
  stand: MusterStand;
}

export type KofferStatus = "verfuegbar" | "verliehen" | "pflege";

export interface Koffer {
  id: string;
  nummer: string;
  name: string;
  serie: string;
  /** Heimatlager, wenn der Koffer nicht verliehen ist. */
  lager: string;
  status: KofferStatus;
  /** Person, die den Koffer gerade hat (nur bei „verliehen“). */
  inhaberId?: string;
  /** Vereinbarte Rückgabe (nur bei „verliehen“), ISO-Datum. */
  rueckgabeAm?: string;
  zuletztGeprueft: string;
  muster: Muster[];
}

export type ReservierungStatus = "geplant" | "aktiv" | "abgeschlossen" | "storniert";

export interface Reservierung {
  id: string;
  kofferId: string;
  personId: string;
  von: string;
  bis: string;
  zweck: string;
  status: ReservierungStatus;
}

export type MeldungArt = "fehlt" | "veraltet" | "beschaedigt";
export type MeldungStatus = "offen" | "erledigt";

export interface Meldung {
  id: string;
  kofferId: string;
  musterId: string;
  art: MeldungArt;
  personId: string;
  gemeldetAm: string;
  status: MeldungStatus;
}

export const KOFFER: Koffer[] = [
  {
    id: "k01",
    nummer: "MK-01",
    name: "Fensterprofile Serie 70",
    serie: "Serie 70",
    lager: "Werk 1, Musterlager",
    status: "verliehen",
    inhaberId: "p2",
    rueckgabeAm: "2026-11-06",
    zuletztGeprueft: "2026-09-15",
    muster: [
      { id: "k01-m1", bezeichnung: "Blendrahmen 70 mm, Eckschnitt", sapNummer: "4100-7001", art: "profil", stand: "aktuell" },
      { id: "k01-m2", bezeichnung: "Flügelprofil 70 mm, Eckschnitt", sapNummer: "4100-7002", art: "profil", stand: "aktuell" },
      { id: "k01-m3", bezeichnung: "Mitteldichtung EPDM, 30 cm", sapNummer: "4300-7010", art: "dichtung", stand: "veraltet" },
      { id: "k01-m4", bezeichnung: "Dreh-Kipp-Beschlag B-12, Ecke", sapNummer: "4500-1201", art: "beschlag", stand: "aktuell" },
    ],
  },
  {
    id: "k02",
    nummer: "MK-02",
    name: "Fensterprofile Serie 70",
    serie: "Serie 70",
    lager: "Werk 1, Musterlager",
    status: "verfuegbar",
    zuletztGeprueft: "2026-10-20",
    muster: [
      { id: "k02-m1", bezeichnung: "Blendrahmen 70 mm, Eckschnitt", sapNummer: "4100-7001", art: "profil", stand: "aktuell" },
      { id: "k02-m2", bezeichnung: "Flügelprofil 70 mm, Eckschnitt", sapNummer: "4100-7002", art: "profil", stand: "aktuell" },
      { id: "k02-m3", bezeichnung: "Mitteldichtung EPDM, 30 cm", sapNummer: "4300-7011", art: "dichtung", stand: "aktuell" },
      { id: "k02-m4", bezeichnung: "Dreh-Kipp-Beschlag B-12, Ecke", sapNummer: "4500-1201", art: "beschlag", stand: "aktuell" },
    ],
  },
  {
    id: "k03",
    nummer: "MK-03",
    name: "Fensterprofile Serie 82 Passiv",
    serie: "Serie 82",
    lager: "Werk 1, Musterlager",
    status: "verliehen",
    inhaberId: "p1",
    rueckgabeAm: "2026-11-10",
    zuletztGeprueft: "2026-08-28",
    muster: [
      { id: "k03-m1", bezeichnung: "Blendrahmen 82 mm, Eckschnitt", sapNummer: "4100-8201", art: "profil", stand: "aktuell" },
      { id: "k03-m2", bezeichnung: "Flügelprofil 82 mm, Eckschnitt", sapNummer: "4100-8202", art: "profil", stand: "aktuell" },
      { id: "k03-m3", bezeichnung: "Dreifachglas-Ausschnitt 20 × 20 cm", sapNummer: "4700-8210", art: "glas", stand: "aktuell" },
      { id: "k03-m4", bezeichnung: "Verdeckter Beschlag B-20, Ecke", sapNummer: "4500-2001", art: "beschlag", stand: "veraltet" },
    ],
  },
  {
    id: "k04",
    nummer: "MK-04",
    name: "Haustüren T60",
    serie: "Tür T60",
    lager: "Werk 2, Versand",
    status: "verliehen",
    inhaberId: "p3",
    rueckgabeAm: "2026-10-30",
    zuletztGeprueft: "2026-07-02",
    muster: [
      { id: "k04-m1", bezeichnung: "Türflügelprofil T60, Eckschnitt", sapNummer: "4110-6001", art: "profil", stand: "aktuell" },
      { id: "k04-m2", bezeichnung: "Schwelle barrierefrei, 20 cm", sapNummer: "4110-6020", art: "profil", stand: "aktuell" },
      { id: "k04-m3", bezeichnung: "Mehrfachverriegelung, Stulpausschnitt", sapNummer: "4510-6005", art: "beschlag", stand: "aktuell" },
      { id: "k04-m4", bezeichnung: "Türdichtung umlaufend, 30 cm", sapNummer: "4300-6012", art: "dichtung", stand: "aktuell" },
    ],
  },
  {
    id: "k05",
    nummer: "MK-05",
    name: "Fassade F50 Pfosten-Riegel",
    serie: "Fassade F50",
    lager: "Werk 2, Versand",
    status: "verfuegbar",
    zuletztGeprueft: "2026-10-05",
    muster: [
      { id: "k05-m1", bezeichnung: "Pfostenprofil F50, 25 cm", sapNummer: "4120-5001", art: "profil", stand: "aktuell" },
      { id: "k05-m2", bezeichnung: "Riegelprofil F50, 25 cm", sapNummer: "4120-5002", art: "profil", stand: "aktuell" },
      { id: "k05-m3", bezeichnung: "Andruckleiste mit Deckschale", sapNummer: "4120-5010", art: "profil", stand: "aktuell" },
      { id: "k05-m4", bezeichnung: "Isolatorband, 25 cm", sapNummer: "4300-5004", art: "dichtung", stand: "veraltet" },
    ],
  },
  {
    id: "k06",
    nummer: "MK-06",
    name: "Beschläge und Griffe",
    serie: "Beschlag B",
    lager: "Werk 1, Musterlager",
    status: "pflege",
    zuletztGeprueft: "2026-11-02",
    muster: [
      { id: "k06-m1", bezeichnung: "Fenstergriff G1, abschließbar", sapNummer: "4520-0101", art: "beschlag", stand: "aktuell" },
      { id: "k06-m2", bezeichnung: "Fenstergriff G2, Edelstahl-Optik", sapNummer: "4520-0102", art: "beschlag", stand: "aktuell" },
      { id: "k06-m3", bezeichnung: "Kippbegrenzer KB-3", sapNummer: "4500-0303", art: "beschlag", stand: "aktuell" },
      { id: "k06-m4", bezeichnung: "Bandseite verdeckt, Schnitt", sapNummer: "4500-2010", art: "beschlag", stand: "veraltet" },
    ],
  },
];

export const RESERVIERUNGEN: Reservierung[] = [
  { id: "r1", kofferId: "k03", personId: "p1", von: "2026-10-27", bis: "2026-11-10", zweck: "Objekt Schulneubau, Bemusterung", status: "aktiv" },
  { id: "r2", kofferId: "k01", personId: "p2", von: "2026-10-30", bis: "2026-11-06", zweck: "Messe-Nachgespräche Nord", status: "aktiv" },
  { id: "r3", kofferId: "k04", personId: "p3", von: "2026-10-20", bis: "2026-10-30", zweck: "Verarbeiter-Schulung West", status: "aktiv" },
  { id: "r4", kofferId: "k01", personId: "p4", von: "2026-11-09", bis: "2026-11-13", zweck: "Termin Fensterbauer Ost", status: "geplant" },
  { id: "r5", kofferId: "k05", personId: "p1", von: "2026-11-17", bis: "2026-11-21", zweck: "Architekturbüro, Fassadenbesprechung", status: "geplant" },
  { id: "r6", kofferId: "k02", personId: "p3", von: "2026-11-04", bis: "2026-11-07", zweck: "Kundentermin Wohnbau", status: "geplant" },
  { id: "r7", kofferId: "k02", personId: "p1", von: "2026-10-12", bis: "2026-10-16", zweck: "Händlertag Süd", status: "abgeschlossen" },
];

export const MELDUNGEN: Meldung[] = [
  { id: "g1", kofferId: "k01", musterId: "k01-m3", art: "veraltet", personId: "p2", gemeldetAm: "2026-10-31", status: "offen" },
  { id: "g2", kofferId: "k06", musterId: "k06-m1", art: "fehlt", personId: "p4", gemeldetAm: "2026-10-29", status: "offen" },
  { id: "g3", kofferId: "k04", musterId: "k04-m2", art: "beschaedigt", personId: "p3", gemeldetAm: "2026-10-24", status: "offen" },
  { id: "g4", kofferId: "k02", musterId: "k02-m3", art: "fehlt", personId: "p1", gemeldetAm: "2026-10-16", status: "erledigt" },
];
