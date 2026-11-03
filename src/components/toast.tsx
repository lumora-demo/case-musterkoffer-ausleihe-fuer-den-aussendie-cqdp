"use client";

import { useEffect, useSyncExternalStore } from "react";
import { de } from "@/content/de";
import { cn } from "@/lib/utils";

// Rückmeldung nach einer Aktion: bestätigt genau das Getane, optional mit „Rückgängig“ (statt Rückfrage).
// Unten mittig, am Handy über der Leiste unten. Verschwindet nach 6 s. Wird per aria-live vorgelesen.
type Rueckmeldung = { id: number; text: string; rueckgaengig?: () => void };

let aktuell: Rueckmeldung | null = null;
const hoerer = new Set<() => void>();
const setze = (r: Rueckmeldung | null) => {
  aktuell = r;
  hoerer.forEach((h) => h());
};

export function zeigeRueckmeldung(text: string, rueckgaengig?: () => void) {
  setze({ id: Date.now(), text, rueckgaengig });
}

export function RueckmeldungsBereich() {
  const r = useSyncExternalStore(
    (h) => {
      hoerer.add(h);
      return () => hoerer.delete(h);
    },
    () => aktuell,
    () => null,
  );

  useEffect(() => {
    if (!r) return;
    const t = window.setTimeout(() => setze(null), 6000);
    return () => window.clearTimeout(t);
  }, [r]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 sm:bottom-6">
      {r ? (
        <div
          key={r.id}
          role="status"
          className={cn(
            "animate-enter pointer-events-auto flex min-h-11 max-w-[520px] items-center gap-3 rounded-pop bg-tile py-1 pr-1 pl-4 text-small text-tile-text shadow-pop",
            !r.rueckgaengig && "pr-4",
          )}
        >
          <span className="py-2">{r.text}</span>
          {r.rueckgaengig ? (
            <button
              type="button"
              onClick={() => {
                r.rueckgaengig?.();
                setze(null);
              }}
              className="min-h-11 shrink-0 rounded-btn px-3 font-semibold text-tile-text underline-offset-2 hover:underline"
            >
              {de.allgemein.rueckgaengig}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
