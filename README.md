# UnityFX.Patterns

A portable pattern library for SPFx (SharePoint Framework) solutions.

## What Is This?

UnityFX.Patterns is a **documentation-only** repository containing reusable patterns for building enterprise SharePoint web parts. It's designed to be referenced by implementation projects to ensure consistency across solutions.

## Quick Start

1. **Find a pattern**: Open `unityfx-manifest.json` and search by category or tags
2. **Read the pattern**: Navigate to `patterns/<category>/<PatternName>.md`
3. **Implement**: Follow the structure, naming, and behavior described

## Repository Structure

```
UnityFX.Patterns/
├── docs/                    # Supporting documentation
│   ├── UnityFX-Standing-Orders.md
│   ├── PatternLibrary.md
│   └── ...
├── patterns/                # Pattern definitions by category
│   ├── core/
│   ├── installers/
│   ├── data/
│   ├── ui-shell/
│   ├── ui/
│   ├── ui-components/
│   ├── dashboards/
│   ├── forms/
│   └── experimental/
├── schemas/                 # JSON schemas
│   └── unityfx-manifest.schema.json
├── unityfx-manifest.json    # Pattern index
└── .augment-guidelines      # AI assistant instructions
```

## Pattern Categories

| Category | Description |
|----------|-------------|
| `core` | Foundational principles and module structure |
| `installers` | SharePoint list/content type provisioning |
| `data` | Data access, services, logging, configuration |
| `ui-shell` | Fullscreen layouts, app shells, navigation |
| `ui` | Fluent UI usage patterns |
| `ui-components` | Reusable component patterns |
| `dashboards` | Dashboard layouts with filtering |
| `forms` | Modal editors, form validation |
| `experimental` | Work-in-progress patterns |

## Using With AI Assistants

This repo is designed for AI-assisted development. Key files for AI:

| File | Purpose |
|------|---------|
| `docs/PatternFinder.md` | **Start here.** Problem-first index ("I need to...") for suggesting patterns |
| `docs/PatternLibrary.md` | Full index with IDs, status, and source files |
| `docs/UnityFX-Standing-Orders.md` | Behavioral guidelines for AI assistants |

### Linking UnityFX to a Project

Create a junction in your project root:

```powershell
New-Item -ItemType Junction -Path ".\unityfx" -Target "C:\code\UnityFX"
```

### AI Prompt Template

Add this to your project's initial prompt or `.augment-guidelines`:

```markdown
This project uses UnityFX patterns. The library is linked at `./unityfx`.

**AI Instructions:**
1. When suggesting next steps, consult `unityfx/docs/PatternFinder.md` for relevant patterns
2. Before implementing features, check if a pattern exists
3. When implementing, follow the pattern's structure, naming, and checklists
4. If you discover a reusable pattern, propose adding it to the library
```

## Related Projects

- **UnityFX** - Full implementation framework with templates and tooling

## License

MIT

