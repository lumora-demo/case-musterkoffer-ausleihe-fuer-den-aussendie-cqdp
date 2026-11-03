"use client";

import { CalendarRange } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge, Button, ButtonLink, EmptyState, Liste, PageHeader, Segmented, Zeile, zeigeRueckmeldung } from "@/components/ui";
import { de } from "@/content/de";
import { abholbar, datum, offeneMeldungen, person } from "@/lib/ausleihe";
import { abholen, stornieren, useAusleihe, zurueckgeben } from "@/lib/ausleihe-store";
import { HEUTE, ICH, type ReservierungStatus } from "@/lib/demo-daten";

const t = de.reservierungen;
type Ansicht = "meine" | "alle" | "vergangen";
const TON: Record<ReservierungStatus, "accent" | "neutral" | "ok"> = { geplant: "neutral", aktiv: "accent", abgeschlossen: "ok", storniert: "neutral" };

export function Reservierungen() {
  const z = useAusleihe();
  const [ansicht, setAnsicht] = useState<Ansicht>("meine");

  const laufend = (s: ReservierungStatus) => s === "geplant" || s === "aktiv";
  const liste = z.reservierungen
    .filter((r) => (ansicht === "vergangen" ? !laufend(r.status) : laufend(r.status)))
    .filter((r) => ansicht !== "meine" || r.personId === ICH.id)
    .sort((a, b) => (ansicht === "vergangen" ? b.von.localeCompare(a.von) : a.von.localeCompare(b.von)));

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />
      <Segmented
        label={t.filter}
        wert={ansicht}
        setze={setAnsicht}
        werte={[
          { id: "meine", name: t.meine },
          { id: "alle", name: t.alle },
          { id: "vergangen", name: t.vergangen },
        ]}
      />

      {liste.length === 0 ? (
        <EmptyState icon={CalendarRange} title={t.leerTitel} text={t.leerText}>
          <ButtonLink href="/koffer" variante="secondary">
            {t.zuDenKoffern}
          </ButtonLink>
        </EmptyState>
      ) : (
        <Liste label={t.title}>
          {liste.map((r) => {
            const k = z.koffer.find((x) => x.id === r.kofferId);
            if (!k) return null;
            const meine = r.personId === ICH.id;
            const kannAbholen = meine && abholbar(z, r);
            const wartet = meine && r.status === "geplant" && r.von <= HEUTE && !kannAbholen;
            return (
              <Zeile key={r.id}>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/koffer/${k.id}`} className="font-medium hover:underline">
                      <span className="font-mono text-small text-muted">{k.nummer}</span> {k.name}
                    </Link>
                    <span className="sm:hidden">
                      <Badge ton={TON[r.status]}>{de.status.reservierung[r.status]}</Badge>
                    </span>
                  </div>
                  <span className="text-small text-text-2">
                    <span className="font-mono tabular-nums">{t.zeitraum(datum(r.von), datum(r.bis))}</span>
                    {ansicht !== "meine" ? ` · ${person(r.personId)?.name}` : null}
                  </span>
                  <span className="text-small text-muted">{r.zweck}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="max-sm:hidden">
                    <Badge ton={TON[r.status]}>{de.status.reservierung[r.status]}</Badge>
                  </span>
                  {wartet ? <Badge ton="warn">{t.wartet}</Badge> : null}
                  {kannAbholen ? (
                    <Button
                      variante="secondary"
                      groesse="s"
                      onClick={() => {
                        const rueckweg = abholen(r.id);
                        if (rueckweg) zeigeRueckmeldung(t.abgeholt(k.nummer), rueckweg);
                      }}
                    >
                      {t.abholen}
                    </Button>
                  ) : null}
                  {meine && r.status === "aktiv" ? (
                    <Button variante="secondary" groesse="s" onClick={() => {
                        const pflege = offeneMeldungen(z, k.id).length > 0;
                        zeigeRueckmeldung(pflege ? de.detail.zurueckgegebenPflege : de.detail.zurueckgegeben, zurueckgeben(k.id));
                      }}>
                      {t.zurueckgeben}
                    </Button>
                  ) : null}
                  {meine && r.status === "geplant" ? (
                    <Button variante="ghost" groesse="s" onClick={() => zeigeRueckmeldung(t.storniert(k.nummer), stornieren(r.id))}>
                      {t.stornieren}
                    </Button>
                  ) : null}
                </div>
              </Zeile>
            );
          })}
        </Liste>
      )}
    </>
  );
}
