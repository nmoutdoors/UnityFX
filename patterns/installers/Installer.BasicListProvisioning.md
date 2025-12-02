# Installer – Basic List Provisioning

**Category:** installer  
**Status:** draft  

---

## 1. Intent

Use this pattern when you need to provision one or more SharePoint lists in a **predictable, idempotent** way as part of a UnityFX-based solution.

The goal is to have a single, repeatable installer that can be safely re-run without breaking existing data or configuration.

---

## 2. When to Use

Apply this pattern when:

- A feature or app depends on **one or more SharePoint lists** with known structure.
- You want a **single “install” entry point** instead of ad hoc list creation.
- You want to run the installer **multiple times** (e.g., dev, test, prod) with consistent results.

Do **not** use this pattern for:

- Highly destructive “nuke and rebuild” routines.
- Ad hoc one-off troubleshooting scripts.

---

## 3. Inputs (conceptual)

Human-level inputs:

- **Site / Web** where the lists live.
- **List definitions**, each specifying:
  - Internal name
  - Display name
  - Description
  - Template type (e.g., Generic List)
  - Additional settings (e.g., versioning, content approval)
- **Field definitions** per list:
  - Internal name
  - Display name
  - Field type
  - Required / optional
  - Other key settings (choices, lookup target, etc.)
- **View definitions** per list:
  - Name
  - Fields in the view
  - Default view flag
  - Sort / filter basics (if needed)

Technical details (TypeScript, PnPjs, etc.) are handled by concrete implementations, not this pattern doc.

---

## 4. Outputs

After applying this pattern:

- Target lists exist with:
  - Expected fields
  - Expected default views
  - Expected basic settings (versioning, content types if applicable)
- Installer can be run again without:
  - Breaking user data
  - Recreating lists unnecessarily
  - Causing avoidable errors

---

## 5. Behavior & Rules

**Idempotency**

- If a list does not exist → **create** it.
- If a list exists → **update** key configuration:
  - Add missing fields.
  - Add/adjust views (non-destructive where possible).
- Do **not**:
  - Drop columns that might contain data, unless explicitly requested.
  - Force-delete and recreate lists unless the pattern explicitly declares “destructive mode”.

**Error Handling**

- Provide clear logs or messages:
  - What list is being processed.
  - What changes are applied (e.g., “Added field X”, “View Y already exists”).
- Prefer **fail-fast** if configuration is invalid rather than silently skipping.

**Config-Driven**

- Favor configuration objects (e.g., arrays of list definitions) over hardcoded procedural steps.
- Make it easy for future agents/humans to add/remove lists via config rather than editing logic.

---

## 6. Implementation Checklist (for agents)

When generating an installer that follows this pattern:

1. **Define configuration**
   - Create a structured config for:
     - Lists
     - Fields
     - Views
   - Keep the config in a **single place** (e.g., `install.config.ts`).

2. **Create an installer entry point**
   - A top-level function like `runInstall()` or `provisionListsAsync()`.

3. **Loop through lists**
   - For each list:
     - Ensure existence.
     - Apply field and view configuration.

4. **Log meaningful progress**
   - Log at least:
     - Starting installer
     - Per-list operations
     - Summary (success/failure)

5. **Avoid destructive defaults**
   - Only remove/rename columns or views if explicitly allowed by the user or config.

---

## 7. Notes for AI Assistants

- Before writing code:
  - Ask which lists need provisioning and capture them as **configuration data**.
- Use UnityFX conventions for:
  - File names (e.g., `Installer.[Feature].ts` or similar local convention).
  - Function naming (`runInstall`, `ensureLists`, etc.).
- If the project already has an installer:
  - Align with that structure instead of inventing a new one.
