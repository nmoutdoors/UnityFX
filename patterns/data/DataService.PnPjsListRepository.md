# Data Service - PnPjs List Repository

**Category:** data-service  
**Status:** draft  

---

## 1. Intent

Wrap a SharePoint list in a **typed, focused data service** (or “repository”) built on top of PnPjs.

The goal is to:

- Provide a **simple interface** for reading/writing list items.
- Centralize list interaction logic (filters, paging, mapping).
- Keep SharePoint specifics (field names, CAML/filters) out of UI components.

---

## 2. When to Use

Use this pattern when:

- A feature frequently reads/writes items from a particular list.
- You want UI components to depend on **clean TypeScript interfaces**, not raw SharePoint responses.
- You want a future AI or developer to see “this is how we talk to this list” in one place.

---

## 3. Inputs (conceptual)

- Target **Site / Web** and **list name / ID**.
- Type definition for the **domain model** for that list, e.g.:
  - `ID`, `Title`, and any important fields.
- Required **operations**:
  - Read all / filtered
  - Get by ID
  - Create / update
  - (Optional) Delete / soft delete

---

## 4. Outputs

- A **single module or class** that:
  - Encapsulates PnPjs calls for that list.
  - Exposes a small, well-defined API, e.g.:

    ```ts
    interface IMyListRepository {
      getItems(filter?: IMyFilter): Promise<IMyItem[]>;
      getItemById(id: number): Promise<IMyItem | null>;
      saveItem(item: IMyItem): Promise<IMyItem>;
      deleteItem(id: number): Promise<void>;
    }
    ```

- UI components and hooks that depend on this interface, **not** on PnPjs directly.

---

## 5. Behavior & Rules

**Encapsulation**

- Only the repository knows:
  - The list’s internal name.
  - Column internal names.
  - PnPjs-specific query details.
- Callers see **clean models** and parameters, not implementation details.

**Mapping**

- Map from raw SharePoint item → **domain model**:
  - Handle null/undefined safely.
  - Surface only relevant fields.
- Map from domain model → **SharePoint update body**:
  - Don’t leak internal field names out of the repository.

**Error Handling**

- Catch and rethrow errors with context, or allow them to bubble with enough information.
- Consider logging or telemetry hooks as appropriate for the project.

**Extensibility**

- Start simple (basic CRUD).
- Add advanced operations (batching, caching, complex filters) incrementally as needed.

---

## 6. Implementation Checklist (for agents)

When generating a PnPjs-based repository:

1. **Define item model(s)**
   - Example: `IMyListItem` (domain model).
   - Optionally define input model(s) for create/update.

2. **Define the interface**
   - Keep it small and focused.
   - Ensure it reflects what the UI actually needs.

3. **Implement using PnPjs**
   - Use the project’s existing PnPjs setup and configuration.
   - Implement mapping functions in **one place**.

4. **Avoid leaking SharePoint details**
   - No direct `sp.web.lists.getByTitle` calls from components.
   - Prefer the repository everywhere.

5. **Document the repository**
   - Short JSDoc/TS doc comments explaining:
     - What list it targets.
     - Any assumptions (e.g., required fields).

---

## 7. Notes for AI Assistants

- When asked to “load data from list X”:
  - Propose **creating or extending a repository** that follows this pattern.
- If a project already has repositories:
  - Mirror existing naming and structure.
- Prefer adding methods to the repository over adding direct PnPjs calls in UI components.
