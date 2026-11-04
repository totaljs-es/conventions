---
name: totaljs-conventions-write
description: Write or correct Total.js 5 app code using the Total.js conventions and the target project's existing native patterns.
---

# Write Total.js 5 code

Read the repository's `AGENTS.md`, `general/workflow.md` and the affected zone pages from `README.md`. Paths here are relative to the conventions repository root; resolve them there even when working in a consuming app.

Select a concrete compatible reference and read its route, action and caller together. Identify the target app's installed backend and UI versions, route style and storage model before writing. Preserve URLs, permissions, settings keys, response shapes and plugin/model paths during corrections. Action/schema names use `|`; when correcting a name, update its registration and callers together and check endpoint compatibility.

Use the direct native pattern: declared input, business/ownership checks, existing storage, one response. Prefer Total.js helpers/prototypes and RESTBuilder over new wrappers or dependencies. Follow the repository's ES5 preference for new code, but do not rewrite unrelated working code. `Total.Os` is case-sensitive; standalone tools and bootstrap code have a different execution context from loaded app files.

Keep explicit routes where the app uses them; keep action `route:` registrations where it uses those. Use `|` as the separator for standalone, grouped and nested action/schema names, never `/` or `\`. Update affected route targets and action-name callers together; URL and plugin method path separators remain unchanged. Use `DATA` for SQL features and the existing load/save lifecycle for FileStorage or persisted memory features. Use `.promise($)` / `.callback($)` / `$.done(id)` according to the response contract.

For UI, match the loaded jComponent major, read component configuration, reuse catalogue components through `COMPONENTATOR()` and load custom components from app assets. Preserve importer/form paths and caller refresh. Use `exec`, scoped `CLASS`, Tangular and English `@(...)` keys with native resources; see `frontend/binding-and-forms.md`.

Verify syntax and the observable route/screen behaviour using the workflow's relevant checks. Report what changed, which reference supports it, checks run and what remains unverified. Documentation tests do not establish runtime compatibility.

For a standalone action (a kit, not an app feature) follow `backend/action-kits.md`: contract first, `config` for URL and secrets, sample-based assertions and explicit database/provider integration boundaries. See `general/testing.md` for native test bootstrap and disposable databases. For CMS widgets follow `frontend/cms-widgets.md`; verify compatible hooks, editable content, repeated settings and the rendered preview.
