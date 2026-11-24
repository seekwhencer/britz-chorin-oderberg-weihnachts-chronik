---
name: xmas-ui
description: Comprehensive Christmas & Winter UI Design System using pure semantic CSS custom properties, modular CSS components, inline SVGs, vanilla JS theme/snowfall controllers, and strict WCAG AA accessibility guardrails.
---

# Christmas & Winter UI Design System (Complete Pure-CSS Specification)

Whenever the user requests a Christmas, holiday, advent, or winter theme for a web application, implement this complete design system using **native CSS custom properties, semantic CSS classes, lightweight inline SVGs, and zero-dependency Vanilla JS**. 

The aesthetic direction is **"Modern Nordic Winter & Classic Editorial Holiday"**: warm parchment surfaces, deep cranberry and pine tones, candlelight gold accents, and crisp readability—never tacky neon colors or intrusive animations.

---

## 1. Architecture & File Structure

When scaffolding a new holiday theme or refactoring an existing stylesheet, organize the code cleanly:

- `styles/xmas-tokens.css` — Scoped CSS variables for Light Mode, Dark Mode, typography, spacing, and elevation.
- `styles/xmas-components.css` — Reusable UI classes (`.xmas-card`, `.xmas-btn-*`, `.xmas-input`, `.xmas-modal`, `.xmas-advent-grid`).
- `styles/xmas-effects.css` — GPU-accelerated snowfall, fairy-light header divider, and `@media (prefers-reduced-motion)` overrides.
- `scripts/xmas-theme.js` — Lightweight controller for toggling `.theme-xmas`, persisting user preference in `localStorage`, and spawning accessible snow particles.

---

## 2. Design Tokens (`xmas-tokens.css`)

Scope all tokens under `.theme-xmas` (applied to `<html>` or `<body>`) so the holiday theme can be enabled or disabled globally without side effects.

```css
.theme-xmas {
  /* === Light Mode: Cozy Nordic Snow === */
  --xmas-bg-primary: #FAF7F2;          /* Warm Snow */
  --xmas-bg-secondary: #F2ECE1;        /* Soft Parchment / Cream */
  --xmas-bg-elevated: #FFFFFF;         /* Crisp Card & Modal Surface */
  --xmas-bg-subtle: #EAE2D3;           /* Muted Hover / Table Stripe */

  --xmas-text-primary: #1C1917;        /* Warm Charcoal (Contrast > 14:1) */
  --xmas-text-secondary: #57534E;      /* Muted Stone (Contrast > 6:1) */
  --xmas-text-muted: #78716C;          /* Subtle Metadata */
  --xmas-text-inverse: #FAF7F2;        /* Text on Dark Red/Green */

  /* Brand & Festive Palette */
  --xmas-red-primary: #B91C1C;         /* Deep Cranberry (Primary CTA) */
  --xmas-red-hover: #991B1B;           /* Rich Berry */
  --xmas-red-soft: #FEE2E2;            /* Soft Blush Tint */

  --xmas-green-primary: #14532D;       /* Pine Evergreen (Secondary / Badges) */
  --xmas-green-hover: #166534;         /* Forest Pine */
  --xmas-green-soft: #DCFCE7;          /* Muted Sage Tint */

  --xmas-gold-accent: #D97706;         /* Warm Amber Gold (Borders / Focus / Stars) */
  --xmas-gold-light: #FEF3C7;          /* Champagne Tint */
  --xmas-gold-glow: rgba(245, 158, 11, 0.35);

  /* Semantic Status Overrides (Keep Distinct from Festive Colors) */
  --xmas-status-error: #DC2626;
  --xmas-status-success: #15803D;
  --xmas-status-info: #0369A1;

  /* Typography */
  --xmas-font-serif: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
  --xmas-font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  /* Radii & Spacing */
  --xmas-radius-sm: 6px;
  --xmas-radius-md: 12px;
  --xmas-radius-lg: 18px;
  --xmas-radius-pill: 9999px;

  /* Borders, Dividers & Elevation */
  --xmas-border: #E7E0D5;
  --xmas-border-strong: #D6CCC2;
  --xmas-shadow-sm: 0 2px 8px rgba(28, 25, 23, 0.05);
  --xmas-shadow-card: 0 6px 24px -4px rgba(28, 25, 23, 0.08);
  --xmas-shadow-modal: 0 20px 50px rgba(28, 25, 23, 0.22);
}

.theme-xmas.dark,
[data-theme="dark"] .theme-xmas {
  /* === Dark Mode: Midnight Winter Sky === */
  --xmas-bg-primary: #0B1120;          /* Deep Midnight Blue */
  --xmas-bg-secondary: #131C31;        /* Winter Slate */
  --xmas-bg-elevated: #1E293B;         /* Frosted Night Surface */
  --xmas-bg-subtle: #172033;           /* Subtle Row Highlight */

  --xmas-text-primary: #F8FAFC;        /* Frost White */
  --xmas-text-secondary: #94A3B8;      /* Silver Mist */
  --xmas-text-muted: #64748B;
  --xmas-text-inverse: #0B1120;

  --xmas-red-primary: #DC2626;         /* Luminous Crimson */
  --xmas-red-hover: #EF4444;
  --xmas-red-soft: rgba(220, 38, 38, 0.18);

  --xmas-green-primary: #15803D;       /* Spruce Green */
  --xmas-green-hover: #16A34A;
  --xmas-green-soft: rgba(20, 83, 45, 0.35);

  --xmas-gold-accent: #F59E0B;         /* Candlelight Gold */
  --xmas-gold-light: rgba(245, 158, 11, 0.15);
  --xmas-gold-glow: rgba(245, 158, 11, 0.28);

  --xmas-border: rgba(248, 250, 252, 0.12);
  --xmas-border-strong: rgba(248, 250, 252, 0.22);
  --xmas-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --xmas-shadow-card: 0 10px 30px rgba(0, 0, 0, 0.45);
  --xmas-shadow-modal: 0 24px 60px rgba(0, 0, 0, 0.65);
}
```

---

## 3. Typography & Seasonal Microcopy Rules

```css
.theme-xmas {
  background-color: var(--xmas-bg-primary);
  color: var(--xmas-text-primary);
  font-family: var(--xmas-font-sans);
  line-height: 1.6;
  transition: background-color 250ms ease, color 250ms ease;
}

.theme-xmas h1,
.theme-xmas h2,
.theme-xmas h3,
.theme-xmas .xmas-heading {
  font-family: var(--xmas-font-serif);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--xmas-text-primary);
}
```

- **Editorial Contrast:** Pair serif headings (`h1`–`h3`) with clean sans-serif UI controls (`button`, `input`, `table`, `nav`).
- **Microcopy Guardrail:** Use warm seasonal phrasing in marketing/storefront headers (*"Holiday Gift Guide"*, *"Guaranteed Delivery Before Dec 24"*, *"Unwrap Your Offer"*), but **never** rename core functional actions in SaaS or checkout flows (keep *"Save"*, *"Cancel"*, *"Delete"*, *"Checkout"* literal and clear).

---

## 4. Complete Component Library (`xmas-components.css`)

### 4.1 Announcement Banner & Navigation

```css
.xmas-banner {
  background-color: var(--xmas-green-primary);
  color: #FAF7F2;
  border-bottom: 1px solid var(--xmas-gold-accent);
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.xmas-navbar {
  background-color: var(--xmas-bg-elevated);
  border-bottom: 1px solid var(--xmas-border);
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### 4.2 Buttons & Focus Rings

```css
.xmas-btn-primary,
.xmas-btn-secondary,
.xmas-btn-gold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--xmas-radius-sm);
  padding: 0.625rem 1.25rem;
  font-family: var(--xmas-font-sans);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.xmas-btn-primary {
  background-color: var(--xmas-red-primary);
  color: #FAF7F2;
  border: 1px solid transparent;
}

.xmas-btn-primary:hover {
  background-color: var(--xmas-red-hover);
  box-shadow: 0 0 18px var(--xmas-gold-glow);
  transform: translateY(-1px);
}

.xmas-btn-secondary {
  background-color: transparent;
  color: var(--xmas-green-primary);
  border: 1px solid var(--xmas-green-primary);
}

.theme-xmas.dark .xmas-btn-secondary {
  color: #86EFAC;
  border-color: #22C55E;
}

.xmas-btn-secondary:hover {
  background-color: var(--xmas-green-soft);
}

.xmas-btn-gold {
  background: linear-gradient(135deg, #D97706, #B45309);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.xmas-btn-gold:hover {
  box-shadow: 0 0 20px var(--xmas-gold-glow);
}

.theme-xmas :focus-visible {
  outline: 2px solid var(--xmas-gold-accent);
  outline-offset: 2px;
}
```

### 4.3 Cards, Pricing Tiers & Advent Calendar Grid

```css
.xmas-card {
  background-color: var(--xmas-bg-elevated);
  border: 1px solid var(--xmas-border);
  border-radius: var(--xmas-radius-md);
  box-shadow: var(--xmas-shadow-card);
  padding: 1.5rem;
  position: relative;
}

.xmas-card--featured {
  border: 1px solid var(--xmas-gold-accent);
  border-top: 4px solid var(--xmas-gold-accent);
}

.theme-xmas.dark .xmas-card {
  backdrop-filter: blur(12px);
}

/* Interactive 24-Day Advent Calendar Grid */
.xmas-advent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1rem;
}

.xmas-advent-door {
  aspect-ratio: 1 / 1;
  background-color: var(--xmas-bg-secondary);
  border: 1px dashed var(--xmas-gold-accent);
  border-radius: var(--xmas-radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--xmas-font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--xmas-red-primary);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}

.xmas-advent-door:hover:not([disabled]) {
  background-color: var(--xmas-bg-elevated);
  border-style: solid;
  box-shadow: 0 0 16px var(--xmas-gold-glow);
  transform: translateY(-2px);
}

.xmas-advent-door[aria-expanded="true"] {
  background-color: var(--xmas-green-primary);
  color: #FEF3C7;
  border-style: solid;
}
```

### 4.4 Forms, Inputs & Data Tables

```css
.xmas-input,
.xmas-select,
.xmas-textarea {
  width: 100%;
  background-color: var(--xmas-bg-elevated);
  color: var(--xmas-text-primary);
  border: 1px solid var(--xmas-border-strong);
  border-radius: var(--xmas-radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--xmas-font-sans);
  font-size: 0.9375rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.xmas-input:focus,
.xmas-select:focus,
.xmas-textarea:focus {
  border-color: var(--xmas-gold-accent);
  box-shadow: 0 0 0 3px var(--xmas-gold-glow);
  outline: none;
}

.xmas-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--xmas-bg-elevated);
  border: 1px solid var(--xmas-border);
  border-radius: var(--xmas-radius-md);
  overflow: hidden;
}

.xmas-table th {
  background-color: var(--xmas-bg-secondary);
  color: var(--xmas-text-primary);
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--xmas-border);
}

.xmas-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--xmas-border);
}

.xmas-table tr:hover td {
  background-color: var(--xmas-bg-subtle);
}
```

### 4.5 Badges, Progress Bars & Modals

```css
.xmas-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--xmas-green-primary);
  color: #FEF3C7;
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: var(--xmas-radius-pill);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.xmas-progress-track {
  width: 100%;
  height: 10px;
  background-color: var(--xmas-bg-secondary);
  border-radius: var(--xmas-radius-pill);
  overflow: hidden;
  border: 1px solid var(--xmas-border);
}

.xmas-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--xmas-red-primary), var(--xmas-gold-accent));
  border-radius: var(--xmas-radius-pill);
  transition: width 350ms ease;
}

.xmas-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 17, 32, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.xmas-modal {
  background-color: var(--xmas-bg-elevated);
  border: 1px solid var(--xmas-gold-accent);
  border-radius: var(--xmas-radius-lg);
  box-shadow: var(--xmas-shadow-modal);
  max-width: 480px;
  width: calc(100% - 2rem);
  padding: 2rem;
}
```

---

## 5. Lightweight Inline SVG Icons (Zero External Assets)

Use crisp, single-color `currentColor` SVGs (`16x16` or `20x20`) instead of external PNGs or icon fonts:

- **Snowflake Icon:**

```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
</svg>
```

- **Gift Box Icon:**

```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>
</svg>
```

---

## 6. Motion & Atmospheric Effects (`xmas-effects.css`)

### 6.1 GPU-Composited Snowfall Overlay

```css
.xmas-snow-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.xmas-snowflake {
  position: absolute;
  top: -1.5rem;
  color: #FFFFFF;
  text-shadow: 0 0 4px rgba(15, 23, 42, 0.25);
  user-select: none;
  will-change: transform;
  animation: xmas-snow-fall linear infinite;
}

@keyframes xmas-snow-fall {
  0% {
    transform: translate3d(0, -5vh, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(25px, 105vh, 0) rotate(360deg);
  }
}

/* Subtle Top Fairy-Light Accent Line */
.xmas-fairy-lights {
  height: 4px;
  width: 100%;
  background: repeating-linear-gradient(
    90deg,
    var(--xmas-red-primary) 0 12px,
    transparent 12px 24px,
    var(--xmas-gold-accent) 24px 36px,
    transparent 36px 48px,
    var(--xmas-green-primary) 48px 60px,
    transparent 60px 72px
  );
  animation: xmas-twinkle 4s ease-in-out infinite alternate;
}

@keyframes xmas-twinkle {
  0% { opacity: 0.65; }
  100% { opacity: 1; }
}

/* Mandatory Reduced-Motion Guardrail */
@media (prefers-reduced-motion: reduce) {
  .xmas-snow-container {
    display: none !important;
  }
  .xmas-fairy-lights {
    animation: none !important;
  }
}
```

---

## 7. Vanilla JS Theme & Snowfall Controller (`xmas-theme.js`)

Include a clean, dependency-free controller so users can toggle the holiday theme on or off at any time:

```javascript
const XmasTheme = (() => {
  const STORAGE_KEY = 'ui-xmas-enabled';
  const ROOT = document.documentElement;

  function initSnow(count = 28) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.querySelector('.xmas-snow-container')) return;

    const container = document.createElement('div');
    container.className = 'xmas-snow-container';
    container.setAttribute('aria-hidden', 'true');

    const glyphs = ['❄', '❅', '•'];
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('span');
      flake.className = 'xmas-snowflake';
      flake.textContent = glyphs[i % glyphs.length];
      flake.style.left = `${Math.random() * 100}vw`;
      flake.style.fontSize = `${0.6 + Math.random() * 0.7}rem`;
      flake.style.opacity = `${0.25 + Math.random() * 0.35}`;
      flake.style.animationDuration = `${8 + Math.random() * 10}s`;
      flake.style.animationDelay = `${-Math.random() * 15}s`;
      container.appendChild(flake);
    }
    document.body.appendChild(container);
  }

  function removeSnow() {
    document.querySelector('.xmas-snow-container')?.remove();
  }

  function setEnabled(enabled, withSnow = true) {
    ROOT.classList.toggle('theme-xmas', enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
    if (enabled && withSnow) initSnow();
    else removeSnow();
  }

  function toggle(withSnow = true) {
    setEnabled(!ROOT.classList.contains('theme-xmas'), withSnow);
  }

  function init(defaultEnabled = true, withSnow = true) {
    const saved = localStorage.getItem(STORAGE_KEY);
    const shouldEnable = saved !== null ? saved === 'true' : defaultEnabled;
    setEnabled(shouldEnable, withSnow);
  }

  return { init, toggle, setEnabled };
})();
```

---

## 8. Strict Guardrails & Edge-Case Rules

| Category | Mandatory Rule | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **WCAG Contrast** | Every text/background pair must meet `>= 4.5:1` (`>= 3:1` for large text). | Never place red text directly on a green surface or green text on red. |
| **Pointer Events** | Decorative snow, sparkles, and corner garlands must have `pointer-events: none`. | Never allow snow particles to intercept clicks on buttons, inputs, or links. |
| **Motion Safety** | Respect `@media (prefers-reduced-motion: reduce)` and cap snow flakes at `<= 35` DOM nodes. | Never use flashing/strobing lights faster than `0.5Hz` or auto-playing sound effects. |
| **Semantic Status** | Keep validation error messages, destructive modals, and chart series unambiguous. | Never color "Success" in red or "Error" in festive green. |
| **User Autonomy** | Expose a visible toggle button (`aria-pressed`) to disable `.theme-xmas`. | Never lock the user into the seasonal theme without an opt-out. |

---

## 9. Agent Verification Checklist

Before finishing any Christmas UI task, confirm every item:

1. [ ] All colors, fonts, borders, and shadows use `--xmas-*` CSS custom properties scoped under `.theme-xmas`.
2. [ ] Both Light Mode (`.theme-xmas`) and Dark Mode (`.theme-xmas.dark`) render cleanly with verified contrast.
3. [ ] Forms, tables, modals, and buttons retain clear focus rings (`--xmas-gold-accent`) and accessible labels.
4. [ ] `@media (prefers-reduced-motion: reduce)` disables all snowfall and twinkling animations.
5. [ ] A working toggle button calls `XmasTheme.toggle()` so the user can switch back to the standard UI anytime.
