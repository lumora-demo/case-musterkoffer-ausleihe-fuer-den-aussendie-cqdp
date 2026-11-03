# CLAUDE.md – Regeln für Apps im Set „Interne Anwendungen (IT)“

Dieses Repository ist eine App der **Lumora Systeme AG**, einer **erfundenen** Firma (Fenster-, Tür- und Fassadensysteme). Alles hier ist Demo mit Testdaten.
Gebaut wird nach einem **Bauauftrag** aus Kompass (steht im Issue). Lies zuerst den Bauauftrag, dann diese Datei und `STYLEGUIDE.md`.

## Dieses Set: Interne Anwendungen (IT)

- **Für wen:** Werkzeuge für Mitarbeitende in Vertrieb, Service, Einkauf, Produktion und Verwaltung
- **Ton der Texte:** sachlich, präzise und ruhig, ein Arbeitswerkzeug. Die Nutzer arbeiten jeden Tag damit: Fachbegriffe des Hauses sind erlaubt (Charge, Auftrag, Werk, SAP-Nummer), Zahlen und Status zuerst, keine Werbesprache. Anrede immer „du“.
- **Frontend:** React (Next.js) + TypeScript + Tailwind, statisch gebaut (`src/`)
- **Backend:** Python 3.12 · FastAPI in `backend/`
- **Betrieb (Zielbild):** Azure, Region West Europe: App Service (API und Frontend), Azure SQL, Anmeldung über Microsoft Entra ID (SSO)
- **Code-Ablage:** GitHub (Organisation lumora-demo)

## Pflicht bei jeder Änderung

1. **Aussehen nur nach `STYLEGUIDE.md`.** Nur Tokens aus `src/app/globals.css` und Bausteine aus `src/components/` (`ui.tsx`, `app-shell.tsx`). Keine eigenen Farben, Schriften, Schatten, Radien oder Abstände außerhalb des 4er-Rasters. Fehlt ein Baustein, ergänze ihn in `src/components/ui.tsx` im selben Stil und beschreibe ihn in `STYLEGUIDE.md`, Abschnitt 9.
2. **Rechner und Handy.** Jede Seite funktioniert bei 390 px und bei 1280 px: Rahmen aus `app-shell.tsx` (Seitenleiste bzw. Leiste unten mit höchstens 4 Bereichen), Tippflächen mindestens 44 px, Datensätze am Handy als kompakte Karten, nichts scrollt seitwärts.
3. **Texte nur in `src/content/de.ts`**, Bereiche in `src/content/nav.ts`. App-Name und Beschreibung dort ersetzen.
4. **Nur erfundene Testdaten** in `src/lib/demo-daten.ts`, Zahlen sichtbar als „Testdaten“ kennzeichnen. Keine echten Firmen, Personen, Marken oder Inhalte.
5. **Statisch baubar.** Die Live-Vorschau läuft auf GitHub Pages ohne Server: keine API-Routen, keine Server Actions, keine Cookies; dynamische Seiten nur mit `generateStaticParams`. Die App arbeitet in der Vorschau mit den Testdaten (Zustand im Browser ist erlaubt).
6. **Backend als Zielbild.** Lege im Backend die Endpunkte an, die das Frontend später braucht, mit denselben Feldern wie `src/lib/demo-daten.ts`. Es läuft in der Vorschau nicht mit.
7. **Keine neuen Abhängigkeiten** ohne Not; wenn doch, im Pull Request begründen. Keine Zugangsdaten im Code, keine Aufrufe fremder Dienste.

## Ablauf

1. Eigener Branch, ein Pull Request mit Beschreibung auf Deutsch: was gebaut wurde, welche Seiten, was bewusst offen ist.
2. Vor dem Pull Request: `npm ci`, `npm run lint`, `npm run build` – alles grün.
3. Nach dem Übernehmen (Merge) baut der Workflow „Live-Vorschau“ die App und stellt sie auf GitHub Pages bereit.

## Wo steht was

- `STYLEGUIDE.md` – Lumora Design-System (gilt für alle Sets gleich)
- `src/app/globals.css` – Tokens, Grundregeln; `src/components/` – Bausteine und Rahmen
- `src/app/` – Seiten; `src/content/` – Texte und Bereiche; `src/lib/` – Testdaten, `cn`
- `backend/` – Python-API (FastAPI); `infra/README.md` – Betrieb im Zielbild
