// js/ui/EventCard.js
// Rendert eine Event-Karte. Kapselt HTML-Escaping in static esc().

export class EventCard {
  static esc(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  static formatDatum(datum) {
    if (!datum) return "";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(datum));
    if (!m) return String(datum);
    return `${m[3]}.${m[2]}.${m[1]}`;
  }

  static icon(name) {
    const icons = {
      kerze: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 2c1.5 2 1.5 3.5 0 5-1.5-1.5-1.5-3 0-5Z"/><path d="M9 10h6v11a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V10Z"/><path d="M12 10v12"/></svg>',
      markt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg>',
      musik: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      herz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.5 1.5 6 4 2.5-2.5 4-4 6-4 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20Z"/></svg>',
      kind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>',
      baum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 6 10h3l-4 6h4l-4 6h12l-4-6h4l-4-6h3L12 2Z"/><path d="M12 22v-4"/></svg>',
      sack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 7c0-2 1.5-4 3-4s3 2 3 4"/><path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"/><path d="M9 12h6"/></svg>',
      pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    };
    return icons[name] || icons.baum;
  }

  static render(event, chronik, { selectable = true } = {}) {
    const card = document.createElement("article");
    card.className = "xmas-card event-card";
    card.dataset.eventId = event.id;
    if (event.geplant) card.classList.add("event-card--geplant");

    const cats = (event.kategorie || [])
      .map((k) => chronik.kategorie[k])
      .filter(Boolean)
      .map(
        (c) =>
          `<span class="chip chip--cat"><span class="chip__icon">${EventCard.icon(c.icon)}</span>${EventCard.esc(c.label)}</span>`
      )
      .join("");

    const zeit = [EventCard.formatDatum(event.datum), event.uhrzeit ? `${event.uhrzeit} Uhr` : ""]
      .filter(Boolean)
      .join(" · ");
    const ort = event.ort ? `<span class="event-card__ort">${EventCard.esc(event.ort)}</span>` : "";
    const meta =
      zeit || event.ort
        ? `<div class="event-card__meta">${zeit ? `<span class="event-card__datum">${EventCard.esc(zeit)}</span>` : ""}${ort}</div>`
        : "";
    const ortName = event.ortName
      ? `<span class="event-card__ortname"><span class="event-card__ortname-icon">${EventCard.icon("pin")}</span>${EventCard.esc(event.ortName)}</span>`
      : "";
    const geplant = event.geplant ? `<span class="badge badge--geplant">geplant</span>` : "";

    const body = document.createElement("div");
    body.innerHTML = `
      <div class="event-card__head">
        ${ortName}
        ${geplant}
      </div>
      <h3 class="event-card__titel">${EventCard.esc(event.titel)}</h3>
      <div class="event-card__chips">${cats}</div>
      ${meta}
      <p class="event-card__kurz">${EventCard.esc(event.kurzfassung)}</p>
      ${selectable ? '<button type="button" class="xmas-btn xmas-btn-secondary event-card__details" data-select-event="' + EventCard.esc(event.id) + '">Details</button>' : ""}
    `;
    card.appendChild(body);
    return card;
  }
}
