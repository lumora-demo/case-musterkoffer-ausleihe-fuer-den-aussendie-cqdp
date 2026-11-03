import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { de } from "@/content/de";
import "./globals.css";

// Schrift Geist, beim Bauen geladen und mit der App ausgeliefert.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: de.app.name, template: `%s – ${de.app.name}` },
  description: de.app.beschreibung,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f5f5f7", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
      {/* data-app-shell: verhält sich wie eine App; ui-dense: dichte App-Größen (globals.css) */}
      <body data-app-shell className="ui-dense flex min-h-full flex-col font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
