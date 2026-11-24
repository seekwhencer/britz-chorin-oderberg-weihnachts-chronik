// js/ui/SearchBox.js
// Live-Suche mit 150 ms Debounce.

export class SearchBox {
  constructor({ store, bus } = {}) {
    this.store = store;
    this.bus = bus;
    this.el = null;
    this.timer = null;
  }

  render(host) {
    const el = document.createElement("div");
    el.className = "searchbox";
    el.innerHTML = `
      <label class="searchbox__label" for="search-input">Suche</label>
      <input id="search-input" class="xmas-input searchbox__input" type="search"
        placeholder="z. B. Alpaka, Conradi, Glühwein …" autocomplete="off" />
    `;
    host.appendChild(el);
    this.el = el;
    const input = el.querySelector("input");
    input.addEventListener("input", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.store.set({ query: input.value.trim() });
      }, 150);
    });
    return el;
  }

  setValue(value) {
    const input = this.el && this.el.querySelector("input");
    if (input) input.value = value || "";
  }
}
