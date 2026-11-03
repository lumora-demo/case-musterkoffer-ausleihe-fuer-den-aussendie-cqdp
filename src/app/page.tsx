import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, Kennzahl, PageHeader, Section } from "@/components/ui";
import { de } from "@/content/de";
import { EINTRAEGE } from "@/lib/demo-daten";

const t = de.uebersicht;

export default function Uebersicht() {
  const zahl = (s: string) => EINTRAEGE.filter((e) => e.status === s).length;
  return (
    <>
      <PageHeader title={t.title} lead={t.lead}>
        <Button variante="primary" icon={Plus}>
          {t.neu}
        </Button>
      </PageHeader>

      <Section title={t.kennzahlen}>
        <div className="grid grid-cols-2 gap-(--gap) md:grid-cols-3">
          <Kennzahl label={t.offen} wert={zahl("offen")} hinweis={t.testdaten} />
          <Kennzahl label={t.inArbeit} wert={zahl("arbeit")} hinweis={t.testdaten} />
          <Kennzahl label={t.erledigt} wert={zahl("erledigt")} hinweis={t.testdaten} />
        </div>
      </Section>

      <Section
        title={t.zuletzt}
        action={
          <Link href="/eintraege" className="inline-flex min-h-11 items-center gap-1 text-small font-medium text-accent hover:underline">
            {t.alle} <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="grid gap-(--gap) sm:grid-cols-2">
          {EINTRAEGE.slice(0, 2).map((e) => (
            <Card key={e.id} klickbar className="flex flex-col gap-2">
              <Badge ton={e.status === "erledigt" ? "ok" : e.status === "arbeit" ? "accent" : "neutral"}>{de.eintraege.status[e.status]}</Badge>
              <p className="font-medium">{e.titel}</p>
              <p className="line-clamp-2 text-small text-muted">{e.beschreibung}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
