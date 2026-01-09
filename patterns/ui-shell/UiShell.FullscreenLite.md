# UI - Fullscreen Shell (Lite)

**Category:** ui-shell
**Status:** draft
**UI Framework:** Fluent UI (`@fluentui/react`)

---

## 1. Intent

Provide a **lightweight** pattern for a fullscreen app shell:

- Minimal chrome (top toolbar using Fluent UI `CommandBar`)
- Fullscreen toggle
- Property panel or secondary panel toggle
- Theme switching support

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
- **Toolbar contents** (via Fluent UI `CommandBar`):
  - Title
  - Primary actions (New, Edit, Delete, Refresh)
  - Far actions (Theme switcher, Search, Fullscreen toggle, Settings)
  - Overflow actions (Export, Print, Share)
- **Panel contents** (optional):
  - Properties, filters, or settings shown in a side panel.

---

## 4. Outputs

- A **shell layout** with:
  - A top toolbar using Fluent UI `CommandBar` containing:
    - **items**: App title, primary actions (New, Edit, Delete, Refresh)
    - **farItems**: Theme dropdown, SearchBox, Fullscreen toggle, Settings button
    - **overflowItems**: Secondary actions (Export, Print, Share)
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

0. **Strip Yeoman boilerplate**
   - Remove or replace the default Yeoman-generated component content (welcome image, user greeting, SPFx learning links)
   - The initial content area should be **empty or minimal** - just the shell + toolbar
   - Feature content (dashboards, grids, forms) gets added as a separate step
   - This ensures a clean canvas that matches the "toolbar-first" intent of the pattern

1. **Create a shell component**
   - Accept props like:
     - `title`
     - `children` (main content)
     - `startInFullscreen` (default: `true`)
     - `onOpenPropertyPane` (callback to open SPFx property pane)
     - `renderPanel?` (optional panel render function)
     - Command callbacks: `onNewClick`, `onEditClick`, `onDeleteClick`, `onRefreshClick`
     - `onSearch` (search callback)
   - Maintain internal state for:
     - `isFullscreen`
     - `isPanelOpen`

2. **TopToolbar with Fluent UI CommandBar**

   Use the `CommandBar` component from `@fluentui/react`:

   ```tsx
   import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
   import { SearchBox } from '@fluentui/react/lib/SearchBox';
   import { Dropdown } from '@fluentui/react/lib/Dropdown';

   const items: ICommandBarItemProps[] = [
     {
       key: 'title',
       onRender: () => <Text variant="large" className={styles.title}>{title}</Text>
     },
     { key: 'new', text: 'New', iconProps: { iconName: 'Add' }, onClick: onNewClick },
     { key: 'edit', text: 'Edit', iconProps: { iconName: 'Edit' }, onClick: onEditClick },
     { key: 'delete', text: 'Delete', iconProps: { iconName: 'Delete' }, onClick: onDeleteClick },
     { key: 'refresh', text: 'Refresh', iconProps: { iconName: 'Refresh' }, onClick: onRefreshClick }
   ];

   const farItems: ICommandBarItemProps[] = [
     {
       key: 'theme',
       onRender: () => (
         <Dropdown
           options={[
             { key: 'light', text: 'Simple (light)' },
             { key: 'dark', text: 'Simple (dark)' }
           ]}
           selectedKey={currentTheme}
           onChange={onThemeChange}
         />
       )
     },
     {
       key: 'search',
       onRender: () => <SearchBox placeholder="Search..." onSearch={onSearch} />
     },
     {
       key: 'fullscreen',
       iconOnly: true,
       iconProps: { iconName: isFullscreen ? 'BackToWindow' : 'FullScreen' },
       onClick: toggleFullscreen
     },
     {
       key: 'settings',
       iconOnly: true,
       iconProps: { iconName: 'Settings' },
       onClick: onOpenPropertyPane
     }
   ];

   const overflowItems: ICommandBarItemProps[] = [
     { key: 'export', text: 'Export', iconProps: { iconName: 'Export' } },
     { key: 'print', text: 'Print', iconProps: { iconName: 'Print' } },
     { key: 'share', text: 'Share', iconProps: { iconName: 'Share' } }
   ];

   <CommandBar items={items} farItems={farItems} overflowItems={overflowItems} />
   ```

3. **Web part properties**
   - Add `startInFullscreen: boolean` property (default: `true`)
   - Add property pane toggle under "Display Settings" group
   - Initialize `isFullscreen` state from prop value

4. **Classnames / CSS**
   - Use CSS classes or utility classes to:
     - Toggle fullscreen layout.
     - Hide/show panels.
   - Keep styles simple and composable.
   - **Use `inherit` or CSS variables for theme-aware colors** (see Theme Switching pattern)

5. **Integration**
   - Wrap dashboards or workspaces in this shell rather than embedding fullscreen logic into each one.
   - Keep fullscreen behavior centralized.
   - Pass `this.context.propertyPane.open()` as callback for settings button.
   - Wrap with `ThemeContextProvider` for theme switching support.

---

## 7. Notes for AI Assistants

- Do:
  - Reuse this shell for any UnityFX-style “big app” experience.
  - Keep fullscreen, panel toggling, and top chrome concerns inside the shell.

- Don’t:
  - Duplicate fullscreen logic in each dashboard or component.
  - Over-implement advanced features (e.g., complex transitions) unless requested.

---

## 8. SPFx / Implementation Notes

SPFx uses **ES5 as the TypeScript target** for browser compatibility. When implementing this pattern:

| Avoid | Use Instead |
|-------|-------------|
| `str.includes('x')` | `str.indexOf('x') >= 0` |
| `Object.entries(obj)` | `Object.keys(obj)` + for-loop |
| `arr.find(...)` | `arr.filter(...)[0]` or for-loop |

**Type Casting:**
- When setting dynamic CSS properties, cast through `unknown`:
  ```typescript
  (el.style as unknown as Record<string, string>)[prop] = value;
  ```

**Explicit Types:**
- Always annotate variables in loops to avoid implicit `any`:
  ```typescript
  const keys = Object.keys(styles);
  for (let i = 0; i < keys.length; i++) {
    const prop: string = keys[i];
    const value: string = styles[prop];
  }
  ```

---

## 9. Toolbar Styling Guidelines

These guidelines ensure consistent, polished toolbar appearance across implementations.

### 9.1 CommandBar Layout Rules

| Rule | Rationale |
|------|-----------|
| **No left/right padding** | Use `padding: 0` on `.ms-CommandBar` - prevents unwanted white gaps at edges |
| **Height: 48px** | Taller than default (44px) to accommodate search box with visual breathing room |
| **Edge-to-edge** | Toolbar should extend fully across the container width |

### 9.2 Search Box Styling (SharePoint-style)

The search box should appear to "float" inside the toolbar with clear visual separation:

```scss
$toolbar-height: 48px;

.searchBoxContainer {
  width: 200px;
  display: flex;
  align-items: center;
  height: $toolbar-height;
  padding: 8px 0;              // Creates space above/below
  box-sizing: border-box;

  :global {
    .ms-SearchBox {
      border-radius: 4px;
      height: 32px;            // Fixed height for consistent look
    }
  }
}
```

**Important:** You MUST wrap `<SearchBox>` in a container `<div>` with the style class:

```tsx
// ❌ WRONG - SearchBox doesn't forward className to wrapper
<SearchBox className={styles.searchBox} ... />

// ✅ CORRECT - Wrap in div for styling control
<div className={styles.searchBoxContainer}>
  <SearchBox ... />
</div>
```

### 9.3 Branded Toolbar (Themed Background)

When using a primary-colored toolbar (like Bootswatch navbars):

| Element | Styling |
|---------|---------|
| **Background** | `var(--themePrimary)` or `theme.palette.themePrimary` |
| **All text/icons** | White (`#ffffff`) for contrast |
| **Hover states** | `var(--themeDarkAlt)` for subtle feedback |
| **Search box** | Semi-transparent white background (`rgba(255,255,255,0.2)`), no border |
| **Search focus** | Background becomes opaque white, text becomes dark |

### 9.4 Overflow Button Styling

The overflow "..." button requires explicit targeting in branded mode:

```scss
.toolbarBranded {
  :global {
    .ms-CommandBar {
      // Target both selectors for complete coverage
      .ms-CommandBar-overflowButton,
      .ms-OverflowSet-overflowButton .ms-Button {
        background-color: transparent;
        color: #ffffff;

        .ms-Button-icon {
          color: #ffffff;
        }

        &:hover {
          background-color: var(--themeDarkAlt);
        }
      }
    }
  }
}
```

### 9.5 Cohesive Branding Pattern

When using a branded toolbar, any adjacent UI elements (nav toggles, hamburger menus) should also use the theme primary color to create a unified top "stripe":

```tsx
// In ThemeContext, expose a flag for branded toolbar
const hasBrandedToolbar = brandedToolbarThemes.indexOf(currentTheme) >= 0;

// Other components can consume this to match styling
const { hasBrandedToolbar, theme } = useTheme();
const backgroundColor = hasBrandedToolbar ? theme.palette.themePrimary : 'inherit';
```

### 9.6 Implementation Checklist for Toolbar Styling

- [ ] Set `padding: 0` on CommandBar
- [ ] Set toolbar height to 48px
- [ ] Wrap SearchBox in container div with style class
- [ ] Add 8px vertical padding to search container
- [ ] Set SearchBox height to 32px with border-radius 4px
- [ ] For branded mode: white text/icons, themeDarkAlt hover
- [ ] Target overflow button with explicit selectors
- [ ] Expose `hasBrandedToolbar` flag for cohesive branding
