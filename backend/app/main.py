"""API der App (Zielbild: Azure App Service). Läuft in der Live-Vorschau nicht mit;
das Frontend nutzt dort die Testdaten aus src/lib/demo-daten.ts. Felder wie dort."""

from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Lumora App")


class Eintrag(BaseModel):
    id: str
    titel: str
    beschreibung: str
    status: Literal["offen", "arbeit", "erledigt"]
    geaendert: str


EINTRAEGE = [
    Eintrag(id="e1", titel="Profilserie 70 – Datenblatt prüfen", beschreibung="Maße der Dichtung weichen vom Katalog ab.", status="offen", geaendert="2026-10-29"),
    Eintrag(id="e2", titel="Beschlag B-12 – Ersatzteil anlegen", beschreibung="Neue Artikelnummer ab Werk 2.", status="arbeit", geaendert="2026-10-28"),
]


@app.get("/api/gesund")
def gesund() -> dict:
    return {"ok": True}


@app.get("/api/eintraege")
def eintraege() -> list[Eintrag]:
    return EINTRAEGE


@app.get("/api/eintraege/{eintrag_id}")
def eintrag(eintrag_id: str) -> Eintrag:
    for e in EINTRAEGE:
        if e.id == eintrag_id:
            return e
    raise HTTPException(status_code=404, detail="Nicht gefunden")
