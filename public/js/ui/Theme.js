// js/ui/Theme.js
// Tag/Nacht-Controller nach dem xmas-ui-Skill:
// - `.theme-xmas` auf <html> (Light = Tag, `.dark` = Nacht)
// - Persistenz in localStorage
// - Snow-Delegation an das Snowfall-Widget
// - Sichtbarer Toggle mit aria-pressed

const STORAGE_KEY = "xmas-theme-dark";

export class Theme {
  constructor({ snowfall = null, bus = null } = {}) {
    this.root = document.documentElement;
    this.snowfall = snowfall;
    this.bus = bus;
    this.dark = false;
    this.toggleBtn = null;
  }

  init() {
    const saved = this.readStorage();
    this.dark = saved !== null ? saved === "true" : this.prefersDark();
    this.apply();
    this.bindToggle();
  }

  prefersDark() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  readStorage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  writeStorage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* localStorage nicht verfügbar — ignorieren */
    }
  }

  apply() {
    // `.theme-xmas` ist immer aktiv (Design-System), `.dark` schaltet die Nacht.
    this.root.classList.add("theme-xmas");
    this.root.classList.toggle("dark", this.dark);
    this.root.style.colorScheme = this.dark ? "dark" : "light";
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("aria-pressed", String(this.dark));
      this.toggleBtn.setAttribute(
        "aria-label",
        this.dark ? "Zum Tag-Theme wechseln" : "Zum Nacht-Theme wechseln"
      );
    }
    if (this.bus) this.bus.emit("theme:change", { dark: this.dark });
  }

  set(dark) {
    this.dark = Boolean(dark);
    this.writeStorage(this.dark);
    this.apply();
  }

  toggle() {
    this.set(!this.dark);
  }

  bindToggle() {
    this.toggleBtn = document.querySelector("[data-theme-toggle]");
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }
  }
}
