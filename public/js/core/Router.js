// js/core/Router.js
// Hash-basierter Router — GH-Pages-tauglich ohne Server-Rewrites.

export class Router {
  constructor(store, routes) {
    this.store = store;
    this.routes = routes; // { name: { pattern, view } }
    this.current = null;
  }

  start() {
    window.addEventListener("hashchange", () => this.resolve());
    this.resolve();
  }

  to(hash) {
    if (window.location.hash === hash) {
      this.resolve();
    } else {
      window.location.hash = hash;
    }
  }

  parse() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    const [path, query] = raw.split("?");
    const params = new URLSearchParams(query || "");
    return { path: path.replace(/\/$/, ""), params };
  }

  match(path) {
    if (path === "" || path === "home") return "home";
    for (const [name, def] of Object.entries(this.routes)) {
      if (def.pattern === path) return name;
    }
    return null;
  }

  resolve() {
    const { path, params } = this.parse();
    const name = this.match(path) || "home";
    this.store.set({ route: name, params });
    this.current = name;
    return name;
  }
}
