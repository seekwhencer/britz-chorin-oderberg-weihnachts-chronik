// js/core/EventBus.js
// Lose Kopplung zwischen UI-Widgets und Views.

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    const set = this.listeners.get(event);
    if (set) set.delete(fn);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (set) {
      for (const fn of [...set]) {
        try {
          fn(payload);
        } catch (err) {
          // Ein fehlerhafter Listener darf die anderen nicht blockieren.
          // eslint-disable-next-line no-console
          console.error(`EventBus listener for "${event}" threw:`, err);
        }
      }
    }
  }
}
