// js/ui/FilterBar.js
// Gemeinsame Filter-Komponente für Chronik und Events.
// Gruppen: Jahr (Filter oder Scroll-to), Kategorie, Veranstalter (optional), Ort (optional).

export class FilterBar {
  constructor({
    chronik,
    store,
    bus,
    jahre = "filter",
    kategorien = true,
    veranstalter = true,
    orte = false,
    onYear = null,
    searchbox = null,
  } = {}) {
    this.chronik = chronik;
    this.store = store;
    this.bus = bus;
    this.jahreMode = jahre; // "filter" | "scroll"
    this.showKategorien = kategorien;
    this.showVeranstalter = veranstalter;
    this.showOrte = orte;
    this.onYear = onYear;
    this.searchbox = searchbox;
    this.el = null;
    this.activeYear = null;
    this.unsub = null;
  }

  esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  jahre() {
    const set = new Set(this.chronik.events.map((e) => e.jahr));
    return [...set].sort((a, b) => b - a);
  }

  veranstalter() {
    const set = new Set();
    this.chronik.events.forEach((e) => (e.veranstalter || []).forEach((v) => set.add(v)));
    return [...set].sort((a, b) => a.localeCompare(b, "de"));
  }

  orte() {
    const set = new Set();
    this.chronik.events.forEach((e) => {
      if (e.ortName) set.add(e.ortName);
    });
    return [...set].sort((a, b) => a.localeCompare(b, "de"));
  }

  render(host) {
    const el = document.createElement("div");
    el.className = "filterbar";
    el.innerHTML = [
      this.yearGroupHtml(),
      this.showKategorien ? this.kategorieGroupHtml() : "",
      this.showVeranstalter && this.veranstalter().length ? this.veranstalterGroupHtml() : "",
      this.searchbox ? `<div data-searchbox></div>` : "",
      this.showOrte && this.orte().length ? this.ortGroupHtml() : "",
      `<button type="button" class="xmas-btn xmas-btn-secondary filterbar__reset" data-reset>Zurücksetzen</button>`,
    ].join("");
    host.appendChild(el);
    this.el = el;
    if (this.searchbox) this.searchbox.render(el.querySelector("[data-searchbox]"));
    this.bind();
    this.unsub = this.store.subscribe((changed) => {
      if (changed.filter) this.onFilterChange();
    });
    this.syncFromStore();
    return el;
  }

  yearGroupHtml() {
    if (this.jahreMode === "scroll") {
      return `
        <div class="filterbar__group" role="group" aria-label="Jahre">
          <span class="filterbar__label">Jahr</span>
          <div class="filterbar__chips" data-year-chips></div>
        </div>`;
    }
    return `
      <div class="filterbar__group" role="group" aria-label="Jahr filtern">
        <span class="filterbar__label">Jahr</span>
        <div class="filterbar__chips" data-filter="jahre">
          ${this.jahre().map((j) => `<button type="button" class="chip chip--filter" data-value="${j}" aria-pressed="false">${j}</button>`).join("")}
        </div>
      </div>`;
  }

  kategorieGroupHtml() {
    const kategorie = this.chronik.kategorie;
    return `
      <div class="filterbar__group" role="group" aria-label="Kategorie filtern">
        <span class="filterbar__label">Kategorie</span>
        <div class="filterbar__chips" data-filter="kategorien">
          ${Object.entries(kategorie).map(([key, c]) => `<button type="button" class="chip chip--filter" data-value="${key}" aria-pressed="false">${this.esc(c.label)}</button>`).join("")}
        </div>
      </div>`;
  }

  veranstalterGroupHtml() {
    return `
      <div class="filterbar__group" role="group" aria-label="Veranstalter filtern">
        <label class="filterbar__label" for="filter-veranstalter">Veranstalter</label>
        <select id="filter-veranstalter" class="xmas-select" data-filter="veranstalter">
          <option value="">Alle</option>
          ${this.veranstalter().map((v) => `<option value="${this.esc(v)}">${this.esc(v)}</option>`).join("")}
        </select>
      </div>`;
  }

  ortGroupHtml() {
    return `
      <div class="filterbar__group" role="group" aria-label="Ort filtern">
        <span class="filterbar__label">Ort</span>
        <div class="filterbar__chips" data-filter="orte">
          ${this.orte().map((o) => `<button type="button" class="chip chip--filter" data-value="${this.esc(o)}" aria-pressed="false">${this.esc(o)}</button>`).join("")}
        </div>
      </div>`;
  }

  bind() {
    this.el.querySelectorAll('[data-filter] .chip--filter').forEach((chip) => {
      chip.addEventListener("click", () => {
        const group = this.groupOf(chip);
        const value = chip.dataset.value;
        const pressed = chip.getAttribute("aria-pressed") === "true";
        chip.setAttribute("aria-pressed", String(!pressed));
        this.update(group, value, !pressed);
      });
    });
    const select = this.el.querySelector('[data-filter="veranstalter"]');
    if (select) {
      select.addEventListener("change", () => {
        this.store.set({ filter: { ...this.store.get("filter"), veranstalter: [select.value].filter(Boolean) } });
      });
    }
    const reset = this.el.querySelector("[data-reset]");
    if (reset) {
      reset.addEventListener("click", () => this.reset());
    }
    if (this.jahreMode === "scroll") this.renderYearChips();
  }

  reset() {
    this.store.set({ filter: { jahre: [], kategorien: [], veranstalter: [], orte: [] }, query: "" });
    if (this.jahreMode === "scroll") this.selectYear(null);
  }

  groupOf(chip) {
    const container = chip.closest("[data-filter]");
    return container ? container.dataset.filter : null;
  }

  update(group, value, active) {
    const filter = { ...(this.store.get("filter") || { jahre: [], kategorien: [], veranstalter: [], orte: [] }) };
    const list = filter[group] || [];
    if (active && !list.includes(value)) filter[group] = [...list, value];
    if (!active) filter[group] = list.filter((v) => v !== value);
    this.store.set({ filter });
  }

  // Scroll-Modus: Jahre, die nach den aktiven Filtern noch Einträge haben.
  visibleJahre() {
    const filter = this.store.get("filter") || {};
    const events = this.chronik.events.filter((e) => {
      if ((filter.orte || []).length && !filter.orte.includes(e.ortName)) return false;
      if ((filter.kategorien || []).length && !(e.kategorie || []).some((k) => filter.kategorien.includes(k))) return false;
      if ((filter.veranstalter || []).length && !(e.veranstalter || []).some((v) => filter.veranstalter.includes(v))) return false;
      return true;
    });
    const set = new Set(events.map((e) => e.jahr));
    return [...set].sort((a, b) => b - a);
  }

  renderYearChips() {
    const host = this.el.querySelector("[data-year-chips]");
    if (!host) return;
    host.innerHTML = this.visibleJahre()
      .map(
        (j) =>
          `<button type="button" class="chip chip--filter" data-jahr="${j}" aria-pressed="${String(String(j) === this.activeYear)}">${j}</button>`
      )
      .join("");
    host.querySelectorAll(".chip--filter").forEach((chip) => {
      chip.addEventListener("click", () => this.selectYear(chip.dataset.jahr));
    });
  }

  selectYear(jahr) {
    this.activeYear = jahr;
    this.el.querySelectorAll("[data-year-chips] .chip--filter").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.jahr === jahr));
    });
    if (this.onYear) this.onYear(jahr);
  }

  onFilterChange() {
    if (this.jahreMode === "scroll") {
      if (this.activeYear && !this.visibleJahre().includes(Number(this.activeYear))) {
        this.activeYear = null;
        if (this.onYear) this.onYear(null);
      }
      this.renderYearChips();
    }
    this.syncFromStore();
  }

  syncFromStore() {
    const filter = this.store.get("filter") || { jahre: [], kategorien: [], veranstalter: [], orte: [] };
    this.el.querySelectorAll('[data-filter] .chip--filter').forEach((chip) => {
      const group = this.groupOf(chip);
      const value = chip.dataset.value;
      const active = (filter[group] || []).includes(value);
      chip.setAttribute("aria-pressed", String(active));
    });
    const select = this.el.querySelector('[data-filter="veranstalter"]');
    if (select) select.value = (filter.veranstalter || [])[0] || "";
  }

  leave() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
    this.el = null;
    this.activeYear = null;
  }
}
