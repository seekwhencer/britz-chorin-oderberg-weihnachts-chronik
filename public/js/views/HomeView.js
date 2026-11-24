// js/views/HomeView.js
// Hero + Countdown + Highlights + Zitat-Band.

import { EventCard } from "../ui/EventCard.js";

export class HomeView {
  constructor({ chronik, store, bus, countdown, reveal } = {}) {
    this.chronik = chronik;
    this.store = store;
    this.bus = bus;
    this.countdown = countdown;
    this.reveal = reveal;
    this.el = null;
  }

  esc(s) {
    return EventCard.esc(s);
  }

  enter() {
    const meta = this.chronik.meta;
    const el = document.createElement("div");
    el.className = "view view--home";

    const highlights = [
      {
        titel: "Ortsweihnachtsbaum seit 2009",
        text: "An der Eberswalder Straße / Ecke Heegermühler Straße – 2024 zum 15. Mal gestaltet. Heimatkundeverein + FFW.",
        href: "#/traditionen",
        cta: "Zu den Traditionen",
      },
      {
        titel: "Vom Wichtelfest zum Familienadvent",
        text: "Das Wichtelfest (bis 2018) wurde 2019 pausiert. 2023 entstand das erste Adventsfest, 2024 der „Britzer Familienadvent“.",
        href: "#/chronik",
        cta: "Chronik lesen",
      },
      {
        titel: "Neue Tradition: Weihnachtssingen",
        text: "Seit 2025 wird auf dem Bahnhofsvorplatz gemeinsam gesungen – mit Zelt, Lichterketten und Glühwein.",
        href: "#/events",
        cta: "Events entdecken",
      },
    ];

    el.innerHTML = `
      <section class="hero" aria-labelledby="hero-title">
        <p class="hero__kicker">${this.esc(meta.gemeinde)}</p>
        <h1 class="hero__title" id="hero-title">${this.esc(meta.titel)}</h1>
        <p class="hero__lead">${this.esc(meta.untertitel)}</p>
        <div class="hero__badges">
          ${Object.values(this.chronik.kategorie).map((c) => `<span class="chip chip--cat">${this.esc(c.label)}</span>`).join("")}
        </div>
        <div class="hero__actions">
          <a class="xmas-btn xmas-btn-primary" href="#/chronik">Chronik starten</a>
          <a class="xmas-btn xmas-btn-secondary" href="#/events">Alle Events</a>
        </div>
        <p class="hero__meta">Stand: ${this.esc(meta.stand)} · ${this.esc(meta.quelle)}</p>
      </section>

      <section class="home-countdown" aria-label="Nächster Termin">
        <div class="xmas-card xmas-card--featured" data-countdown-host></div>
      </section>

      <section class="home-highlights" aria-labelledby="highlights-title">
        <h2 class="section-title" id="highlights-title">Höhepunkte</h2>
        <div class="highlight-grid">
          ${highlights.map((h) => `
            <article class="xmas-card highlight-card" data-reveal>
              <h3 class="highlight-card__titel">${this.esc(h.titel)}</h3>
              <p class="highlight-card__text">${this.esc(h.text)}</p>
              <a class="xmas-btn xmas-btn-gold highlight-card__cta" href="${h.href}">${this.esc(h.cta)}</a>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="home-quote" aria-label="Zitat">
        <blockquote class="xmas-quote">
          <p>„Wenn an der Britzer Ecke die Weihnachtstanne im Kerzenschein sich wankt, dem Heimatverein und der Feuerwehr sei Dank, ist es Advent und bis zum Heiligen Abend nicht mehr lang.“</p>
          <cite>— Rede des Bürgermeisters, 1. Britzer Adventsfest 2023</cite>
        </blockquote>
      </section>
    `;
    this.el = el;

    // Countdown einbinden.
    const host = el.querySelector("[data-countdown-host]");
    if (host && this.countdown) this.countdown.render(host);
    if (this.reveal) this.reveal.observe(el);
    return el;
  }

  leave() {
    if (this.countdown) this.countdown.destroy();
    this.el = null;
  }
}
