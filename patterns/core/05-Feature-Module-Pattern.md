# Feature Module Pattern

The Feature Module Pattern defines how UnityFX groups related functionality into self-contained units that can be composed into a single app shell.

---

## Problems This Pattern Addresses

Without a module pattern:

- Apps become a tangle of unrelated components and services.
- It’s hard to see “what parts belong to what feature.”
- Reuse is limited because everything is coupled.

UnityFX uses **feature modules** to group:

- UI
- data services
- models
- configuration hooks

---

## Goals

1. Encapsulate a feature’s UI, data, and logic.
2. Make it easy to:
   - enable/disable features
   - reuse them in different UnityFX apps
3. Provide a predictable folder and registration pattern.

---

## Structure

```text
src/unityfx/features/
  <FeatureName>/
    components/
    services/
    models/
    index.ts

