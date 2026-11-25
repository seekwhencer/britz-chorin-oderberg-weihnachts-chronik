// js/views/TraditionenView.js
// Wiederkehrende Bräuche — mit Highlight für den Ortsweihnachtsbaum.

import { EventCard } from "../ui/EventCard.js";

export class TraditionenView {
  constructor({ chronik, store, bus, reveal } = {}) {
    this.chronik = chronik;
    this.store = store;
    this.bus = bus;
    this.reveal = reveal;
    this.el = null;
  }

  esc(s) {
    return EventCard.esc(s);
  }

  enter() {
    const el = document.createElement("div");
    el.className = "view view--traditionen";

    const traditionen = [...this.chronik.traditionen].sort((a, b) => a.seit - b.seit);

    el.innerHTML = `
      <header class="view__head">
        <h1 class="view__title">Traditionen</h1>
        <p class="view__lead">Wiederkehrende Bräuche und Feste, die die Vorweihnachtszeit in Britz prägen.</p>
      </header>
      <div class="traditionen-list">
        ${traditionen.map((t, i) => this.card(t, i)).join("")}
      </div>
    `;
    this.el = el;
    if (this.reveal) this.reveal.observe(el);
    return el;
  }

  card(t, i = 0) {
    const featured = t.id === "ortsweihnachtsbaum";
    const events = (t.eventIds || [])
      .map((id) => this.chronik.events.find((e) => e.id === id))
      .filter(Boolean);
    const tags = events
      .map(
        (e) =>
          `<button type="button" class="chip chip--event" data-select-event="${this.esc(e.id)}">${this.esc(e.jahr)} · ${this.esc(e.titel)}</button>`
      )
      .join("");
    const snow = featured ? " xmas-card--snow" : i % 3 === 0 ? " xmas-card--snow-left" : i % 3 === 1 ? " xmas-card--snow-right" : "";
    return `
      <article class="xmas-card tradition-card${featured ? " tradition-card--featured" : ""}${snow}" data-reveal>
        <div class="tradition-card__head">
          <h3 class="tradition-card__name">${this.esc(t.name)}</h3>
          <span class="badge badge--seit">seit ${this.esc(t.seit)}</span>
        </div>
        <p class="tradition-card__desc">${this.esc(t.beschreibung)}</p>
        ${tags ? `<div class="tradition-card__events">${tags}</div>` : ""}
      </article>
    `;
  }

  leave() {
    this.el = null;
  }
}
