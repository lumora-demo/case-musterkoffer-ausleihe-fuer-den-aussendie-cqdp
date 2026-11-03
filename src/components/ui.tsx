import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Bausteine des Lumora Design-Systems (STYLEGUIDE.md, Abschnitt 9). Seiten bauen nur hieraus.
// Fehlt ein Baustein, wird er zuerst hier ergänzt (und im Style-Guide beschrieben), dann verwendet.
// Bausteine mit Zustand liegen in eigenen Dateien ("use client") und werden hier mit ausgegeben.
export { PageHeader } from "./page-header";
export { Segmented } from "./segmented";

// Knöpfe: genau ein „primary“ je Ansicht. Icon links vom Text.
const KNOPF = {
  primary: "bg-accent text-on-accent font-semibold hover:bg-accent-hover",
  secondary: "bg-fill text-text font-semibold hover:bg-fill-2",
  outline: "bg-surface text-text font-medium shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-surface-2",
  ghost: "text-text-2 font-medium hover:bg-fill hover:text-text",
  danger: "bg-danger-soft text-danger font-semibold",
} as const;
const GROESSE = {
  s: "h-(--ctl-h-s) px-3 text-small gap-1.5",
  m: "h-(--ctl-h) px-4 text-control gap-2",
  l: "h-(--ctl-h-l) px-5 text-control gap-2",
} as const;

type KnopfArt = { variante?: keyof typeof KNOPF; groesse?: keyof typeof GROESSE; icon?: LucideIcon };

export function knopfKlasse({ variante = "secondary", groesse = "m" }: KnopfArt = {}) {
  return cn(
    "relative inline-flex shrink-0 items-center justify-center rounded-btn whitespace-nowrap transition-colors duration-(--dur-fast) ease-(--ease) disabled:opacity-45 pointer-coarse:min-h-11",
    KNOPF[variante],
    GROESSE[groesse],
  );
}

export function Button({ variante, groesse, icon: Icon, className, children, ...rest }: KnopfArt & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn(knopfKlasse({ variante, groesse }), className)} {...rest}>
      {Icon ? <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({ variante, groesse, icon: Icon, className, children, href }: KnopfArt & { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn(knopfKlasse({ variante, groesse }), className)}>
      {Icon ? <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden /> : null}
      {children}
    </Link>
  );
}

// Karte: nur für eigenständige Objekte. `klickbar` hebt beim Hover leicht an.
export function Card({ className, klickbar, children }: { className?: string; klickbar?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface p-(--pad-card) shadow-card",
        klickbar && "transition-[box-shadow,transform] duration-(--dur) ease-(--ease) hover:-translate-y-px hover:shadow-hover active:scale-[.99]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Abschnitt mit kleinem Titel (Kategorie) und optionaler Aktion rechts
export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-caption font-semibold tracking-[.07em] text-muted uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// Markierung: 22 px hoch, 12 px/600, 1–2 Wörter. Farbe nie allein: immer mit Text.
const TON = {
  neutral: "bg-fill text-text-2",
  accent: "bg-accent-soft text-accent",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  ok: "bg-ok-soft text-ok",
} as const;

export function Badge({ children, ton = "neutral" }: { children: React.ReactNode; ton?: keyof typeof TON }) {
  return <span className={cn("inline-flex h-[22px] w-fit shrink-0 items-center gap-1 rounded-full px-2 text-[12px] font-semibold", TON[ton])}>{children}</span>;
}

// Kennzahl: Beschriftung klein, Zahl groß mit gleich breiten Ziffern. `hinweis` z. B. „Testdaten“.
export function Kennzahl({ label, wert, hinweis }: { label: string; wert: string | number; hinweis?: string }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-small text-muted">{label}</span>
      <span className="text-h2 font-semibold tabular-nums">{wert}</span>
      {hinweis ? <span className="text-caption text-muted">{hinweis}</span> : null}
    </Card>
  );
}

// Leerer Zustand: Symbol in 44-px-Kachel, Titel, ein Satz, wie man anfängt, ein Knopf dafür.
export function EmptyState({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card bg-surface px-6 py-10 text-center shadow-card">
      <span className="mb-1 flex size-11 items-center justify-center rounded-control bg-fill text-text-2">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <p className="font-semibold">{title}</p>
      <p className="max-w-[48ch] text-small text-muted">{text}</p>
      {children}
    </div>
  );
}

// Hinweis im Inhalt: fetter Titel sagt was, Text sagt, was jetzt zu tun ist.
export function Hinweis({ title, children, ton = "info" }: { title: string; children: React.ReactNode; ton?: "info" | "warn" | "danger" }) {
  return (
    <div className={cn("rounded-card p-4 text-small", ton === "warn" ? "bg-warn-soft" : ton === "danger" ? "bg-danger-soft" : "bg-fill")}>
      <p className="font-semibold">{title}</p>
      <p className="text-text-2">{children}</p>
    </div>
  );
}

// Eingaben: Beschriftung über dem Feld, Hinweis darunter, Fehler ersetzt den Hinweis.
export const feldKlasse =
  "w-full rounded-control bg-surface px-3 text-body shadow-[inset_0_0_0_1px_var(--line-2)] outline-none transition-shadow duration-(--dur-fast) hover:shadow-[inset_0_0_0_1px_var(--muted)] focus:shadow-[inset_0_0_0_1.5px_var(--accent),0_0_0_3px_var(--ring)] aria-invalid:shadow-[inset_0_0_0_1.5px_var(--danger)] disabled:bg-fill";

export function Field({ label, hinweis, fehler, optional, children }: { label: string; hinweis?: string; fehler?: string; optional?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-small font-medium">
        {label}
        {optional ? <span className="font-normal text-muted"> ({optional})</span> : null}
      </span>
      {children}
      {fehler ? <span className="text-small text-danger">{fehler}</span> : hinweis ? <span className="text-small text-muted">{hinweis}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(feldKlasse, "h-(--ctl-h)", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(feldKlasse, "min-h-24 py-2.5", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(feldKlasse, "h-(--ctl-h)", props.className)} />;
}
