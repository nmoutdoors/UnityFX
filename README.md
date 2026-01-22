# UnityFX

**Build it once, use it forever.**

A battle-tested pattern library for SPFx development, designed specifically for AI-assisted collaboration with Augment.

---

## The Problem

AI coding assistants like Augment excel at creative problem-solving through non-deterministic exploration. This is fantastic when you're tackling something new or want fresh perspectives on a challenge.

But this strength becomes a weakness when solving problems you've already solved:
- You get different solutions each time
- Code becomes inconsistent across projects
- You waste time and tokens re-explaining your preferences
- Proven approaches get reinvented (often worse) instead of reused

## The Solution

**UnityFX** is a curated library of battle-tested patterns for SharePoint Framework (SPFx) development. Instead of re-solving known problems, you and your AI assistant apply proven patterns consistently.

### Real-World Impact

While we don't have precise metrics, the practical results are dramatic:
- **Multiple strawmen in minutes**: Create 5-6 proof-of-concept variations in less time than it used to take to build one
- **Faster path to production**: So much is already captured in patterns that the gap between POC and production code shrinks drastically
- **Instant pattern application**: Once a pattern exists, Augment can incorporate it into a new codebase with remarkable speed
- **Consistent quality**: Every implementation follows the same proven approach

## What Is This?

UnityFX is a **documentation-only** repository containing reusable patterns for building enterprise SharePoint web parts. It's designed to be referenced by implementation projects to ensure consistency across solutions.

## Repository Structure

```
UnityFX/
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

## How It Works

### 1. Starting a New Thread/Session

When beginning a new Augment session, use this prompt to ensure proper context:

```
Please confirm that a Junction exists from this project to UnityFX.
If not, please create: New-Item -ItemType Junction -Path "unityfx" -Target "C:\code\UnityFX"
Then confirm or add unityfx to .gitignore.
Next, review unityfx/docs/UnityFX-Standing-Orders.md and unityfx/unityfx-manifest.json
```

This ensures Augment has access to all patterns and understands UnityFX conventions.

### 2. Building New Features

**When approaching something new:**
- Ask: "Does a pattern exist for this? Or something related?"
- If yes → Apply the pattern for consistent, fast results
- If no → Leverage Augment's creativity to explore solutions

**After solving something new:**
- Discuss: "Should we capture this as a pattern?"
- If yes → Document it together for future reuse
- Update the manifest and commit

### 3. The Collaborative Cycle

This library is collaborative from start to finish:
1. **Discover** a new challenge
2. **Explore** solutions with Augment's creativity
3. **Refine** the approach together
4. **Document** as a pattern
5. **Reuse** consistently across projects

## Quick Start

1. **Find a pattern**: Open `unityfx-manifest.json` and search by category or tags, or consult `docs/PatternFinder.md` for problem-first index
2. **Read the pattern**: Navigate to `patterns/<category>/<PatternName>.md`
3. **Implement**: Follow the structure, naming, and behavior described

## Key Files for AI Assistants

| File | Purpose |
|------|---------|
| `docs/PatternFinder.md` | **Start here.** Problem-first index ("I need to...") for suggesting patterns |
| `docs/PatternLibrary.md` | Full index with IDs, status, and source files |
| `docs/UnityFX-Standing-Orders.md` | Behavioral guidelines for AI assistants |
| `unityfx-manifest.json` | Complete pattern index with metadata |

## Important Notes

### Built for Augment

This pattern library has been extensively battle-tested in collaboration with **Augment Code's AI assistant**. The patterns, structure, and workflow are optimized for how Augment processes and applies context.

**Disclaimer**: While our protocol is proven in our Augment-based workflow, results may vary with other AI tools. The patterns themselves are sound, but the efficiency gains we've experienced are specifically tied to Augment's context engine and code generation capabilities.

### Philosophy

**Build it once, use it forever.**

These patterns represent proven solutions to common SPFx challenges. By documenting them once, we ensure:
- Consistency across projects
- Faster development cycles
- Better use of AI creativity (save it for new problems)
- Knowledge preservation and team scalability

## Contributing

When you solve a problem that could benefit other projects:

1. Ask: "Should we capture this as a pattern?"
2. Document it as a pattern in the appropriate category
3. Add an entry to `unityfx-manifest.json`
4. Follow the pattern template structure
5. Keep it focused on one concept

## License

MIT

