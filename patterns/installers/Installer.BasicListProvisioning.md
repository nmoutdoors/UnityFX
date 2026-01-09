# Installer - Basic List Provisioning

**Category:** installer
**Status:** stable

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
  - Template type (e.g., Generic List = 100, Events = 106)
  - Additional settings (e.g., versioning, content approval)
- **Field definitions** per list:
  - Internal name (see Section 6.4 for encoding rules)
  - Display name
  - Field type
  - Required / optional
  - Other key settings (choices, lookup target, etc.)
- **View definitions** per list (optional):
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

## 6. Three-Tier Validation System

The installer uses **progressive validation** to check configuration status:

### 6.1 Validation Levels

1. **Existence Check** - Does the list exist?
2. **Template Check** - Is it the correct list type (e.g., Events = 106)?
3. **Field Check** - Are all required fields present?

### 6.2 Validation Result Interface

```typescript
export interface IListValidationResult {
  isValid: boolean;           // All checks passed
  listExists: boolean;        // List found in site
  missingFields: string[];    // Fields that need to be added
  errorMessage?: string;      // Human-readable error
  canCreate?: boolean;        // Safe to offer "Create" button
}
```

### 6.3 Required vs Optional Lists

Distinguish between:

| Type | Behavior | UI Treatment |
|------|----------|--------------|
| **Required** | Blocks functionality | ❌ Error state, must fix |
| **Optional** | Enables additional features | ⚠️ Warning only, graceful degradation |

### 6.4 SharePoint Internal Name Encoding

> ⚠️ **CRITICAL**: SharePoint encodes special characters in internal field names.

When a field is created with a display name containing spaces or special characters, SharePoint URL-encodes them in the internal name:

| Character | Encoding |
|-----------|----------|
| Space | `_x0020_` |
| Ampersand (&) | `_x0026_` |
| Apostrophe (') | `_x0027_` |

**Example:**
```typescript
// Field created with display name "Unrated Time"
// SharePoint stores internal name as:
{ internalName: 'Unrated_x0020_Time', displayName: 'Unrated Time', type: 'Choice' }
```

**Best Practice:** When validating against existing lists, check the actual internal names in SharePoint (visible in column URL: `&Field=InternalName`) and use those exact values in your config.

---

## 7. UI Integration: Property Pane First

> ⚠️ **CRITICAL**: The installer UI belongs in the **Property Pane**, NOT on a toolbar button.
>
> Rationale: List provisioning happens **at most once** per site. A toolbar button wastes space and confuses users after setup is complete.

### 7.1 Property Pane Elements

```
┌─────────────────────────────────────────────────┐
│ SharePoint List Name                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ Promos                                      │ │
│ └─────────────────────────────────────────────┘ │
│ ✅ List validated - contains all required fields│
│                                                 │
│ ─── OR ───                                      │
│                                                 │
│ ❌ List does not exist                          │
│ ┌─────────────────────────────────────────────┐ │
│ │        Create Promos List                   │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ─── OR ───                                      │
│                                                 │
│ ⚠️ List exists but missing fields: Rank, Unit  │
│ ┌─────────────────────────────────────────────┐ │
│ │        Add Missing Fields                   │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 7.2 Dynamic Description Pattern

The list name field description updates based on validation state:

```typescript
private _getListValidationDescription(): string {
  if (!this._validationResult) {
    return 'Validating...';
  }
  if (this._validationResult.isValid) {
    return '✅ List validated successfully - contains all required fields';
  }
  if (!this._validationResult.listExists) {
    return '❌ List does not exist - use the Create button below';
  }
  if (this._validationResult.missingFields.length > 0) {
    return `⚠️ List exists but missing fields: ${this._validationResult.missingFields.join(', ')}`;
  }
  return this._validationResult.errorMessage || 'Unknown validation state';
}
```

### 7.3 Conditional Create Button

Only show the Create/Fix button when needed:

```typescript
// In getPropertyPaneConfiguration()
const groups: IPropertyPaneGroup[] = [];

// Always show list name field
fields.push(
  PropertyPaneTextField('listName', {
    label: 'SharePoint List Name',
    description: this._getListValidationDescription()
  })
);

// Conditionally show Create button
if (this._validationResult?.canCreate && !this._validationResult.isValid) {
  fields.push(
    PropertyPaneButton('createList', {
      text: this._isCreating ? 'Creating...' : 'Create List',
      buttonType: PropertyPaneButtonType.Primary,
      onClick: () => this._handleCreateList(),
      disabled: this._isCreating
    })
  );
}
```

### 7.4 Spinner/Status Feedback

> ⚠️ **IMPORTANT**: Property pane cannot render Fluent UI Spinner components. Use a text label with emoji instead.

Show a status indicator during async operations:

```typescript
// Show working status when creating
if (this._isCreating) {
  fields.push(
    PropertyPaneLabel('creatingStatus', {
      text: '⏳ Working... please wait'
    })
  );
}

// Then show the (disabled) button
fields.push(
  PropertyPaneButton('createList', {
    text: this._isCreating ? 'Creating List...' : 'Create List',
    disabled: this._isCreating,
    // ...
  })
);
```

This provides visual feedback that the operation is in progress, especially for operations that may take 30+ seconds.

### 7.5 Validation Lifecycle

> ⚠️ **CRITICAL**: Run validation on `onInit()`, not just when the property pane opens.

If validation only runs in `onPropertyPaneConfigurationStart()`, the `isConfigured` flag will be `false` on initial render—causing the runtime warning to show even when the list is fully configured.

```typescript
protected async onInit(): Promise<void> {
  // Initialize PnPjs
  this._sp = spfi().using(SPFx(this.context));
  this._installerService = new InstallerService(this._sp);

  // Validate on load so isConfigured is accurate from the start
  await this._runValidation();
}

protected async onPropertyPaneConfigurationStart(): Promise<void> {
  // Also validate when property pane opens (for fresh status)
  await this._runValidation();
}
```

---

## 8. Runtime Warning System

When configuration is incomplete, show a **MessageBar** in the web part content area.

### 8.1 Warning MessageBar (Text Only)

> ⚠️ **NOTE**: Do NOT add action buttons to the MessageBar.
>
> **Rationale:**
> - In workbench, user must exit fullscreen first to access property pane
> - On a page, user must switch to edit mode first
> - Users with SP admin experience know how to access web part properties
> - The warning text is sufficient guidance

```tsx
{!isConfigured && (
  <MessageBar
    messageBarType={MessageBarType.warning}
    isMultiline={false}
  >
    Configuration required. The list needs to be created or is missing required fields.
    Edit the page and open web part properties to configure.
  </MessageBar>
)}
```

### 8.2 Admin-Only Warnings

For optional lists, show warnings only to users who can fix them:

```tsx
{this.state.configIssues.length > 0 && this.props.isUserAdmin && (
  <MessageBar messageBarType={MessageBarType.warning} isMultiline>
    <strong>Configuration Issues ({this.state.configIssues.length}):</strong>
    <ul>
      {this.state.configIssues.map((issue, i) => <li key={i}>{issue}</li>)}
    </ul>
  </MessageBar>
)}
```

---

## 9. Implementation Checklist (for agents)

When generating an installer that follows this pattern:

### 9.1 Define Configuration (Single Source of Truth)

- [ ] Create `installer/install.types.ts` with validation interfaces
- [ ] Create `installer/install.config.ts` with list/field specs
- [ ] Keep all field definitions in **one place**

### 9.2 Create Validation Service

- [ ] Create `installer/install.service.ts` with:
  - `validateList(listName): Promise<IListValidationResult>`
  - `createList(listSpec): Promise<IListCreationResult>`
  - `addMissingFields(listName, fields): Promise<void>`
- [ ] Implement progressive validation (existence → template → fields)

### 9.3 Wire to Property Pane

- [ ] Add `listName` property to web part properties
- [ ] Run validation in `onInit()` **AND** `onPropertyPaneConfigurationStart()`
- [ ] Show dynamic description with validation status
- [ ] Show conditional Create/Fix button when `canCreate && !isValid`
- [ ] Refresh property pane after creation: `this.context.propertyPane.refresh()`

> ⚠️ **CRITICAL**: Validation must run on `onInit()`, not just when the property pane opens.
> Otherwise `isConfigured` will be `false` on initial render, showing a spurious warning even when the list is fully configured.

### 9.4 Add Runtime Warning

- [ ] Pass `isConfigured` state to component
- [ ] Show text-only MessageBar when not configured (no action button)
- [ ] Include instructions: "Edit the page and open web part properties to configure"

### 9.5 Handle State Correctly

- [ ] Store `_validationResult` on web part instance
- [ ] Store `_isCreating` flag to disable button during creation
- [ ] Show "⏳ Working..." label during async operations
- [ ] Re-validate after list name changes (debounced)
- [ ] Re-validate after Create button clicked

---

## 10. File Structure

```
src/webparts/[name]/
├── installer/
│   ├── install.types.ts      # Interfaces
│   ├── install.config.ts     # List/field specs (single source of truth)
│   └── install.service.ts    # Validation & creation engine
├── components/
│   └── [Name].tsx            # Shows MessageBar when !isConfigured
└── [Name]WebPart.ts          # Property pane integration
```

---

## 11. Notes for AI Assistants

- Before writing code:
  - Ask which lists need provisioning and capture them as **configuration data**.
- **Property Pane is the UI** - never put installer buttons on toolbars.
- Use UnityFX conventions for:
  - File names (e.g., `install.config.ts`, `install.service.ts`).
  - Function naming (`validateList`, `createList`, etc.).
- If the project already has an installer:
  - Align with that structure instead of inventing a new one.
- Always implement:
  - Progressive validation (existence → template → fields)
  - Dynamic property pane descriptions
  - Runtime MessageBar for unconfigured state
