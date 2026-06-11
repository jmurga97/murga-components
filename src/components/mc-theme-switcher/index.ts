import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import componentStylesText from "./styles.css?inline";
import { createComponentStyles } from "../../internal/component-styles";
import { dispatchMcEvent } from "../../internal/events";
import { murgaThemeStyles } from "../../internal/styles";

import type { McTheme } from "../../internal/contracts";

export const MC_THEME_SWITCHER_TAG_NAME = "mc-theme-switcher";
export const TAG_NAME = MC_THEME_SWITCHER_TAG_NAME;

const componentStyles = createComponentStyles(componentStylesText);
const themes: McTheme[] = ["dark", "light"];

export class McThemeSwitcher extends LitElement {
  static shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = [murgaThemeStyles, componentStyles];

  @property({ type: String, reflect: true })
  theme: McTheme = "dark";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, attribute: "aria-label" })
  ariaLabel = "Color theme";

  @property({ type: String, attribute: "dark-label" })
  darkLabel = "Dark";

  @property({ type: String, attribute: "light-label" })
  lightLabel = "Light";

  #requestTheme(theme: McTheme) {
    if (this.disabled || theme === this.theme) {
      return;
    }

    dispatchMcEvent(this, "mc-theme-change", { theme });
  }

  #handleKeyDown = (event: KeyboardEvent) => {
    let nextTheme: McTheme | undefined;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Home") {
      nextTheme = themes[0];
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "End") {
      nextTheme = themes[themes.length - 1];
    }

    if (!nextTheme) {
      return;
    }

    event.preventDefault();
    this.shadowRoot?.querySelector<HTMLButtonElement>(`button[data-theme="${nextTheme}"]`)?.focus();
    this.#requestTheme(nextTheme);
  };

  render() {
    return html`
      <div
        class="switcher"
        part="switcher"
        role="radiogroup"
        aria-label=${this.ariaLabel}
        aria-disabled=${this.disabled ? "true" : "false"}
        @keydown=${this.#handleKeyDown}
      >
        ${this.#renderOption("dark", this.darkLabel)}
        ${this.#renderOption("light", this.lightLabel)}
      </div>
    `;
  }

  #renderOption(theme: McTheme, label: string) {
    const selected = this.theme === theme;

    return html`
      <button
        part="option ${theme}-option"
        type="button"
        role="radio"
        data-theme=${theme}
        aria-checked=${selected ? "true" : "false"}
        tabindex=${selected ? "0" : "-1"}
        ?disabled=${this.disabled}
        @click=${() => this.#requestTheme(theme)}
      >
        <span part="label ${theme}-label">${label}</span>
      </button>
    `;
  }
}

export function defineMcThemeSwitcher() {
  if (!customElements.get(MC_THEME_SWITCHER_TAG_NAME)) {
    customElements.define(MC_THEME_SWITCHER_TAG_NAME, McThemeSwitcher);
  }
}

export type McThemeSwitcherArgs = Partial<
  Pick<McThemeSwitcher, "theme" | "disabled" | "ariaLabel" | "darkLabel" | "lightLabel">
>;

declare global {
  interface HTMLElementTagNameMap {
    "mc-theme-switcher": McThemeSwitcher;
  }
}
