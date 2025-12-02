# Installer Pattern

The Installer Pattern defines how UnityFX applications:

- Validate required SharePoint resources (lists, fields, views, config)
- Create or fix those resources when needed
- Communicate status clearly to administrators
- Stay **idempotent** (safe to run multiple times)

---

## Problem

Many SPFx solutions require supporting lists/config before they can function:

- config lists
- data lists
- taxonomy fields
- views
- permissions

Without a pattern, each app:

- invents its own installer UI
- handles validation inconsistently
- makes different decisions on “what if something already exists?”

UnityFX solves this with a **standard installer model**.

---

## Goals

- One way to define required resources (installer spec).
- One way to validate and create them.
- One way to present results to an admin.
- Idempotent operations (no double-creation or corruption).
- Clear separation between:
  - **spec** (what we need)
  - **engine** (how we validate/create)
  - **UI** (how admins see & trigger the process)

---

## Core Concepts

### 1. Installer Spec

A declarative definition of requirements, e.g.:

- lists and their fields
- views
- permissions
- behavior when something already exists

Spec location (for v0.1):

- May be defined in TypeScript (interface + object)
- In the future, may also be definable in JSON/YAML

The spec is the **single source of truth** for provisioning needs.

### 2. Validation

Validation answers:

- Does the list exist?
- Does it have the required fields?
- Are fields the right type?
- Are required views present?
- Are permission expectations met?

Result: a collection of structured validation results that the UI can render.

### 3. Creation / Fixup

Based on validation output, the installer may:

- create lists
- add missing fields
- adjust views
- configure permissions (where safe/appropriate)

Again: idempotency is key.

---

## Responsibilities

The **Installer Pattern** doc (this file) defines:

- **WHAT**: What installers do
- **WHEN**: When to run them (e.g., admin-only, from a toolbar, after initial install)
- **HOW**: At a conceptual level

Separate implementation docs and templates will:

- Show concrete SPFx code examples
- Introduce reusable installer services and components
- Provide a generic `UnityFxInstaller` React component

---

## UI Integration

Typical UnityFX UX:

- Admin opens the app.
- A banner or status area indicates whether setup is complete.
- A button “Validate & Install” opens the installer panel.
- Validation runs and shows:
  - ✅ OK items
  - ⚠️ Warning items
  - ❌ Error items
- Admin can choose to create/fix resources.

The exact look & feel belongs to the **Feature Module Pattern** and future UI specs, but the behavior comes from this Installer Pattern.

---

## Future Direction

Later UnityFX versions will likely add:

- Multiple installer “profiles” (minimal vs full)
- More flexible spec formats (YAML/JSON)
- Shared diagnostic views across apps
- A standardized logging pattern specific to installer runs

