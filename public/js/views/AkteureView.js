// js/views/AkteureView.js
// Karten pro Organisation/Person mit ihren Events.

import { EventCard } from "../ui/EventCard.js";

export class AkteureView {
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
    el.className = "view view--akteure";

    const akteure = [...this.chronik.akteure].sort((a, b) => {
      const aHas = (a.eventIds || []).length > 0 ? 0 : 1;
      const bHas = (b.eventIds || []).length > 0 ? 0 : 1;
      if (aHas !== bHas) return aHas - bHas;
      return a.name.localeCompare(b.name, "de");
    });

    el.innerHTML = `
      <header class="view__head">
        <h1 class="view__title">Akteure &amp; Organisationen</h1>
        <p class="view__lead">Vereine, Personen und Institutionen, die die Weihnachtszeit in Britz tragen.</p>
      </header>
      <div class="akteure-grid">
        ${akteure.map((a, i) => this.card(a, i)).join("")}
      </div>
    `;
    this.el = el;
    if (this.reveal) this.reveal.observe(el);
    return el;
  }

  card(a, i = 0) {
    const events = (a.eventIds || [])
      .map((id) => this.chronik.events.find((e) => e.id === id))
      .filter(Boolean);
    const tags = events
      .map(
        (e) =>
          `<button type="button" class="chip chip--event" data-select-event="${this.esc(e.id)}">${this.esc(e.jahr)} · ${this.esc(e.titel)}</button>`
      )
      .join("");
    const snow = i % 4 === 0 ? " xmas-card--snow" : i % 4 === 1 ? " xmas-card--snow-left" : i % 4 === 2 ? " xmas-card--snow-right" : "";
    return `
      <article class="xmas-card akteur-card${snow}" data-reveal>
        <h3 class="akteur-card__name">${this.esc(a.name)}</h3>
        <p class="akteur-card__rolle">${this.esc(a.rolle)}</p>
        ${a.person ? `<p class="akteur-card__person"><strong>Person:</strong> ${this.esc(a.person)}</p>` : ""}
        <p class="akteur-card__count">${events.length} ${events.length === 1 ? "Event" : "Events"}</p>
        ${tags ? `<div class="akteur-card__events">${tags}</div>` : ""}
      </article>
    `;
  }

  leave() {
    this.el = null;
  }
}
