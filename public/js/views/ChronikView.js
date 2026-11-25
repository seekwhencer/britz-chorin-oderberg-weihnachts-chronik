// js/views/ChronikView.js
// Vertikale Timeline 2009–2026, gruppiert nach Jahr, mit gemeinsamer FilterBar
// (Jahre als Scroll-to, Ort-Filter).

import { EventCard } from "../ui/EventCard.js";
import { FilterBar } from "../ui/FilterBar.js";

const YEAR_CONTEXT = {
  2009: "Beginn der Tradition: Ortsweihnachtsbaum",
  2010: "Keine belastbaren Einträge im RAG-Archiv (2010–2017)",
  2018: "10. Wichtelfest & erste Seniorenfeier im Haus Chorin",
  2019: "Wichtelfest-Ende („kreative Pause“) · erstes Weihnachtskonzert",
  2020: "Corona-Pandemie — Ausfall der Weihnachtsfeiern",
  2021: "1. Strolche-Weihnachtsmarkt · Rückkehr der Seniorenfeier",
  2022: "2. Strolche-Weihnachtsmarkt · Weihnachtskonzert",
  2023: "1. Britzer Adventsfest · Hort-Weihnachtsmarkt",
  2024: "1. „Britzer Familienadvent“ · 15. Ortsweihnachtsbaum",
  2025: "2. „Britzer Familienadvent“ · Weihnachtssingen am Bahnhof",
  2026: "Geplante Termine & Neujahrsfeuer",
};

export class ChronikView {
  constructor({ chronik, store, bus, reveal } = {}) {
    this.chronik = chronik;
    this.store = store;
    this.bus = bus;
    this.reveal = reveal;
    this.el = null;
    this.unsub = null;
    this.filterbar = new FilterBar({
      chronik,
      store,
      bus,
      jahre: "scroll",
      kategorien: false,
      veranstalter: false,
      orte: true,
      onYear: (jahr) => this.onYear(jahr),
    });
  }

  esc(s) {
    return EventCard.esc(s);
  }

  enter() {
    const el = document.createElement("div");
    el.className = "view view--chronik";

    el.innerHTML = `
      <header class="view__head">
        <h1 class="view__title">Chronik</h1>
        <p class="view__lead">Die Advents- und Weihnachtszeit in Britz und dem Amt Britz-Chorin-Oderberg, 2009–2026.</p>
      </header>

      <div data-filterbar></div>
      <ol class="timeline" data-timeline></ol>
      <p class="chronik__empty" data-chronik-empty hidden>Keine Einträge für die gewählte Auswahl.</p>
    `;
    this.el = el;

    this.filterbar.render(el.querySelector("[data-filterbar]"));
    this.renderTimeline();

    this.unsub = this.store.subscribe((changed) => {
      if (changed.filter) {
        this.renderTimeline();
      }
    });

    this.applyYearFromParams();

    if (this.reveal) this.reveal.observe(el);
    return el;
  }

  renderTimeline() {
    const orte = (this.store.get("filter") || {}).orte || [];
    const events = this.chronik.events.filter((e) => {
      if (!orte.length) return true;
      return orte.includes(e.ortName);
    });
    const jahre = [...new Set(events.map((e) => e.jahr))].sort((a, b) => b - a);

    const timeline = this.el.querySelector("[data-timeline]");
    let index = 0;
    timeline.innerHTML = jahre
      .map((j) => {
        const yearEvents = this.yearEvents(j, orte);
        const block = this.yearBlock(j, yearEvents, index);
        index += yearEvents.length;
        return block;
      })
      .join("");

    const empty = this.el.querySelector("[data-chronik-empty]");
    if (empty) empty.hidden = jahre.length > 0;

    if (this.reveal) this.reveal.observe(this.el);
  }

  yearEvents(jahr, orte = []) {
    return this.chronik.events
      .filter((e) => e.jahr === jahr)
      .filter((e) => !orte.length || orte.includes(e.ortName))
      .sort((a, b) => (a.datum || "").localeCompare(b.datum || ""));
  }

  onYear(jahr) {
    this.el.querySelectorAll(".timeline__year").forEach((block) => {
      block.classList.remove("is-active");
    });
    if (!jahr) return;
    const block = this.el.querySelector(`.timeline__year[data-jahr="${jahr}"]`);
    if (!block) return;
    block.classList.add("is-active");
    // Deep-Link aktualisieren, ohne die View neu zu rendern.
    history.replaceState(null, "", `#/chronik?jahr=${jahr}`);
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      block.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  }

  applyYearFromParams() {
    const jahr = this.store.get("params")?.get?.("jahr");
    if (jahr) this.filterbar.selectYear(jahr);
  }

  yearBlock(jahr, events, startIndex = 0) {
    const context = YEAR_CONTEXT[jahr] || "";
    return `
      <li class="timeline__year" data-jahr="${jahr}" id="jahr-${jahr}">
        <div class="timeline__node" aria-hidden="true"></div>
        <div class="timeline__head">
          <span class="timeline__zahl">${jahr}</span>
          ${context ? `<p class="timeline__kontext">${this.esc(context)}</p>` : ""}
        </div>
        <div class="timeline__events">
          ${events.map((e, i) => this.cardSlot(e, startIndex + i)).join("")}
        </div>
      </li>
    `;
  }

  cardSlot(event, index) {
    const side = index % 2 === 0 ? "left" : "right";
    const wrap = document.createElement("div");
    wrap.className = `timeline__card timeline__card--${side}`;
    wrap.setAttribute("data-reveal", "");
    wrap.appendChild(EventCard.render(event, this.chronik));
    return wrap.outerHTML;
  }

  leave() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
    this.filterbar.leave();
    this.el = null;
  }
}
