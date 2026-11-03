"use client";

import { CalendarRange, ChevronLeft, Clock, MapPin, PackageX, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KofferStatus, ReservierenDialog, wo } from "@/components/ausleihe";
import { Angabe, Badge, Button, Card, Hinweis, Liste, PageHeader, Section, Zeile, zeigeRueckmeldung } from "@/components/ui";
import { de } from "@/content/de";
import { belegungen, datum, freiAb, offeneMeldungen, offeneMeldungZuMuster, person } from "@/lib/ausleihe";
import { melden, useAusleihe, zurueckgeben } from "@/lib/ausleihe-store";
import { ICH, type MeldungArt, type Muster } from "@/lib/demo-daten";

const t = de.detail;

export function KofferDetail({ id }: { id: string }) {
  const z = useAusleihe();
  const [dialog, setDialog] = useState(false);
  const k = z.koffer.find((x) => x.id === id);
  if (!k) return null;

  const meins = k.status === "verliehen" && k.inhaberId === ICH.id;
  const inhaber = person(k.inhaberId);
  const plan = belegungen(z, k.id);

  const tippen = (m: Muster, art: MeldungArt) => {
    const rueckweg = melden(k.id, m.id, art);
    zeigeRueckmeldung(t.meldungGespeichert(de.meldungArt[art], m.bezeichnung), rueckweg);
  };

  const rueckgabe = () => {
    const pflege = offeneMeldungen(z, k.id).length > 0;
    const rueckweg = zurueckgeben(k.id);
    zeigeRueckmeldung(pflege ? t.zurueckgegebenPflege : t.zurueckgegeben, rueckweg);
  };

  return (
    <>
      <div className="-mt-2 -mb-6 sm:-mt-4">
        <Link href="/koffer" className="inline-flex min-h-11 items-center gap-1 text-small font-medium text-accent hover:underline">
          <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
          {t.zurueck}
        </Link>
      </div>

      <PageHeader title={`${k.nummer} ${k.name}`} lead={k.serie}>
        {meins ? (
          <Button variante="primary" icon={Undo2} onClick={rueckgabe}>
            {t.zurueckgeben}
          </Button>
        ) : (
          <Button variante="primary" icon={CalendarRange} onClick={() => setDialog(true)}>
            {t.reservieren}
          </Button>
        )}
      </PageHeader>

      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="font-mono text-small text-muted">{k.nummer}</span>
            {/* Am Handy steht der Seitentitel nicht sichtbar oben, darum hier der Name */}
            <h2 className="text-h3 font-semibold sm:hidden">{k.name}</h2>
            <h2 className="text-h3 font-semibold max-sm:hidden">{t.wo}</h2>
          </div>
          <KofferStatus koffer={k} />
        </div>
        <p className="flex items-center gap-2 text-text-2">
          <MapPin className="size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
          {wo(k)}
        </p>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {inhaber ? <Angabe label={t.inhaber}>{inhaber.name}</Angabe> : <Angabe label={t.lager}>{k.lager}</Angabe>}
          {k.rueckgabeAm ? (
            <Angabe label={t.rueckgabe}>
              <span className="tabular-nums">{datum(k.rueckgabeAm)}</span>
            </Angabe>
          ) : null}
          <Angabe label={t.freiAb}>
            <span className="tabular-nums">{datum(freiAb(z, k.id))}</span>
          </Angabe>
          <Angabe label={t.geprueft}>
            <span className="tabular-nums">{datum(k.zuletztGeprueft)}</span>
          </Angabe>
        </dl>
        {meins ? (
          <div>
            <Button variante="secondary" icon={CalendarRange} onClick={() => setDialog(true)}>
              {t.reservieren}
            </Button>
          </div>
        ) : null}
      </Card>

      {k.status === "pflege" ? (
        <Hinweis ton="warn" title={t.pflegeHinweisTitel}>
          {t.pflegeHinweis}
        </Hinweis>
      ) : null}

      <Section title={t.muster}>
        <p className="-mt-1 max-w-[68ch] text-small text-muted">{t.musterHinweis}</p>
        <Liste label={t.muster}>
          {k.muster.map((m) => {
            const offen = offeneMeldungZuMuster(z, m.id);
            return (
              <Zeile key={m.id}>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-medium">{m.bezeichnung}</span>
                  <span className="text-small text-muted">
                    {de.musterArt[m.art]} · {t.sap} <span className="font-mono tabular-nums">{m.sapNummer}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {m.stand === "veraltet" ? (
                    <Badge ton="warn">
                      <Clock className="size-3" strokeWidth={2} aria-hidden />
                      {de.musterStand.veraltet}
                    </Badge>
                  ) : null}
                  {offen ? (
                    <Badge ton="warn">{t.gemeldet(de.meldungArt[offen.art])}</Badge>
                  ) : (
                    <>
                      <Button variante="ghost" groesse="s" icon={PackageX} aria-label={t.meldenLabel(t.fehlt, m.bezeichnung)} onClick={() => tippen(m, "fehlt")}>
                        {t.fehlt}
                      </Button>
                      {m.stand === "veraltet" ? null : (
                        <Button variante="ghost" groesse="s" icon={Clock} aria-label={t.meldenLabel(t.veraltet, m.bezeichnung)} onClick={() => tippen(m, "veraltet")}>
                          {t.veraltet}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Zeile>
            );
          })}
        </Liste>
      </Section>

      <Section title={t.belegung}>
        {plan.length === 0 ? (
          <p className="text-small text-muted">{t.belegungLeer}</p>
        ) : (
          <Liste label={t.belegung}>
            {plan.map((r) => (
              <Zeile key={r.id}>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-medium">{person(r.personId)?.name}</span>
                  <span className="text-small text-muted">{r.zweck}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge ton={r.status === "aktiv" ? "accent" : "neutral"}>{de.status.reservierung[r.status]}</Badge>
                  <span className="font-mono text-small text-text-2 tabular-nums">{de.reservierungen.zeitraum(datum(r.von), datum(r.bis))}</span>
                </div>
              </Zeile>
            ))}
          </Liste>
        )}
      </Section>

      <Hinweis title={t.pimHinweisTitel}>{t.pimHinweis}</Hinweis>

      <ReservierenDialog z={z} koffer={k} offen={dialog} schliessen={() => setDialog(false)} />
    </>
  );
}
