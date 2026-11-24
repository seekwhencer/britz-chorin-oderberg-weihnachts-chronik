// js/views/QuellenView.js
// Quellen, Methodik, Stand, Über.

import { EventCard } from "../ui/EventCard.js";

export class QuellenView {
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
    const meta = this.chronik.meta;
    const el = document.createElement("div");
    el.className = "view view--quellen";
    el.innerHTML = `
      <header class="view__head">
        <h1 class="view__title">Quellen &amp; Methodik</h1>
        <p class="view__lead">Alle Angaben stammen ausschließlich aus den indexierten Dokumenten.</p>
      </header>

      <section class="xmas-card quellen-card" data-reveal>
        <h2 class="quellen-card__title">Datenquelle</h2>
        <p>${this.esc(meta.quelle)}.</p>
        <p>Arbeitsgrundlage ist die Zusammenstellung <code>weihnachten-in-britz-chronologie.md</code>. Namen, Daten und Zitate wurden 1:1 übernommen. Wo die Quelle unsicher ist, werden beide Varianten abgebildet.</p>
      </section>

      <section class="xmas-card quellen-card" data-reveal>
        <h2 class="quellen-card__title">Methodik</h2>
        <ul class="quellen-card__list">
          <li>Geprüft wurden u. a. die Dezember-Ausgaben 2010–2017 sowie weitere November- und Januar-Ausgaben.</li>
          <li>Begriffe: Wichtelfest, Adventsfest, Adventsmarkt, Krippenspiel, Nikolaus, Tanne / Weihnachtsbaum, Weihnachtsgrüße, Seniorenweihnachtsfeier, Feuerwehr / Jugendfeuerwehr, Kita / Hort, Weihnachtsbaumwettbewerb.</li>
          <li>Für Britz wurden für 2010–2017 keine verwertbaren Einträge gefunden; für die übrigen Orte des Amtes gibt es vereinzelt Einträge ab 2017.</li>
        </ul>
      </section>

      <section class="xmas-card quellen-card" data-reveal>
        <h2 class="quellen-card__title">Stand &amp; Hinweis</h2>
        <p>Stand: ${this.esc(meta.stand)}.</p>
        <p>Keine neuen Fakten wurden erfunden — jeder Satz auf dieser Website ist in der Chronologie belegt.</p>
        <p class="quellen-card__top"><a class="xmas-btn xmas-btn-secondary" href="#top">Nach oben</a></p>
      </section>
    `;
    this.el = el;
    if (this.reveal) this.reveal.observe(el);
    return el;
  }

  leave() {
    this.el = null;
  }
}
