# PLAN_WEBSITE — „Weihnachtszeit in Britz“

> Implementierungs-Konzept für eine statische CSR-Frontend-App ohne Server,
> ohne Build-Step, ohne Frameworks. Ziel: eine **sehr schöne, weihnachtliche**
> Chronik-Website, die auf GitHub Pages (oder jedem statischen Host) läuft.
>
> **Datenquelle (einzige Wahrheit):** `weihnachten-in-britz-chronologie.md`
> **Archivierte Vorgängerversion:** `archive/public-v1/` (nur Inspiration, wird ersetzt)

---

## 1. Vision & Ziel

Eine einseitige, interaktive Web-App („Single Page App“), die die Weihnachts-
Chronik Britz 2009–2026 als **erlebbares Wintererlebnis** erzählt:

- **Stimmung:** „Winterabend in Britz“ — tiefe Nacht, fallender Schnee,
  Lichterketten, Kerzenlicht, warmes Gold auf dunklem Tannengrün.
- **Inhalt:** Alle Events, Traditionen, Akteure und Zitate aus dem Amtsblatt,
  gefiltert, durchsuchbar und als Zeitstrahl erzählbar.
- **Qualität:** „SEHR hübsch“ ist ein Abkriterium, keine Floskel — Design-
  System, Motion-Design und Accessibility sind Teil der Definition of Done.

### Nicht-Ziele (Out of Scope)

- Kein Backend, kein CMS, keine Datenbank, kein Build-Step, kein Bundler.
- Kein React/Vue/Svelte, kein Vite/Webpack, keine npm-Abhängigkeiten.
- Keine neuen Fakten erfinden: **Jeder Satz auf der Website muss in der
  Chronologie-MD belegt sein.**
- Kein Login, keine Persistenz über `sessionStorage`-Unabhängigkeit hinaus
  (Filter-State darf in der Hash-URL liegen, mehr nicht).

---

## 2. Harte Constraints (für alle Agenten bindend)

| # | Regel |
|---|-------|
| C1 | **Hosting:** Lauffähig als reine statische Dateien. GitHub Pages ohne Server-Konfiguration. `file://`-Öffnung von `index.html` darf nicht crashen (Module erfordern `http(s)://` — dafür ist der QA-Punkt „lokaler Static-Server“ Pflicht, `file://` nur als Bonus-Check). |
| C2 | **JS:** ES2020+ Vanilla-JS, **ausschließlich Klassen** (keine losen Top-Level-Funktionen, keine IIFE, keine `var`). Einstiegspunkt: genau ein `<script type="module">`. |
| C3 | **CSS:** Ein Einstieg `css/main.css`, der **nur `@import`-Anweisungen** enthält; alle Styles liegen in nummerierten Partials. Kein CSS-Framework, kein Tailwind, kein Preprocessor. |
| C4 | **Keine externen JS-Abhängigkeiten.** Fonts dürfen über Google-Fonts-`<link>` geladen werden (mit `font-display: swap` und System-Fallback). |
| C5 | **Sprache:** UI und Inhalte auf Deutsch. |
| C6 | **Daten:** Alle Inhalte stammen aus `weihnachten-in-britz-chronologie.md`. Namen, Daten, Zitate 1:1 übernehmen. Wo die MD unsicher ist (z. B. 12. vs. 14.12.2024), beide Varianten wie in der MD abbilden. |
| C7 | **Accessibility:** WCAG-AA-Kontrast, Tastaturbedienbarkeit, `prefers-reduced-motion`-Fallbacks, semantisches HTML, `aria`-Attribute an interaktiven Stellen. |
| C8 | **Performance:** Gesamt-JS < 80 KB, CSS < 50 KB (ungemindert), keine Blocking-Requests außer Fonts, Lighthouse-Performance ≥ 90 auf Mid-Range-Emulation. |
| C9 | **Kein Commit** ohne explizite Aufforderung. Kein Hinzufügen von READMEs/Doku außer diesem Plan. |

---

## 3. Projektstruktur (Zielzustand)

```
xmas-history/
├── PLAN_WEBSITE.md                     ← dieses Dokument
├── weihnachten-in-britz-chronologie.md ← Datenquelle (read-only)
├── archive/
│   └── public-v1/                      ← alte statische Seite (Referenz)
└── site/                               ← deploybare App (Root für GH Pages)
    ├── index.html                      ← einziger HTML-File, App-Shell
    ├── css/
    │   ├── main.css                    ← nur @import-Liste (C3)
    │   ├── 01-tokens.css               ← Design-Tokens (Farben, Typo, Spacing)
    │   ├── 02-base.css                 ← Reset, Body, Hintergrund, Typografie
    │   ├── 03-layout.css               ← Shell, Nav, Footer, Grid
    │   ├── 04-components.css           ← Cards, Chips, Buttons, Modal, Tabs
    │   ├── 05-views.css                ← View-spezifische Styles (Timeline etc.)
    │   ├── 06-motion.css               ← Keyframes, Reveal, Snow, Lights
    │   └── 07-responsive.css           ← Breakpoints, Mobile-Feinjustierung
    ├── js/
    │   ├── main.js                     ← Einstieg: `new App().start()`
    │   ├── data/
    │   │   └── chronik.js              ← `class Chronik` (statische Daten)
    │   ├── core/
    │   │   ├── App.js                  ← Bootstrap, Wiring, View-Lebenszyklus
    │   │   ├── Router.js               ← Hash-Router
    │   │   ├── Store.js                ← Observable State
    │   │   ├── EventBus.js             ← on/off/emit
    │   │   └── Reveal.js               ← IntersectionObserver-Scroll-Reveal
    │   ├── ui/
    │   │   ├── Snowfall.js             ← Canvas-Schneefall
    │   │   ├── LightString.js          ← Lichterkette (SVG/CSS, Twinkle)
    │   │   ├── EventCard.js            ← rendert eine Event-Karte
    │   │   ├── FilterBar.js            ← Jahr-/Kategorie-/Akteur-Filter
    │   │   ├── SearchBox.js            ← Live-Suche
    │   │   ├── Modal.js                ← Detail-Dialog (Focus-Trap, Esc)
    │   │   └── Countdown.js            ← „Nächster Termin“ im Hero
    │   └── views/
    │       ├── HomeView.js             ← Hero + Highlights + Countdown
    │       ├── ChronikView.js          ← Zeitstrahl 2009–2026
    │       ├── EventsView.js           ← Filterbare Event-Galerie
    │       ├── AkteureView.js          ← Organisationen & Personen
    │       ├── TraditionenView.js      ← Wiederkehrende Bräuche
    │       └── QuellenView.js          ← Quellen, Impressum, Über
    └── assets/
        └── icons/                      ← Inline-SVG-Icons (Baum, Stern, …)
```

**Routing (Hash-basiert, GH-Pages-tauglich ohne Server-Rewrites):**

| Route | View | Inhalt |
|-------|------|--------|
| `#/` | HomeView | Hero, Countdown zum nächsten Termin, 3–4 Highlight-Karten, „Start der Chronik“-CTA |
| `#/chronik` | ChronikView | Vertikaler Zeitstrahl, Jahre als Meilensteine, Events chronologisch |
| `#/events` | EventsView | Galerie aller Events + FilterBar + SearchBox |
| `#/akteure` | AkteureView | Karten pro Organisation/Person mit ihren Events |
| `#/traditionen` | TraditionenView | Ortsweihnachtsbaum, Wichtelfest→Familienadvent, Neujahrsfeuer, … |
| `#/quellen` | QuellenView | Amtsblatt-Quellen, RAG-Hinweis, Methodik, Kontakt |

---

## 4. Datenmodell

Alle Daten leben in **einer Klasse** (`js/data/chronik.js`) — erfüllt C2.
Die Klasse ist reine Datenhaltung (statische Properties), keine Logik.

```js
// js/data/chronik.js
export class Chronik {
  static meta = {
    titel: "Weihnachtszeit in Britz",
    untertitel: "Eine Chronik der Advents- und Weihnachtszeit in Britz, 2009–2026",
    gemeinde: "Gemeinde Britz · Amt Britz-Chorin-Oderberg",
    stand: "November 2026",
    quelle: "Amtsblatt Britz-Chorin-Oderberg (indexiert im RAG-Archiv), Ausgaben 2019–2026",
  };

  static kategorie = {
    advent:      { label: "Adventszeit",   icon: "kerze" },
    markt:       { label: "Märkte & Feste", icon: "markt" },
    konzert:     { label: "Musik & Konzerte", icon: "musik" },
    senioren:    { label: "Senioren",      icon: "herz" },
    kinder:      { label: "Kinder & Schule", icon: "kind" },
    tradition:   { label: "Traditionen",   icon: "baum" },
    weihnachtsmann: { label: "Weihnachtsmann & Co.", icon: "sack" },
  };

  static events = [
    {
      id: "wichtelfest-2018",
      jahr: 2018,
      datum: null,                    // ISO "2018-12-01" oder null (nur Jahr belegt)
      titel: "10. Britzer Wichtelfest",
      kategorie: ["markt", "kinder", "weihnachtsmann"],
      ort: "Parkplatz des Amtes Britz-Chorin-Oderberg",
      veranstalter: ["Britzer Heimatkundeverein e. V.", "Freiwillige Feuerwehr Britz"],
      kurzfassung: "Duft von Waffeln und gewürztem Wein, großer Adventskranz, Weihnachtsmann mit Alpakas vom Serwester Hof.",
      details: [
        "Eröffnung durch den Vereinsvorsitzenden Lutz-Werner Marten.",
        "Programm: „Abenteuer des Engel Louigi und seiner Flügel“, Waffeln, Crêpes, Bratwürste, Glühwein, Kinderpunsch.",
        "Werbestand der FFW-Jugend Britz, Bastelstand des Jugendklubs, Sofortbilder mit dem Weihnachtsmann, Knüppelkuchen, Kinderschminken.",
        "Spendenbox für die Britzer Kita; Spendensumme auf 50 Euro aufgerundet.",
        "Weihnachtsbaumwettbewerb „Der Weihnachtsbaum im Wandel der Zeit“: 1. Platz Britzer Kita, Pokal des Vorstandes Jugendfeuerwehr Britz.",
      ],
      zitate: [
        "Die Stände schön gelassen nacheinander anschauen, mitmachen und mitnehmen, was alles geht, macht viel Spaß. — Familie Jung aus Eberswalde",
      ],
      tags: ["Alpakas", "Weihnachtsmann", "Waffeln", "Glühwein", "Kinderschminken"],
    },
    // … alle weiteren Events aus der Chronologie-MD (siehe Checkliste in Schritt 1)
  ];

  static akteure = [
    {
      id: "heimatverein",
      name: "Britzer Heimatkundeverein e. V.",
      rolle: "Wichtelfest (bis 2018), Ortsweihnachtsbaum, Glühweinstand, Adventsfest, Familienadvent, Neujahrsfeuer (Süßes)",
      person: "Lutz-Werner Marten (1. Vorsitzender)",
      eventIds: ["wichtelfest-2018", "baum-2009", "baum-2024", "adventsfest-2023", "familienadvent-2024", "familienadvent-2025", "neujahrsfeuer-2026"],
    },
    // … alle Zeilen aus „Anhang: Wichtige Akteure & Organisationen“
  ];

  static traditionen = [
    {
      id: "ortsweihnachtsbaum",
      name: "Ortsweihnachtsbaum Britz",
      seit: 2009,
      beschreibung: "Eberswalder Straße / Ecke Heegermühler Straße. 2024 zum 15. Mal gestaltet. Heimatkundeverein + FFW, unterstützt durch Gemeinde Britz, GIGALIFT-Vermietung GmbH, Familie Günther (Strom).",
      eventIds: ["baum-2009", "baum-2024"],
    },
    // … Wichtelfest→Familienadvent, Neujahrsfeuer, Weihnachtssingen, Hort-Weihnachtsmarkt, …
  ];

  // Geplante Termine 2026 sind Teil von `events` (geplant: true, mit datum + uhrzeit):
  // ortsgruppen-2026, familienadvent-2026, senioren-2026, weihnachtssingen-2026.
}
```

**Pflichtfelder pro Event:** `id`, `jahr`, `titel`, `kategorie[]`, `kurzfassung`,
`details[]`. Optional: `datum`, `ort`, `veranstalter[]`, `zitate[]`, `tags[]`.

**Vollständigkeits-Checkliste (alle Events der MD müssen existieren):**
2009 Baum · 2018 Wichtelfest · 2018 Seniorenfeier · 2019 Seniorenfeier ·
2019 Wichtelfest-Ende („kreative Pause“) · 2019 Konzert · 2020 Corona-Ausfall ·
2020 Konzert · 2021 Strolche-Weihnachtsmarkt · 2021 Seniorenfeier ·
2022 Strolche-Weihnachtsmarkt · 2022 Seniorenfeier · 2022 Konzert ·
2023 1. Adventsfest · 2023 Seniorenfeier · 2023 Hort-Weihnachtsmarkt ·
2023 Konzert · 2023 Adventsgestecke · 2024 1. Familienadvent ·
2024 Baum (15. Mal) · 2024 Seniorenfeier · 2024 Hort-Weihnachtsmarkt ·
2024 Martinsfest · 2024 Weihnachtsabend Schule · 2025 2. Familienadvent ·
2025 Adventszauber Schule · 2025 Hort-Weihnachtsmarkt · 2025 Seniorenfeier ·
2025 Weihnachtssingen · 2025 Stettin-Fahrt · 2026 Neujahrsfeuer ·
2026 geplante Termine (als `geplant: true` markiert).

---

## 5. Design-System

### 5.1 Farbwelt — „Winterabend in Britz“

| Token | Wert | Verwendung |
|-------|------|------------|
| `--nacht-900` | `#0a1626` | Seitenhintergrund (Mitternachtsblau) |
| `--nacht-800` | `#0e2033` | Flächen, Nav |
| `--tanne-700` | `#0f3d2e` | Akzentflächen, Timeline-Linie |
| `--tanne-500` | `#1d6b4f` | Hover, aktive Chips |
| `--gold-400` | `#f2c14e` | Primärakzent, Titel-Gradient, Linien |
| `--gold-200` | `#ffe9b0` | Highlights, Fokus |
| `--rot-500` | `#c2273f` | Sekundärakzent (Bänder, Weihnachtsmann) |
| `--creme` | `#fdf6e3` | Text auf dunklen Flächen |
| `--creme-70` | `rgba(253,246,227,.72)` | Sekundärtext |
| `--glas` | `rgba(255,255,255,.06)` | Card-Hintergrund (Frosted Glass) |
| `--linie` | `rgba(242,193,78,.28)` | Borders |

Hintergrund: mehrschichtiger Gradient (Mitternachtsblau → Tannengrün) +
subtile Sternpunkte (CSS-Radial-Gradients) + Canvas-Schnee. Kontrast Creme auf
Nacht-900 ≥ 12:1 (AA erfüllt).

### 5.2 Typografie

- **Display:** „Cormorant Garamond“ (600/700) — Jahreszahlen, H1/H2, Zitate.
- **Body:** „Source Sans 3“ (400/600) — Fließtext, UI.
- Fallbacks: `Georgia, "Times New Roman", serif` bzw. `"Segoe UI", system-ui, sans-serif`.
- Skala (rem): H1 `clamp(2.6rem, 6vw, 4.5rem)` · H2 `clamp(1.6rem, 3vw, 2.2rem)` ·
  Body `1rem/1.7` · Caption `0.85rem` · Jahreszahl `clamp(2.2rem, 5vw, 3.4rem)`.
- `text-wrap: balance` auf Headlines, `text-wrap: pretty` auf Absätzen.

### 5.3 Motion-Design

| Element | Verhalten | Reduced-Motion-Fallback |
|---------|-----------|--------------------------|
| Schneefall | Canvas, 2 Tiefenlagen, sanfte Drift, `requestAnimationFrame`, Pause bei `visibilitychange` | statischer Sternenhimmel, kein Schnee |
| Lichterkette | SVG-Bulbs oben, sequenzielles Twinkle (Chase), 4 Farben (rot/gold/grün/blau) | statisch, volle Helligkeit |
| Scroll-Reveal | `IntersectionObserver`, `translateY(24px)→0` + Fade, 500 ms, `cubic-bezier(.22,.61,.36,1)` | sofort sichtbar |
| Card-Hover | `translateY(-4px)`, Gold-Glow-Schatten, 200 ms | nur Farbwechsel |
| View-Wechsel | Fade + 8 px Slide, 250 ms | sofort |
| Countdown | Sekunden-Tick, dezente Pulsation der Ziffern | statischer Text |

Regel: **Jede Animation hat einen `@media (prefers-reduced-motion: reduce)`-Zweig.**

### 5.4 Komponenten-Spezifikation

- **EventCard:** Frosted-Glass-Fläche, 1 px Gold-Border, 18 px Radius,
  Kategorie-Chips (Icon + Label), Jahreszahl groß in Display-Serif,
  Kurzfassung, „Details“ öffnet Modal. Hover: Lift + Glow.
- **Chip:** Pill, 1 px Border, Icon 16 px, aktive Variante: Gold-Füllung,
  Nacht-Text (Kontrast prüfen!).
- **Timeline:** mittige vertikale Linie (Gold-Verlauf), Jahres-Knoten als
  leuchtende Diamanten, Karten abwechselnd links/rechts (Desktop),
  gestapelt (Mobile). Jahreskopf: große Serif-Zahl + Kontextzeile.
- **Modal:** dunkles Overlay (80 %), zentrierte Karte max. 640 px,
  Zitate als Blockquote mit 3 px Gold-Linkskante, Esc/Overlay-Schließen,
  Focus-Trap, `role="dialog" aria-modal="true"`.
- **Nav:** sticky, Blur, Logo (SVG-Tannenbaum) + Routen, aktive Route
  gold unterstrichen, Mobile: horizontal scrollbare Pills.
- **Footer:** Quellenzeile, „Nach oben“-Link, Stand-Datum.

---

## 6. Architektur

```
index.html
  └─ <script type="module" src="js/main.js">
       └─ class App
            ├─ class Router      (hashchange → View wechseln)
            ├─ class Store       (State: route, filter, query, selectedEvent)
            ├─ class EventBus    (lose Kopplung UI ↔ Views)
            ├─ class Chronik     (Daten, read-only)
            ├─ Views (eine Instanz pro Route, lazy erzeugt, wiederverwendet)
            └─ UI-Widgets (Snowfall, LightString, Reveal, Modal, …)
```

**Klassen-Verträge (Kern):**

```js
class App {
  constructor(rootEl) { /* … */ }
  start() { /* Router, Store, Widgets, erste View */ }
  // View-Lebenszyklus: enter() / leave() — Widgets wie Snowfall laufen global
}

class Router {
  constructor(store, app) { /* … */ }
  start() { /* hashchange-Listener + initiale Route */ }
  to(hash) { /* location.hash = hash */ }
}

class Store {
  constructor(initial) { /* … */ }
  get(key) { /* … */ }
  set(patch) { /* merge + emit("change", patch) */ }
  subscribe(fn) { /* … */ }
}

class EventBus {
  on(evt, fn) { /* … */ }
  off(evt, fn) { /* … */ }
  emit(evt, payload) { /* … */ }
}
```

**State-Form:**
```js
{
  route: "chronik",
  filter: { jahre: [], kategorien: [], veranstalter: [] },
  query: "",
  selectedEvent: null,   // id
}
```

**Rendering-Prinzip:** Views bauen DOM per `document.createElement` /
Template-Strings (Escape-Pflicht für alle Datenwerte — `EventCard` kapselt
das in `static esc(s)`). Kein `innerHTML` mit ungefilterten Strings.
Re-Renders nur bei Store-Änderungen, die die View betreffen (EventsView
filtert, ChronikView nicht).

**Filter-Logik (EventsView):**
- Jahr: Mehrfachauswahl (Chips 2009…2026).
- Kategorie: Mehrfachauswahl (OR innerhalb Kategorie, AND zwischen Kategorien).
- Veranstalter: Dropdown (einfach).
- Suche: Substring über `titel`, `kurzfassung`, `tags`, `veranstalter`
  (case-insensitiv, Umlaut-tolerant: `ä→ae` optional als Bonus).
- Ergebnis-Zeile: „12 von 34 Veranstaltungen“ (`aria-live="polite"`).
- Filter-State in Hash-Query spiegeln (z. B. `#/events?k=markt&j=2024`) →
  teilbar, zurück-Taste funktioniert.

---

## 7. View-Spezifikationen

### 7.1 HomeView (`#/`)
1. **Hero:** Kicker „Gemeinde Britz · Amt Britz-Chorin-Oderberg“, H1
   „Weihnachtszeit in Britz“ (Gold-Gradient), Lead-Satz, Badges
   (Adventszeit, Märkte, Konzerte, Senioren, Kinder, Traditionen).
2. **Countdown-Widget:** nächster Termin aus den geplanten Events (`geplant: true`) (relativ zu
   „heute“; nach dem letzten Termin: „Die Adventszeit 2026 ist vorbei —
   bis zum nächsten Lichterfest!“).
3. **Highlights:** 3 Karten — „Ortsweihnachtsbaum seit 2009“,
   „Vom Wichtelfest zum Familienadvent“, „Neue Tradition: Weihnachtssingen“
   (jeweils CTA → `#/chronik` bzw. `#/traditionen`).
4. **Zitat-Band:** ein kurzes Zitat aus der MD (z. B. Bürgermeister-Gedicht
   2023, gekürzt) als Blockquote.

### 7.2 ChronikView (`#/chronik`)
- Vertikale Timeline, gruppiert nach Jahr (2009 → 2026).
- Jahreskopf: große Zahl + einzeilige Jahres-Kontextzeile
  (z. B. 2020: „Corona-Pandemie — Ausfall der Weihnachtsfeiern“).
- Events des Jahres als Karten (EventCard), chronologisch.
- 2026: geplante Termine mit Badge „geplant“.
- Scroll-Reveal pro Karte.

### 7.3 EventsView (`#/events`)
- Kopfzeile: Titel + Ergebnis-Zähler.
- FilterBar (Jahr-Chips, Kategorie-Chips, Veranstalter-Select, „Zurücksetzen“).
- SearchBox (Live, 150 ms Debounce).
- Galerie: responsive Grid (1 Spalte < 640 px, 2 < 1024 px, 3 ≥ 1024 px).
- Leerer Zustand: „Keine Veranstaltung gefunden — Filter lockern?“ + Button.

### 7.4 AkteureView (`#/akteure`)
- Karten pro Akteur (Name, Rolle, Person, Anzahl Events).
- Klick auf Event-Tag → öffnet Modal dieses Events.
- Sortierung: Organisationen zuerst, dann Personen (wie im Anhang der MD).

### 7.5 TraditionenView (`#/traditionen`)
- Pro Tradition: Name, „seit …“, Beschreibung, verlinkte Events.
- Besonderes Highlight-Layout für den Ortsweihnachtsbaum
  (15. Mal 2024, GIGALIFT, Familie Günther).

### 7.6 QuellenView (`#/quellen`)
- Quellenliste (Amtsblatt-Ausgaben, RAG-Sammlung), Methodik
  („Alle Angaben stammen ausschließlich aus den indexierten Dokumenten“),
  Hinweis auf `weihnachten-in-britz-chronologie.md` als Arbeitsgrundlage,
  Stand-Datum, „Nach oben“.

---

## 8. Agent-Flow (sequenziell abarbeiten)

> **Regeln für jeden Agenten-Lauf:**
> 1. Nur den eigenen Schritt ausführen; Abhängigkeiten sind erfüllt, wenn die
>    Akzeptanzkriterien des vorherigen Schritts grün sind.
> 2. Vor dem Start: `PLAN_WEBSITE.md` + `weihnachten-in-britz-chronologie.md`
>    lesen (Schritt 1 zusätzlich die Vollständigkeits-Checkliste).
> 3. Nach dem Start: Akzeptanzkriterien **selbst prüfen** und im Ergebnis
>    reporten (bestanden / nicht bestanden + warum).
> 4. Keine Dateien außerhalb des Schritts anlegen. Keine Commits.
> 5. Bei Abbruch: Status + erledigte Teilpunkte + offene Punkte reporten.

### Schritt 0 — Setup & App-Shell
- **Eingaben:** `PLAN_WEBSITE.md`, `archive/public-v1/` (Stil-Referenz).
- **Aufgaben:**
  - Verzeichnisstruktur `site/` gemäß §3 anlegen.
  - `index.html`: Meta (title, description, viewport, `lang="de"`,
    theme-color `#0a1626`), Google-Fonts-Link (Cormorant Garamond +
    Source Sans 3, `display=swap`), `<link rel="stylesheet" href="css/main.css">`,
    `<script type="module" src="js/main.js">`, App-Shell-Markup
    (Skip-Link, `<header>` mit Nav-Platzhalter, `<main id="app">`,
    `<footer>`, Canvas-Platzhalter für Schnee, Lichterketten-Container).
  - `css/main.css` mit den 7 `@import`-Zeilen (C3).
  - `js/main.js`: `import { App } from "./core/App.js"; new App(document.getElementById("app")).start();`
  - `js/core/App.js`, `Router.js`, `Store.js`, `EventBus.js` als minimale
    funktionierende Skelette (Router zeigt „Route: …“ in `<main>`).
- **Ergebnis:** Alle Dateien aus §3 existieren (Views/UI noch leer).
- **Akzeptanz:**
  - [ ] `python3 -m http.server` in `site/` → Seite lädt, keine Console-Errors.
  - [ ] `node --check` auf jeder JS-Datei: Syntax OK.
  - [ ] Hash-Wechsel `#/` ↔ `#/chronik` ändert den Anzeigetext.
  - [ ] `css/main.css` enthält ausschließlich `@import`-Anweisungen.

### Schritt 1 — Datenmodul
- **Eingaben:** `weihnachten-in-britz-chronologie.md` (komplett!), Schema §4.
- **Aufgaben:**
   - `js/data/chronik.js` als `class Chronik` mit `meta`, `kategorie`,
     `events` (inkl. geplanter 2026-Termine mit `geplant: true`), `akteure`, `traditionen` befüllen.
  - **Jedes** Event der Vollständigkeits-Checkliste (§4) anlegen;
    Zitate 1:1 aus der MD; `eventIds`-Verweise konsistent (jede `id`
    existiert in `events`).
  - `akteure` aus dem Anhang der MD (alle Zeilen der Tabelle).
  - `traditionen` aus den wiederkehrenden Themen (Baum, Wichtelfest→
    Familienadvent, Neujahrsfeuer, Weihnachtssingen, Hort-Weihnachtsmarkt,
    Martinsfest, Weihnachtskonzert).
- **Akzeptanz:**
  - [ ] `node --check js/data/chronik.js` OK.
  - [ ] Kurzskript (Node, ESM): `events.length ≥ 30`, alle Pflichtfelder
         gesetzt, keine `eventIds`-Dangling-References, 4 geplante 2026-Events (`geplant: true`).
  - [ ] Stichprobe: Wichtelfest-2018, Corona-2020, Familienadvent-2024,
        Weihnachtssingen-2025 enthalten alle MD-Details (Details, Zitate,
        Veranstalter).
  - [ ] Keine erfundenen Fakten (Namen/Daten nur aus der MD).

### Schritt 2 — Design-Tokens & Base
- **Eingaben:** §5 (Farben, Typo), `archive/public-v1/style.css` (Stil-Referenz).
- **Aufgaben:**
  - `css/01-tokens.css`: alle Tokens aus §5.1 + Typo-Skala + Spacing-Skala
    (4/8/12/16/24/32/48/64) + Radien + Schatten + Motion-Durations.
  - `css/02-base.css`: Reset, `html`/`body` (Hintergrund-Gradient,
    Sternpunkte, `color-scheme: dark`), Typografie-Defaults, `::selection`,
    Scrollbar-Styling, Fokus-Styles (`:focus-visible` Gold-Ring).
- **Akzeptanz:**
  - [ ] Seite zeigt korrekte Hintergrund-Atmosphäre und Schriftarten.
  - [ ] Kontrast Creme/Nacht-900 ≥ 7:1 (Rechner-Check).
  - [ ] `@media (prefers-reduced-motion)`-Grundgerüst vorhanden.

### Schritt 3 — Layout & Komponenten-CSS
- **Eingaben:** §5.3/§5.4, `archive/public-v1/` (Card-/Nav-Muster).
- **Aufgaben:**
  - `css/03-layout.css`: Shell (max-width 1180 px), sticky Nav (Blur),
    Footer, Grid-Grundlagen, Skip-Link.
  - `css/04-components.css`: EventCard, Chip, Button, Select, SearchBox,
    Modal, Blockquote, Badge („geplant“), Ergebnis-Zähler, Leerer-Zustand.
  - `css/05-views.css`: Timeline (Linie, Knoten, Jahreskopf,
    Links/rechts-Layout), Hero, Countdown, Akteur-Karten, Traditionen.
- **Akzeptanz:**
  - [ ] Statische Test-Markups (temporär in `index.html` erlaubt, danach
        entfernen) rendern korrekt bei 360 px, 768 px, 1440 px.
  - [ ] Keine horizontale Scrollbar bei 360 px.
  - [ ] Alle Komponenten haben Hover- und Fokus-Zustände.

### Schritt 4 — Kern-Engine
- **Eingaben:** §6, Skelette aus Schritt 0.
- **Aufgaben:**
  - `App.js` ausbauen: View-Registry, `enter()/leave()`, Widget-Init
    (Snowfall, LightString, Reveal), Modal-Instanz global.
  - `Router.js`: Route-Patterns, 404-Fallback → Home, `to()`.
  - `Store.js`: `get/set/subscribe`, Initial-State, Hash-Query-Sync
    (EventsView-Filter ↔ `#/events?…`).
  - `Reveal.js`: IntersectionObserver-Wrapper, `data-reveal`-Attribut,
    Reduced-Motion-Respekt.
- **Akzeptanz:**
  - [ ] Alle 6 Routen wechseln ohne Errors; unbekannte Route → Home.
  - [ ] Store-Änderung triggert exakt die abonnierten Views.
  - [ ] `node --check` auf allen Dateien OK.
  - [ ] Kein `console.log`-Müll in Produktion (Debug-Hilfen hinter
        `location.hash.startsWith("#/debug")` oder entfernen).

### Schritt 5 — UI-Widgets
- **Eingaben:** §5.3, §6.
- **Aufgaben:**
  - `Snowfall.js`: Canvas, DPR-aware, 2 Lagen, Pause bei Hidden-Tab,
    Reduced-Motion → deaktiviert, Resize-Handling.
  - `LightString.js`: SVG-Lichterkette (Bulbs + Draht), Chase-Twinkle,
    Reduced-Motion → statisch.
  - `EventCard.js`: `static render(event, chronik)` → Element;
    `static esc()`; Kategorie-Chips; „Details“-Button emittet
    `event:select` auf dem EventBus.
  - `FilterBar.js`: Chips + Select, Store-Sync, „Zurücksetzen“.
  - `SearchBox.js`: Debounce 150 ms, `aria-live`-Ergebnis.
  - `Modal.js`: öffnen/schließen, Focus-Trap, Esc, Overlay-Klick,
    `aria-modal`, Body-Scroll-Lock.
   - `Countdown.js`: nächster Termin aus den geplanten Events (`geplant: true`), Tick, Fallback-Text.
- **Akzeptanz:**
  - [ ] Jedes Widget einzeln testbar (temporärer Test-Route `#/debug`
        erlaubt, danach entfernen).
  - [ ] Reduced-Motion: Schnee aus, Lichter statisch, Reveal sofort.
  - [ ] Modal: Tab-Zyklus bleibt im Dialog, Esc schließt, Fokus zurück
        zum Auslöser.
  - [ ] Canvas: keine Memory-Leaks (Resize-Listener einmalig,
        `cancelAnimationFrame` bei `leave()`).

### Schritt 6 — Views
- **Eingaben:** §7, Datenmodul, Widgets.
- **Aufgaben:**
  - `HomeView`, `ChronikView`, `EventsView`, `AkteureView`,
    `TraditionenView`, `QuellenView` gemäß §7 implementieren.
  - Event-Selektion: `event:select` → Modal mit Details + Zitat +
    Veranstalter + Ort; „Zur Chronik“-Link im Modal.
  - AkteureView: Event-Tags klickbar → Modal.
- **Akzeptanz:**
  - [ ] Alle 6 Routen zeigen echte Daten (keine Platzhalter).
  - [ ] EventsView: Filter + Suche kombinierbar; Ergebnis-Zähler korrekt;
        Leerer-Zustand erreichbar und bedienbar.
  - [ ] ChronikView: alle Jahre 2009–2026 vorhanden, Reihenfolge korrekt.
  - [ ] Modal zeigt für `wichtelfest-2018` alle 5 Detail-Punkte + Zitat.
  - [ ] Keine Console-Errors im kompletten Klickpfad (alle Routen,
        alle Filter, 10 Modal-Öffnungen).

### Schritt 7 — Polish, Accessibility & Performance
- **Eingaben:** C7/C8, §5.
- **Aufgaben:**
  - A11y-Pass: Landmarks, `aria-current` auf Nav, `aria-expanded` auf
    Filter, Screenreader-Spaziergang (NVDA/VoiceOver-Checkliste),
    Kontrast-Endkontrolle aller Textpaarungen.
  - Motion-Pass: Timing-Kurve vereinheitlichen, Stagger auf
    Timeline-Karten (max. 80 ms Stagger), Hover-States konsistent.
  - Performance-Pass: Fonts `preload`, Canvas-DPR-Cap (max. 2),
    Lazy-Init von Snowfall erst nach `load`, JS/CSS-Größen messen.
  - Mobile-Pass: Nav-Pills, Touch-Targets ≥ 44 px, Modal-Layout.
- **Akzeptanz:**
  - [ ] Lighthouse (Chrome, Moto G-Emulation): Performance ≥ 90,
        Accessibility ≥ 95, Best Practices ≥ 95.
  - [ ] JS < 80 KB, CSS < 50 KB (ungemindert, gemessen).
  - [ ] 360 px: alle Interaktionen mit Daumen erreichbar, keine
        abgeschnittenen Chips.
  - [ ] `prefers-reduced-motion`: kompletter Klickpfad ohne Animationen.

### Schritt 8 — QA & Abnahme
- **Eingaben:** komplette App, QA-Checkliste §9.
- **Aufgaben:**
  - Checkliste §9 vollständig abarbeiten, Ergebnisse dokumentieren.
  - Cross-Browser: Chrome + Firefox (Safari optional): Rendering,
    Modal, Filter, Schnee.
  - Daten-Abgleich: Stichprobe 5 Events gegen MD (Details, Zitate,
    Namen, Daten) — Abweichungen korrigieren.
  - `node --check` auf allen JS-Dateien; `@import`-Reihenfolge prüfen.
- **Akzeptanz:**
  - [ ] Alle Punkte §9 grün oder mit dokumentiertem, akzeptiertem Restrisiko.
  - [ ] Kein offener Console-Error in irgendeinem Browser.
  - [ ] Daten-Stichprobe: 0 Abweichungen zur MD.

### Schritt 9 — Deployment (GitHub Pages)
- **Eingaben:** finale `site/`.
- **Aufgaben:**
  - Repo-Struktur für GH Pages klären: `site/` als Deploy-Root
    (Settings → Pages → Source: Branch `main`, Folder `site/`) **oder**
    `site/`-Inhalt nach Repo-Root verschieben (Empfehlung: erstere,
    da `PLAN_WEBSITE.md` + MD + Archive im Repo bleiben).
  - Hash-Routing benötigt keine 404-Datei (Bonus: `404.html` mit
    Weiterleitung auf `#/`).
  - Optional: `CNAME` für eigene Domain.
  - Smoke-Test auf der Live-URL: alle Routen, Filter, Modal, Schnee.
- **Akzeptanz:**
  - [ ] Live-URL lädt ohne Errors; alle 6 Routen funktionieren.
  - [ ] Lighthouse auf Live-URL: Performance ≥ 90.
  - [ ] Kein `file://`-Pflichtpfad (Module laufen über https).

---

## 9. QA-Checkliste (Schritt 8)

**Funktional**
- [ ] Alle 6 Routen erreichbar (Nav, Hash, Zurück/Weiter-Taste).
- [ ] Filter: Jahr × Kategorie × Veranstalter kombinierbar, „Zurücksetzen“ wirkt.
- [ ] Suche: „Alpaka“ findet Wichtelfest-2018 + Familienadvent-2024 + Hort-2022.
- [ ] Suche: „Conradi“ findet Senioren-Events + Weihnachtssingen.
- [ ] Modal: öffnet/schließt (Button, Esc, Overlay), Fokus-Trap, Scroll-Lock.
- [ ] Countdown zeigt den nächsten geplanten Termin (`geplant: true`).
- [ ] Leerer-Zustand bei unmöglichem Filter (z. B. Jahr 2009 + Kategorie „konzert“).

**Inhalt**
- [ ] 30+ Events, alle Jahre 2009–2026, 2026 mit „geplant“-Badges.
- [ ] Zitate wortgleich mit der MD (Stichprobe 5).
- [ ] Akteure: alle Zeilen des MD-Anhangs vorhanden.
- [ ] QuellenView nennt Amtsblatt + RAG-Sammlung + Stand.

**Technik**
- [ ] `node --check` alle JS-Dateien: OK.
- [ ] Keine Console-Errors/Warnings (alle Browser).
- [ ] `main.css` = nur `@import`s; Import-Reihenfolge korrekt.
- [ ] Keine externen JS-Abhängigkeiten (Network-Tab: nur Fonts + eigene Dateien).
- [ ] Größen: JS < 80 KB, CSS < 50 KB.
- [ ] Lighthouse: Perf ≥ 90, A11y ≥ 95, BP ≥ 95.

**Accessibility**
- [ ] Kompletter Klickpfad nur mit Tastatur (Tab/Shift-Tab/Enter/Esc).
- [ ] `:focus-visible` überall sichtbar (Gold-Ring).
- [ ] Kontrast: alle Textpaarungen ≥ 4.5:1 (Body), ≥ 3:1 (Großschrift).
- [ ] `prefers-reduced-motion`: kein Schnee, statische Lichter, keine Reveals.
- [ ] Screenreader: Landmarks, `aria-live`-Ergebniszähler, `aria-modal`.

**Mobile (360 × 740)**
- [ ] Keine horizontale Scrollbar.
- [ ] Touch-Targets ≥ 44 px.
- [ ] Modal passt in den Viewport (max-height + innerer Scroll).
- [ ] Nav-Pills horizontal scrollbar.

---

## 10. Risiken & Entscheide

| Risiko | Entscheidung |
|--------|--------------|
| `@import` erzeugt zusätzliche Requests (kein Parallel-Load) | 7 Partials sind klein (< 8 KB); akzeptabel. Alternative (einzelne Datei) nur bei Performance-Problem. |
| ES-Modules unter `file://` blockiert | QA-Pflicht ist `http(s)` (Local-Server / GH Pages); `file://` nur Bonus. |
| Google Fonts offline | System-Fallbacks definiert; Seite bleibt lesbar. |
| Canvas-Schnee auf schwachen Geräten | DPR-Cap 2, Partikelzahl nach `devicePixelRatio`/Breite skaliert, Pause bei Hidden-Tab. |
| Datenwachstum (neue Amtsblatt-Ausgaben) | Schema ist erweiterbar; neue Events = Eintrag in `chronik.js`, keine Code-Änderung. |

---

## 11. Definition of Done (Gesamt)

1. Alle 9 Agent-Schritte mit grünen Akzeptanzkriterien abgeschlossen.
2. QA-Checkliste §9 vollständig grün.
3. App läuft auf GitHub Pages ohne Server-Konfiguration.
4. `site/` enthält nur statische Dateien (HTML/CSS/JS/SVG) — kein Build nötig.
5. Alle Inhalte 1:1 aus `weihnachten-in-britz-chronologie.md`, keine Erfindungen.
6. Die Website ist **hübsch**: Design-System konsistent, Motion feinfühlig,
   Details (Fokus-Ringe, Hover-Glows, Zitat-Layout, Jahreszahlen) sitzen.
