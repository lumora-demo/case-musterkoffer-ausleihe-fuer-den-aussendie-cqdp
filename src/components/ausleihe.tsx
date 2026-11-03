"use client";

import { useId, useState } from "react";
import { de } from "@/content/de";
import { datum, frist, freiAb, MAX_TAGE, person, pruefeReservierung, vorschlagBis, type Zustand } from "@/lib/ausleihe";
import { reservieren } from "@/lib/ausleihe-store";
import type { Koffer } from "@/lib/demo-daten";
import { Badge, Button, Dialog, Field, Input, Textarea, zeigeRueckmeldung } from "./ui";

// Zusammengesetzte Teile der Musterkoffer-Ausleihe, gebaut nur aus den Bausteinen in ui.tsx.

/** Status eines Koffers: überfällige oder bald fällige Rückgabe geht vor „Verliehen“. */
export function KofferStatus({ koffer }: { koffer: Koffer }) {
  const f = frist(koffer);
  if (f === "ueberfaellig") return <Badge ton="danger">{de.status.frist.ueberfaellig}</Badge>;
  if (f === "bald") return <Badge ton="warn">{de.status.frist.bald}</Badge>;
  if (koffer.status === "verfuegbar") return <Badge ton="ok">{de.status.koffer.verfuegbar}</Badge>;
  if (koffer.status === "pflege") return <Badge ton="warn">{de.status.koffer.pflege}</Badge>;
  return <Badge ton="accent">{de.status.koffer.verliehen}</Badge>;
}

/** Wo der Koffer gerade ist, als ein kurzer Satz. */
export function wo(koffer: Koffer) {
  if (koffer.status === "verliehen") {
    const p = person(koffer.inhaberId);
    return p ? de.koffer.beiPerson(p.name, p.gebiet) : koffer.lager;
  }
  if (koffer.status === "pflege") return de.koffer.inPflege(koffer.lager);
  return de.koffer.imLager(koffer.lager);
}

type Feld = "von" | "bis" | "zweck";

/** Formular-Dialog „Koffer reservieren“. Prüft beim Verlassen eines Feldes und beim Absenden. */
export function ReservierenDialog({ z, koffer, offen, schliessen }: { z: Zustand; koffer: Koffer; offen: boolean; schliessen: () => void }) {
  return (
    <Dialog offen={offen} schliessen={schliessen} titel={de.dialog.titel(koffer.nummer)} schliessenLabel={de.allgemein.schliessen}>
      {/* Neu einhängen bei jedem Öffnen: Vorschlag passt dann zur aktuellen Belegung */}
      {offen ? <Formular z={z} koffer={koffer} schliessen={schliessen} /> : null}
    </Dialog>
  );
}

function Formular({ z, koffer, schliessen }: { z: Zustand; koffer: Koffer; schliessen: () => void }) {
  const t = de.dialog;
  const vorschlag = freiAb(z, koffer.id);
  const [werte, setWerte] = useState({ von: vorschlag, bis: vorschlagBis(z, koffer.id, vorschlag), zweck: "" });
  const [beruehrt, setBeruehrt] = useState<Record<Feld, boolean>>({ von: false, bis: false, zweck: false });
  const idBasis = useId();
  const feldId = (f: Feld) => `${idBasis}-${f}`;

  const pruefung = pruefeReservierung(z, { kofferId: koffer.id, ...werte });
  const fehler = (f: Feld) => {
    const code = beruehrt[f] ? pruefung.fehler[f] : undefined;
    if (!code) return undefined;
    if (code === "belegt" && pruefung.konflikt) {
      const r = pruefung.konflikt;
      return `${t.fehler.belegt} ${t.belegtDurch(person(r.personId)?.name ?? "", datum(r.von), datum(r.bis))}`;
    }
    return t.fehler[code];
  };
  const verlassen = (f: Feld) => () => setBeruehrt((b) => ({ ...b, [f]: true }));
  const setze = (f: Feld) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setWerte((w) => ({ ...w, [f]: e.target.value }));

  const absenden = (e: React.FormEvent) => {
    e.preventDefault();
    setBeruehrt({ von: true, bis: true, zweck: true });
    if (!pruefung.ok) {
      const erstes = (["von", "bis", "zweck"] as const).find((f) => pruefung.fehler[f]);
      if (erstes) document.getElementById(feldId(erstes))?.focus();
      return;
    }
    const rueckweg = reservieren({ kofferId: koffer.id, ...werte });
    schliessen();
    zeigeRueckmeldung(t.gespeichert(koffer.nummer, datum(werte.von), datum(werte.bis)), rueckweg);
  };

  return (
    <form noValidate onSubmit={absenden} className="flex flex-col gap-4">
      <p className="text-small text-muted">
        {koffer.name} · {t.vorschlag(datum(vorschlag))}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.von} fehler={fehler("von")}>
          <Input id={feldId("von")} type="date" value={werte.von} onChange={setze("von")} onBlur={verlassen("von")} aria-invalid={!!fehler("von")} />
        </Field>
        <Field label={t.bis} hinweis={t.bisHinweis(MAX_TAGE)} fehler={fehler("bis")}>
          <Input id={feldId("bis")} type="date" value={werte.bis} onChange={setze("bis")} onBlur={verlassen("bis")} aria-invalid={!!fehler("bis")} />
        </Field>
      </div>
      <Field label={t.zweck} hinweis={t.zweckHinweis} fehler={fehler("zweck")}>
        <Textarea id={feldId("zweck")} value={werte.zweck} onChange={setze("zweck")} onBlur={verlassen("zweck")} aria-invalid={!!fehler("zweck")} rows={2} />
      </Field>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variante="outline" onClick={schliessen}>
          {de.allgemein.abbrechen}
        </Button>
        <Button type="submit" variante="primary">
          {t.absenden}
        </Button>
      </div>
    </form>
  );
}
