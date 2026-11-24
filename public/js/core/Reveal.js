// js/core/Reveal.js
// IntersectionObserver-Scroll-Reveal. Respektiert prefers-reduced-motion.

export class Reveal {
  constructor(root = document) {
    this.root = root;
    this.io = null;
    this.reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  start() {
    if (this.reduced) {
      // Sofort sichtbar, keine Animation.
      this.root.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      this.root.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            this.io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    this.observe();
  }

  observe(scope = this.root) {
    if (!this.io) return;
    scope.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => {
      this.io.observe(el);
    });
  }

  stop() {
    if (this.io) {
      this.io.disconnect();
      this.io = null;
    }
  }
}
