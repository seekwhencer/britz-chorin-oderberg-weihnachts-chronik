# Weihnachtszeit in Britz

Eine interaktive Chronik der Advents- und Weihnachtszeit in Britz und dem Amt Britz-Chorin-Oderberg, 2009–2026 — Adventsfeste, Weihnachtsmärkte, Konzerte, Seniorenfeiern und Traditionen.

Statische Single-Page-App ohne Build-Step und ohne Frameworks: Vanilla-JS (ES-Modules, Klassen), nummerierte CSS-Partials, Daten als JSON. Lauffähig auf GitHub Pages oder jedem statischen Host.

## Features

- **Start** (`#/`) — Hero, Countdown zum nächsten Termin, Highlights
- **Chronik** (`#/chronik`) — Zeitstrahl 2009–2026, Jahre als Meilensteine
- **Events** (`#/events`) — filterbare Galerie (Jahr, Kategorie, Veranstalter) + Live-Suche
- **Akteure** (`#/akteure`) — Organisationen & Personen mit ihren Events
- **Traditionen** (`#/traditionen`) — wiederkehrende Bräuche (Ortsweihnachtsbaum, Familienadvent, …)
- **Quellen** (`#/quellen`) — Quellen, Methodik, Stand
- Nacht-/Tag-Theme, Schneefall, Lichterkette, Scroll-Reveal — jeweils mit `prefers-reduced-motion`-Fallback
- Hash-Routing (teilbare URLs, funktioniert ohne Server-Rewrites)

## Tech-Stack

| Baustein | Umsetzung |
|----------|-----------|
| Frontend | Vanilla-JS ES-Modules (Klassen), kein Bundler, kein Framework |
| Styling | `css/main.css` mit `@import`-Liste, nummerierte Partials `01`–`07` |
| Daten | `public/data/*.json` (meta, kategorie, events, akteure, traditionen) |
| Dev-Server | Express (`server.js`), Port `2412` |
| Deployment | GitHub Pages (`.github/workflows/deploy.yml`, Deploy-Root `public/`) |
| Runtime | Node.js ≥ 18 |

## Projektstruktur

```
xmas-history/
├── public/                          ← deploybare Website (Root für GH Pages)
│   ├── index.html                   ← App-Shell
│   ├── css/                         ← main.css + Partials 01–07
│   ├── js/
│   │   ├── main.js                  ← Einstiegspunkt
│   │   ├── core/                    ← App, Router, Store, EventBus, Reveal
│   │   ├── ui/                      ← Snowfall, Modal, Countdown, …
│   │   ├── views/                   ← Home, Chronik, Events, Akteure, Traditionen, Quellen
│   │   └── data/loader.js           ← lädt public/data/*.json
│   └── data/                        ← meta, kategorie, events, akteure, traditionen
├── server.js                        ← Express-Server für die lokale Entwicklung
├── weihnachten-in-britz-chronologie.md  ← Datenquelle (read-only)
├── archive/public-v1/               ← Vorgängerversion (Referenz)
└── .github/workflows/deploy.yml     ← Deploy nach GitHub Pages
```

## Loslegen

```bash
npm install
npm run dev        # http://localhost:2412 (node --watch)
# oder
npm start          # http://localhost:2412
```

- Health-Check: `GET /health`
- Port über `PORT`-Umgebungsvariable änderbar (Default `2412`)
- Alternativ: jeder statische Server in `public/` (z. B. `python3 -m http.server` in `public/`)

## Daten

Alle Inhalte stammen aus `weihnachten-in-britz-chronologie.md` (Amtsblatt Britz-Chorin-Oderberg, Ausgaben 2010–2026, indexiert im RAG-Archiv). Die Website liest die Daten zur Laufzeit aus `public/data/*.json`:

| Datei | Inhalt |
|-------|--------|
| `meta.json` | Titel, Gemeinde, Stand, Quelle |
| `kategorie.json` | Kategorien (Adventszeit, Märkte, Musik, …) |
| `events.json` | alle Veranstaltungen 2009–2026 (inkl. geplanter Termine) |
| `akteure.json` | Organisationen & Personen |
| `traditionen.json` | wiederkehrende Bräuche |

Neue Events = Eintrag in `events.json` (+ ggf. `akteure.json`/`traditionen.json`), keine Code-Änderung.

## Deployment

Push auf `main` deployt automatisch den `public/`-Ordner auf GitHub Pages (`.github/workflows/deploy.yml`). Hash-Routing benötigt keine Server-Konfiguration.

## Lizenz

Inhalte: Gemeinde Britz · Amt Britz-Chorin-Oderberg (Quellen: Amtsblatt, RAG-Archiv).
