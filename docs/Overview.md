
---

## 2. `docs/Overview.md`

```md
# UnityFX Overview

UnityFX is a **pattern-based SPFx framework** for building modern SharePoint applications.

It grew out of real-world solutions like **BigCal** and **ProgramTracker**, where the same architectural ideas kept appearing:

- Installers that validate & create lists/config
- Fullscreen layouts that feel like true web apps (no flicker, no chrome)
- Consistent logging and config management
- Data access that hides SharePoint quirks
- Feature modules that can be reused and recombined across apps
- Fluent UI components with consistent UX patterns

UnityFX takes those patterns and turns them into:

1. **Patterns** - documented, reusable “how we do things”
2. **Templates** - starting points with UnityFX baked in
3. **Tools** - scripts/CLIs to create new apps and features quickly

---

## Goals

1. **Speed**  
   Make it possible to build *real*, production-ready SPFx apps in days instead of weeks.

2. **Consistency**  
   Every UnityFX app looks and feels familiar under the hood:
   - same folder structure
   - same naming conventions
   - same installer pattern
   - same fullscreen behavior
   - same logging and data services

3. **Security by Default**  
   UnityFX patterns avoid insecure practices and ship with:
   - centralized data access
   - safe rendering helpers
   - clear permission boundaries

4. **AI-Friendly**  
   UnityFX is designed to work hand-in-hand with agentic AI tools (like Augment):
   - clear patterns and file locations
   - predictable abstractions
   - documentation that can be “fed” to AI as standing orders

5. **Teachability**  
   UnityFX should be learnable:
   - by reading the docs
   - by exploring templates
   - and eventually by interactive “playground” experiences

---

## What UnityFX Is Not

- It is **not** a replacement for SPFx. It runs *on top* of SPFx.
- It is **not** a monolithic library that tries to hide SharePoint. You still “feel” the platform.
- It is **not** a visual designer or low-code tool (at least not in v0.1).

UnityFX is an **architecture and pattern layer** that gives your SPFx apps a consistent spine.

---

## First Contact: UnityFXShell-Spfx

The fastest way to experience UnityFX will be:

1. Create a new project based on `templates/UnityFXShell-Spfx/`
2. Run it locally
3. See:
   - the fullscreen layout
   - the top toolbar
   - the UnityFX app shell
   - the core logging, config, and data services wired in

From there, you add **feature modules** using the patterns in `/patterns`.

See:

- `docs/Architecture.md` - to understand how the pieces fit
- `patterns/00-UnityFX-Principles.md` - to understand the philosophy behind it

