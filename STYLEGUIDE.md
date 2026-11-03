# Lumora Design-System

Gilt für **jede** App der (erfundenen) Lumora Systeme AG, egal ob interne Anwendung (IT) oder digitales Produkt. Beide Vorlagen haben dieselbe Datei, dieselben Tokens (`src/app/globals.css`) und dieselben Bausteine (`src/components/`).

**Regel:** Jede Oberfläche entsteht nur aus den Tokens und Bausteinen dieser Datei. Fehlt etwas, wird es zuerst hier und in `src/components/ui.tsx` ergänzt, dann gebaut. Keine festen Farbwerte, Größen, Schatten oder Schriften in Seiten.

## 1 Leitlinie

Hell, ruhig, viel Weißraum, **ein einziger Akzent: Salbeigrün**. Feine Linien statt schwerer Schatten, kompakte Höhen (Klasse `ui-dense` am Rahmen). Nichts zeigen, was es nicht gibt.

## 2 Farben

Alle Farben sind CSS-Variablen in `src/app/globals.css` und als Tailwind-Farben verfügbar (`bg-surface`, `text-muted` …). Dunkle Werte sind hinterlegt (`<html data-theme="dark">`), heller Modus ist Standard.

| Token | Hell | Verwendung |
|---|---|---|
| `bg` | `#F5F5F7` | Seitenhintergrund |
| `surface` | `#FFFFFF` | Karten, Kopfzeile, Felder |
| `surface-2` | `#FAFAFB` | Seitenleiste, Tabellenkopf |
| `fill` / `fill-2` | Grau 10 % / 18 % | Zweitknöpfe, Umschalter-Grund / Hover darauf |
| `line` / `line-2` | Grau 12 % / 22 % | Trennlinien / Rahmen von Feldern und Chips |
| `text` / `text-2` / `muted` | `#1D1D1F` / `#48484C` / `#6E6E73` | Haupttext / Beschreibungen / Hinweise, Meta |
| `accent` | `#427E70` | **Kernfarbe Salbeigrün**: Hauptknopf, Links, Fokus, Auswahl |
| `accent-hover` | `#346559` | Hover auf Akzent |
| `accent-soft` | Grün 11 % | Hinterlegung Auswahl, aktive Navigation |
| `on-accent` | `#FFFFFF` | Text auf Akzent |
| `ring` | Grün 34 % | Fokus-Ring |
| `warn` / `warn-soft` | `#A35F00` | bald fällig, „bitte prüfen“ |
| `danger` / `danger-soft` | `#C62F2F` | Fehler, Löschen, überfällig |
| `ok` / `ok-soft` | `#2B7A3D` | erledigt, übernommen |
| `cat-1` … `cat-4` | Petrol, Kupfer, Violett, Oliv | Kategorien (Punkt vor dem Namen), nie als Fläche |

Regeln:
- **Ein Akzent.** Grün nur für Hauptaktion, Links, Fokus und Auswahl, nie als große Fläche.
- **Status ist kein Akzent.** Gelb, Rot, Grün (ok) nur mit Bedeutung und immer mit Text oder Icon, nie Farbe allein.
- **Kein Rot für Dinge, die nur später dran sind.** Rot nur für echte Fehler.
- **Kontrast:** Text mindestens 4,5:1, Icons und Feldrahmen mindestens 3:1.

## 3 Schrift

**Geist** (Text) und **Geist Mono** (Zahlenspalten, Kürzel, Code), über `next/font` eingebunden. Keine anderen Schriften.

| Stufe | Tailwind | Größe (App) | Gewicht | Verwendung |
|---|---|---|---|---|
| Titel 1 | `text-h1` | 30 px | 700, −0,02 em | Seitentitel |
| Titel 2 | `text-h2` | 22 px | 600 | Abschnitte, Kennzahlen |
| Titel 3 | `text-h3` | 15 px | 600 | Karten-, Dialogtitel |
| Text | `text-body` | 14 px | 400 (Kartentitel 500) | Fließtext |
| Bedienung | `text-control` | 13 px | 500 | Knöpfe, Felder, Navigation |
| Klein | `text-small` | 12 px | 400 | Hinweise, Meta, Labels (500) |
| Kategorie | `text-caption` | 11 px | 600, Großbuchstaben, +0,07 em | Abschnittsköpfe |

Am Handy (unter 640 px) automatisch größer: Text und Felder 16 px (sonst zoomt das iPhone), klein 14 px.
Fließtext höchstens 65–72 Zeichen breit. Überschriften mit `text-wrap: balance`. Zahlen in Spalten mit `tabular-nums`.

## 4 Abstände

4er-Raster, nur **2, 4, 8, 12, 16, 20, 24, 32, 48, 64 px**. Abstände zwischen Geschwistern immer mit `gap`, nicht mit Außenabständen.

| Wo | Wert |
|---|---|
| Icon zu Text | 8 (kleine Knöpfe 6) |
| Zwischen Knöpfen | 8 |
| Beschriftung zu Feld, Feld zu Hinweis | 6 |
| Zwischen Feldern | 16 |
| Karten im Raster | `gap-(--gap)` = 12 |
| Innenabstand Karte | `p-(--pad-card)` = 16 |
| Zwischen Abschnitten | 32 (`gap-8` im Rahmen) |
| Seitenrand | Handy 16, ab Tablet 24 |

## 5 Formen und Höhen

| Token | Wert | Verwendung |
|---|---|---|
| `rounded-btn`, `rounded-control` | 8 px | Knöpfe, Felder, Umschalter |
| `rounded-card` | 12 px | Karten, Dialoge |
| `rounded-pop` | 12 px | Menüs, Meldungen |
| `rounded-full` | | Chips, Markierungen, Avatar |
| `--ctl-h` / `--ctl-h-s` / `--ctl-h-l` | 36 / 28 / 44 px | Standard / klein / groß (Touch immer mindestens 44 px) |
| `shadow-card` | 1 px Linie | Karten in Ruhe |
| `shadow-hover` / `shadow-pop` | weich / deutlich | Hover / Menü, Dialog |

## 6 Bewegung

| Token | Wert | Verwendung |
|---|---|---|
| `--dur-fast` | 120 ms | Hover, Fokus, Farbe |
| `--dur` | 200 ms | Umschalter, Meldung |
| `--dur-slow` | 320 ms | Panel, Dialog, Bereichswechsel |
| `--ease` / `--ease-out` | `cubic-bezier(.2,0,0,1)` / `(.16,1,.3,1)` | Standard / Einblenden |

- **Bereichswechsel:** neuer Inhalt blendet ein und kommt 8 px hoch (`animate-enter`, steht schon im Rahmen).
- **Tippen:** Knöpfe, Links und Reiter werden beim Drücken kurz blasser (Grundregel in `globals.css`), Karten 99 %.
- Ruhig und kurz (unter 0,35 s), immer mit Sinn: kein Federn, kein Parallax, nichts Blinkendes. Nichts springt oder flackert; Platzhalter in Endgröße statt Sprung.
- „Weniger Bewegung“ (Systemeinstellung) wird beachtet, das regelt `globals.css`.

## 7 Icons

**lucide-react**, Strich 1,75. 16 px in Meta-Zeilen, 18 px in Knöpfen, 22 px in der Leiste unten am Handy. Nur-Icon-Knöpfe haben immer `aria-label` und `title`. Das Zeichen der App ist ein Linien-Symbol in `accent`, ohne Fläche.

## 8 Layout

| Name | Wert |
|---|---|
| Inhaltsbreite | höchstens 1360 px |
| Seitenleiste | 240 px (ab 960 px), 64 px nur Symbole (640–960 px), darunter Leiste unten |
| Dialog | 420 (Rückfrage) / 520 px (Formular) |
| Umbruchpunkte | 640 (`sm`) · 960 (`lg`) · 1280 px (`xl`) |

## 9 Bausteine (`src/components/ui.tsx`)

| Baustein | Wann |
|---|---|
| `Button` / `ButtonLink` mit `variante` | `primary` genau **eine** Hauptaktion je Ansicht; `secondary` Alternativen; `outline` neutral in Dialogen (Abbrechen); `ghost` Nebenaktionen; `danger` nur Löschen |
| `PageHeader` | Titel jeder Seite, optional Einleitung und Knöpfe rechts; bleibt am Rechner oben stehen |
| `Section` | Abschnitt mit kleinem Titel und optionaler Aktion rechts |
| `Card` | nur für eigenständige Objekte, nicht für jeden Block; `klickbar` für ganze anklickbare Karten |
| `Badge` | Status in 1–2 Wörtern: `neutral`, `accent` (neu, in Arbeit), `warn` (prüfen), `danger` (Fehler), `ok` (erledigt) |
| `Kennzahl` | Beschriftung und Zahl; nur echte bzw. als Testdaten gekennzeichnete Werte |
| `EmptyState` | leerer Zustand: Symbol, Titel, ein Satz, ein Knopf zum Anfangen |
| `Hinweis` | Info, Warnung, Fehler im Inhalt: Titel sagt was, Text sagt, was zu tun ist |
| `Field` + `Input` / `Textarea` / `Select` | Beschriftung **über** dem Feld, Hinweis darunter, Fehler ersetzt den Hinweis; nie nur Platzhalter |
| `Segmented` | Umschalter für andere Darstellung oder kurze Auswahl, höchstens 5 Segmente |

Jeder Baustein hat die Zustände Ruhe, Hover, Fokus (Ring immer sichtbar), Gedrückt und Gesperrt. Gesperrt sparsam: lieber klickbar lassen und erklären, was fehlt.

**Listen und Tabellen:** am Rechner Zeilen in einer Fläche, durch `line` getrennt, Zahlen rechtsbündig in Mono. Am Handy dieselben Datensätze als kompakte Karten (Titel und Status oben, das Wichtigste darunter, leere Felder weglassen). Die Seite scrollt nie seitwärts.

**Laden:** Platzhalter in Form des späteren Inhalts, erst ab 300 ms. Nie leere Seite, nie „Lädt …“ allein.

## 10 Rahmen: Rechner und Handy (`src/components/app-shell.tsx`)

Jede App hat denselben Rahmen. Dieselben Bereiche in derselben Reihenfolge auf beiden Geräten (`src/content/nav.ts`).

- **Rechner (ab 640 px):** Seitenleiste links (`surface-2`, Linie rechts): oben Zeichen und Name der App, darunter die Bereiche als Zeilen (34 px, Symbol 18 px; aktiv `surface` mit `shadow-card` und fett). Ab 960 px 240 px breit, darunter nur Symbole. Der Seitentitel bleibt beim Scrollen oben stehen.
- **Handy (unter 640 px):** Kopfzeile oben (App-Name klein in Großbuchstaben, Bereich groß), Glasfläche. Leiste unten mit **höchstens 4 Bereichen**, gleich breit, Symbol 22 px und Name 11 px; aktiv in Grün mit heller Fläche dahinter. Mehr als 4 Bereiche: der vierte heißt „Mehr“ und führt zu einer Seite mit Kacheln.
- **Tablet (640–960 px)** ausdrücklich mitdenken: Seitenleiste nur mit Symbolen, Inhalt volle Breite.

## 11 UX-Regeln

1. **Eine Hauptaktion pro Ansicht.** Genau ein `primary`-Knopf sichtbar.
2. **Sofort reagieren.** Änderungen erscheinen sofort, gespeichert wird im Hintergrund; klappt es nicht, zurücksetzen und am Ort erklären.
3. **Rückgängig statt Rückfrage.** Kein „Bist du sicher?“; Dialog nur bei Dingen ohne Rückweg.
4. **Im Kontext bleiben.** Details im Seitenpanel (am Handy Fenster von unten), Formulare im Dialog. `Esc` schließt; am Handy gibt es dafür immer einen sichtbaren Knopf („Abbrechen“, „Fertig“ oder X).
5. **Leere Zustände führen weiter, Fehler stehen am Ort** und sagen, was zu tun ist; Eingaben gehen nie verloren.
6. **Tastatur genauso gut wie Maus.** Alles per Tab erreichbar, Fokus-Ring immer sichtbar.
7. **Ehrlich.** Keine ausgegrauten Zukunftsfunktionen, keine erfundenen Zahlen ohne Kennzeichnung „Testdaten“.
8. **Immer Handy und Rechner.** Jede Oberfläche wird für beide Größen gebaut und in beiden Breiten geprüft (390 px und 1280 px). Keine Oberfläche ist fertig, die nur in einer Größe gut ist.
9. **Handy: Daumen zuerst.** Navigation unten, jede Tippfläche mindestens 44 × 44 px (auch Links und kleine Pfeile), Hover nie einziger Weg.
10. **Handy: Kacheln statt langer Listen.** Übersichten als Kacheln (zwei je Reihe, mindestens 112 px hoch), Datensätze als kompakte Karten, selten Gebrauchtes eingeklappt.
11. **Handy: Reiter oben fest.** Umschalter innerhalb eines Bereichs bleiben beim Scrollen unter der Kopfzeile stehen.
12. **Handy: Text zuerst.** In Detailansichten steht der Text bzw. das wichtigste Feld ohne Scrollen im ersten Bildschirm; Zusätzliches als kompakte Zeile, die ein Fenster von unten öffnet.
13. **Am Handy keine Tastatur-Hinweise** (`pointer-coarse:hidden`): keine Kürzel, keine Wörter wie „Klicken“.
14. **Sanft und smooth.** Übergänge nur mit den Bewegungs-Tokens, was verschwindet, gleitet weg, nichts springt.

### Formulare

Eine Spalte. Pflichtfelder normal, optionale mit „(optional)“. Prüfen beim Verlassen des Feldes und beim Absenden, nicht beim Tippen. Absenden bleibt klickbar und springt zum ersten Fehler. Erfolg im selben Bereich zeigen.

### Barrierefreiheit (Mindeststandard)

Kontrast wie in Abschnitt 2. Fokus immer sichtbar. Farbe nie einziges Signal. Jedes Feld hat ein Label, jeder Nur-Icon-Knopf einen Namen. Meldungen per `aria-live`. „Weniger Bewegung“ wird beachtet.

## 12 Sprache und Ton

Deutsch, **du-Form**, kurz und konkret. Knöpfe sagen, was passiert („Übernehmen“, nicht „OK“); Meldungen bestätigen genau das („Übernommen“). Keine Entschuldigungen, keine Fachbegriffe. Texte nie fest in Komponenten, sondern in `src/content/de.ts`. Browser-Tab: „Seite – App“ mit Halbgeviertstrich.

Die Tonlage je Entwicklungsset steht in `CLAUDE.md` (Abschnitt „Dieses Set“).
