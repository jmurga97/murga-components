import { LitElement } from "lit";

import type { PropertyValues } from "lit";

export abstract class PointerDownOutsideElement extends LitElement {
  abstract open: boolean;

  #releasePointerDownListener: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.#syncPointerDownListener();
  }

  disconnectedCallback() {
    this.#releasePointerDownListener?.();
    this.#releasePointerDownListener = null;
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("open")) {
      this.#syncPointerDownListener();
    }
  }

  protected abstract handlePointerDownOutside(): void;

  #syncPointerDownListener() {
    this.#releasePointerDownListener?.();
    this.#releasePointerDownListener = null;

    if (!this.open) {
      return;
    }

    const ownerDocument = this.ownerDocument;
    const handlePointerDown = (event: PointerEvent) => {
      if (!event.composedPath().includes(this)) {
        this.handlePointerDownOutside();
      }
    };

    ownerDocument.addEventListener("pointerdown", handlePointerDown, true);
    this.#releasePointerDownListener = () => {
      ownerDocument.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }
}
