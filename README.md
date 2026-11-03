# Vorlage IT: Interne Anwendungen (IT)

Vorlage für neue Apps der **Lumora Systeme AG** (erfundene Firma, nur Testdaten) im Set „Interne Anwendungen (IT)“.
Kompass legt für jeden Case aus dieser Vorlage ein eigenes Repository an und übergibt den Bauauftrag als Issue an Claude.

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
