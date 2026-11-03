"use client";

import { cn } from "@/lib/utils";

// Umschalter: andere Darstellung derselben Daten oder kurze Auswahl, höchstens 5 Segmente, gleich breit.
export function Segmented<T extends string>({ label, werte, wert, setze }: { label: string; werte: { id: T; name: string }[]; wert: T; setze: (w: T) => void }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-control bg-fill p-0.5">
      {werte.map((w) => (
        <button
          key={w.id}
          type="button"
          aria-pressed={wert === w.id}
          onClick={() => setze(w.id)}
          className={cn(
            "h-(--ctl-h-s) flex-1 whitespace-nowrap rounded-[8px] px-3 text-control tabular-nums text-text-2 transition-[background-color,box-shadow] duration-(--dur) ease-(--ease-out) pointer-coarse:min-h-11",
            wert === w.id && "bg-surface font-medium text-text shadow-card",
          )}
        >
          {/* Unsichtbar in fetter Schrift: hält die Breite fest, damit beim Umschalten nichts springt */}
          <span className="inline-grid">
            <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
              {w.name}
            </span>
            <span className="col-start-1 row-start-1">{w.name}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
