# UnityFX Fullscreen Pattern (v0.2)

The UnityFX fullscreen pattern solves a real, recurring problem in large SPFx apps:

> **Default SPFx fullscreen often enters slowly and flickers**, briefly exposing the underlying SharePoint chrome (headers, scrollbars, layout shifts) before the app is ready.

UnityFX fullscreen is designed to be:

- **Instant visually** - blank, stable canvas ASAP  
- **Toolbar-first** - title + key controls appear quickly  
- **App-later** - heavy UI loads after the shell is stable  
- **Reusable** - the same behavior in every UnityFX app  

This doc is the **conceptual overview**. The technical spec lives in  
`patterns/02-Fullscreen-Layout-Pattern.md`.

---

## Goals

1. **Blank screen ASAP**  
   As soon as the SPFx web part container is available, the user should see a clean, white canvas that feels like a standalone app - not a partially rendered SharePoint page.

2. **Toolbar-first render**  
   The very first *intentional* UI should be:
   - a top toolbar  
   - app title  
   - fullscreen toggle  
   - property pane/config toggle  

   Everything else (grids, timelines, modals) can lag behind without feeling broken.

3. **No chrome flicker**  
   The user should not see:
   - SharePoint headers flashing  
   - scrollbars popping in/out  
   - layout snapping as fullscreen is activated  

4. **Reusable across apps**  
   BigCal, ProgramTracker, and any future UnityFX app should get this behavior by simply using the shared layout components - no custom one-off fullscreen hacks.

---

## Key Pieces

UnityFX fullscreen is implemented using three core pieces:

1. **A CSS bootstrap class** applied as early as possible  
2. **A shared layout component** - `FullscreenLayout`  
3. **A shared toolbar component** - `TopToolbar`  

### 1. CSS Bootstrap Class

UnityFX uses a “bootstrap” CSS class that takes over the viewport immediately:

```css
/* Example only: actual implementation will live in UnityFX styles */
.unityfx-fullscreen-bootstrap {
  all: unset !important;
  position: fixed !important;
  inset: 0 !important;
  background: #ffffff !important;
  z-index: 999999 !important;
  opacity: 1 !important;
  overflow: hidden !important;
}
