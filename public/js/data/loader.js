// js/data/loader.js
// Lädt die Chronik-Daten aus public/data/*.json und liefert ein Objekt
// mit der gleichen Struktur wie die frühere class Chronik.

const FELD = ["meta", "kategorie", "events", "akteure", "traditionen"];

export async function loadChronik() {
  const eintraege = await Promise.all(
    FELD.map(async (name) => {
      const res = await fetch(new URL(`../../data/${name}.json`, import.meta.url));
      if (!res.ok) throw new Error(`Daten konnten nicht geladen werden: ${name}.json (${res.status})`);
      return [name, await res.json()];
    })
  );
  return Object.fromEntries(eintraege);
}
