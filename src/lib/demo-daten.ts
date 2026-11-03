// Testdaten der erfundenen Lumora Systeme AG. Keine echten Firmen, Personen oder Zahlen.
export type Status = "offen" | "arbeit" | "erledigt";

export interface Eintrag {
  id: string;
  titel: string;
  beschreibung: string;
  status: Status;
  geaendert: string;
}

export const EINTRAEGE: Eintrag[] = [
  { id: "e1", titel: "Profilserie 70 – Datenblatt prüfen", beschreibung: "Maße der Dichtung weichen vom Katalog ab.", status: "offen", geaendert: "2026-10-29" },
  { id: "e2", titel: "Beschlag B-12 – Ersatzteil anlegen", beschreibung: "Neue Artikelnummer ab Werk 2.", status: "arbeit", geaendert: "2026-10-28" },
  { id: "e3", titel: "Fassade F50 – U-Wert nachreichen", beschreibung: "Verarbeiter braucht den Nachweis bis Freitag.", status: "arbeit", geaendert: "2026-10-27" },
  { id: "e4", titel: "Tür T60 – Montageanleitung aktualisieren", beschreibung: "Neue Schwelle seit Oktober.", status: "erledigt", geaendert: "2026-10-21" },
];
