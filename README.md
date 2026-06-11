# `@murga.ing/components`

Accessible web components built with Lit, with typed JSX tags and optional React wrappers for
custom events.

## Install

```bash
bun add @murga.ing/components
```

`lit` is a peer dependency. React 19 and React DOM 19 are optional peers required only when
importing `@murga.ing/components/react`.

## Register components

Register the complete library once:

```ts
import { registerMurgaComponents } from "@murga.ing/components/register";

registerMurgaComponents();
```

Or register only the component you use:

```ts
import { defineMcButton } from "@murga.ing/components/components/mc-button";

defineMcButton();
```

The root entrypoint has no registration side effects:

```ts
import { McButton, registerMurgaComponents } from "@murga.ing/components";
```

## Themes

Components use the dark Nothing-inspired palette by default. The application can switch the
complete component tree to the light palette by setting `data-mc-theme` on an ancestor:

```html
<main data-mc-theme="light">
  <mc-button>Save</mc-button>
</main>
```

Theme selection, persistence and operating-system preference handling belong to the application.
`mc-theme-switcher` is a controlled selector: pass the current `theme` and handle
`mc-theme-change` to update the ancestor attribute.

```ts
const switcher = document.querySelector("mc-theme-switcher");

switcher?.addEventListener("mc-theme-change", (event) => {
  document.documentElement.dataset.mcTheme = event.detail.theme;
  switcher.theme = event.detail.theme;
});
```

The library references Space Grotesk for UI text, Space Mono for labels and data, and Doto for
display moments, but does not load fonts as an import side effect. Applications should load these
Google Fonts or provide self-hosted equivalents.

## React

Import the React entrypoint to add all `mc-*` tags to `JSX.IntrinsicElements`. Presentational
components can then be used directly without a wrapper:

```tsx
import { registerMurgaComponents } from "@murga.ing/components/register";
import "@murga.ing/components/react";

registerMurgaComponents();

export function SaveButton() {
  return <mc-button variant="primary">Save</mc-button>;
}
```

React 19 can consume the controlled theme selector directly without a wrapper:

```tsx
<mc-theme-switcher theme={theme} onmc-theme-change={(event) => setTheme(event.detail.theme)} />
```

Components with custom events keep React wrappers that expose typed `onMc*` callbacks:

```tsx
import { useState } from "react";

import { registerMurgaComponents } from "@murga.ing/components/register";
import { McTagPicker } from "@murga.ing/components/react";

registerMurgaComponents();

const tags = [{ id: "editorial", label: "Editorial" }];

export function TagPicker() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <McTagPicker
      options={tags}
      selectedIds={selectedIds}
      onMcChange={(event) => setSelectedIds(event.detail.selectedIds)}
    />
  );
}
```

## Development

```bash
bun install
bun run dev
```

The Vite playground is intended for manual component inspection.

```bash
bun run lint
bun run check
bun run build
bun run package:check
```

## Design principles

- Components own presentation and accessible interaction, not data fetching or routing.
- Public properties remain generic and independent from application domain models.
- Styling is encapsulated in shadow DOM and exposed through CSS custom properties and parts.
- Custom events use the `mc-` prefix and include the expected next state in `detail`.

## License

MIT
