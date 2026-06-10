# AGENTS.md - Murga Components

## Context

Public Lit component library distributed as `@murga/components`.

- Runtime and package manager: Bun
- Build: Vite library mode
- Language: strict TypeScript
- Optional integration: React 18.2 and 19

## Commands

```bash
bun install
bun run dev
bun run lint
bun run check
bun run build
bun run package:check
```

## Conventions

- Use only Bun for dependency and script management.
- Keep components independent from application data, routing, and persistence.
- Components must not register themselves as an import side effect.
- Export a `defineMc*()` function from each component.
- Keep styles static and use CSS custom properties and parts for customization.
- Preserve semantic HTML, keyboard navigation, focus restoration, and ARIA forwarding.
- Do not add tests, Storybook, Vitest, or Playwright unless explicitly requested.
