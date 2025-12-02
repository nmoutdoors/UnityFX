# Dashboard – Card Grid + Filters

**Category:** dashboard  
**Status:** draft  

---

## 1. Intent

Provide a standard dashboard layout:

- Filters/search controls
- A responsive **card grid** of items
- Optional details via modal or side panel

The goal is to standardize how dashboards look and behave so users (and agents) know what to expect.

---

## 2. When to Use

Use this pattern when:

- You are displaying a collection of items (objectives, artifacts, programs, etc.).
- Users need to **filter**, **sort**, or **search** those items.
- Each item can be reasonably represented as a **card**.

---

## 3. Inputs (conceptual)

- **Data source**:
  - A repository or data service (e.g., `IMyListRepository`) that provides items.
- **Card model**:
  - The minimal fields needed to render a card:
    - Title / primary text
    - Key metadata (tags, status, dates)
    - Optional actions (edit, open, etc.)
- **Filter model**:
  - What fields users can filter by (e.g., status, category, date range, text search).

---

## 4. Outputs

- A **top-level dashboard component** with:
  - A consistent layout:
    - Header / title
    - Filter area
    - Card grid
  - Clear wiring to data services for loading data with filters.

- A **reusable card component** when practical.

---

## 5. Layout & Behavior

**Layout**

- Top: dashboard title and optional summary (counts, status).
- Next: filter controls:
  - Search box and/or dropdowns, toggles, etc.
- Main area: responsive **card grid**:
  - Cards should wrap on smaller screens.
  - Maintain a consistent look for card padding, headings, and actions.

**Filtering**

- Filter state is **centralized** in the dashboard component (or a dedicated hook).
- Filters drive data loading:
  - Either client-side (filtering a loaded dataset).
  - Or server-side / repository-level (preferable for large lists).

**Loading & Empty States**

- Show a loading indicator while fetching.
- Show a clear empty state if no items match:
  - Short explanation and possible actions (e.g., “Reset filters”).

---

## 6. Implementation Checklist (for agents)

When generating a dashboard:

1. **Define the card model**
   - Decide which fields from the data service are needed for the card.

2. **Set up filter state**
   - Maintain a filter state object (e.g., `status`, `category`, `searchText`).
   - Wire filter controls to update that state.

3. **Connect to data service**
   - Use a repository or hook (e.g., `useItems(filters)`).
   - Ensure re-fetching or re-filtering when filters change.

4. **Render card grid**
   - Map the data into cards.
   - Keep card component focused on presentation.

5. **Handle loading / empty / error states**
   - Avoid blank screens.
   - Provide simple messages or placeholders.

---

## 7. Notes for AI Assistants

- Prefer:
  - One **dashboard container** component.
  - One or more **presentational card** components.
- Do not:
  - Hardcode list access in the dashboard; use a data service pattern instead.
- Follow UnityFX’s **fullscreen shell** and **modal editor** patterns when combining with those features.
