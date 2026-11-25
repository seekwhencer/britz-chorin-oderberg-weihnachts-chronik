// js/core/App.js
// Bootstrap, Wiring, View-Lebenszyklus.

import { Store } from "./Store.js";
import { EventBus } from "./EventBus.js";
import { Router } from "./Router.js";
import { Reveal } from "./Reveal.js";
import { Theme } from "../ui/Theme.js";
import { Snowfall } from "../ui/Snowfall.js";
import { Modal } from "../ui/Modal.js";
import { Countdown } from "../ui/Countdown.js";
import { SearchBox } from "../ui/SearchBox.js";
import { EventCard } from "../ui/EventCard.js";

import { HomeView } from "../views/HomeView.js";
import { ChronikView } from "../views/ChronikView.js";
import { EventsView } from "../views/EventsView.js";
import { AkteureView } from "../views/AkteureView.js";
import { TraditionenView } from "../views/TraditionenView.js";
import { QuellenView } from "../views/QuellenView.js";

export class App {
  constructor(rootEl, { chronik } = {}) {
    this.root = rootEl;
    this.chronik = chronik;
    this.reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.bus = new EventBus();
    this.store = new Store({
      route: null,
      params: new URLSearchParams(),
      filter: { jahre: [], kategorien: [], veranstalter: [], orte: [] },
      query: "",
      selectedEvent: null,
    });

    this.modal = new Modal();
    this.reveal = new Reveal(this.root);
    this.snowfall = new Snowfall({ reduced: this.reduced });
    this.theme = new Theme({ snowfall: this.snowfall, bus: this.bus });
    const termine = (chronik.events || []).filter((e) => e.geplant && e.datum);
    this.countdown = new Countdown(termine, { reduced: this.reduced });
    this.searchbox = new SearchBox({ store: this.store, bus: this.bus });

    this.views = {
      home: new HomeView({ chronik, store: this.store, bus: this.bus, countdown: this.countdown, reveal: this.reveal }),
      chronik: new ChronikView({ chronik, store: this.store, bus: this.bus, reveal: this.reveal }),
      events: new EventsView({ chronik, store: this.store, bus: this.bus, searchbox: this.searchbox, reveal: this.reveal }),
      akteure: new AkteureView({ chronik, store: this.store, bus: this.bus, reveal: this.reveal }),
      traditionen: new TraditionenView({ chronik, store: this.store, bus: this.bus, reveal: this.reveal }),
      quellen: new QuellenView({ chronik, store: this.store, bus: this.bus, reveal: this.reveal }),
    };

    this.routes = {
      home: { pattern: "" },
      chronik: { pattern: "chronik" },
      events: { pattern: "events" },
      akteure: { pattern: "akteure" },
      traditionen: { pattern: "traditionen" },
      quellen: { pattern: "quellen" },
    };

    this.router = new Router(this.store, this.routes);
    this.activeView = null;
  }

  start() {
    this.theme.init();
    this.snowfall.init();
    this.reveal.start();
    this.bindGlobal();
    this.bindNav();
    // Bei jeder Routenänderung die passende View rendern.
    this.store.subscribe((changed) => {
      if (changed.route) this.renderRoute(changed.route);
    });
    this.router.start();
  }

  bindGlobal() {
    // Event-Auswahl (Details-Button, Akteur-Tags, Tradition-Tags).
    this.bus.on("event:select", (id) => this.openEvent(id));
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-select-event]");
      if (trigger) {
        this.bus.emit("event:select", trigger.dataset.selectEvent);
      }
    });
  }

  bindNav() {
    const nav = document.querySelector("[data-nav]");
    if (!nav) return;
    nav.querySelectorAll("a[data-route]").forEach((a) => {
      a.addEventListener("click", () => {
        const route = a.dataset.route;
        this.router.to(`#/${route}`);
      });
    });
    this.store.subscribe((changed) => {
      if (changed.route) this.markNav(changed.route);
    });
  }

  markNav(route) {
    const nav = document.querySelector("[data-nav]");
    if (!nav) return;
    nav.querySelectorAll("a[data-route]").forEach((a) => {
      const active = a.dataset.route === route;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  openEvent(id) {
    const event = this.chronik.events.find((e) => e.id === id);
    if (!event) return;
    const cats = (event.kategorie || [])
      .map((k) => this.chronik.kategorie[k])
      .filter(Boolean)
      .map((c) => `<span class="chip chip--cat">${EventCard.esc(c.label)}</span>`)
      .join("");
    const details = (event.details || [])
      .map((d) => `<li>${EventCard.esc(d)}</li>`)
      .join("");
    const zitate = (event.zitate || [])
      .map((z) => `<blockquote class="xmas-quote xmas-quote--modal"><p>${EventCard.esc(z)}</p></blockquote>`)
      .join("");
    const veranstalter = (event.veranstalter || [])
      .map((v) => `<li>${EventCard.esc(v)}</li>`)
      .join("");

    const html = `
      <div class="modal__head">
        <span class="modal__jahr">${EventCard.esc(event.jahr)}</span>
        <div class="modal__badges">
          ${event.geplant ? '<span class="badge badge--geplant">geplant</span>' : ""}
          ${event.ortName && event.ortName !== "Britz" ? `<span class="badge badge--ort">${EventCard.esc(event.ortName)}</span>` : ""}
        </div>
      </div>
      <h2 class="modal__titel" id="xmas-modal-title">${EventCard.esc(event.titel)}</h2>
      <div class="modal__chips">${cats}</div>
      ${event.ort ? `<p class="modal__ort"><strong>Ort:</strong> ${EventCard.esc(event.ort)}</p>` : ""}
      ${veranstalter ? `<p class="modal__label">Veranstalter</p><ul class="modal__list">${veranstalter}</ul>` : ""}
      ${details ? `<ul class="modal__details">${details}</ul>` : ""}
      ${zitate}
      <div class="modal__foot">
        <a class="xmas-btn xmas-btn-secondary" href="#/chronik">Zur Chronik</a>
      </div>
    `;
    this.modal.open(html);
  }

  renderRoute(route) {
    const view = this.views[route] || this.views.home;
    if (this.activeView && this.activeView !== view) {
      this.activeView.leave();
    }
    this.root.innerHTML = "";
    const el = view.enter();
    this.root.appendChild(el);
    this.activeView = view;
    window.scrollTo(0, 0);
  }
}
