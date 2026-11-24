// js/ui/Countdown.js
// „Nächster Termin“ aus den geplanten Events (geplant: true), Sekunden-Tick, Fallback-Text.

export class Countdown {
  constructor(termine, { reduced = false } = {}) {
    this.termine = termine;
    this.reduced = reduced;
    this.el = null;
    this.timer = null;
  }

  next(now = new Date()) {
    const sorted = [...this.termine].sort((a, b) => a.datum.localeCompare(b.datum));
    for (const t of sorted) {
      const target = new Date(`${t.datum}T${t.uhrzeit || "12:00"}:00`);
      if (target.getTime() > now.getTime()) return { ...t, target };
    }
    return null;
  }

  render(host) {
    this.el = host;
    const next = this.next();
    if (!next) {
      host.innerHTML =
        '<p class="countdown__fallback">Die Adventszeit 2026 ist vorbei — bis zum nächsten Lichterfest!</p>';
      return;
    }
    host.innerHTML = `
      <p class="countdown__label">Nächster Termin in Britz</p>
      <h3 class="countdown__titel">${this.esc(next.titel)}</h3>
      <p class="countdown__meta">${this.esc(next.datum)} · ${this.esc(next.uhrzeit)} Uhr · ${this.esc(next.ort)}</p>
      <div class="countdown__grid" data-countdown aria-live="off"></div>
    `;
    this.target = next.target;
    this.grid = host.querySelector("[data-countdown]");
    this.tick();
    if (!this.reduced) {
      this.timer = setInterval(() => this.tick(), 1000);
    }
  }

  esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  tick() {
    if (!this.grid) return;
    const diff = Math.max(0, this.target.getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const cell = (v, l) =>
      `<div class="countdown__cell"><span class="countdown__num">${v}</span><span class="countdown__unit">${l}</span></div>`;
    this.grid.innerHTML = cell(d, "Tage") + cell(h, "Stunden") + cell(m, "Minuten") + cell(s, "Sekunden");
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
