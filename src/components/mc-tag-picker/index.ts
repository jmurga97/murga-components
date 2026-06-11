import { html, LitElement, nothing } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";

import componentStylesText from "./styles.css?inline";
import { createComponentStyles } from "../../internal/component-styles";
import { dispatchMcEvent } from "../../internal/events";
import { normalizeSelectedIds, toggleSelectedId } from "../../internal/selection";
import {
  murgaButtonStyles,
  murgaLabelStyles,
  murgaPanelStyles,
  murgaThemeStyles,
} from "../../internal/styles";

import type { McOption } from "../../internal/contracts";
import type { PropertyValues } from "lit";

const TAG_PICKER_PANEL_PREFIX = "mc-tag-picker-panel";
let tagPickerPanelCount = 0;

export const MC_TAG_PICKER_TAG_NAME = "mc-tag-picker";
export const TAG_NAME = MC_TAG_PICKER_TAG_NAME;

const componentStyles = createComponentStyles(componentStylesText);

export class McTagPicker extends LitElement {
  static shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = [
    murgaThemeStyles,
    murgaButtonStyles,
    murgaPanelStyles,
    murgaLabelStyles,
    componentStyles,
  ];

  @property({ attribute: false })
  options: McOption[] = [];

  @property({ attribute: false })
  selectedIds: string[] = [];

  @property({ type: String, attribute: "input-id" })
  inputId?: string;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  open = false;

  @query(".trigger")
  private readonly triggerElement?: HTMLButtonElement;

  @query(".panel")
  private readonly panelElement?: HTMLElement;

  readonly #panelId = `${TAG_PICKER_PANEL_PREFIX}-${++tagPickerPanelCount}`;

  protected updated(changedProperties: PropertyValues<this>) {
    if (!changedProperties.has("open")) {
      return;
    }

    if (this.open) {
      const selectedOption = this.panelElement?.querySelector<HTMLInputElement>(
        "input:checked:not(:disabled)",
      );
      const firstOption =
        this.panelElement?.querySelector<HTMLInputElement>("input:not(:disabled)");
      (selectedOption ?? firstOption)?.focus();
      return;
    }

    if (changedProperties.get("open") === true) {
      this.triggerElement?.focus();
    }
  }

  #handleTriggerClick = () => {
    dispatchMcEvent(this, "mc-open-change", { open: !this.open });
  };

  #handleOptionToggle(optionId: string) {
    const nextSelectedIds = toggleSelectedId(normalizeSelectedIds(this.selectedIds), optionId);
    dispatchMcEvent(this, "mc-change", { selectedIds: nextSelectedIds });
  }

  #handlePanelKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    dispatchMcEvent(this, "mc-open-change", { open: false });
  };

  render() {
    const selectedIds = normalizeSelectedIds(this.selectedIds);
    const selectedIdSet = new Set(selectedIds);

    return html`
      <div part="field">
        <input id=${ifDefined(this.inputId)} type="hidden" value=${selectedIds.join(",")} />
        <button
          class="trigger"
          part="trigger"
          type="button"
          ?disabled=${this.disabled}
          aria-controls=${this.#panelId}
          aria-expanded=${this.open ? "true" : "false"}
          @click=${this.#handleTriggerClick}
        >
          <span
            >${selectedIds.length > 0 ? `[${selectedIds.length} SELECTED]` : "[SELECT TAGS]"}</span
          >
          <span>${this.open ? "[OPEN]" : "[CLOSED]"}</span>
        </button>
        ${this.open
          ? html`
              <div
                id=${this.#panelId}
                class="panel"
                part="panel"
                @keydown=${this.#handlePanelKeyDown}
              >
                ${repeat(
                  this.options,
                  (option) => option.id,
                  (option) => html`
                    <label class="option" part="option">
                      <input
                        type="checkbox"
                        value=${option.id}
                        .checked=${selectedIdSet.has(option.id)}
                        ?disabled=${this.disabled || Boolean(option.disabled)}
                        @change=${() => this.#handleOptionToggle(option.id)}
                      />
                      <span>${option.label}</span>
                    </label>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

export function defineMcTagPicker() {
  if (!customElements.get(MC_TAG_PICKER_TAG_NAME)) {
    customElements.define(MC_TAG_PICKER_TAG_NAME, McTagPicker);
  }
}

export type McTagPickerArgs = Partial<
  Pick<McTagPicker, "options" | "selectedIds" | "inputId" | "disabled" | "open">
>;

declare global {
  interface HTMLElementTagNameMap {
    "mc-tag-picker": McTagPicker;
  }
}
