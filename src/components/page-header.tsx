"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Seitentitel: Am Rechner bleibt die Titelzeile beim Scrollen oben stehen (Glasfläche erst beim Anliegen, ohne
// Höhensprung). Am Handy steht der Name schon in der Kopfzeile (app-shell.tsx), hier nur für Screenreader.
export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [angeheftet, setAngeheftet] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (el) setAngeheftet(window.scrollY > 0 && el.getBoundingClientRect().top <= 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="flex flex-col gap-2">
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-between gap-3",
          "sm:sticky sm:top-0 sm:z-30 sm:-mx-6 sm:-my-3 sm:border-b sm:px-6 sm:py-3 sm:transition-[background-color,border-color] sm:duration-(--dur) sm:ease-(--ease)",
          angeheftet ? "sm:border-line sm:bg-bg/85 sm:backdrop-blur-md" : "sm:border-transparent",
        )}
      >
        <h1 className="text-h1 font-bold tracking-[-0.02em] [text-wrap:balance] max-sm:sr-only">{title}</h1>
        {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
      </div>
      {lead ? <p className="max-w-[68ch] text-text-2">{lead}</p> : null}
    </header>
  );
}
