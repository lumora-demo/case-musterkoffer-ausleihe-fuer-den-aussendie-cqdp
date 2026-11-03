"""API der Musterkoffer-Ausleihe (Zielbild: Azure App Service). Läuft in der Live-Vorschau nicht mit;
das Frontend nutzt dort die Testdaten aus src/lib/demo-daten.ts. Felder und Regeln wie dort bzw. in src/lib/ausleihe.ts.

Zielbild der Anbindungen (noch nicht umgesetzt, siehe Pull Request):
- Muster-Stand und SAP-Nummern aus Produktdaten (PIM) über die Produktdaten-API, nur über die Integration Suite.
- Personen kommen pseudonymisiert aus Entra ID; hier nur Kürzel.
- Speicher im Zielbild Azure SQL; hier nur im Arbeitsspeicher.
"""

from datetime import date
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Lumora Musterkoffer")

HEUTE = date(2026, 11, 3)  # Stichtag der Testdaten, im Betrieb date.today()
ICH = "p1"  # im Betrieb aus dem Entra-ID-Token
MAX_TAGE = 21

KofferStatus = Literal["verfuegbar", "verliehen", "pflege"]
ReservierungStatus = Literal["geplant", "aktiv", "abgeschlossen", "storniert"]
MeldungArt = Literal["fehlt", "veraltet", "beschaedigt"]


class Person(BaseModel):
    id: str
    name: str
    gebiet: str


class Muster(BaseModel):
    id: str
    bezeichnung: str
    sapNummer: str
    art: Literal["profil", "beschlag", "dichtung", "glas"]
    stand: Literal["aktuell", "veraltet"]


class Koffer(BaseModel):
    id: str
    nummer: str
    name: str
    serie: str
    lager: str
    status: KofferStatus
    inhaberId: str | None = None
    rueckgabeAm: str | None = None
    zuletztGeprueft: str
    muster: list[Muster]


class Reservierung(BaseModel):
    id: str
    kofferId: str
    personId: str
    von: str
    bis: str
    zweck: str
    status: ReservierungStatus


class Meldung(BaseModel):
    id: str
    kofferId: str
    musterId: str
    art: MeldungArt
    personId: str
    gemeldetAm: str
    status: Literal["offen", "erledigt"]


class ReservierungNeu(BaseModel):
    kofferId: str
    von: str
    bis: str
    zweck: str


class MeldungNeu(BaseModel):
    kofferId: str
    musterId: str
    art: MeldungArt


def _m(i: str, b: str, sap: str, art: str, stand: str = "aktuell") -> Muster:
    return Muster(id=i, bezeichnung=b, sapNummer=sap, art=art, stand=stand)  # type: ignore[arg-type]


PERSONEN = [
    Person(id="p1", name="J. Brandner", gebiet="Außendienst Süd"),
    Person(id="p2", name="S. Okafor", gebiet="Außendienst Nord"),
    Person(id="p3", name="M. Lindqvist", gebiet="Außendienst West"),
    Person(id="p4", name="A. Petrović", gebiet="Außendienst Ost"),
    Person(id="p5", name="Musterpflege Werk 1", gebiet="Innendienst"),
]

KOFFER: list[Koffer] = [
    Koffer(id="k01", nummer="MK-01", name="Fensterprofile Serie 70", serie="Serie 70", lager="Werk 1, Musterlager", status="verliehen", inhaberId="p2", rueckgabeAm="2026-11-06", zuletztGeprueft="2026-09-15", muster=[
        _m("k01-m1", "Blendrahmen 70 mm, Eckschnitt", "4100-7001", "profil"),
        _m("k01-m2", "Flügelprofil 70 mm, Eckschnitt", "4100-7002", "profil"),
        _m("k01-m3", "Mitteldichtung EPDM, 30 cm", "4300-7010", "dichtung", "veraltet"),
        _m("k01-m4", "Dreh-Kipp-Beschlag B-12, Ecke", "4500-1201", "beschlag"),
    ]),
    Koffer(id="k02", nummer="MK-02", name="Fensterprofile Serie 70", serie="Serie 70", lager="Werk 1, Musterlager", status="verfuegbar", zuletztGeprueft="2026-10-20", muster=[
        _m("k02-m1", "Blendrahmen 70 mm, Eckschnitt", "4100-7001", "profil"),
        _m("k02-m2", "Flügelprofil 70 mm, Eckschnitt", "4100-7002", "profil"),
        _m("k02-m3", "Mitteldichtung EPDM, 30 cm", "4300-7011", "dichtung"),
        _m("k02-m4", "Dreh-Kipp-Beschlag B-12, Ecke", "4500-1201", "beschlag"),
    ]),
    Koffer(id="k03", nummer="MK-03", name="Fensterprofile Serie 82 Passiv", serie="Serie 82", lager="Werk 1, Musterlager", status="verliehen", inhaberId="p1", rueckgabeAm="2026-11-10", zuletztGeprueft="2026-08-28", muster=[
        _m("k03-m1", "Blendrahmen 82 mm, Eckschnitt", "4100-8201", "profil"),
        _m("k03-m2", "Flügelprofil 82 mm, Eckschnitt", "4100-8202", "profil"),
        _m("k03-m3", "Dreifachglas-Ausschnitt 20 × 20 cm", "4700-8210", "glas"),
        _m("k03-m4", "Verdeckter Beschlag B-20, Ecke", "4500-2001", "beschlag", "veraltet"),
    ]),
    Koffer(id="k04", nummer="MK-04", name="Haustüren T60", serie="Tür T60", lager="Werk 2, Versand", status="verliehen", inhaberId="p3", rueckgabeAm="2026-10-30", zuletztGeprueft="2026-07-02", muster=[
        _m("k04-m1", "Türflügelprofil T60, Eckschnitt", "4110-6001", "profil"),
        _m("k04-m2", "Schwelle barrierefrei, 20 cm", "4110-6020", "profil"),
        _m("k04-m3", "Mehrfachverriegelung, Stulpausschnitt", "4510-6005", "beschlag"),
        _m("k04-m4", "Türdichtung umlaufend, 30 cm", "4300-6012", "dichtung"),
    ]),
    Koffer(id="k05", nummer="MK-05", name="Fassade F50 Pfosten-Riegel", serie="Fassade F50", lager="Werk 2, Versand", status="verfuegbar", zuletztGeprueft="2026-10-05", muster=[
        _m("k05-m1", "Pfostenprofil F50, 25 cm", "4120-5001", "profil"),
        _m("k05-m2", "Riegelprofil F50, 25 cm", "4120-5002", "profil"),
        _m("k05-m3", "Andruckleiste mit Deckschale", "4120-5010", "profil"),
        _m("k05-m4", "Isolatorband, 25 cm", "4300-5004", "dichtung", "veraltet"),
    ]),
    Koffer(id="k06", nummer="MK-06", name="Beschläge und Griffe", serie="Beschlag B", lager="Werk 1, Musterlager", status="pflege", zuletztGeprueft="2026-11-02", muster=[
        _m("k06-m1", "Fenstergriff G1, abschließbar", "4520-0101", "beschlag"),
        _m("k06-m2", "Fenstergriff G2, Edelstahl-Optik", "4520-0102", "beschlag"),
        _m("k06-m3", "Kippbegrenzer KB-3", "4500-0303", "beschlag"),
        _m("k06-m4", "Bandseite verdeckt, Schnitt", "4500-2010", "beschlag", "veraltet"),
    ]),
]

RESERVIERUNGEN: list[Reservierung] = [
    Reservierung(id="r1", kofferId="k03", personId="p1", von="2026-10-27", bis="2026-11-10", zweck="Objekt Schulneubau, Bemusterung", status="aktiv"),
    Reservierung(id="r2", kofferId="k01", personId="p2", von="2026-10-30", bis="2026-11-06", zweck="Messe-Nachgespräche Nord", status="aktiv"),
    Reservierung(id="r3", kofferId="k04", personId="p3", von="2026-10-20", bis="2026-10-30", zweck="Verarbeiter-Schulung West", status="aktiv"),
    Reservierung(id="r4", kofferId="k01", personId="p4", von="2026-11-09", bis="2026-11-13", zweck="Termin Fensterbauer Ost", status="geplant"),
    Reservierung(id="r5", kofferId="k05", personId="p1", von="2026-11-17", bis="2026-11-21", zweck="Architekturbüro, Fassadenbesprechung", status="geplant"),
    Reservierung(id="r6", kofferId="k02", personId="p3", von="2026-11-04", bis="2026-11-07", zweck="Kundentermin Wohnbau", status="geplant"),
    Reservierung(id="r7", kofferId="k02", personId="p1", von="2026-10-12", bis="2026-10-16", zweck="Händlertag Süd", status="abgeschlossen"),
]

MELDUNGEN: list[Meldung] = [
    Meldung(id="g1", kofferId="k01", musterId="k01-m3", art="veraltet", personId="p2", gemeldetAm="2026-10-31", status="offen"),
    Meldung(id="g2", kofferId="k06", musterId="k06-m1", art="fehlt", personId="p4", gemeldetAm="2026-10-29", status="offen"),
    Meldung(id="g3", kofferId="k04", musterId="k04-m2", art="beschaedigt", personId="p3", gemeldetAm="2026-10-24", status="offen"),
    Meldung(id="g4", kofferId="k02", musterId="k02-m3", art="fehlt", personId="p1", gemeldetAm="2026-10-16", status="erledigt"),
]


# ---------- Hilfen ----------

def _koffer(koffer_id: str) -> Koffer:
    for k in KOFFER:
        if k.id == koffer_id:
            return k
    raise HTTPException(status_code=404, detail="Koffer nicht gefunden")


def _reservierung(reservierung_id: str) -> Reservierung:
    for r in RESERVIERUNGEN:
        if r.id == reservierung_id:
            return r
    raise HTTPException(status_code=404, detail="Reservierung nicht gefunden")


def _belegungen(koffer_id: str) -> list[Reservierung]:
    return sorted((r for r in RESERVIERUNGEN if r.kofferId == koffer_id and r.status in ("geplant", "aktiv")), key=lambda r: r.von)


def _offene_meldungen(koffer_id: str) -> list[Meldung]:
    return [m for m in MELDUNGEN if m.kofferId == koffer_id and m.status == "offen"]


def _datum(s: str, feld: str) -> date:
    try:
        return date.fromisoformat(s)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"{feld}: kein gültiges Datum") from e


# ---------- Endpunkte ----------

@app.get("/api/gesund")
def gesund() -> dict:
    return {"ok": True}


@app.get("/api/personen")
def personen() -> list[Person]:
    return PERSONEN


@app.get("/api/koffer")
def koffer_liste() -> list[Koffer]:
    return KOFFER


@app.get("/api/koffer/{koffer_id}")
def koffer(koffer_id: str) -> Koffer:
    return _koffer(koffer_id)


@app.get("/api/koffer/{koffer_id}/belegung")
def belegung(koffer_id: str) -> list[Reservierung]:
    _koffer(koffer_id)
    return _belegungen(koffer_id)


@app.get("/api/reservierungen")
def reservierungen(personId: str | None = None) -> list[Reservierung]:
    return [r for r in RESERVIERUNGEN if personId is None or r.personId == personId]


@app.post("/api/reservierungen", status_code=201)
def reservieren(neu: ReservierungNeu) -> Reservierung:
    """Gleiche Regeln wie pruefeReservierung im Frontend: nicht in der Vergangenheit, höchstens 21 Tage, keine Überschneidung."""
    k = _koffer(neu.kofferId)
    von, bis = _datum(neu.von, "von"), _datum(neu.bis, "bis")
    if von < HEUTE:
        raise HTTPException(status_code=422, detail="von liegt in der Vergangenheit")
    if bis < von:
        raise HTTPException(status_code=422, detail="bis liegt vor von")
    if (bis - von).days + 1 > MAX_TAGE:
        raise HTTPException(status_code=422, detail=f"höchstens {MAX_TAGE} Tage")
    if not neu.zweck.strip():
        raise HTTPException(status_code=422, detail="zweck fehlt")
    if k.status == "verliehen" and k.rueckgabeAm and neu.von <= k.rueckgabeAm:
        raise HTTPException(status_code=409, detail="Koffer ist in diesem Zeitraum verliehen")
    for r in _belegungen(k.id):
        if r.von <= neu.bis and neu.von <= r.bis:
            raise HTTPException(status_code=409, detail=f"Überschneidung mit Reservierung {r.id}")
    r = Reservierung(id=f"r{uuid4().hex[:8]}", kofferId=k.id, personId=ICH, von=neu.von, bis=neu.bis, zweck=neu.zweck.strip(), status="geplant")
    RESERVIERUNGEN.append(r)
    return r


@app.post("/api/reservierungen/{reservierung_id}/stornieren")
def stornieren(reservierung_id: str) -> Reservierung:
    r = _reservierung(reservierung_id)
    if r.status != "geplant":
        raise HTTPException(status_code=409, detail="Nur geplante Reservierungen lassen sich stornieren")
    r.status = "storniert"
    return r


@app.post("/api/reservierungen/{reservierung_id}/abholen")
def abholen(reservierung_id: str) -> Koffer:
    r = _reservierung(reservierung_id)
    k = _koffer(r.kofferId)
    if r.status != "geplant" or _datum(r.von, "von") > HEUTE or k.status != "verfuegbar":
        raise HTTPException(status_code=409, detail="Abholen erst ab dem ersten Tag und wenn der Koffer im Lager liegt")
    r.status = "aktiv"
    k.status, k.inhaberId, k.rueckgabeAm = "verliehen", r.personId, r.bis
    return k


@app.post("/api/koffer/{koffer_id}/rueckgabe")
def rueckgabe(koffer_id: str) -> Koffer:
    """Rückgabe ins Lager. Mit offenen Meldungen geht der Koffer in die Musterpflege."""
    k = _koffer(koffer_id)
    for r in RESERVIERUNGEN:
        if r.kofferId == k.id and r.status == "aktiv":
            r.status = "abgeschlossen"
            r.bis = max(r.bis, HEUTE.isoformat())
    k.status = "pflege" if _offene_meldungen(k.id) else "verfuegbar"
    k.inhaberId = k.rueckgabeAm = None
    return k


@app.get("/api/meldungen")
def meldungen(status: Literal["offen", "erledigt"] | None = None) -> list[Meldung]:
    return [m for m in MELDUNGEN if status is None or m.status == status]


@app.post("/api/meldungen", status_code=201)
def melden(neu: MeldungNeu) -> Meldung:
    k = _koffer(neu.kofferId)
    if not any(m.id == neu.musterId for m in k.muster):
        raise HTTPException(status_code=404, detail="Muster gehört nicht zu diesem Koffer")
    for m in _offene_meldungen(k.id):
        if m.musterId == neu.musterId:
            return m  # schon gemeldet: kein Doppel
    m = Meldung(id=f"g{uuid4().hex[:8]}", kofferId=k.id, musterId=neu.musterId, art=neu.art, personId=ICH, gemeldetAm=HEUTE.isoformat(), status="offen")
    MELDUNGEN.insert(0, m)
    return m


@app.post("/api/meldungen/{meldung_id}/erledigen")
def erledigen(meldung_id: str) -> Meldung:
    m = next((x for x in MELDUNGEN if x.id == meldung_id), None)
    if m is None:
        raise HTTPException(status_code=404, detail="Meldung nicht gefunden")
    m.status = "erledigt"
    k = _koffer(m.kofferId)
    if k.status == "pflege" and not _offene_meldungen(k.id):
        k.status = "verfuegbar"
        k.zuletztGeprueft = HEUTE.isoformat()
    return m


@app.delete("/api/meldungen/{meldung_id}", status_code=204)
def zuruecknehmen(meldung_id: str) -> None:
    """Für „Rückgängig“ direkt nach dem Melden."""
    for i, m in enumerate(MELDUNGEN):
        if m.id == meldung_id:
            del MELDUNGEN[i]
            return
    raise HTTPException(status_code=404, detail="Meldung nicht gefunden")
