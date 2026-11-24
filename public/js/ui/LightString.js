// js/ui/LightString.js
// Lichterkette: SVG-Bulbs mit sequenziellem Twinkle (Chase).
// Reduced-Motion → statisch, volle Helligkeit.

const COLORS = ["#e0455e", "#f2c14e", "#4fae6d", "#5b9bd5"];

export class LightString {
  constructor({ reduced = false } = {}) {
    this.reduced = reduced;
    this.el = null;
  }

  init() {
    const host = document.querySelector("[data-lightstring]");
    if (!host) return null;
    const count = Math.max(10, Math.min(28, Math.round(window.innerWidth / 56)));
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "xmas-lightstring");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("viewBox", `0 0 ${count * 40} 28`);

    // Draht (sanfte Welle)
    const wire = document.createElementNS(svgNS, "path");
    let d = `M0 6`;
    for (let i = 1; i <= count; i++) {
      const x = i * 40 - 20;
      const y = 6 + (i % 2 === 0 ? 6 : 0);
      d += ` Q ${x - 20} ${y + 8}, ${x} ${y}`;
    }
    wire.setAttribute("d", d);
    wire.setAttribute("fill", "none");
    wire.setAttribute("stroke", "rgba(120,113,108,.55)");
    wire.setAttribute("stroke-width", "1.5");
    svg.appendChild(wire);

    for (let i = 0; i < count; i++) {
      const cx = i * 40 + 20;
      const cy = 6 + (i % 2 === 0 ? 6 : 0) + 8;
      const color = COLORS[i % COLORS.length];

      const glow = document.createElementNS(svgNS, "circle");
      glow.setAttribute("cx", cx);
      glow.setAttribute("cy", cy);
      glow.setAttribute("r", "7");
      glow.setAttribute("fill", color);
      glow.setAttribute("opacity", "0.25");
      glow.setAttribute("class", "xmas-bulb-glow");
      glow.style.animationDelay = `${i * 0.18}s`;
      svg.appendChild(glow);

      const bulb = document.createElementNS(svgNS, "circle");
      bulb.setAttribute("cx", cx);
      bulb.setAttribute("cy", cy);
      bulb.setAttribute("r", "3.4");
      bulb.setAttribute("fill", color);
      bulb.setAttribute("class", "xmas-bulb");
      bulb.style.animationDelay = `${i * 0.18}s`;
      svg.appendChild(bulb);
    }

    host.appendChild(svg);
    this.el = svg;
    return svg;
  }

  destroy() {
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
  }
}
