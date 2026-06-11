import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import componentStylesText from "./styles.css?inline";
import { createComponentStyles } from "../../internal/component-styles";
import { dispatchMcEvent } from "../../internal/events";
import { murgaButtonStyles, murgaMetaStyles, murgaThemeStyles } from "../../internal/styles";

export const MC_PAGINATION_TAG_NAME = "mc-pagination";
export const TAG_NAME = MC_PAGINATION_TAG_NAME;

const componentStyles = createComponentStyles(componentStylesText);

export class McPagination extends LitElement {
  static styles = [murgaThemeStyles, murgaButtonStyles, murgaMetaStyles, componentStyles];

  @property({ type: Number })
  page = 1;

  @property({ type: Number, attribute: "page-size" })
  pageSize = 20;

  @property({ type: Number })
  total = 0;

  @property({ type: Boolean, attribute: "has-more" })
  hasMore = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  #handlePageChange(nextPage: number) {
    dispatchMcEvent(this, "mc-page-change", { page: nextPage });
  }

  render() {
    const totalPages =
      this.total > 0 && this.pageSize > 0 ? Math.ceil(this.total / this.pageSize) : 0;
    const disablePrevious = this.disabled || this.page <= 1;
    const disableNext =
      this.disabled ||
      (!this.hasMore && totalPages > 0 && this.page >= totalPages) ||
      (!this.hasMore && totalPages === 0);

    return html`
      <nav class="root" part="root" aria-label="Pagination">
        <button
          part="prev-button"
          type="button"
          aria-label="Go to previous page"
          ?disabled=${disablePrevious}
          @click=${() => this.#handlePageChange(Math.max(1, this.page - 1))}
        >
          [PREV]
        </button>
        <span class="meta" part="meta">
          ${totalPages > 0 ? `[PAGE ${this.page} / ${totalPages}]` : `[PAGE ${this.page}]`}
        </span>
        <button
          part="next-button"
          type="button"
          aria-label="Go to next page"
          ?disabled=${disableNext}
          @click=${() => this.#handlePageChange(this.page + 1)}
        >
          [NEXT]
        </button>
      </nav>
    `;
  }
}

export function defineMcPagination() {
  if (!customElements.get(MC_PAGINATION_TAG_NAME)) {
    customElements.define(MC_PAGINATION_TAG_NAME, McPagination);
  }
}

export type McPaginationArgs = Partial<
  Pick<McPagination, "page" | "pageSize" | "total" | "hasMore" | "disabled">
>;

declare global {
  interface HTMLElementTagNameMap {
    "mc-pagination": McPagination;
  }
}
