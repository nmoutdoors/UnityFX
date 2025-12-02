# Fullscreen Layout Pattern (v0.2)

The Fullscreen Layout Pattern defines how UnityFX apps take over the page visually in a clean, stable, and flicker-free way.

---

## Problem

Default SPFx fullscreen behavior can:

- Enter fullscreen slowly
- Flash underlying SharePoint headers and scrollbars
- Feel unstable, especially with complex apps

Large apps (e.g., dashboards with timelines, datasheets, modals) highlight these issues the most.

---

## Goals

1. **Immediate fullscreen visual**  
   - The user should see a clean canvas instantly, not a partially loaded page.

2. **Top toolbar + two icons first**  
   - Fullscreen toggle
   - Property pane/config toggle
   - App title / branding

3. **App UI later**  
   - Heavy components (timelines, grids, etc.) can mount after fullscreen is established.

4. **No “chrome flicker”**  
   - Avoid exposing the underlying SharePoint shell during transitions.

5. **Reusable across apps**  
   - BigCal, ProgramTracker, and all other UnityFX apps should share the same fullscreen behavior.

---

## Structure

### Components

- `FullscreenLayout` (React component)
  - Provides the main layout (toolbar + content region)
  - Responsible for managing fullscreen state and body scroll lock
- `TopToolbar`
  - Houses:
    - title
    - fullscreen toggle
    - property pane/config toggle
  - Optional slots for feature-specific actions

### CSS Bootstrap

A CSS class (e.g. `.unityfx-fullscreen-bootstrap`) is applied to the container before React mounts, ensuring:

- fixed position
- white background
- full-viewport coverage
- high z-index

This avoids flicker and intermediate page states.

---

## Behavior

1. **Initialization**
   - SPFx web part identifies its container.
   - Applies `.unityfx-fullscreen-bootstrap` if configured.
   - Renders `UnityFxAppShell` → `FullscreenLayout`.

2. **Toolbar-first**
   - `FullscreenLayout` renders:
     - `TopToolbar`
     - a placeholder content area (which may start blank or show a loading shimmer)

3. **Content Mounting**
   - After the layout is stable, the feature modules render into the content area.
   - Heavy components can be progressively loaded.

4. **Toggling Fullscreen**
   - The fullscreen toggle button:
     - can switch between fullscreen and “inline” modes
     - ensures proper cleanup of scroll locks and CSS classes

---

## Pattern Usage

- Used as the outermost layout for UnityFX apps.
- Combined with:
  - Installer Pattern (for setup discovery)
  - Feature Module Pattern (for plugging in specific experiences)
  - Fluent UI Pattern (for toolbar and controls)

---

## Future Enhancements

- Configurable themes (colors, branding in the toolbar)
- Support for multiple regions (main, side panel, bottom status bar)
- Advanced transitions/animations
- Optional “chrome hider” pattern integration for more aggressive site chrome control

