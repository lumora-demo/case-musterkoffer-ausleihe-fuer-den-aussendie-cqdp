"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";
import { Badge, EmptyState, PageHeader, Segmented } from "@/components/ui";
import { de } from "@/content/de";
import { EINTRAEGE, type Status } from "@/lib/demo-daten";

const t = de.eintraege;

export default function Eintraege() {
  const [filter, setFilter] = useState<Status | "alle">("alle");
  const liste = EINTRAEGE.filter((e) => filter === "alle" || e.status === filter);
  const ton = (s: Status) => (s === "erledigt" ? "ok" : s === "arbeit" ? "accent" : "neutral");

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />
      <Segmented
        label={t.filter}
        wert={filter}
        setze={setFilter}
        werte={[
          { id: "alle", name: t.alle },
          { id: "offen", name: t.status.offen },
          { id: "arbeit", name: t.status.arbeit },
          { id: "erledigt", name: t.status.erledigt },
        ]}
      />
      {liste.length === 0 ? (
        <EmptyState icon={Inbox} title={t.leerTitel} text={t.leerText} />
      ) : (
        // Rechner: Zeilen in einer Fläche, durch Linien getrennt. Handy: dieselben Einträge als kompakte Karten.
        <ul className="flex flex-col gap-2 sm:gap-0 sm:overflow-hidden sm:rounded-card sm:bg-surface sm:shadow-card">
          {liste.map((e) => (
            <li
              key={e.id}
              className="flex flex-col gap-1 rounded-card bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:gap-4 sm:rounded-none sm:px-(--pad-card) sm:py-3 sm:shadow-none sm:not-last:border-b sm:not-last:border-line"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium">{e.titel}</span>
                <span className="truncate text-small text-muted">{e.beschreibung}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge ton={ton(e.status)}>{t.status[e.status]}</Badge>
                <span className="font-mono text-small text-muted tabular-nums">{new Date(e.geaendert).toLocaleDateString("de-DE")}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
