# UnityFX Pattern Library (v0.1)

> **Purpose**  
> This document is the human-readable index of all UnityFX patterns.  
> Each entry points to one or more source `.md` files and is tagged with a status:
> - ✅ Proven - used successfully in production
> - ⚠️ Draft - documented but not yet widely reused
> - 🧪 Experimental - early ideas, bug notes, or one-off implementations

---

## 1. Layout & Fullscreen

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-FS-001 | Fullscreen Layout Pattern | ✅ Proven | `clean-fullscreen-pattern.md`, `FULLSCREEN_IMPLEMENTATION.md`, `programtracker-fullscreen-implementation-guide.md` | Core blank-canvas fullscreen behavior for large apps. Includes toolbar, property pane toggle, and host promotion (ControlZone). |
| UFX-LAYOUT-001 | Dual Rendering System | ⚠️ Draft | `dual-rendering-system-implementation-guide.md` | Pattern for supporting two rendering modes (e.g., classic vs enhanced views) within a single webpart. |
| UFX-CHROME-001 | SharePoint Chrome Hider | 🧪 Experimental | `chrome-hider-webpart-vision.md` | Vision for hiding SharePoint chrome for immersive experiences. Not yet standardized. |

---

## 2. Navigation & UI Chrome

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-NAV-001 | Navbar Implementation | ✅ Proven | `NAVBAR_IMPLEMENTATION.md`, `BigCal-Navbar-Implementation-Guide.md` | Standard top navigation bar pattern (non-fullscreen layout), used in BigCal and similar apps. |
| UFX-UI-STATUS-001 | Pill-Shaped Status Cards | ⚠️ Draft | `pill-shaped-status-cards-pattern.md` | Visual pattern for status chips/cards, likely to be reused in dashboards. |
| UFX-ICON-001 | Icon Consistency Fix | 🧪 Experimental | `icon-consistency-fix-implementation.md` | Notes on normalizing icon usage; candidate for conversion into a formal icon usage pattern. |

---

## 3. Data & List Behavior

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-DATA-ROLLUP-001 | Hierarchical Data Rollup | ✅ Proven | `hierarchical-data-rollup-pattern.md`, `parent-child-rollup-pattern.md` | Patterns for combining parent/child list items into coherent rollups. Key for ProgramTracker/BigCal style solutions. |
| UFX-DATA-STATE-001 | URL State Management | ✅ Proven | `url-state-management-pattern.md` | Encode filter/sort/page state in the URL for sharable deep links. |
| UFX-DATA-STATE-002 | State Isolation | ⚠️ Draft | `state-isolation-pattern.md` | Keep global, list, and component state cleanly separated to avoid “spaghetti state”. |
| UFX-DATA-EXCEL-001 | Excel Import/Export Pattern | ✅ Proven | `excel-import-export-pattern.md`, `BigCal-Excel-Import-Export-Implementation.md`, `BigCal-Excel-Modal-Implementation-Complete-Guide.md` | Standard way to move list data to/from Excel using modals and mapping. |
| UFX-DATA-VALIDATION-001 | List Detection & Validation | ✅ Proven | `BigCal-List-Detection-and-Validation-System.md` | Detect required lists and verify schema at runtime; surface friendly warnings. |
| UFX-DATA-VALIDATION-002 | Field Validation Fixes | ⚠️ Draft | `field-validation-fix.md`, `comprehensive-list-warnings.md` | Collection of field-level validation fixes that should be consolidated into a single reusable validation service. |
| UFX-DATA-DATES-001 | CSV Date Handling | ⚠️ Draft | `csv-date-fix.md` | Rules for safely parsing and emitting dates when using CSV import/export. |

---

## 4. Field & Form Patterns

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-FIELD-MULTI-001 | SharePoint Multiselect Field Pattern | ✅ Proven | `sharepoint-multiselect-field-pattern.md` | Reliable way to work with multi-select fields in SPFx (read/write, UI binding). |
| UFX-FIELD-IMO-001 | IMO Field Implementation | ✅ Proven | `IMO-Field-Implementation-Plan.md`, `MAIN_IMO_CHECKBOX_ISSUE.md` | Pattern and lessons learned for implementing a critical boolean/flag field. |
| UFX-FIELD-OPR-001 | OPR Field Implementation | ✅ Proven | `OPR-Field-Implementation-Plan.md` | Field configuration and usage pattern for another key business concept. |

---

## 5. Printing & Output

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-PRINT-LEGEND-001 | Legendary Print Pattern | ✅ Proven | `patterns/print/Print.LegendaryPrint.md` | **Content-agnostic** print pattern for any dashboard. Supports image capture (calendars) and HTML generation (reports, profiles). Includes visual design specs for gradient backgrounds, glassmorphism, and "jaw-dropping" polish. |
| UFX-PRINT-MULTI-001 | Multi-Month Print Pattern | ⚠️ Draft | `MultiMonthPrint-Feature-Documentation.md` | Specific approach for multi-month calendar printing; candidate for generalization. |

---

## 6. Timeline & Scheduling

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-TIMELINE-001 | Vis Timeline Integration | ✅ Proven | `vis-timeline-integration-pattern.md`, `vis-timeline-implementation-guide.md` | Core integration with Vis.js Timeline including data binding. |
| UFX-TIMELINE-002 | Vis Timeline Interactions | ✅ Proven | `vis-timeline-popover-quick-implementation-guide.md`, `vis-timeline-zoom-scroll-interactions-guide.md` | Zoom, scroll, popovers and interaction patterns. |
| UFX-TIMELINE-ANALYSIS-001 | Timeline Analysis Prompt | 🧪 Experimental | `vis-timeline-analysis-prompt.md` | AI prompt notes for analyzing timeline behavior; useful for Standing Orders. |

---

## 7. UI Components & Views

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-VIEW-DATASHEET-001 | Datasheet View Implementation | ✅ Proven | `datasheet-view-implementation.md`, `datasheet-modal-css-fixes.md` | Grid-style view for inline editing, including modal and CSS adjustments. |
| UFX-UI-COLOR-001 | Color Reference Mapping | ⚠️ Draft | `color-reference-mapping.md` | Mapping strategy between internal state and visual color tokens. |
| UFX-MINI-CAL-001 | Mini Calendar Vision | 🧪 Experimental | `mini-calendar-vision.md` | Early concept for a compact calendar component; not yet standardized. |

---

## 8. Workflow & Swimlanes

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-WORKFLOW-LANE-001 | Dynamic Swimlane Management | ⚠️ Draft | `dynamic-swimlane-management.md` | Pattern for managing swimlane-based layouts and states (e.g., Kanban/board-style apps). |

---

## 9. Permissions & Security

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-SEC-TRIM-001 | Security Trimming (Permission-Based UI) | ✅ Proven | `patterns/core/15-Security-Trimming-Pattern.md` | Role-based security trimming using SharePoint group membership and site permissions. Includes PermissionChecker utility, component integration, impersonation mode, and fail-safe behavior. Extracted from AskTheDirector production implementation. |

---

## 10. Diagnostics, Debugging & Refactoring

These are more like **supporting practices** than app-level patterns, but they’re still valuable UnityFX assets.

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-CORE-LOGGER-001 | LoggerService Pattern | ✅ Proven | `patterns/core/10-LoggerService-Pattern.md` | Two-tier configurable console logging (standard + verbose). Property pane toggles, React Context, service injection. |
| UFX-DIAG-001 | Data Diagnostics Tool | ⚠️ Draft | `DATA_DIAGNOSTICS_TOOL.md` | Tool/pattern for inspecting list data quality and anomalies. |
| UFX-DEBUG-LEGEND-001 | Legend Studio Debugging Session | 🧪 Experimental | `legend-studio-debugging-session.md` | Case study style debugging notes; good candidate to mine for future patterns. |
| UFX-REFAC-001 | Component Refactoring Summary | 🧪 Experimental | `component-refactoring-summary.md` | Notes on refactoring strategy; should eventually feed into a “Component Design Guidelines” pattern. |
| UFX-QA-TEST-001 | Test Cases Checklist | ⚠️ Draft | `test-cases-checklist.md` | Reusable checklist for validating UnityFX-style apps. |

---

## 11. Coding Practices & Meta-Patterns

| ID | Pattern | Status | Source Files | Notes |
| -- | ------- | ------ | ------------ | ----- |
| UFX-TS-STYLE-001 | TypeScript Best Practices | ✅ Proven | `TypeScript-Best-Practices.md` | Coding style and TS usage guidelines for UnityFX projects. |
| UFX-MEMORY-001 | Augment Memory Refresh | ⚠️ Draft | `AUGMENT_MEMORY_REFRESH.md` | How to refresh AI memory/context to keep patterns aligned. |

---

## 12. Notes, Issues & One-Off Docs (Not Yet Patterns)

These files contain useful context but are **not yet formal patterns**. They should be mined for future pattern candidates:

- `MAIN_IMO_CHECKBOX_ISSUE.md`
- `print-preview-issue-context.md`
- `comprehensive-list-warnings.md`
- `chrome-hider-webpart-vision.md`
- Any other “*_issue” / “*_vision” / “*_context” docs

---

## Next Actions

1. **Edit statuses** - Change ✅/⚠️/🧪 based on your real-world confidence.
2. **Add missing patterns** - If I’ve missed any files, append them to the right section.
3. **Start referencing this doc in your AI prompts** - e.g.  
   > “Augment, when implementing permissions, use `UFX-SEC-UI-001` from `docs/PatternLibrary.md`.”

Once this feels right, we can:

- Derive a **machine-readable `unityfx-manifest.json`** from this index.
- Draft **Standing Orders for Augment** that tell it how to consume this library intelligently.
