# Form – Modal Item Editor

**Category:** form  
**Status:** draft  

---

## 1. Intent

Provide a consistent UX pattern for **creating and editing** items in a modal dialog.

The goal is to:

- Keep dashboards clean and focused.
- Let users edit items without navigating away.
- Reuse the same form for both **create** and **edit** scenarios.

---

## 2. When to Use

Use this pattern when:

- You have a dashboard or list-view of items.
- Users need to make **quick edits or create new items** without leaving the page.
- The form is moderate in size (fits comfortably in a modal).

---

## 3. Inputs (conceptual)

- **Item model** to edit or create.
- **Mode**:
  - `"create"` or `"edit"`.
- **Save handler**:
  - A function that persists changes via a data service.
- **Close handler**:
  - Closes the modal and optionally triggers a refresh.

---

## 4. Outputs

- A **modal-based form** that:
  - Reuses the same component for create/edit.
  - Displays validation messages.
  - Shows loading/disabled states while saving.

---

## 5. Behavior & Rules

**Open/Close**

- Modal opens when:
  - User clicks “New” or “Add”.
  - User clicks “Edit” on an existing item.
- Modal closes when:
  - Save succeeds.
  - User cancels (if allowed).

**State Handling**

- Maintain a **local copy** of the item state in the form.
- Track “dirty” state when appropriate.
- Disable save button while:
  - Required fields are invalid.
  - Save is in progress.

**Validation**

- Validate:
  - Required fields.
  - Simple constraints (e.g., max length, date ranges).
- Show validation **inline near the fields** where possible.

**Error Handling**

- On save error:
  - Show an error message in the modal.
  - Do not close the modal automatically.

---

## 6. Implementation Checklist (for agents)

When generating a modal item editor:

1. **Create a dedicated form component**
   - Accept props like:
     - `mode` (`"create" | "edit"`)
     - `initialItem`
     - `onSave`
     - `onCancel`

2. **Wire up form state**
   - Use React state or a form library per project standards.
   - Initialize from `initialItem` (or sensible defaults for create).

3. **Implement save workflow**
   - Call the data service (repository) to persist changes.
   - Handle loading and errors.
   - Notify parent on success so it can refresh data.

4. **Integrate with dashboard**
   - Dashboard owns the modal’s open/close state.
   - Dashboard passes selected item and mode into the form.

---

## 7. Notes for AI Assistants

- Combine this pattern with:
  - **Data Service – PnPjs List Repository** for persistence.
  - **Dashboard – Card Grid + Filters** for the hosting view.
- Do not:
  - Put repository calls directly in the card; keep them in the form or higher-level container.
- Keep the form **focused and simple**; avoid making the modal a multipage wizard unless absolutely required.
