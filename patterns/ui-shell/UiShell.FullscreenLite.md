# UI – Fullscreen Shell (Lite)

**Category:** ui-shell  
**Status:** draft  

---

## 1. Intent

Provide a **lightweight** pattern for a fullscreen app shell:

- Minimal chrome (top toolbar)
- Fullscreen toggle
- Property panel or secondary panel toggle

The goal is to **reduce flicker** and provide a consistent fullscreen experience without over-engineering the implementation.

---

## 2. When to Use

Use this pattern when:

- Building dashboards or tools that benefit from a **maximized workspace**.
- You need a **fullscreen toggle** inside a web part or app.
- You want a consistent layout that other UnityFX patterns (dashboards, forms) can plug into.

---

## 3. Inputs (conceptual)

- **Main content**:
  - The primary area where dashboards, grids, or editors render.
- **Toolbar contents**:
  - Title
  - Optional extra actions (e.g., refresh, help).
- **Panel contents** (optional):
  - Properties, filters, or settings shown in a side panel.

---

## 4. Outputs

- A **shell layout** with:
  - A top toolbar containing:
    - App/web part title
    - Fullscreen toggle
    - Property panel toggle (if applicable)
  - A main content area that:
    - Expands to fill the available viewport when fullscreen is active.
  - Optional side panel that can be opened/closed.

---

## 5. Behavior & Rules

**Startup & Flicker Reduction**

- On initial load:
  - Show a simple, minimal container quickly:
    - Blank background + top toolbar skeleton is acceptable.
  - Avoid complex animations or heavy layout thrash on first paint.

**Fullscreen Toggle**

- Provide a clear affordance (e.g., icon button) to:
  - Enter fullscreen mode: content area expands, unnecessary chrome hidden.
  - Exit fullscreen mode: layout returns to its embedded state.
- Respect host environment constraints (e.g., SPFx web part container).

**Property Panel / Side Panel**

- Toggle panel from the toolbar.
- Panel should slide in or appear without reflowing the entire app.
- Content of the panel is defined by other patterns or local design.

---

## 6. Implementation Checklist (for agents)

When implementing a fullscreen shell:

1. **Create a shell component**
   - Accept props like:
     - `title`
     - `children` (main content)
     - `renderPanel?` (optional panel render function)
   - Maintain internal state for:
     - `isFullscreen`
     - `isPanelOpen`

2. **Layout structure**
   - Top toolbar (title + actions).
   - Main content area that can expand.
   - Optional side panel container.

3. **Classnames / CSS**
   - Use CSS classes or utility classes to:
     - Toggle fullscreen layout.
     - Hide/show panels.
   - Keep styles simple and composable.

4. **Integration**
   - Wrap dashboards or workspaces in this shell rather than embedding fullscreen logic into each one.
   - Keep fullscreen behavior centralized.

---

## 7. Notes for AI Assistants

- Do:
  - Reuse this shell for any UnityFX-style “big app” experience.
  - Keep fullscreen, panel toggling, and top chrome concerns inside the shell.

- Don’t:
  - Duplicate fullscreen logic in each dashboard or component.
  - Over-implement advanced features (e.g., complex transitions) unless requested.
