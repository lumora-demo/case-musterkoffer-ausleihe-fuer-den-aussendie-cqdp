"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

// Dialog für Formulare (520 px). Am Handy Fenster von unten über die volle Breite.
// Natives <dialog>: Fokus bleibt im Dialog, Esc schließt. Sichtbarer Schließen-Knopf oben rechts.
export function Dialog({
  offen,
  schliessen,
  titel,
  schliessenLabel,
  children,
}: {
  offen: boolean;
  schliessen: () => void;
  titel: string;
  schliessenLabel: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (offen && !d.open) d.showModal();
    if (!offen && d.open) d.close();
  }, [offen]);

  return (
    <dialog
      ref={ref}
      onClose={schliessen}
      onClick={(e) => e.target === e.currentTarget && schliessen()}
      aria-labelledby="dialog-titel"
      className="m-auto w-[calc(100%-32px)] max-w-[520px] rounded-card bg-surface p-0 text-text shadow-pop backdrop:bg-(--scrim) open:animate-enter max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
    >
      {offen ? (
        <div className="flex flex-col gap-4 p-(--pad-card) pb-[max(16px,env(safe-area-inset-bottom))] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id="dialog-titel" className="text-h3 font-semibold [text-wrap:balance]">
              {titel}
            </h2>
            <button
              type="button"
              onClick={schliessen}
              aria-label={schliessenLabel}
              title={schliessenLabel}
              className="-m-2 flex size-11 shrink-0 items-center justify-center rounded-btn text-text-2 transition-colors duration-(--dur-fast) hover:bg-fill hover:text-text"
            >
              <X className="size-[18px]" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
