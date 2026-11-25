// js/views/EventsView.js
// Filterbare Event-Galerie: FilterBar + SearchBox + Grid + Leerer-Zustand.

import { EventCard } from "../ui/EventCard.js";
import { FilterBar } from "../ui/FilterBar.js";

export class EventsView {
  constructor({ chronik, store, bus, searchbox, reveal } = {}) {
    this.chronik = chronik;
    this.store = store;
    this.bus = bus;
    this.searchbox = searchbox;
    this.reveal = reveal;
    this.el = null;
    this.grid = null;
    this.counter = null;
    this.empty = null;
    this.unsub = null;
    this.filterbar = new FilterBar({
      chronik,
      store,
      bus,
      jahre: "filter",
      kategorien: true,
      veranstalter: true,
      orte: false,
      searchbox: this.searchbox,
    });
  }

  esc(s) {
    return EventCard.esc(s);
  }

  enter() {
    const el = document.createElement("div");
    el.className = "view view--events";
    el.innerHTML = `
      <header class="view__head">
        <h1 class="view__title">Events</h1>
        <p class="view__lead">Alle Veranstaltungen der Advents- und Weihnachtszeit — filterbar und durchsuchbar.</p>
        <p class="events__counter" data-counter aria-live="polite"></p>
      </header>
      <div class="events__controls" data-controls></div>
      <div class="events__grid" data-grid></div>
      <div class="events__empty" data-empty hidden>
        <p>Keine Veranstaltung gefunden — Filter lockern?</p>
        <button type="button" class="xmas-btn xmas-btn-primary" data-reset-empty>Filter zurücksetzen</button>
      </div>
    `;
    this.el = el;
    this.grid = el.querySelector("[data-grid]");
    this.counter = el.querySelector("[data-counter]");
    this.empty = el.querySelector("[data-empty]");

    const controls = el.querySelector("[data-controls]");
    this.filterbar.render(controls);

    el.querySelector("[data-reset-empty]").addEventListener("click", () => {
      this.store.set({ filter: { jahre: [], kategorien: [], veranstalter: [], orte: [] }, query: "" });
    });

    this.unsub = this.store.subscribe(() => this.renderGrid());
    this.renderGrid();
    if (this.reveal) this.reveal.observe(el);
    return el;
  }

  matches(event, filter, query) {
    const f = filter || { jahre: [], kategorien: [], veranstalter: [] };
    if ((f.jahre || []).length && !f.jahre.includes(String(event.jahr))) return false;
    if ((f.kategorien || []).length) {
      const ok = f.kategorien.some((k) => (event.kategorie || []).includes(k));
      if (!ok) return false;
    }
    if ((f.veranstalter || []).length) {
      const ok = f.veranstalter.some((v) => (event.veranstalter || []).includes(v));
      if (!ok) return false;
    }
    if (query) {
      const hay = [
        event.titel,
        event.kurzfassung,
        (event.tags || []).join(" "),
        (event.veranstalter || []).join(" "),
        event.ort,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  }

  renderGrid() {
    if (!this.grid) return;
    const filter = this.store.get("filter") || { jahre: [], kategorien: [], veranstalter: [] };
    const query = this.store.get("query") || "";
    const all = this.chronik.events;
    const list = all
      .filter((e) => this.matches(e, filter, query))
      .sort((a, b) => b.jahr - a.jahr || (a.datum || "").localeCompare(b.datum || ""));

    this.grid.innerHTML = "";
    const snowClasses = ["xmas-card--snow", "xmas-card--snow-left", "xmas-card--snow-right"];
    for (let i = 0; i < list.length; i++) {
      const card = EventCard.render(list[i], this.chronik);
      card.setAttribute("data-reveal", "");
      if (i % 3 === 0) card.classList.add(snowClasses[i % 3]);
      this.grid.appendChild(card);
    }
    this.counter.textContent = `${list.length} von ${all.length} Veranstaltungen`;
    this.empty.hidden = list.length > 0;
    if (this.reveal) this.reveal.observe(this.grid);
  }

  leave() {
    if (this.unsub) this.unsub();
    this.filterbar.leave();
    this.el = null;
    this.grid = null;
  }
}
