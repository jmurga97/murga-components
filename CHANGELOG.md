# Changelog

All notable changes to `@murga.ing/components` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-12

### Migration

- React integrations now require React 19 and React DOM 19. React 18 is no longer included in the
  supported peer dependency range.
- Import `@murga.ing/components/react` to add typed `mc-*` custom elements to
  `JSX.IntrinsicElements`.
- Replace the removed presentational React wrappers with their custom-element equivalents:
  `McBadge`, `McButton`, `McField`, `McInlineMessage`, `McOverviewPanel`, and `McStatusText` become
  `mc-badge`, `mc-button`, `mc-field`, `mc-inline-message`, `mc-overview-panel`, and
  `mc-status-text`.
- Continue using the exported React wrappers for components with custom events or property-rich
  controlled state, including `McInput`, `McSelect`, `McTagPicker`, and `McResourceTable`.

### Added

- Added typed JSX declarations for every public `mc-*` custom element.
- Added the controlled `mc-theme-switcher` component with keyboard navigation, accessible radio
  semantics, customizable labels, and the `mc-theme-change` event.
- Added light theme support through `data-mc-theme="light"` on an ancestor element while keeping
  the existing dark theme as the default.
- Exported the `McTheme` type and included `mc-theme-switcher` in the public registry and complete
  registration function.
- Added automatic dependency registration for composed media components.
- Expanded the playground into a complete interactive catalog covering public components,
  controlled React examples, events, focus behavior, and both color themes.
- Documented themes, font ownership, direct React custom-element usage, and typed event wrappers.

### Changed

- Simplified React wrappers to pass properties through React 19 custom-element support while
  retaining typed `onMc*` callbacks and forwarded refs.
- Improved controlled behavior across selectors, tag pickers, pagination, media browsing, resource
  editing, and navigation components.
- Centralized pointer-down-outside behavior for open popovers and selectors.
- Moved component-specific typography and state presentation into component styles, reducing
  reliance on shared style fragments.
- Refined the application shell, overview, relationship, resource, media, and navigation
  components for more predictable composition.

### Fixed

- Improved focus delegation for interactive shadow-DOM components.
- Prevented deferred focus-trap work from moving focus after the trap has been released.
- Added busy-state semantics to pending confirmation, search, table, and editor surfaces.
- Prevented duplicated selection events from nested media and thumbnail components.
- Improved disabled, selected, current, and pending visual states across interactive components.
- Corrected outside-click cleanup and close events for select and tag-picker popovers.
