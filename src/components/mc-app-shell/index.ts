import { html, LitElement, nothing } from "lit";
import { property, query } from "lit/decorators.js";

import componentStylesText from "./styles.css?inline";
import { createComponentStyles } from "../../internal/component-styles";
import { dispatchMcEvent } from "../../internal/events";
import { createFocusTrap } from "../../internal/focus";
import { murgaThemeStyles } from "../../internal/styles";

import type { PropertyValues } from "lit";

export const MC_APP_SHELL_TAG_NAME = "mc-app-shell";
export const TAG_NAME = MC_APP_SHELL_TAG_NAME;

const componentStyles = createComponentStyles(componentStylesText);
const DESKTOP_SIDEBAR_MEDIA_QUERY = "(min-width: 960px)";

export class McAppShell extends LitElement {
  static styles = [murgaThemeStyles, componentStyles];

  @property({ type: Boolean, attribute: "sidebar-open", reflect: true })
  sidebarOpen = false;

  @property({ type: Boolean, attribute: "mobile-overlay", reflect: true })
  mobileOverlay = true;

  @query(".sidebar")
  private readonly sidebarElement?: HTMLElement;

  #desktopSidebarMedia?: MediaQueryList;
  #releaseFocusTrap: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.#desktopSidebarMedia = window.matchMedia(DESKTOP_SIDEBAR_MEDIA_QUERY);
    this.#desktopSidebarMedia.addEventListener("change", this.#syncFocusTrap);
  }

  disconnectedCallback() {
    this.#desktopSidebarMedia?.removeEventListener("change", this.#syncFocusTrap);
    this.#desktopSidebarMedia = undefined;
    this.#releaseFocusTrap?.();
    this.#releaseFocusTrap = null;
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("sidebarOpen") || changedProperties.has("mobileOverlay")) {
      this.#syncFocusTrap();
    }
  }

  #syncFocusTrap = () => {
    this.#releaseFocusTrap?.();
    this.#releaseFocusTrap = null;

    if (!this.mobileOverlay || !this.sidebarOpen || this.#desktopSidebarMedia?.matches) {
      return;
    }

    if (!this.sidebarElement) {
      return;
    }

    this.#releaseFocusTrap = createFocusTrap(this.sidebarElement, {
      onEscape: () => {
        dispatchMcEvent(this, "mc-sidebar-open-change", { open: false });
      },
    });
  };

  #handleOverlayClick = () => {
    dispatchMcEvent(this, "mc-sidebar-open-change", { open: false });
  };

  render() {
    const showOverlay = this.mobileOverlay && this.sidebarOpen;

    return html`
      <div class="root" part="root">
        ${showOverlay
          ? html`
              <button
                class="overlay"
                part="overlay"
                type="button"
                aria-label="Close sidebar"
                @click=${this.#handleOverlayClick}
              ></button>
            `
          : nothing}
        <aside
          class="sidebar"
          part="sidebar"
          .inert=${!this.sidebarOpen}
          aria-hidden=${this.sidebarOpen ? nothing : "true"}
        >
          <slot name="sidebar"></slot>
        </aside>
        <main class="main" part="main">
          <slot name="header"></slot>
          <slot name="main"></slot>
          <slot name="footer"></slot>
        </main>
      </div>
    `;
  }
}

export function defineMcAppShell() {
  if (!customElements.get(MC_APP_SHELL_TAG_NAME)) {
    customElements.define(MC_APP_SHELL_TAG_NAME, McAppShell);
  }
}

export type McAppShellArgs = Partial<Pick<McAppShell, "sidebarOpen" | "mobileOverlay">>;

declare global {
  interface HTMLElementTagNameMap {
    "mc-app-shell": McAppShell;
  }
}
