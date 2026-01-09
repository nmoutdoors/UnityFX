# Pill-Shaped Status Cards Pattern

## Purpose

Provide a reusable, pill-shaped status card layout for UnityFX dashboards:

- Compact, horizontally oriented cards
- Visual C/S/P status badges
- Icon indicators for flags (e.g., “Main”, “ABO”, “Archived”)
- Hover-based detail popover (no navigation required)

This pattern started in **ProgramTracker** and has been stable in production.

---

## Applicability

Use this pattern when:

- Displaying list items with multiple status dimensions (e.g. Cost, Schedule, Performance).
- You need a dense, scannable dashboard view.
- You want cards that:
  - are fixed-size
  - can be laid out in horizontal rows or wraps
  - show more detail on hover (popover) instead of navigation.

---

## Visual & Layout Spec

### Card

- **Dimensions**: `245px` width × `88px` height (fixed).
- **Border radius**: `50px` (full pill).
- **Columns**:
  - Left: ~20% (status badges)
  - Middle: ~60% (title + subtitle)
  - Right: ~20% (icon indicators)
- **Background**: `#333` (dark).
- **Border**: `2px` solid, color based on overall status.
- **Hover**:
  - Slight lift (`translateY(-2px)`)
  - Stronger shadow

### Status Border Colors

- Red (danger): `#BB1E10`
- “Green” (good): **use primary blue** `#375a7f` instead of literal green
- Amber (warning): `#EFB700`
- Not set: black `#000000`

> Note: The “green” state uses a primary blue for better contrast and theme alignment. :contentReference[oaicite:2]{index=2}  

### Left Column - C/S/P Badges

- Three circular badges stacked vertically: `C`, `S`, `P`.
- Size: ~22.5 × 18.5 px, `border-radius: 50%`.
- Colors per badge status:
  - Red `#BB1E10`
  - Green `#238823` (here it’s OK as an accent)
  - Amber `#EFB700`
  - Gray `#7f8c8d` (not set)
- Layout: flex column, `justify-content: space-evenly`.

### Middle Column - Content

- Title:
  - `16px`, `font-weight: 600`, white
  - 2-line clamp with ellipsis
- Subtitle (e.g., org/center):
  - `16px`, `font-weight: 600`, `#aaa`
  - single line, ellipsis
- Layout: vertical flex, `justify-content: space-between`.

### Right Column - Icon Indicators

- Three icon slots, stacked vertically.
- Slot size: ~25×25 px.
- Typical icons:
  - Gold star → primary / “Main” item
  - ABO badge
  - Archive icon
- Layout: `justify-content: space-evenly`.

---

## Hover Popover

- Trigger: `onMouseEnter` / `onMouseLeave` on the card.
- Implementation: Fluent UI `Callout` with `DirectionalHint.bottomCenter`.
- Style:
  - Background: `#444`
  - Border: `1px solid #555`
  - Max width: `680px`
  - Min width: `553px`
- Behavior:
  - `preventDismissOnScroll: true`
  - Hover-only (no click to open/close)
- Content:
  - Full item details
  - C/S/P status indicators
  - IMO badges or similar tag badges

---

## Example UnityFX Folder Layout

For a feature using this pattern:

```text
src/
  unityfx/
    ui/
      cards/
        UnityFxPillStatusCard.tsx
        UnityFxPillStatusCardPopover.tsx
        UnityFxPillStatusCards.module.scss
    theme/
      DarkTheme.ts    # or DarklyTheme.ts, where colors live
  features/
    ProgramTracker/
      models/
        IDcsItem.ts   # example interface
      components/
        ProgramTrackerDashboard.tsx
