
---

## `patterns/04-Data-Access-Pattern.md`

```md
# Data Access Pattern

The Data Access Pattern defines how UnityFX apps talk to data sources (primarily SharePoint lists, but extensible to others).

---

## Problems This Pattern Addresses

Without a unified data layer:

- Every component might use its own REST calls, PnP setup, or SPHttpClient logic.
- Inconsistent error handling.
- Repeated logic for:
  - filtering
  - paging
  - projections
- Harder to secure and optimize.

UnityFX uses a **single data client** and **feature-specific data services**.

---

## Goals

1. Provide a **single entry point** for HTTP/SharePoint data access (`DataClient`).
2. Keep data logic **out of components**.
3. Make it easier to:
   - add caching
   - switch implementations (PnP, REST, Graph)
   - test data flows
4. Enable consistent error handling and logging.

---

## Core Concept: DataClient

`src/unityfx/data/DataClient.ts`

Responsibilities:

- Wrap the underlying HTTP/SPFx clients (e.g. `SPHttpClient`, `@pnp/sp`, etc.).
- Provide generic methods like:
  - `getListItems(listName, queryOptions)`
  - `getItemById(listName, id)`
  - `createItem(listName, data)`
  - `updateItem(listName, id, data)`
  - `deleteItem(listName, id)`
- Emit structured errors and integrate with `LoggerService`.

`DataClient` is not app-specific. It is a **platform-level service**.

---

## Feature-Level Data Services

Feature modules define their own data services that consume `DataClient`, for example:

- `BigCalDataService.ts`
- `ProgramTrackerDataService.ts`

Responsibilities:

- Encapsulate all domain-specific data logic:
  - list names
  - field mappings
  - filters
  - projections
- Provide methods like:
  - `getScheduleForRange(start, end)`
  - `getProgramById(id)`
  - `getOpenItemsForUser(userId)`

Components call **feature data services**, not `DataClient` directly.

---

## Error Handling & Logging

Core expectations:

- `DataClient` logs:
  - request failures
  - timeouts
  - key context (list, query, etc.)
- Feature services:
  - add domain context to errors
  - may translate technical errors into user-friendly messages

UnityFX should make it easy to centralize error handling and diagnostics around data.

---

## Security Considerations

- All calls respect SharePoint’s current user context (no elevation).
- Data services avoid exposing more fields than necessary.
- Future: incorporate configurable safety checks (e.g., max items per query).

---

## Pattern Summary

**DataClient** → single technical data access abstraction.  
**Feature data services** → domain-specific logic for each feature.

Components remain focused on UI and user interactions, not data plumbing.

