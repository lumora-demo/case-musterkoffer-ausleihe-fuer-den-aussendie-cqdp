"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { de } from "@/content/de";
import { NAV } from "@/content/nav";
import { cn } from "@/lib/utils";

// Rahmen jeder Lumora-App (STYLEGUIDE.md, Abschnitt 10):
// - Rechner ab 960 px: Seitenleiste 240 px; 640–960 px eingeklappt auf 64 px (nur Symbole).
// - Handy unter 640 px: Kopfzeile oben (App-Name klein, Bereich groß), Leiste unten mit höchstens 4 Bereichen.
// Dieselben Bereiche in derselben Reihenfolge auf beiden Geräten.

function aktiv(pfad: string, href: string) {
  return href === "/" ? pfad === "/" : pfad === href || pfad.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pfad = usePathname();
  const bereich = NAV.find((n) => aktiv(pfad, n.href)) ?? NAV[0];

  return (
    <div className="flex min-h-dvh flex-col sm:flex-row">
      {/* Handy: Kopfzeile */}
      <header className="sticky top-0 z-40 flex h-(--mobile-bar-h) items-end border-b border-line bg-surface/90 px-4 pb-2 backdrop-blur-md sm:hidden">
        <div className="flex flex-col">
          <span className="text-caption font-semibold tracking-[.07em] text-muted uppercase">{de.app.name}</span>
          <span className="text-h2 leading-tight font-semibold">{bereich.label}</span>
        </div>
      </header>

      {/* Rechner und Tablet: Seitenleiste */}
      <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col gap-4 self-start border-r border-line bg-surface-2 px-2 py-4 sm:flex lg:w-[240px] lg:px-3">
        <Link href="/" className="flex items-center justify-center gap-2 text-h3 font-bold lg:justify-start lg:px-2">
          <Zeichen />
          <span className="max-lg:sr-only">{de.app.name}</span>
        </Link>
        <nav aria-label={de.app.navLabel} className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              title={label}
              aria-current={aktiv(pfad, href) ? "page" : undefined}
              className={cn(
                "flex h-[34px] items-center justify-center gap-2.5 rounded-control px-2.5 text-control text-text-2 transition-colors duration-(--dur-fast) hover:bg-fill hover:text-text lg:justify-start pointer-coarse:min-h-11",
                aktiv(pfad, href) && "bg-surface font-semibold text-text shadow-card",
              )}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="max-lg:sr-only">{label}</span>
            </Link>
          ))}
        </nav>
        <p className="mt-auto hidden px-2 text-caption text-muted lg:block">{de.app.testdaten}</p>
      </aside>

      <main key={bereich.href} className="animate-enter mx-auto flex w-full max-w-[1360px] min-w-0 flex-1 flex-col gap-8 px-4 pt-5 pb-28 sm:px-6 sm:pt-6 sm:pb-16 lg:pt-8">
        {children}
      </main>

      {/* Handy: Leiste unten, höchstens 4 Bereiche */}
      <nav
        aria-label={de.app.navLabel}
        className="fixed inset-x-0 bottom-0 z-40 grid border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
        style={{ gridTemplateColumns: `repeat(${Math.min(NAV.length, 4)}, minmax(0, 1fr))` }}
      >
        {NAV.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={aktiv(pfad, href) ? "page" : undefined}
            className={cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-text-2", aktiv(pfad, href) && "font-semibold text-accent")}
          >
            <span className={cn("flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-(--dur)", aktiv(pfad, href) && "bg-accent-soft")}>
              <Icon className="size-[22px]" strokeWidth={aktiv(pfad, href) ? 2 : 1.75} aria-hidden />
            </span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

// Zeichen der App: Linien-Symbol in der Kernfarbe (klein, ohne Fläche)
function Zeichen() {
  const Icon = NAV[0].icon;
  return <Icon className="size-[22px] shrink-0 text-accent" strokeWidth={1.75} aria-hidden />;
}
