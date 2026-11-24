// js/core/Store.js
// Observable State — get/set/subscribe.

export class Store {
  constructor(initial = {}) {
    this.state = { ...initial };
    this.subscribers = new Set();
  }

  get(key) {
    if (key === undefined) return this.state;
    return this.state[key];
  }

  set(patch) {
    const changed = {};
    for (const [k, v] of Object.entries(patch)) {
      if (this.state[k] !== v) {
        this.state[k] = v;
        changed[k] = v;
      }
    }
    if (Object.keys(changed).length > 0) {
      this.emit(changed);
    }
    return this.state;
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  emit(changed) {
    for (const fn of [...this.subscribers]) {
      try {
        fn(changed, this.state);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Store subscriber threw:", err);
      }
    }
  }
}
