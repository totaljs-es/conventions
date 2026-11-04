---
name: totaljs-conventions-review
description: Review a Total.js 5 diff or feature against the Total.js conventions with source-backed findings and corrections that preserve existing contracts.
---

# Review a Total.js 5 change

Read the repository's `AGENTS.md`, `general/workflow.md` and pages for the affected zones. Resolve paths from the conventions repository root. Inspect the target project's instructions and actual backend/UI versions before reporting an API violation.

Review the bounded feature with its callers. For each actionable finding give file and line, concrete problem, supporting convention/reference, smallest correction and verification. Distinguish runtime defects, contract changes and convention mismatches from optional simplifications. Do not report a repository preference as an unsupported framework requirement.

Check these points where relevant:

- Tabs, semicolons, short quoted strings, familiar names and the repo's ES5 preference for new code; no array `for...in`. No unrelated mass reformatting.
- Existing native helper/component before custom wrappers or dependencies. App globals only after initialization; `Total.Os`, not `Total.OS`.
- Action/schema name separators are `|`, never `/` or `\`, including grouped/nested names. For naming corrections check registrations, route targets, action-name callers, generated endpoints and external compatibility together. URL and plugin method paths keep their own syntax. Explicit routes and action `route:` are valid alternatives; no duplicate endpoints.
- Declared input/query/params plus business, ownership and server authorization checks. Menu visibility is not authorization. Complete each response path once, with early returns where fallthrough is possible.
- Existing persistence and cache lifecycle. SQL filters and projections, safe parameters/escaping, request-bound error handling and the exact response envelope expected by the caller.
- SQL names/upgrades consistent with the project; do not force a SQL migration on other storage models.
- Matching jComponent major and component config, catalogue bundle entries, `exec`, local plugin paths, form importer/submit/caller refresh, Tangular binding, `CLASS` and translations.
- Standalone actions (`backend/action-kits.md`): `name`, `summary`, `input`, `output`; configurable values in `config` with no real secret; one answer per path; a test with assertions that needs no network.

Run relevant checks if available and authorized. State what you could not verify. If no actionable findings remain, say so without implying runtime checks that were not performed.

For standalone actions and widgets also read `general/testing.md` and the matching `backend/action-kits.md` or `frontend/cms-widgets.md`. Check anonymous versus authenticated contracts, nullable authorship, fixed status values, test-only config, cached NOW timestamps and actual visual review.
