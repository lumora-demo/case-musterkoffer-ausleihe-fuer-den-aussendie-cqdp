# Betrieb im Zielbild (Azure)

Die Live-Vorschau läuft auf GitHub Pages (nur Frontend, Testdaten). Im echten Betrieb:

| Teil | Dienst |
|---|---|
| Frontend | Azure Static Web Apps, Region West Europe |
| API (`backend/`) | Azure App Service (Python 3.12) |
| Datenbank | Azure SQL |
| Anmeldung | Microsoft Entra ID (SSO) |
| Geheimnisse | Azure Key Vault |

Vorgaben: Freigegebene Bibliotheken laut Whitelist; Sicherheits-Scan vor jedem Merge; personenbezogene Daten nur in EU-Rechenzentren; zwei Freigaben vor Produktion (Fachbereich und IT).
