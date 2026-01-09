# UnityFX Standing Orders for Pattern-Aware Agents

> These instructions are for AI coding assistants (e.g., Augment) that work inside the UnityFX ecosystem.
> Follow these orders whenever you read or write code in a project that uses UnityFX.

---

## 1. Mission

UnityFX exists to:
- Capture repeatable implementation patterns as **human-readable pattern docs**.
- Make it easy for AI assistants to **apply those patterns consistently** across multiple SPFx solutions.
- Keep behavior and structure **predictable** even when many different agents or humans contribute.

Your mission as an AI assistant:
- **Use the UnityFX pattern library as your first source of truth** for structure, naming, and approach.
- Prefer **composing existing patterns** over inventing new one-off solutions.
- **Update and extend patterns carefully** when truly needed, instead of silently diverging.

---

## 2. What the pattern library is

The UnityFX pattern library is described in:

- 'docs/PatternLibrary.md' - human overview of patterns and how they’re organized.
- 'patterns/**/*.md' - individual pattern documents.
- 'unityfx-manifest.json' - machine-readable index of patterns (names, categories, file paths, tags, etc.).

Each pattern '.md' file will generally include:
- A short **summary** of the pattern.
- **Context & intent** (when to use it).
- **Inputs / expected configuration**.
- **Outputs / side effects** (lists created, files generated, etc.).
- **Implementation notes / checklist**.
- **Example usage**.

When unsure about how to implement something, **look for the nearest relevant pattern**.

---

## 3. How to behave when generating code

Whenever you’re asked to generate or modify code in a UnityFX-aware project:

1. **Identify relevant patterns**
   - From the user’s request, extract keywords (e.g., “installer”, “list provisioning”, “dashboard”, “data service”, “fullscreen layout”).
   - Look up likely matches in:
     - 'unityfx-manifest.json' (preferred)
     - 'docs/PatternLibrary.md' (fallback / extra context)

2. **Read the pattern(s) before coding**
   - Open the relevant pattern '.md' file(s).
   - Note:
     - Required inputs / configuration
     - Expected file locations
     - Naming conventions
     - Any do/don’t rules

3. **Propose an approach**
   - Before writing a lot of code, summarize the plan in terms of patterns, e.g.:
     > “I’ll apply the 'Installer - Basic List Provisioning' pattern for the new DRA lists and the 'Dashboard - Card Grid' pattern for the main UI.”

4. **Generate code that adheres to the pattern**
   - Match **file locations**, **component names**, **props structure**, and **conventions** described by the pattern.
   - Respect established **UnityFX naming conventions** and **project structure**.
   - Prefer **reusing existing utilities / components** if the pattern calls for them.

5. **Explain which patterns were used**
   - After generating code, briefly document:
     - Which patterns were applied
     - Where they live (pattern file path)
     - Any intentional deviations

---

## 4. Rules for modifying patterns (Improvement Protocol)

When real code reveals problems or gaps, patterns SHOULD improve - but carefully.
Follow this protocol whenever you think a UnityFX pattern needs to change.

### 4.1 Classify the issue

- **Local issue (code-only):**
  - Typos, wrong imports, project-specific props, one-off TypeScript errors.
  - -> Fix the code. DO NOT change the pattern.

- **Repeatable structural issue (pattern-level):**
  - The pattern is unclear, incomplete, or consistently fights reality
    (e.g., SPFx constraints, Fluent UI expectations, prop shapes).
  - -> Fix the code AND update the pattern.

### 4.2 Propose improvements before editing

- First, write a short list of proposed changes, for example:
  - "Clarify that the fullscreen shell must wrap its content in a single root element."
  - "Add a note that the shell should not interfere with SPFx web part padding; host handles outer spacing."
- Keep proposals in plain language, 1-3 sentences each.

### 4.3 Keep changes small and additive

- Prefer:
  - Adding bullets under **Behavior & Rules**, **Implementation Checklist**, or **Notes for AI Assistants**.
  - Adding a short **"SPFx / Implementation Notes"** subsection when needed.
- Avoid:
  - Large rewrites.
  - Deleting existing guidance unless it is clearly wrong.

### 4.4 Align code and pattern

- After changing a pattern:
  - Make sure the current implementation matches the updated rules.
  - If they must diverge, add a short note explaining why ("known exception").

### 4.5 Document relationships

- When a change turns into a new variant (e.g., a "lite" vs "full" fullscreen shell):
  - Add or update 'relatedPatterns' in 'unityfx-manifest.json'.
  - Do NOT duplicate entire pattern docs if a few notes will do.

### 4.6 When in doubt

- If you are not sure whether a problem is pattern-level or code-level:
  - Assume it is **code-level** and fix it locally.
  - Optionally add a **TODO** note in the pattern suggesting a future review.

### 4.7 Sync with the manifest (if needed)

- If a new pattern is created, ensure it's added to `unityfx-manifest.json` (or propose the entry for a human to add).

---

## 5. Naming, structure, and safety rules

When working in UnityFX-aware projects:

- **Don’t invent new top-level structures** unless:
  - No suitable pattern exists, and
  - You’ve clearly explained why a new structure is necessary.

- **Don’t silently break conventions.**
  - If an implementation needs to diverge from the pattern, explain:
    - What the pattern recommends
    - Why the divergence is needed
    - How to update the pattern (if appropriate)

- **Be idempotent where possible.**
  - Installers and provisioning routines should be safe to run multiple times.
  - Follow any idempotency guidance in the relevant installer patterns.

- **Preserve human edits.**
  - When editing existing files, minimize churn.
  - Avoid large-scale rewrites unless explicitly asked.

---

## 6. How to choose patterns

If multiple patterns might apply:

1. Prefer **more specific** over more generic.
2. Prefer **UnityFX-native** patterns over ad hoc frameworks.
3. When in doubt, ask (or log) which of a small set the user prefers.

Example decision process:
- “Need a dashboard with filters and modals?”  
  -> Prefer a 'Dashboard - Unified Grid + Modal Editor' pattern (if it exists) over hand-rolled ad hoc state.

- “Need to provision SharePoint lists?”  
  -> Prefer an 'Installer - List Provisioning' pattern over copy-pasting REST calls scattered around.

---

## 7. Working with the Everything FluentUI app (future consumers)

When operating inside a **consumer app** (e.g., 'Everything FluentUI'):

- Treat UnityFX as **the source of truth for patterns**, even if the app only imports a subset.
- If the app has local pattern overrides, **call out the differences**:
  - e.g., “This app uses the standard UnityFX 'Dashboard - Card Grid' pattern with a custom card header layout.”

If the app repo vendored or copied patterns directly:
- Still reference the **original UnityFX pattern name** and structure.
- Encourage syncing / consolidation back into the UnityFX repo when improvements are made.

---

## 8. When no pattern exists

If you can’t find a relevant pattern:

1. **Say so explicitly.**
   - “There is no existing UnityFX pattern that matches this scenario.”

2. **Design with future patternization in mind.**
   - Implement the code in a clean, modular way that could easily become a pattern.
   - Optionally propose a new pattern skeleton:
     - Name, category, summary
     - When to use it
     - Inputs / outputs
     - Implementation outline

3. **Avoid accidental one-off frameworks.**
   - Don’t introduce heavy new abstractions without treating them as candidate patterns.

---

## 9. Continuous Pattern Improvement (Learn Once, Reuse Forever)

UnityFX grows more valuable with every project that uses it. Actively seek opportunities to enhance the pattern library during implementation.

### 9.1 After Every Implementation

When completing any task that used UnityFX patterns, ask yourself:

1. **Did I learn something new?**
   - CSS quirks, API gotchas, better approaches, edge cases handled
   - If yes → Document it in the relevant pattern

2. **Did I solve a problem that will recur?**
   - Workarounds for framework limitations, integration patterns, styling fixes
   - If yes → Add it to the pattern's implementation notes or create a new pattern

3. **Did I create something reusable?**
   - New component patterns, utility functions, theme configurations
   - If yes → Consider whether it belongs in UnityFX

### 9.2 Pattern Enhancement Triggers

Actively look for these signals during development:

| Signal | Action |
|--------|--------|
| "I wish the pattern had told me this" | Add it to the pattern |
| "I had to figure this out the hard way" | Document the solution |
| "This workaround will be needed again" | Add to Implementation Notes |
| "I created a new theme/component/utility" | Consider adding as a pattern |
| "The pattern was wrong or incomplete" | Fix the pattern (Section 4) |

### 9.3 The Goal

Every project should leave UnityFX **better than it found it**:
- More complete patterns
- More edge cases documented
- More reusable solutions
- Fewer "gotchas" for future projects

This creates a virtuous cycle: the more you use UnityFX, the more valuable it becomes for all future work.

---

## 10. Development Workflow

### 10.1 Local Development Server

**IMPORTANT:** The user runs `gulp serve` on their end and keeps it running permanently during development.

- **DO NOT** run `gulp serve` or `npm run serve` from the AI assistant.
- **DO NOT** attempt to start the local development server.
- The user will handle starting/stopping the dev server.
- Running it from both sides causes port conflicts and process management issues.

### 10.2 Testing Changes

After making code changes:
1. Run `gulp build` to verify the code compiles without errors.
2. The user will refresh their browser to see the changes (dev server has hot reload).
3. **DO NOT** use `open-browser` repeatedly - the user already has the page open.

---

## 11. Summary

- Always **look for and read patterns first**.
- **Implement according to patterns** whenever possible.
- **Update patterns intentionally**, not accidentally.
- **Explain pattern usage** so humans can follow and maintain consistency.
- **Actively seek opportunities to enhance patterns** after every implementation.
- Treat UnityFX as a **shared brain** that gets smarter over time - not as a pile of unrelated snippets.
- **Never run `gulp serve`** - the user handles the dev server.
