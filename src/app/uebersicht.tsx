"use client";

import { ArrowRight, BriefcaseBusiness, CalendarRange, RotateCcw } from "lucide-react";
import Link from "next/link";
import { KofferStatus, wo } from "@/components/ausleihe";
import { Badge, Button, ButtonLink, Card, EmptyState, Kennzahl, Liste, PageHeader, Section, Zeile, zeigeRueckmeldung } from "@/components/ui";
import { de } from "@/content/de";
import { datum, frist, offeneMeldungen } from "@/lib/ausleihe";
import { useAusleihe, zuruecksetzen } from "@/lib/ausleihe-store";
import { HEUTE, ICH } from "@/lib/demo-daten";

const t = de.uebersicht;

export function Uebersicht() {
  const z = useAusleihe();
  const kofferVon = (id: string) => z.koffer.find((k) => k.id === id);

  const beiMir = z.koffer.filter((k) => k.status === "verliehen" && k.inhaberId === ICH.id);
  const fuerMich = z.reservierungen.filter((r) => r.personId === ICH.id && r.status === "geplant").sort((a, b) => a.von.localeCompare(b.von));
  const faellig = z.koffer
    .filter((k) => frist(k) === "ueberfaellig" || frist(k) === "bald")
    .sort((a, b) => (a.rueckgabeAm ?? "").localeCompare(b.rueckgabeAm ?? ""));
  const testdaten = de.allgemein.stichtag(datum(HEUTE));

  return (
    <>
      <PageHeader title={t.title} lead={t.lead}>
        <ButtonLink href="/koffer" variante="primary" icon={BriefcaseBusiness}>
          {t.reservieren}
        </ButtonLink>
      </PageHeader>

      <Section title={t.kennzahlen}>
        <div className="grid grid-cols-2 gap-(--gap) lg:grid-cols-4">
          <Kennzahl label={t.verfuegbar} wert={z.koffer.filter((k) => k.status === "verfuegbar").length} hinweis={testdaten} />
          <Kennzahl label={t.verliehen} wert={z.koffer.filter((k) => k.status === "verliehen").length} hinweis={testdaten} />
          <Kennzahl label={t.ueberfaellig} wert={z.koffer.filter((k) => frist(k) === "ueberfaellig").length} hinweis={testdaten} />
          <Kennzahl label={t.meldungen} wert={offeneMeldungen(z).length} hinweis={testdaten} />
        </div>
      </Section>

      <Section title={t.meine}>
        {beiMir.length + fuerMich.length === 0 ? (
          <EmptyState icon={CalendarRange} title={t.meineLeerTitel} text={t.meineLeerText} />
        ) : (
          <div className="grid gap-(--gap) sm:grid-cols-2 xl:grid-cols-3">
            {beiMir.map((k) => (
              <Link key={k.id} href={`/koffer/${k.id}`} className="rounded-card">
                <Card klickbar className="flex h-full min-h-28 flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-small text-muted">{k.nummer}</span>
                    <KofferStatus koffer={k} />
                  </div>
                  <p className="font-medium">{k.name}</p>
                  <p className="text-small text-text-2 tabular-nums">{t.bis(datum(k.rueckgabeAm ?? HEUTE))}</p>
                </Card>
              </Link>
            ))}
            {fuerMich.map((r) => {
              const k = kofferVon(r.kofferId);
              if (!k) return null;
              return (
                <Link key={r.id} href={`/koffer/${k.id}`} className="rounded-card">
                  <Card klickbar className="flex h-full min-h-28 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-small text-muted">{k.nummer}</span>
                      <Badge ton="neutral">{de.status.reservierung.geplant}</Badge>
                    </div>
                    <p className="font-medium">{k.name}</p>
                    <p className="text-small text-text-2 tabular-nums">{t.ab(datum(r.von), datum(r.bis))}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      <Section
        title={t.faellig}
        action={
          <Link href="/koffer" className="inline-flex min-h-11 items-center gap-1 text-small font-medium text-accent hover:underline">
            {t.alleKoffer} <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        }
      >
        {faellig.length === 0 ? (
          <p className="text-small text-muted">{t.faelligLeer}</p>
        ) : (
          <Liste>
            {faellig.map((k) => (
              <Zeile key={k.id}>
                <Link href={`/koffer/${k.id}`} className="flex min-h-11 min-w-0 flex-1 flex-col justify-center hover:underline">
                  <span className="font-medium">
                    <span className="font-mono text-small text-muted">{k.nummer}</span> {k.name}
                  </span>
                  <span className="text-small text-muted">{wo(k)}</span>
                </Link>
                <div className="flex items-center gap-3">
                  <KofferStatus koffer={k} />
                  <span className="font-mono text-small text-text-2 tabular-nums">{datum(k.rueckgabeAm ?? HEUTE)}</span>
                </div>
              </Zeile>
            ))}
          </Liste>
        )}
      </Section>

      <div>
        <Button
          variante="ghost"
          groesse="s"
          icon={RotateCcw}
          onClick={() => zeigeRueckmeldung(de.allgemein.zurueckgesetzt, zuruecksetzen())}
        >
          {de.allgemein.zuruecksetzen}
        </Button>
      </div>
    </>
  );
}
