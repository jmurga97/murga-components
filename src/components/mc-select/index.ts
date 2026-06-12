import { html, nothing } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";

import componentStylesText from "./styles.css?inline";
import { syncAriaAttributes, syncAttribute } from "../../internal/attributes";
import { createComponentStyles } from "../../internal/component-styles";
import { dispatchMcEvent } from "../../internal/events";
import { PointerDownOutsideElement } from "../../internal/pointer";
import { findItemById } from "../../internal/selection";
import { murgaButtonStyles, murgaThemeStyles } from "../../internal/styles";

import type { McOption } from "../../internal/contracts";
import type { PropertyValues } from "lit";

const SELECT_LISTBOX_PREFIX = "mc-select-listbox";
let selectListboxCount = 0;

export const MC_SELECT_TAG_NAME = "mc-select";
export const TAG_NAME = MC_SELECT_TAG_NAME;

const componentStyles = createComponentStyles(componentStylesText);

export class McSelect extends PointerDownOutsideElement {
  static shadowRootOptions: ShadowRootInit = {
    ...PointerDownOutsideElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = [murgaThemeStyles, murgaButtonStyles, componentStyles];

  @property({ attribute: false })
  options: McOption[] = [];

  @property({ type: String, attribute: "selected-id" })
  selectedId: string | null = null;

  @property({ type: String, attribute: "input-id" })
  inputId?: string;

  @property({ type: String })
  name?: string;

  @property({ type: String })
  placeholder = "[SELECT]";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string | null = null;

  @query(".trigger")
  private readonly triggerElement?: HTMLButtonElement;

  @query(".panel")
  private readonly panelElement?: HTMLElement;

  readonly #listboxId = `${SELECT_LISTBOX_PREFIX}-${++selectListboxCount}`;
  #restoreTriggerFocusOnClose = false;

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.get("open") === true && !this.open) {
      this.#restoreTriggerFocusOnClose = this.matches(":focus-within");
    }
  }

  protected updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (this.triggerElement) {
      syncAriaAttributes(this, this.triggerElement);
      syncAttribute(this.triggerElement, "aria-controls", this.#listboxId);
      syncAttribute(this.triggerElement, "aria-expanded", this.open ? "true" : "false");
      syncAttribute(this.triggerElement, "aria-haspopup", "listbox");
      syncAttribute(this.triggerElement, "aria-label", this.ariaLabel);
    }

    if (!changedProperties.has("open")) {
      return;
    }

    if (this.open) {
      const selectedOption = this.panelElement?.querySelector<HTMLButtonElement>(
        '.option[aria-selected="true"]:not(:disabled)',
      );
      const firstOption =
        this.panelElement?.querySelector<HTMLButtonElement>(".option:not(:disabled)");
      (selectedOption ?? firstOption)?.focus();
      return;
    }

    if (changedProperties.get("open") === true && this.#restoreTriggerFocusOnClose) {
      this.triggerElement?.focus();
    }

    this.#restoreTriggerFocusOnClose = false;
  }

  protected handlePointerDownOutside() {
    dispatchMcEvent(this, "mc-open-change", { open: false });
  }

  #handleTriggerClick = () => {
    dispatchMcEvent(this, "mc-open-change", { open: !this.open });
  };

  #handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dispatchMcEvent(this, "mc-open-change", { open: true });
    }
  };

  #handlePanelKeyDown = (event: KeyboardEvent) => {
    const optionElements = Array.from(
      this.panelElement?.querySelectorAll<HTMLButtonElement>(".option:not(:disabled)") ?? [],
    );

    if (event.key === "Escape") {
      event.preventDefault();
      dispatchMcEvent(this, "mc-open-change", { open: false });
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const activeElement = this.shadowRoot?.activeElement ?? null;
    const currentIndex = optionElements.findIndex((element) => element === activeElement);
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      currentIndex === -1
        ? 0
        : Math.max(0, Math.min(optionElements.length - 1, currentIndex + delta));
    optionElements[nextIndex]?.focus();
  };

  #handleOptionClick(option: McOption) {
    dispatchMcEvent(this, "mc-change", { selectedId: option.id });
    dispatchMcEvent(this, "mc-open-change", { open: false });
  }

  render() {
    const selectedOption = findItemById(this.options, this.selectedId);

    return html`
      <div class="field" part="field">
        <input
          type="hidden"
          id=${ifDefined(this.inputId)}
          name=${ifDefined(this.name)}
          value=${ifDefined(this.selectedId ?? undefined)}
        />
        <button
          class="trigger"
          part="trigger"
          type="button"
          ?disabled=${this.disabled}
          aria-controls=${this.#listboxId}
          aria-expanded=${this.open ? "true" : "false"}
          aria-haspopup="listbox"
          @click=${this.#handleTriggerClick}
          @keydown=${this.#handleTriggerKeyDown}
        >
          <span class=${selectedOption ? "value" : "value placeholder"}
            >${selectedOption?.label ?? this.placeholder}</span
          >
          <span>${this.open ? "[OPEN]" : "[CLOSED]"}</span>
        </button>

        ${this.open
          ? html`
              <div
                id=${this.#listboxId}
                class="panel"
                part="panel"
                role="listbox"
                aria-label=${this.ariaLabel ?? this.placeholder}
                @keydown=${this.#handlePanelKeyDown}
              >
                ${repeat(
                  this.options,
                  (option) => option.id,
                  (option) => html`
                    <button
                      class="option"
                      part="option"
                      type="button"
                      role="option"
                      aria-selected=${this.selectedId === option.id ? "true" : "false"}
                      ?disabled=${option.disabled}
                      @click=${() => this.#handleOptionClick(option)}
                    >
                      <span>${option.label}</span>
                      ${option.description
                        ? html`<span class="description">${option.description}</span>`
                        : nothing}
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

export function defineMcSelect() {
  if (!customElements.get(MC_SELECT_TAG_NAME)) {
    customElements.define(MC_SELECT_TAG_NAME, McSelect);
  }
}

export type McSelectArgs = Partial<
  Pick<
    McSelect,
    | "options"
    | "selectedId"
    | "inputId"
    | "name"
    | "placeholder"
    | "disabled"
    | "open"
    | "ariaLabel"
  >
>;

declare global {
  interface HTMLElementTagNameMap {
    "mc-select": McSelect;
  }
}
