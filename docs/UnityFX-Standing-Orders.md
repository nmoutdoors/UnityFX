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

- `docs/PatternLibrary.md` — human overview of patterns and how they’re organized.
- `patterns/**/*.md` — individual pattern documents.
- `unityfx-manifest.json` — machine-readable index of patterns (names, categories, file paths, tags, etc.).

Each pattern `.md` file will generally include:
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
     - `unityfx-manifest.json` (preferred)
     - `docs/PatternLibrary.md` (fallback / extra context)

2. **Read the pattern(s) before coding**
   - Open the relevant pattern `.md` file(s).
   - Note:
     - Required inputs / configuration
     - Expected file locations
     - Naming conventions
     - Any do/don’t rules

3. **Propose an approach**
   - Before writing a lot of code, summarize the plan in terms of patterns, e.g.:
     > “I’ll apply the `Installer – Basic List Provisioning` pattern for the new DRA lists and the `Dashboard – Card Grid` pattern for the main UI.”

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

## 4. Rules for modifying patterns

Sometimes the correct thing to do is to **update** or **extend** a pattern rather than just applying it as-is.

When you believe a pattern should be modified:

1. **Call it out explicitly**
   - Say something like:
     > “The existing `Installer – Basic List Provisioning` pattern doesn’t mention multi-list dependency ordering. I recommend extending the pattern to cover this.”

2. **Prefer additive changes over destructive ones**
   - Add new sections or clarifications rather than deleting old guidance, unless it is clearly obsolete or incorrect.

3. **Keep the pattern readable**
   - Use concise headings and bullet points.
   - Avoid long narrative; patterns are reference material.

4. **Sync with the manifest (if needed)**
   - If a new pattern is created, ensure it’s added to `unityfx-manifest.json` (or propose the entry for a human to add).

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
  → Prefer a `Dashboard – Unified Grid + Modal Editor` pattern (if it exists) over hand-rolled ad hoc state.

- “Need to provision SharePoint lists?”  
  → Prefer an `Installer – List Provisioning` pattern over copy-pasting REST calls scattered around.

---

## 7. Working with the Everything FluentUI app (future consumers)

When operating inside a **consumer app** (e.g., `Everything FluentUI`):

- Treat UnityFX as **the source of truth for patterns**, even if the app only imports a subset.
- If the app has local pattern overrides, **call out the differences**:
  - e.g., “This app uses the standard UnityFX `Dashboard – Card Grid` pattern with a custom card header layout.”

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

## 9. Summary

- Always **look for and read patterns first**.
- **Implement according to patterns** whenever possible.
- **Update patterns intentionally**, not accidentally.
- **Explain pattern usage** so humans can follow and maintain consistency.
- Treat UnityFX as a **shared brain** that gets smarter over time — not as a pile of unrelated snippets.
