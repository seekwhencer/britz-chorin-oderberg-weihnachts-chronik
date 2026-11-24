// js/ui/Snowfall.js
// GPU-komponierter Schneefall nach dem xmas-ui-Skill:
// - DOM-Span-Flakes (max. 35), pointer-events: none
// - prefers-reduced-motion → deaktiviert
// - Pause bei verstecktem Tab

const MAX_FLAKES = 35;
const GLYPHS = ["❄", "❅", "•"];

export class Snowfall {
  constructor({ reduced = false } = {}) {
    this.reduced = reduced;
    this.container = null;
    this.visible = true;
  }

  init() {
    if (this.reduced) return null;
    if (document.querySelector(".xmas-snow-container")) {
      this.container = document.querySelector(".xmas-snow-container");
      return this.container;
    }
    const container = document.createElement("div");
    container.className = "xmas-snow-container";
    container.setAttribute("aria-hidden", "true");

    const count = Math.min(MAX_FLAKES, Math.round(window.innerWidth / 34));
    for (let i = 0; i < count; i++) {
      const flake = document.createElement("span");
      flake.className = "xmas-snowflake";
      flake.textContent = GLYPHS[i % GLYPHS.length];
      flake.style.left = `${Math.random() * 100}vw`;
      flake.style.fontSize = `${0.6 + Math.random() * 0.7}rem`;
      flake.style.opacity = `${0.25 + Math.random() * 0.35}`;
      flake.style.animationDuration = `${8 + Math.random() * 10}s`;
      flake.style.animationDelay = `${-Math.random() * 15}s`;
      container.appendChild(flake);
    }
    document.body.appendChild(container);
    this.container = container;

    document.addEventListener("visibilitychange", () => {
      this.visible = document.visibilityState === "visible";
      if (container) {
        container.style.animationPlayState = this.visible ? "running" : "paused";
        container.querySelectorAll(".xmas-snowflake").forEach((f) => {
          f.style.animationPlayState = this.visible ? "running" : "paused";
        });
      }
    });
    return container;
  }

  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
