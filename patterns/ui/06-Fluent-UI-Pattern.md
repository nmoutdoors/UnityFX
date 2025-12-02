
---

## `patterns/06-Fluent-UI-Pattern.md`

```md
# Fluent UI Pattern

The Fluent UI Pattern defines how UnityFX uses Fluent UI (and related libraries) consistently across apps.

---

## Problems This Pattern Addresses

Without a pattern:

- Each feature uses Fluent UI controls in slightly different ways.
- UX becomes inconsistent:
  - different button styles
  - different spacing
  - different panel layouts
- It’s harder to theme and adjust globally.

UnityFX provides conventions and shared building blocks for Fluent UI usage.

---

## Goals

1. Provide a **consistent visual language**:
   - buttons
   - toolbars
   - panels
   - dialogs
2. Make it easy to:
   - change look & feel over time
   - enforce consistent layout patterns
3. Support both:
   - UnityFX core components
   - feature-specific UIs

---

## Core Ideas

1. **Use Fluent UI for structural components**
   - Command bars / toolbars
   - Panels
   - Dialogs
   - Inputs (text fields, dropdowns, toggles)
2. **Wrap common patterns in UnityFX components**
   - e.g. `UnityFxPrimaryButton`, `UnityFxToolbar`, `UnityFxPanel`
3. **Avoid ad-hoc styling**
   - Prefer theme-aware styles.
   - Keep custom CSS limited and scoped.

---

## Layout & Toolbar

For toolbars (`TopToolbar` and others):

- Use Fluent UI’s command bar, stack, or toolbar components.
- Standardize:
  - app title on the left
  - main actions (save, refresh) near the center/right
  - global actions (fullscreen, config) on the far right

---

## Buttons

Guidelines:

- Primary actions → Fluent `PrimaryButton` (or equivalent).
- Secondary actions → `DefaultButton`.
- Destructive actions → use a distinct style and clear labels (e.g. “Delete item”).

UnityFX may introduce wrapper components later for even stronger consistency.

---

## Panels & Dialogs

For modals/panels:

- Prefer Fluent `Panel` and `Dialog` components.
- Use:
  - consistent widths/sizes (small, medium, large)
  - consistent close behavior
  - clear primary/secondary actions

Future UnityFX components may include:

- `UnityFxSidePanel`
- `UnityFxConfirmDialog`
- `UnityFxFormDialog`

---

## Forms & Inputs

Use Fluent UI form components wherever possible:

- `TextField`
- `Dropdown`
- `Checkbox`
- `Toggle`
- etc.

UnityFX form patterns (v0.1) are not yet defined, but the guiding principle is:

> “If Fluent UI already solves it well, use Fluent. UnityFX focuses on patterns around it.”

---

## Themes

UnityFX should:

- Respect the host SharePoint theme by default.
- Minimize hard-coded colors.
- Keep global overrides small and intentional.

Future pattern work can define theming more deeply, but early UnityFX aims not to fight Fabric/Fluent and the M365 theme system.

---

## Pattern Summary

The Fluent UI Pattern asks:

- “Can we build this with Fluent UI?”
- “If so, can we wrap it in a UnityFX convention so it feels consistent everywhere?”

UnityFX focuses on composition, layout, and patterns *around* Fluent UI, not reinventing basic controls.

