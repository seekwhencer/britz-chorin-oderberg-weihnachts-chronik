// js/ui/Modal.js
// Detail-Dialog: Focus-Trap, Esc, Overlay-Klick, aria-modal, Scroll-Lock.

export class Modal {
  constructor() {
    this.el = null;
    this.backdrop = null;
    this.lastFocus = null;
    this.onClose = null;
  }

  ensure() {
    if (this.el) return;
    this.backdrop = document.createElement("div");
    this.backdrop.className = "xmas-modal-backdrop";
    this.backdrop.setAttribute("hidden", "");

    this.el = document.createElement("div");
    this.el.className = "xmas-modal";
    this.el.setAttribute("role", "dialog");
    this.el.setAttribute("aria-modal", "true");
    this.el.setAttribute("aria-labelledby", "xmas-modal-title");

    const close = document.createElement("button");
    close.type = "button";
    close.className = "xmas-modal__close";
    close.setAttribute("aria-label", "Dialog schließen");
    close.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    close.addEventListener("click", () => this.close());

    const content = document.createElement("div");
    content.className = "xmas-modal__content";

    this.el.appendChild(close);
    this.el.appendChild(content);
    this.backdrop.appendChild(this.el);
    document.body.appendChild(this.backdrop);

    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) this.close();
    });
    document.addEventListener("keydown", this.onKeydown);
  }

  onKeydown = (e) => {
    if (!this.isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
    } else if (e.key === "Tab") {
      this.trapFocus(e);
    }
  };

  isOpen() {
    return this.el && !this.backdrop.hasAttribute("hidden");
  }

  open(html, { labelledBy = "xmas-modal-title" } = {}) {
    this.ensure();
    this.lastFocus = document.activeElement;
    this.el.querySelector(".xmas-modal__content").innerHTML = html;
    this.el.setAttribute("aria-labelledby", labelledBy);
    this.backdrop.removeAttribute("hidden");
    document.body.classList.add("modal-open");
    // Fokus auf den Schließen-Button setzen.
    const closeBtn = this.el.querySelector(".xmas-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  close() {
    if (!this.el) return;
    this.backdrop.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
    if (this.onClose) this.onClose();
    if (this.lastFocus && typeof this.lastFocus.focus === "function") {
      this.lastFocus.focus();
    }
  }

  trapFocus(e) {
    const focusables = this.el.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
