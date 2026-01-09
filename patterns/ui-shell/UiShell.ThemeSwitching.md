# UI - Theme Switching Pattern

**Category:** ui-shell
**Status:** draft
**UI Framework:** Fluent UI (`@fluentui/react`, `@fluentui/theme-samples`)

---

## 1. Intent

Provide a pattern for **runtime theme switching** in Fluent UI applications:

- Light/Dark mode toggle
- Theme context for app-wide state
- Theme-aware SCSS that responds to theme changes
- Integration with Fluent UI's `ThemeProvider`

---

## 2. When to Use

Use this pattern when:

- Your app needs to support **light and dark modes**
- You want users to **switch themes at runtime** (not just compile-time)
- You're building a **dashboard or tool** that should respect user preference
- You want consistent theming across all Fluent UI components

---

## 3. Dependencies

```bash
npm install @fluentui/theme-samples --save
```

This package provides ready-to-use themes:
- `DefaultTheme` - Standard Fluent UI light theme
- `DarkTheme` - Standard Fluent UI dark theme

---

## 4. Implementation

### 4.1 Theme Context

Create a React context to manage theme state.

> **CRITICAL**: Fluent UI's `ThemeProvider` does NOT automatically set CSS custom properties.
> You must explicitly set them on the wrapper div for SCSS to use `var(--bodyBackground)`, etc.
> This is especially important for `position: fixed` elements (like fullscreen layouts) which
> break CSS `inherit` chains.

```tsx
// context/ThemeContext.tsx
import * as React from 'react';
import { createContext, useContext, useState, ReactNode, CSSProperties } from 'react';
import { ThemeProvider, ITheme } from '@fluentui/react';
import { DefaultTheme, DarkTheme } from '@fluentui/theme-samples';

export type ThemeMode = 'light' | 'dark';

interface IThemeContext {
  themeMode: ThemeMode;
  theme: ITheme;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightTheme: ITheme = DefaultTheme as ITheme;
const darkTheme: ITheme = DarkTheme as ITheme;

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

interface IThemeContextProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

/**
 * Build CSS custom properties from the current theme.
 * These enable SCSS to use var(--bodyBackground), var(--neutralLight), etc.
 */
const buildCssVariables = (theme: ITheme): Record<string, string> => {
  return {
    // Semantic colors
    '--bodyBackground': theme.semanticColors.bodyBackground,
    '--bodyText': theme.semanticColors.bodyText,
    // Palette colors for cards, borders, accents
    '--neutralLighter': theme.palette.neutralLighter,
    '--neutralLight': theme.palette.neutralLight,
    '--neutralPrimary': theme.palette.neutralPrimary,
    '--neutralSecondary': theme.palette.neutralSecondary,
    '--themePrimary': theme.palette.themePrimary,
    '--themeDarkAlt': theme.palette.themeDarkAlt,
    '--white': theme.palette.white,
    '--black': theme.palette.black
  };
};

export const ThemeContextProvider: React.FC<IThemeContextProviderProps> = ({
  children,
  defaultMode = 'light'
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultMode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const cssVariables = buildCssVariables(theme);

  const value: IThemeContext = { themeMode, theme, setThemeMode };

  // Combine base styles with CSS custom properties
  const wrapperStyle: CSSProperties = {
    backgroundColor: theme.semanticColors.bodyBackground,
    color: theme.semanticColors.bodyText,
    minHeight: '100%',
    ...cssVariables as CSSProperties
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <div style={wrapperStyle}>
          {children}
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
```

### 4.2 Theme Dropdown in Toolbar

Add a theme switcher to the CommandBar:

```tsx
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';

const { themeMode, setThemeMode } = useTheme();

const themeOptions: IDropdownOption[] = [
  { key: 'light', text: 'Simple (light)' },
  { key: 'dark', text: 'Simple (dark)' }
];

const handleThemeChange = (
  _event: React.FormEvent<HTMLDivElement>,
  option?: IDropdownOption
): void => {
  if (option) {
    setThemeMode(option.key as ThemeMode);
  }
};

// In CommandBar farItems:
{
  key: 'theme',
  onRender: () => (
    <Dropdown
      options={themeOptions}
      selectedKey={themeMode}
      onChange={handleThemeChange}
      styles={{ dropdown: { minWidth: 120 } }}
    />
  )
}
```

### 4.3 Wrap Your App

```tsx
// ThemePicker.tsx (main component)
import { ThemeContextProvider } from './context/ThemeContext';

public render(): React.ReactElement {
  return (
    <ThemeContextProvider defaultMode="light">
      <FullscreenLayout title="My App">
        <DashboardLayout />
      </FullscreenLayout>
    </ThemeContextProvider>
  );
}
```

---

## 5. Theme-Aware SCSS Rules

**Critical**: SCSS variables like `$ms-color-white` are compile-time constants. They do NOT respond to runtime theme changes.

### ❌ Avoid: Hardcoded SCSS Colors

```scss
// These values are baked in at build time - won't change with theme!
.card {
  background-color: $ms-color-white;        // Always white
  border: 1px solid $ms-color-neutralLight; // Always light gray
  color: $ms-color-neutralPrimary;          // Always dark text
}
```

### ✅ Use: Inherit from ThemeProvider

```scss
// Inherits background/color from parent ThemeProvider wrapper
.dashboardLayout {
  background-color: inherit;
  color: inherit;
}

.contentArea {
  background-color: inherit;
}
```

### ✅ Use: CSS Variables

```scss
// CSS variables are set by the theme and update at runtime
.card {
  background-color: var(--neutralLighter);
  border: 1px solid var(--neutralLight);
  color: var(--neutralPrimary);
}

.badge {
  background-color: var(--themePrimary);
  color: var(--white);
}
```

---

## 6. CSS Variable Reference

| Variable | Purpose | Light | Dark |
|----------|---------|-------|------|
| `--bodyBackground` | Page/app background | #ffffff | #1f1f1f |
| `--bodyText` | Primary text | #323130 | #f3f2f1 |
| `--neutralLighter` | Card backgrounds | #f3f2f1 | #2d2d2d |
| `--neutralLight` | Borders, dividers | #edebe9 | #3d3d3d |
| `--neutralPrimary` | Primary text | #323130 | #f3f2f1 |
| `--neutralSecondary` | Secondary/muted text | #605e5c | #d2d0ce |
| `--themePrimary` | Accent/brand color | #0078d4 | #2899f5 |

---

## 7. Checklist for Theme-Aware Components

When creating new components or updating existing ones:

- [ ] Remove `$ms-color-*` SCSS variables for backgrounds, text, borders
- [ ] Use `inherit` for containers that should match parent background
- [ ] Use `var(--neutralLighter)` for cards/elevated surfaces
- [ ] Use `var(--neutralLight)` for borders
- [ ] Use `var(--themePrimary)` for accent elements
- [ ] Test in both light and dark modes

---

## 8. Notes for AI Assistants

- **Do:**
  - Wrap the app root in `ThemeContextProvider`
  - Use `useTheme()` hook to access current theme state
  - Use `inherit` or CSS variables in SCSS
  - Include theme dropdown in CommandBar `farItems`
  - **Set CSS custom properties explicitly** in ThemeContextProvider (see Section 4.1)
  - Include `buildCssVariables()` helper to bridge Fluent UI theme → CSS variables

- **Don't:**
  - Use `$ms-color-white`, `$ms-color-neutralLight`, etc. for dynamic elements
  - Create manual dark theme CSS overrides (let ThemeProvider handle it)
  - Forget to test both light and dark modes
  - **Assume Fluent UI ThemeProvider sets CSS variables** - it does NOT, you must set them manually

---

## 9. Custom Theme Creation

### 9.1 Using the Fluent UI Theme Designer

The Fluent UI v8 Theme Designer generates palette code directly compatible with SPFx:

**URL:** https://fluentuipr.z22.web.core.windows.net/heads/master/theming-designer/index.html

The designer produces code like:

```typescript
const myTheme = createTheme({
  palette: {
    themePrimary: '#d41900',
    themeLighterAlt: '#fdf4f3',
    // ... full palette
  }
});
```

This is **Fluent UI v8** format - directly usable with `@fluentui/react`.

### 9.2 Theme Registry Pattern

Instead of simple light/dark toggle, use a registry for multiple themes:

```typescript
// context/ThemeContext.tsx

// 1. Define theme options as a union type
export type ThemeOption =
  | 'light'
  | 'dark'
  | 'ceruleanLight'
  | 'ceruleanDark'
  | 'crimsonDark';  // Add new themes here

// 2. Map theme keys to ITheme objects
const themeRegistry: Record<ThemeOption, ITheme> = {
  light: DefaultTheme as ITheme,
  dark: DarkTheme as ITheme,
  ceruleanLight: ceruleanLightTheme,
  ceruleanDark: ceruleanDarkTheme,
  crimsonDark: crimsonDarkTheme  // Add new themes here
};

// 3. Define display names for UI dropdown
export const themeDisplayNames: Record<ThemeOption, string> = {
  light: 'Simple (Light)',
  dark: 'Simple (Dark)',
  ceruleanLight: 'Cerulean (Light)',
  ceruleanDark: 'Cerulean (Dark)',
  crimsonDark: 'Crimson (Dark)'  // Add new themes here
};

// 4. Get available themes dynamically
const availableThemes = Object.keys(themeRegistry) as ThemeOption[];
```

### 9.3 Branded Toolbar Integration

Some themes benefit from a primary-colored toolbar (like Bootswatch navbars):

```typescript
// Themes that should use branded (primary-colored) toolbar
export const brandedToolbarThemes: ThemeOption[] = [
  'ceruleanLight',
  'ceruleanDark',
  'crimsonDark'  // Add branded themes here
];

// In context provider
const hasBrandedToolbar = brandedToolbarThemes.indexOf(currentTheme) >= 0;

// Expose via context
const contextValue = {
  currentTheme,
  theme,
  setTheme,
  availableThemes,
  hasBrandedToolbar  // Components can check this flag
};
```

See `UiShell.FullscreenLite.md` Section 9 for toolbar styling guidelines when using branded themes.

### 9.4 Adding a New Theme - Checklist

To add a new theme (e.g., from Theme Designer):

**Step 1: Create theme file** (`themes/myTheme.ts`)

```typescript
/**
 * My Custom Theme
 * Generated from Fluent UI v8 Theme Designer
 */
import { createTheme, ITheme } from '@fluentui/react';

export const myCustomTheme: ITheme = createTheme({
  palette: {
    // Paste palette from Theme Designer
    themePrimary: '#...',
    // ...
  },
  isInverted: false,  // true for dark themes
  semanticColors: {
    // Optional: customize semantic colors
    bodyBackground: '#...',
    bodyText: '#...',
    // ...
  }
});
```

**Step 2: Export from barrel** (`themes/index.ts`)

```typescript
export { myCustomTheme } from './myTheme';
```

**Step 3: Register in ThemeContext** (`context/ThemeContext.tsx`)

```typescript
// 1. Import
import { myCustomTheme } from '../themes';

// 2. Add to ThemeOption type
export type ThemeOption = '...' | 'myCustom';

// 3. Add to themeRegistry
const themeRegistry: Record<ThemeOption, ITheme> = {
  // ...existing themes
  myCustom: myCustomTheme
};

// 4. Add display name
export const themeDisplayNames: Record<ThemeOption, string> = {
  // ...existing names
  myCustom: 'My Custom Theme'
};

// 5. If branded toolbar, add to array
export const brandedToolbarThemes: ThemeOption[] = [
  // ...existing
  'myCustom'  // Only if this theme should have colored toolbar
];
```

**That's it - 3 files, and the new theme appears in the dropdown!**

---

## 10. Related Patterns

- **Fullscreen Shell Lite** (`UiShell.FullscreenLite.md`) - Integrates theme switching in TopToolbar, includes Section 9 on toolbar styling
- **Fluent UI Pattern** (`06-Fluent-UI-Pattern.md`) - General Fluent UI usage and theming reference

