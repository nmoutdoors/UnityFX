# Services, Logging, and Config Pattern

The Services, Logging, and Config Pattern defines how UnityFX apps:

- Centralize cross-cutting concerns (logging, configuration, feature flags)
- Avoid scattering environment logic throughout components
- Present a consistent way for feature modules to access core services

---

## Problems This Pattern Addresses

Without a pattern:

- Each app invents its own logging strategy.
- Components grab config from arbitrary sources (web part props, lists, localStorage).
- There is no single place to understand “what this app depends on.”

UnityFX solves this with **core services** and a standard way to consume them.

---

## Goals

1. Provide a **single logging API** for the entire app.
2. Provide a **single config API** for:
   - web part properties
   - config lists
   - feature flags
3. Make services easily accessible from:
   - React components
   - feature modules
4. Make it easy to:
   - swap implementations (e.g., console logging vs remote logging)
   - test components (mocking services)

---

## Core Services

For v0.1, UnityFX defines at least:

- `LoggerService`
- `ConfigService`
- `FeatureService` (registration & feature flags)

### LoggerService

**Responsibilities:**

- Provide methods like:
  - `info(message: string, context?: object)`
  - `warn(message: string, context?: object)`
  - `error(message: string, context?: object, error?: Error)`
- Optionally integrate with:
  - console
  - SharePoint logs
  - custom diagnostic lists (future)
- Keep a consistent shape for log entries.

### ConfigService

**Responsibilities:**

- Aggregate configuration values from:
  - SPFx web part properties
  - configuration lists
  - environment variables (build-time)
- Provide strongly-typed getters, e.g.:
  - `getFeatureFlag("bigCalTimelineEnabled")`
  - `getString("dataListName")`
  - `getNumber("maxItems")`

### FeatureService

**Responsibilities:**

- Track available features and their state (enabled/disabled).
- Allow feature modules to register themselves.
- Provide an API to query feature availability.

---

## Implementation Shape

In `src/unityfx/core/services/`:

- `LoggerService.ts` → `ILoggerService`, `LoggerService`
- `ConfigService.ts` → `IConfigService`, `ConfigService`
- `FeatureService.ts` → `IFeatureService`, `FeatureService`

In `UnityFxAppShell.tsx`:

- Services are instantiated once.
- Provided via React context or a custom UnityFX context provider.

Components and feature modules should **not** construct their own services; they should **consume** them.

---

## Usage in Components

Example (conceptual):

```ts
const { logger, config, features } = useUnityFxServices();

logger.info("BigCal view mounted", { feature: "BigCal" });

if (features.isEnabled("BigCalTimeline")) {
  // render timeline
}

const listName = config.getString("bigCalDataListName");

