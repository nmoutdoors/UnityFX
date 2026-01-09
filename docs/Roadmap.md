
---

## `docs/Roadmap.md`

```md
# UnityFX Roadmap

UnityFX is currently in an early, definition-heavy phase (v0.1). The roadmap below is intentionally high-level and focused on **sequencing** rather than hard dates.

We will refine this over time as patterns stabilize across real applications.

---

## Phase 0 - Foundation (v0.1)

**Status: In Progress**

Focus:

- Define core **principles** and **architecture**
- Capture key patterns:
  - Installer
  - Fullscreen layout (v0.2)
  - Services (logging, config)
  - Data access
  - Feature modules
  - Fluent UI conventions
- Create initial **UnityFXShell-Spfx** template
- Establish **naming conventions** and repo structure
- Document basic security posture at pattern level

Deliverables:

- `/docs` and `/patterns` largely drafted
- `templates/UnityFXShell-Spfx` compiling and running as a baseline SPFx project
- `UnityFxAppShell`, `FullscreenLayout`, `TopToolbar`, `LoggerService`, `ConfigService`, `DataClient` stubs in place

---

## Phase 1 - UnityFX Base & First Real Client (v0.2)

**Focus: Make UnityFX usable for real work.**

Key goals:

1. **UnityFX.Base Project**
   - Turn `UnityFXShell-Spfx` into a clean base template.
   - Use it instead of generic SPFx HelloWorld for new apps.
   - Add basic installer UI and wiring.

2. **Fullscreen Pattern Implementation (v0.2)**
   - CSS-first bootstrap class
   - Toolbar-first rendering
   - Deferred content mount
   - No chrome flicker in real scenarios

3. **BigCal / ProgramTracker Pilot**
   - Integrate UnityFX into one existing app (likely BigCal).
   - Replace legacy fullscreen with UnityFX fullscreen.
   - Optionally begin adopting data/installer patterns.

4. **Security Baseline**
   - Document UnityFX security posture.
   - Introduce security-conscious ESLint rules (or at least define the plan).
   - Establish safe rendering & data access helpers.

---

## Phase 2 - Feature Modules & Data Layer Expansion (v0.3)

**Focus: Modular features and richer data services.**

Key goals:

1. **Feature Module Pattern Implementation**
   - `src/unityfx/features/<FeatureName>` structure.
   - Standard module registration and lifecycle.
   - Support for multiple modules in a single app shell.

2. **Data Layer Extensions**
   - List-specific services (e.g., `ListDataService`).
   - Config list service.
   - Diagnostics / health check endpoints.

3. **Installer Pattern v1.0**
   - Shared installer engine.
   - Reusable installer React component.
   - Clear, standardized admin UX for validation & fixes.

4. **Logging & Diagnostics**
   - Centralized logging funnel.
   - Optional diagnostics webpart/template.

---

## Phase 3 - Fluent UI & UX Polish (v0.4)

**Focus: Cohesive, opinionated UX.**

Key goals:

1. **Fluent UI Pattern Implementation**
   - Standard button styles & layouts.
   - Standard panels, dialogs, and command bars.
   - Reusable UX patterns for common UnityFX tasks.

2. **Toolbar Enhancements**
   - Feature actions embedded in `TopToolbar`.
   - Context-aware actions and status indicators.

3. **Visual Consistency**
   - Shared themes.
   - Standard spacing, typography, density defaults.

---

## Phase 4 - Tooling & CLI (v0.5+)

**Focus: Make UnityFX easier to adopt and scale.**

Key goals:

1. **`create-unityfx-app` Script / CLI**
   - Wrap copying of `UnityFXShell-Spfx` into a simple command.
   - Automate renaming of solution/webpart/app names.

2. **Dev Tools Integration**
   - Example configs for:
     - Augment AI
     - (Later) Copilot Workspace

3. **Security Tooling**
   - Scripts for dependency audit.
   - Basic static analysis integration (e.g., ESLint security rules).

---

## Phase 5 - Learning Experience & Public Story (1.x)

**Focus: Teaching & broader adoption.**

Key goals:

1. **UnityFX Documentation Site**
   - Static site (e.g. Docusaurus or similar).
   - Hosted docs with navigation and search.

2. **UnityFX Playground**
   - A repo with runnable UnityFX examples.
   - “Try this pattern” exercises.

3. **Blog / Articles**
   - Stories behind the patterns.
   - Real-world lessons from UnityFX apps.

4. **Open Source Prep**
   - Licensing decision.
   - Contribution guidelines.
   - Public repo hygiene & stability.

---

## Beyond

Longer-term ideas (subject to change):

- Pattern-specific packages (e.g., `@unityfx/timeline`, `@unityfx/datasheet`)
- Integration with additional agentic AI tools
- Optional “low-code” layer for installer specs and configuration
- A “UnityFX Learn” interactive tutorial (inspired by KnockoutJS and w3schools-style “try it” experiences)

