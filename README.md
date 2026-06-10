# `@murga.ing/components`

Accessible web components built with Lit, with optional React wrappers.

## Install

```bash
bun add @murga.ing/components
```

`lit` is a peer dependency. React and React DOM are optional peers required only
when importing `@murga.ing/components/react`.

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

## React

```tsx
import { registerMurgaComponents } from "@murga.ing/components/register";
import { McButton } from "@murga.ing/components/react";

registerMurgaComponents();

export function SaveButton() {
  return <McButton variant="primary">Save</McButton>;
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
