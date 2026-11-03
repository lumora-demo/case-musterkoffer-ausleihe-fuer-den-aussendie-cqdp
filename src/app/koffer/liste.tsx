"use client";

import { ChevronRight, PackageX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KofferStatus, wo } from "@/components/ausleihe";
import { Badge, Button, EmptyState, Field, Input, Liste, PageHeader, Segmented, Zeile } from "@/components/ui";
import { de } from "@/content/de";
import { datum, datumKurz, freiAb, offeneMeldungen } from "@/lib/ausleihe";
import { useAusleihe } from "@/lib/ausleihe-store";
import { HEUTE } from "@/lib/demo-daten";

const t = de.koffer;
type Filter = "alle" | "verfuegbar" | "verliehen" | "meldung";

export function KofferListe() {
  const z = useAusleihe();
  const [filter, setFilter] = useState<Filter>("alle");
  const [suche, setSuche] = useState("");

  const q = suche.trim().toLowerCase();
  const liste = z.koffer.filter((k) => {
    if (filter === "verfuegbar" && k.status !== "verfuegbar") return false;
    if (filter === "verliehen" && k.status !== "verliehen") return false;
    if (filter === "meldung" && offeneMeldungen(z, k.id).length === 0) return false;
    if (!q) return true;
    return [k.nummer, k.name, k.serie, ...k.muster.flatMap((m) => [m.sapNummer, m.bezeichnung])].some((s) => s.toLowerCase().includes(q));
  });

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="sm:w-80">
          <Field label={t.suche} hinweis={t.sucheHinweis}>
            <Input type="search" value={suche} onChange={(e) => setSuche(e.target.value)} />
          </Field>
        </div>
        <div className="sm:mb-6">
          <Segmented
            label={t.filter}
            wert={filter}
            setze={setFilter}
            werte={[
              { id: "alle", name: t.alle },
              { id: "verfuegbar", name: t.frei },
              { id: "verliehen", name: de.status.koffer.verliehen },
              { id: "meldung", name: t.unvollstaendig },
            ]}
          />
        </div>
      </div>

      {liste.length === 0 ? (
        <EmptyState icon={PackageX} title={t.leerTitel} text={t.leerText}>
          <Button
            variante="secondary"
            onClick={() => {
              setFilter("alle");
              setSuche("");
            }}
          >
            {t.filterZuruecksetzen}
          </Button>
        </EmptyState>
      ) : (
        <Liste label={t.title}>
          {liste.map((k) => {
            const meldungen = offeneMeldungen(z, k.id).length;
            const frei = freiAb(z, k.id);
            return (
              <Zeile key={k.id} className="relative">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/koffer/${k.id}`} className="font-medium after:absolute after:inset-0 after:rounded-card sm:after:rounded-none">
                      <span className="font-mono text-small text-muted">{k.nummer}</span> {k.name}
                    </Link>
                    <span className="sm:hidden">
                      <KofferStatus koffer={k} />
                    </span>
                  </div>
                  <span className="text-small text-text-2">{wo(k)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted sm:justify-end">
                  {meldungen > 0 ? <Badge ton="warn">{t.meldungen(meldungen)}</Badge> : null}
                  <span>{t.muster(k.muster.length)}</span>
                  {k.status === "verliehen" && k.rueckgabeAm ? (
                    <span className="font-mono tabular-nums">{datum(k.rueckgabeAm)}</span>
                  ) : frei !== HEUTE ? (
                    <span className="tabular-nums">{t.freiAb(datumKurz(frei))}</span>
                  ) : null}
                  <span className="max-sm:hidden">
                    <KofferStatus koffer={k} />
                  </span>
                  <ChevronRight className="size-4 text-muted max-sm:hidden" strokeWidth={1.75} aria-hidden />
                </div>
              </Zeile>
            );
          })}
        </Liste>
      )}
    </>
  );
}
