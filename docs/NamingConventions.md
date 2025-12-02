# UnityFX Naming Conventions

UnityFX relies heavily on **predictable naming** so that:

- Humans can quickly find things
- Agentic AI tools (Augment, Copilot Workspace, etc.) can navigate and refactor safely
- Patterns feel the same across all UnityFX-based apps

These conventions apply to the UnityFX framework itself and to apps built *with* UnityFX.

---

## 1. General Principles

1. **Be explicit over clever.**
   - `ConfigService` is better than `CfgSvc`.
2. **Name by responsibility, not implementation detail.**
   - `DataClient` (what it *is*), not `PnpWrapper` (how it’s implemented).
3. **Stick to the pattern.**
   - If a pattern says “Feature modules live under `features/<FeatureName>`,” don’t invent a different pattern in a single app.
4. **Favor singular nouns for services and modules.**
   - `LoggerService`, `ProgramTrackerFeature`, etc.

---

## 2. Files & Folders

### 2.1 UnityFX Core

```text
src/unityfx/
  core/
    services/
      LoggerService.ts
      ConfigService.ts
      FeatureService.ts
    UnityFxAppShell.tsx
  ui/
    FullscreenLayout.tsx
    TopToolbar.tsx
  data/
    DataClient.ts

