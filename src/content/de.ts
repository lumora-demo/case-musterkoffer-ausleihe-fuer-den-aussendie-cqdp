// Alle sichtbaren Texte der App an einer Stelle (STYLEGUIDE.md, Abschnitt 12). Nie Texte fest in Komponenten.
// Beim Bauen einer neuen App: Name, Beschreibung und Bereiche hier ersetzen.
export const de = {
  app: {
    name: "Neue App",
    beschreibung: "Vorlage für Apps der Lumora Systeme AG im Set „Interne Anwendungen (IT)“ (erfundene Firma, Testdaten).",
    navLabel: "Bereiche",
    testdaten: "Lumora Systeme AG ist erfunden, alle Daten sind Testdaten.",
  },
  nav: { uebersicht: "Übersicht", eintraege: "Einträge" },
  uebersicht: {
    title: "Übersicht",
    lead: "So sieht eine Seite im Lumora Design-System aus. Ersetze sie durch die erste Seite deiner App.",
    neu: "Neuer Eintrag",
    kennzahlen: "Auf einen Blick",
    offen: "Offen",
    inArbeit: "In Arbeit",
    erledigt: "Erledigt diesen Monat",
    testdaten: "Testdaten",
    zuletzt: "Zuletzt geändert",
    alle: "Alle Einträge",
  },
  eintraege: {
    title: "Einträge",
    lead: "Datensätze als Liste am Rechner, als kompakte Karten am Handy.",
    filter: "Status",
    leerTitel: "Noch keine Einträge",
    leerText: "Leg den ersten Eintrag an, dann erscheint er hier.",
    status: { offen: "Offen", arbeit: "In Arbeit", erledigt: "Erledigt" },
    alle: "Alle",
  },
} as const;
