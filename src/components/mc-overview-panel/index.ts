import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import componentStylesText from "./styles.css?inline";
import { createComponentStyles } from "../../internal/component-styles";
import { murgaSurfaceStyles, murgaThemeStyles } from "../../internal/styles";

import type { McInlineStatus, McStatItem } from "../../internal/contracts";

export const MC_OVERVIEW_PANEL_TAG_NAME = "mc-overview-panel";
export const TAG_NAME = MC_OVERVIEW_PANEL_TAG_NAME;

const componentStyles = createComponentStyles(componentStylesText);

export class McOverviewPanel extends LitElement {
  static styles = [murgaThemeStyles, murgaSurfaceStyles, componentStyles];

  @property({ type: String })
  title = "";

  @property({ type: String })
  description?: string;

  @property({ attribute: false })
  stats: McStatItem[] = [];

  @property({ attribute: false })
  status: McInlineStatus | null = null;

  render() {
    return html`
      <section class="root" part="root">
        <header class="header" part="header">
          <slot name="actions"></slot>
          <div class="title">${this.title}</div>
          ${this.description ? html`<div class="description">${this.description}</div>` : nothing}
          ${this.status ? html`<div class="status">${this.status.label}</div>` : nothing}
        </header>

        ${this.stats.length > 0
          ? html`
              <div class="stats" part="stats">
                ${repeat(
                  this.stats,
                  (item) => item.id,
                  (item) => html`
                    <article class="stat">
                      <div>${item.label}</div>
                      <div class="stat-value" data-status=${item.status ?? nothing}>
                        ${item.value}
                      </div>
                    </article>
                  `,
                )}
              </div>
            `
          : nothing}

        <div part="body">
          <slot name="content"></slot>
        </div>
      </section>
    `;
  }
}

export function defineMcOverviewPanel() {
  if (!customElements.get(MC_OVERVIEW_PANEL_TAG_NAME)) {
    customElements.define(MC_OVERVIEW_PANEL_TAG_NAME, McOverviewPanel);
  }
}

export type McOverviewPanelArgs = Partial<
  Pick<McOverviewPanel, "title" | "description" | "stats" | "status">
>;

declare global {
  interface HTMLElementTagNameMap {
    "mc-overview-panel": McOverviewPanel;
  }
}
