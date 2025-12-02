# UnityFX UI Components

The UnityFX UI layer provides **consistent, reusable, high-performance interface components** that form the foundation of every UnityFX application.  
These components abstract away repetitive UI tasks, enforce design uniformity, and ensure that UnityFX apps look and feel like part of a unified ecosystem.

This document describes the **core UI primitives** in UnityFX v0.1 and outlines areas for future expansion.

---

# 1. Design Principles

UnityFX UI components follow these principles:

### **1. Shell-first rendering**
Components that participate in the initial application frame (e.g. fullscreen layout, toolbar) must render instantly and without flicker.

### **2. Predictable geometry**
UnityFX uses fixed or well-defined dimensions for many components (cards, toolbars, panels) to ensure stable layouts and consistent alignment across feature modules.

### **3. Theme-agnostic, FluentUI-first**
UnityFX UI components do not assume a default light or dark theme. Instead, they:
- Respect the host's Fluent UI / SharePoint theme wherever possible
- Are built to work under both light and dark palettes
- Avoid hard-coded colors in favor of theme tokens or semantic color names

Individual apps (ProgramTracker, BigCal, etc.) may **choose** dark or light looks, 
but UnityFX itself stays neutral and themeable.

### **4. Feature-agnostic**
UnityFX components are presentational, not business-specific. Feature modules (BigCal, ProgramTracker, etc.) map their data onto these components via props.

### **5. Extensible**
Every component includes:
- slots (children or props) for extending behavior  
- SCSS module isolation  
- theming hooks  
- future Fluent UI variants  


# 2. Core Components (v0.1)

UnityFX v0.1 includes the following foundational UI components:

## **2.1 FullscreenLayout**

**File:** `src/unityfx/ui/FullscreenLayout.tsx`  
**Role:** The structural root for all UnityFX apps.

### Responsibilities:
- Establish the top-level visual container
- Apply fullscreen CSS classes
- Manage body lock / scroll lock
- Render the top toolbar
- Render the main content region

### Highlights:
- “Blank screen first” load behavior
- No SharePoint flicker
- App always feels like a standalone product

See `docs/FullscreenPattern.md` for the complete specification.

---

## **2.2 TopToolbar**

**File:** `src/unityfx/ui/TopToolbar.tsx`  
**Role:** The universal header bar for UnityFX apps.

### Responsibilities:
- Display app name
- Fullscreen toggle
- Property pane toggle (if provided by host)
- Provide an extension slot for feature-specific actions (future)

### Characteristics:
- Always renders instantly
- Works with keyboard navigation
- Eventually replaced by Fluent UI / custom icons
- Dark theme by default

---

## **2.3 Pill Status Cards (Dashboard Cards)**

**File(s):**
- (future) `src/unityfx/ui/cards/UnityFxPillStatusCard.tsx`
- (future) `src/unityfx/ui/cards/UnityFxPillStatusCardPopover.tsx`

**Role:** A reusable dashboard card layout optimized for dense information display.

### Key Features:
- Fixed 245×88 pill geometry
- 3-column layout:
  - **Left:** C/S/P status badges
  - **Middle:** Title / subtitle with ellipsis
  - **Right:** Icon indicators (Main, ABO, Archived, etc.)
- Fluent UI hover popover for rich detail
- Proven production design (ProgramTracker)

### Intended Uses:
- Program dashboards
- Topic dashboards
- Status boards
- Feature modules requiring compact, scannable UI

See `patterns/07-Pill-Status-Cards-Pattern.md` for full details.

---

# 3. Pending UI Components (v0.2 and beyond)

UnityFX will eventually include a full suite of UI primitives. The following planned components already have working patterns in your provided files and will be formalized in later versions.

## **3.1 Navbar / Command Bar**
Inspired by:
- `BigCal-Navbar-Implementation-Guide.md`
- `NAVBAR_IMPLEMENTATION.md`

Will become:
- `UnityFxNavbar`
- Supports actions, filters, view toggles
- Optionally integrates with feature modules

## **3.2 DataSheet View**
Based on:
- `datasheet-view-implementation.md`
- `datasheet-modal-css-fixes.md`

Will become:
- A reusable spreadsheet-like grid component
- With row selection, inline editing, modal details
- Built on Fluent UI DetailsList or a virtualized grid

## **3.3 Timeline Components (vis-timeline)**
Based on:
- `vis-timeline-integration-pattern.md`
- `vis-timeline-implementation-guide.md`
- `vis-timeline-popover-quick-implementation-guide.md`
- `vis-timeline-zoom-scroll-interactions-guide.md`

UnityFX will standardize:
- Timeline container
- Popover behavior
- Group/track configuration
- Scrolling/zooming patterns

## **3.4 Print Systems**
Inspired by:
- `LegendaryPrint.md`
- `legendary-print-pattern.md`
- `legendary-print-vision.md`

UnityFX will support:
- Multi-month calendar printing
- PDF-mode layouts
- Clean print-friendly themes
- Configurable margins and templates

## **3.5 Dropdown / Dynamic Field Components**
Based on:
- `dynamic-dropdown-population-pattern.md`
- `sharepoint-multiselect-field-pattern.md`
- `OPR-Field-Implementation-Plan.md`
- `IMO-Field-Implementation-Plan.md`

Eventually includes:
- Smart lookup fields
- Multi-select UI
- Dynamic taxonomy-driven dropdowns
- Field component wrappers for SharePoint data

---

# 4. UI Component Naming Rules

UnityFX UI components follow this naming pattern:

