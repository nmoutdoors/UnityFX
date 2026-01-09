# UnityFX Pattern Finder

> **For AI Assistants:** When a developer completes a task or asks "what's next?", scan this document to suggest relevant patterns they might not know exist. Match their current context to the "I need to..." statements below. Suggest 1-3 patterns max, with a one-sentence reason why each applies.

---

## I need to...

### 🖥️ Layout & Shell

**...create a fullscreen dashboard experience**
→ **Fullscreen Lite** (`UiShell.FullscreenLite.md`)
Toggle-able fullscreen with toolbar, escape key support, and property pane integration.

**...add theme switching (light/dark/custom)**
→ **Theme Switching** (`UiShell.ThemeSwitching.md`)
ThemeContext provider with Fluent UI theme samples and CSS variable propagation.

**...build a card grid with search and filters**
→ **Card Grid with Filters** (`Dashboard.CardGridWithFilters.md`)
Responsive card layout with toolbar search, dropdowns, and user-based filtering.

---

### 📝 Forms & Modals

**...show a modal for viewing or editing an item**
→ **Modal Item Editor** (`Form.ModalItemEditor.md`)
Consistent modal shell with tabs, field layouts, save/cancel, and responsive sizing.

---

### 🗄️ Data & Services

**...read and write SharePoint list data**
→ **PnPjs List Repository** (`DataService.PnPjsListRepository.md`)
Service pattern for CRUD operations with proper typing and error handling.

**...aggregate data across organizational hierarchies**
→ **Hierarchical Data Rollup** (`DataAccess.HierarchicalRollup.md`)
Multi-level rollup using SharePoint lookup fields (parent-child-grandchild). Handles REST API quirks, missing data, and categorical-to-numeric conversions.

**...set up logging and configuration**
→ **Services, Logging & Config** (`03-Services-Logging-Config-Pattern.md`)
Centralized service initialization with consistent logging patterns.

---

### 🔧 Installation & Provisioning

**...create a SharePoint list on first run**
→ **Basic List Provisioning** (`Installer.BasicListProvisioning.md`)
Property pane installer with validation, field definitions, and progressive creation.

**...understand how installers work in UnityFX**
→ **Installer Core** (`Installer.Core.md`)
Foundation concepts for all provisioning patterns.

---

### 🖨️ Printing & Export

**...add a beautiful print preview**
→ **Legendary Print** (`Print.LegendaryPrint.md`)
Stunning print modal with gradient background, glassmorphism, WYSIWYG preview. Works with any content type - calendars, reports, profiles.

**...export data to Excel**
→ **Excel Import/Export** (see PatternLibrary.md → `UFX-DATA-EXCEL-001`)
Modal-based Excel export with field mapping and validation.

---

### 🎨 UI Components

**...show status with colored pills/badges**
→ **Pill Status Cards** (`07-Pill-Status-Cards-Pattern.md`)
Visual pattern for status chips with consistent color mapping.

**...add custom controls to webpart property panes**
→ **Custom Property Pane Controls** (`PropertyPane.CustomControls.md`)
Color pickers, font selectors, and advanced controls with live previews and validation. Integrates React components into SPFx property panes.

**...add drag-and-drop image upload (profile photos, avatars)**
→ **Image Dropzone** (`UiComponent.ImageDropzone.md`)
Circular dropzone with native drag/drop that works in SPFx iframe. Uploads to list item attachments with proper blob URL handling.

**...use Fluent UI consistently**
→ **Fluent UI Pattern** (`06-Fluent-UI-Pattern.md`)
Standard component usage, theming integration, and accessibility.

---

### 🔐 Permissions & Security

**...show/hide UI based on user permissions**
→ **Permission-Based UI** (see PatternLibrary.md → `UFX-SEC-UI-001`)
Conditional rendering based on SharePoint groups and roles.

---

### 📊 Timeline & Visualization

**...add an interactive timeline**
→ **Vis Timeline Integration** (see PatternLibrary.md → `UFX-TIMELINE-001`)
Vis.js Timeline with data binding, zoom, scroll, and popovers.

---

### 🧪 Quality & Testing

**...validate that lists are configured correctly**
→ **List Detection & Validation** (see PatternLibrary.md → `UFX-DATA-VALIDATION-001`)
Runtime schema checks with friendly warnings.

---

## Quick Reference by Situation

| You just finished... | Consider next... |
|---------------------|------------------|
| Setting up the project shell | Card Grid, Modal Editor, or Data Service |
| Building a card grid | Print capability, Excel export, or Permission-based filtering |
| Creating an edit modal | Validation patterns, Save/Cancel UX, Image Dropzone for profile photos |
| Wiring up data services | List provisioning for first-run setup, Hierarchical Rollup for org data |
| Adding print functionality | Multi-page layouts, theme-aware printing |
| Creating webpart properties | Custom Property Pane Controls for color pickers, font selectors |
| Working with org hierarchies | Hierarchical Data Rollup for parent-child-grandchild aggregation |
| Adding profile photo upload | Image Dropzone with native drag/drop for SPFx compatibility |

---

## Pattern Locations

All patterns live in `unityfx/patterns/` organized by category:
- `core/` - Foundational principles
- `ui-shell/` - Layout and chrome
- `dashboards/` - Card grids, filters
- `forms/` - Modals, field layouts
- `data/` - Services, repositories
- `installers/` - Provisioning
- `print/` - Print and export
- `ui-components/` - Reusable UI elements

Full index with status and IDs: `unityfx/docs/PatternLibrary.md`

