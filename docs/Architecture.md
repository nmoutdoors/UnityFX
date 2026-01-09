# UnityFX Architecture

UnityFX is organized around a few key concepts:

- **Core services** - logging, config, feature registry
- **UI framework** - fullscreen layout, toolbars, common components
- **Data layer** - data client + data services
- **Feature modules** - self-contained features (dashboards, installers, tools)
- **SPFx wrappers** - UnityFX apps exposed as SPFx web parts

---

## Layers

### 1. SPFx Layer

This is the “outer shell” that SharePoint understands:

- `UnityFxShellWebPart.ts` - SPFx web part host
- SPFx manifests, bundling, and packaging configs

The web part’s main job is to:

- bootstrap UnityFX
- pass SPFx context into UnityFX
- render `<UnityFxAppShell />`

---

### 2. UnityFX Core (`src/unityfx/core`)

This is where the high-level framework lives.

- `UnityFxAppShell.tsx` - top-level React component for UnityFX apps
- `services/LoggerService.ts` - shared logging API
- `services/ConfigService.ts` - configuration loading (from properties, lists, etc.)
- `services/FeatureService.ts` - feature registry and activation

Core responsibilities:

- Provide a consistent environment for features
- Expose React context/hooks for logging, config, and features
- Orchestrate layout (through UI layer)

---

### 3. UnityFX UI (`src/unityfx/ui`)

- `FullscreenLayout.tsx` - implements the fullscreen pattern
- `TopToolbar.tsx` - toolbar for app title + key actions (fullscreen toggle, config, etc.)

This layer is responsible for:

- A clean, flicker-free fullscreen experience
- A consistent toolbar with UnityFX-standard controls
- Housing feature modules inside a stable chrome

See `docs/FullscreenPattern.md` and `patterns/02-Fullscreen-Layout-Pattern.md` for more.

---

### 4. UnityFX Data (`src/unityfx/data`)

- `DataClient.ts` - unified data access wrapper (PnP/REST/Graph/etc.)

Responsibilities:

- Provide a single entry point for all data access
- Enforce security and consistency (no random `fetch` in components)
- Make mocking/testability easier

Future extensions:

- `ListService`
- `ConfigListService`
- `DiagnosticsService`
- etc.

---

### 5. Feature Modules

In future templates, each feature will live under something like:

```text
src/unityfx/features/<FeatureName>/
  ├─ components/
  ├─ services/
  ├─ models/
  └─ index.ts

