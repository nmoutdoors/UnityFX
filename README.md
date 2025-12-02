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

This repo includes an `.augment-guidelines` file that instructs AI assistants how to use the pattern library. Projects referencing UnityFX.Patterns should add to their own `.augment-guidelines`:

```markdown
**External Pattern Library:**
- The master pattern library lives at `C:\code\UnityFX.Patterns`
- Before implementing features, check for relevant patterns
- Read patterns via: `Get-Content "C:\code\UnityFX.Patterns\patterns\<category>\<pattern>.md"`
```

## Related Projects

- **UnityFX** — Full implementation framework with templates and tooling

## License

MIT

