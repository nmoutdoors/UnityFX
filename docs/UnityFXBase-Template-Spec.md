# UnityFX Base Template Specification

## Purpose

The UnityFX Base template is the **simplest possible UnityFX application**:

- A fullscreen SPFx webpart
- A UnityFX toolbar at the top
- A blank content area ready for feature modules
- A working property pane toggle

Its job is to replace the current workflow:

> Yeoman → HelloWorld webpart → “Augment, strip all boilerplate”  

with:

> “Create UnityFX base app” → *start building features immediately*.

This template is the **default starting point** for all UnityFX-based projects.

---

## Core Requirements

### 1. Fullscreen Behavior

The UnityFX Base app MUST:

- Render as a fullscreen app surface with:
  - No visible SharePoint chrome while active (no flicker if possible)
  - A consistent neutral background
- Use the UnityFX fullscreen pattern:
  - `FullscreenLayout` as outer layout
  - Top toolbar rendered first
  - Content area rendered below the toolbar

Initial implementation can be **basic**, but it should:

- Wrap the whole app in a root `<div>` with a UnityFX fullscreen class (e.g. `unityfx-fullscreen-root`)
- Apply any necessary CSS to:
  - Fill available space
  - Avoid scrollbars where not needed
- Be easy to evolve into the full “CSS-first blank screen” behavior.

### 2. Toolbar

The template MUST include:

- `TopToolbar` at the top of the layout
- A title (from config)
- Two buttons:
  - Fullscreen toggle (stub is okay for v0.1)
  - Property pane toggle (must be wired up)

**Toolbar behaviors:**

- Keyboard accessible (Tab, Enter/Space)
- Buttons have `aria-label` and `title` attributes
- Live inside a visually distinct bar (even if minimally styled)

### 3. Property Pane Integration

The Base template MUST:

- Accept an `onTogglePropertyPane` callback from the SPFx webpart
- Pass this handler into `UnityFxAppShell` → `FullscreenLayout` → `TopToolbar`
- Call `this.context.propertyPane.open()` / `close()` behind the scenes

For v0.1, a simple *toggle* behavior is acceptable:

- If property pane is open → close it
- If property pane is closed → open it

### 4. Blank App Surface

The content area in the template MUST:

- Be intentionally simple:
  - No business logic
  - No data access
  - No routing
- Provide a clear placeholder region where feature modules will later be mounted.

Example placeholder:

- A centered message:
  - “UnityFX app surface goes here.”
- Or a neutral empty state with a short note like:
  - “Add your first UnityFX feature module here.”

### 5. Service Stubs

The Base template SHOULD include **stubs** for core services:

- `LoggerService`
- `ConfigService`
- `FeatureService`
- `DataClient`

These do not need full implementations yet, but:

- They should have interfaces defined.
- They should be *ready* to be wired into React context/provider(s) inside `UnityFxAppShell` later.
- They should be easy for Augment to locate and extend.

For v0.1, UnityFxAppShell may not yet provide these via context, but the **file locations and names MUST be stable**.

---

## File & Folder Structure

The UnityFX Base template lives under:

```text
templates/UnityFXShell-Spfx/
