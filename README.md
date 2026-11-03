# Musterkoffer-Ausleihe für den Außendienst

App der **Lumora Systeme AG** (erfundene Firma, nur Testdaten) im Set „Interne Anwendungen (IT)“: Wer sieht auf einen Blick, welcher Musterkoffer wo ist, reserviert ihn und meldet fehlende oder veraltete Muster mit einem Tipp.

- **Seiten:** Übersicht (`/`), Koffer (`/koffer`, Detail `/koffer/[id]`), Reservierungen, Meldungen
- **Fachlogik:** `src/lib/ausleihe.ts` (Regeln), `src/lib/ausleihe-store.ts` (Zustand der Vorschau im Browser)
- **API (Zielbild):** `backend/app/main.py`, gleiche Felder und Regeln

- **Für wen:** Werkzeuge für Mitarbeitende in Vertrieb, Service, Einkauf, Produktion und Verwaltung
- **Frontend:** React (Next.js) + TypeScript + Tailwind, statisch gebaut
- **Backend:** Python 3.12 · FastAPI in `backend/`
- **Betrieb (Zielbild):** Azure, Region West Europe: App Service (API und Frontend), Azure SQL, Anmeldung über Microsoft Entra ID (SSO)
- **Aussehen:** [STYLEGUIDE.md](STYLEGUIDE.md) – Lumora Design-System, identisch in allen Sets
- **Regeln für Claude:** [CLAUDE.md](CLAUDE.md)

## Lokal starten

```
npm install
npm run dev
```

## Live-Vorschau

Jeder Stand auf `main` wird automatisch gebaut und auf GitHub Pages veröffentlicht (Workflow „Live-Vorschau“). Pull Requests werden mit Lint und Build geprüft.
