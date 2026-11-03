"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge, Button, EmptyState, Liste, PageHeader, Segmented, Zeile, zeigeRueckmeldung } from "@/components/ui";
import { de } from "@/content/de";
import { datum, person } from "@/lib/ausleihe";
import { meldungErledigen, useAusleihe } from "@/lib/ausleihe-store";
import type { MeldungArt, MeldungStatus } from "@/lib/demo-daten";

const t = de.meldungen;
const TON: Record<MeldungArt, "warn" | "danger"> = { fehlt: "warn", veraltet: "warn", beschaedigt: "danger" };

export function Meldungen() {
  const z = useAusleihe();
  const [status, setStatus] = useState<MeldungStatus>("offen");
  const anzahl = (s: MeldungStatus) => z.meldungen.filter((m) => m.status === s).length;
  const liste = z.meldungen.filter((m) => m.status === status).sort((a, b) => b.gemeldetAm.localeCompare(a.gemeldetAm));

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />
      <Segmented
        label={t.filter}
        wert={status}
        setze={setStatus}
        werte={[
          { id: "offen", name: `${de.status.meldung.offen} ${anzahl("offen")}` },
          { id: "erledigt", name: `${de.status.meldung.erledigt} ${anzahl("erledigt")}` },
        ]}
      />

      {liste.length === 0 ? (
        status === "offen" ? (
          <EmptyState icon={CircleCheck} title={t.leerOffenTitel} text={t.leerOffenText} />
        ) : (
          <EmptyState icon={CircleCheck} title={t.leerTitel} text={t.leerText} />
        )
      ) : (
        <Liste label={t.title}>
          {liste.map((m) => {
            const k = z.koffer.find((x) => x.id === m.kofferId);
            const muster = k?.muster.find((x) => x.id === m.musterId);
            if (!k || !muster) return null;
            return (
              <Zeile key={m.id}>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{muster.bezeichnung}</span>
                    <span className="sm:hidden">
                      <Badge ton={m.status === "erledigt" ? "ok" : TON[m.art]}>{de.meldungArt[m.art]}</Badge>
                    </span>
                  </div>
                  <span className="text-small text-text-2">
                    <Link href={`/koffer/${k.id}`} className="text-accent hover:underline">
                      {k.nummer} {k.name}
                    </Link>
                    {" · "}
                    {de.detail.sap} <span className="font-mono tabular-nums">{muster.sapNummer}</span>
                  </span>
                  <span className="text-small text-muted tabular-nums">{t.von(person(m.personId)?.name ?? "", datum(m.gemeldetAm))}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="max-sm:hidden">
                    <Badge ton={m.status === "erledigt" ? "ok" : TON[m.art]}>{de.meldungArt[m.art]}</Badge>
                  </span>
                  {m.status === "offen" ? (
                    <Button
                      variante="secondary"
                      groesse="s"
                      icon={CircleCheck}
                      onClick={() => zeigeRueckmeldung(t.erledigt(muster.bezeichnung), meldungErledigen(m.id))}
                    >
                      {t.erledigen}
                    </Button>
                  ) : (
                    <Badge ton="ok">{de.status.meldung.erledigt}</Badge>
                  )}
                </div>
              </Zeile>
            );
          })}
        </Liste>
      )}
    </>
  );
}
