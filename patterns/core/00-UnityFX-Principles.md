
---

## 5. `patterns/00-UnityFX-Principles.md`

```md
# UnityFX Principles

These principles guide every pattern, template, and decision in UnityFX.

They are not rigid laws, but they should be very hard to violate.

---

## 1. Spec Over Script

Where possible, UnityFX favors **declarative specs** over scattered imperative code.

Examples:

- Installer specs describe lists, fields, and behavior.
- Data access is defined by service interfaces, not inline fetch calls.
- Feature modules declare their dependencies (data, config, permissions) instead of “just reaching out” to whatever they want.

---

## 2. Separation of Concerns

- **Components** focus on rendering and UI behavior.
- **Services** handle data, config, and cross-cutting concerns (logging, security).
- **Patterns** describe how components and services work together.

UnityFX templates reinforce this separation by default.

---

## 3. Composition Over Inheritance

UnityFX prefers **small, composable services and components**:

- `FullscreenLayout` composes:
  - toolbar
  - content area
  - fullscreen behavior
- Data services compose:
  - a shared `DataClient`
  - scenario-specific methods

We avoid deep inheritance chains and “magic base classes” as much as possible.

---

## 4. Predictability

Given any UnityFX app, you should be able to answer:

- “Where does logging happen?”
- “Where does config come from?”
- “Where is data access implemented?”
- “Where is fullscreen behavior controlled?”

The answer should **always** be the same places.

---

## 5. Security by Default

UnityFX patterns should:

- Encapsulate dangerous operations (HTML rendering, data access) behind safe APIs.
- Prefer encoded/safe rendering helpers.
- Use a single, approved data client for external calls.
- Respect SharePoint permissions and never assume more access than the current user has.

---

## 6. AI-Aware Design

UnityFX is intentionally structured to play well with agentic AI tools:

- Clear folder structure
- Well-named pattern files
- Consistent naming conventions
- Documentation that can be used as “standing orders”

If an AI can “read the repo,” it should be able to apply UnityFX patterns correctly.

---

## 7. Real-World Driven

UnityFX patterns are not theoretical.

They originate from:

- production apps
- real bugs
- performance problems
- UX issues
- lessons learned

A pattern should be documented **after it has proven itself** in at least one real application.

---

## 8. Teachability & Stewardship

UnityFX is designed so that:

- future developers can pick it up without the original author present
- teams can onboard new members quickly
- the framework can be shared, taught, and eventually open-sourced

We aim for clarity, not cleverness.

