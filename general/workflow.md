# Writing and correcting Total.js apps

Use this workflow with the [source map](sources.md) and the pages for the affected zone. It is a review method, not an automatic certification.

## Before writing

1. Read the target project's instructions, entry point, dependencies and nearest working feature. Identify the backend version, browser UI major, storage model and route registration pattern.
2. Select a concrete reference: for example CMS redirects for a FileStorage feature, or OpenPlatform groups for SQL CRUD. Read its route, action, screen and form together.
3. Record the contracts you must preserve: URL and action ID, body/query/params, response envelope, permission IDs, settings keys and plugin/model paths.
4. Find the native helper or existing component before creating a wrapper. See [native patterns](native-patterns.md). Read only the component documentation compatible with the app's UI version.

## Write a feature

Implement the same direct flow as the reference: route → validated action → existing storage → one response, with the UI calling that endpoint and binding its result. Keep `exports`, `$`, `model`, `self`, `config`, `cls` and familiar field names. Add only the files the feature needs. Keep business checks in the action; input validation does not establish ownership or authorization.

For SQL-backed features follow [queries](../database/queries.md) and add the schema upgrade if needed. For memory/FileStorage features use the app's existing load/save and cache hooks. For UI changes follow [binding and forms](../frontend/binding-and-forms.md).

## Correct existing code

Review a bounded feature or diff. For each finding record:

| Field | What to record |
|---|---|
| Location | File and line, with the concrete code |
| Rule | Page and reference file that support the finding |
| Kind | Runtime/API defect, contract change, convention mismatch or optional simplification |
| Correction | Smallest change that fixes it and the callers it affects |
| Verification | Observable result that would demonstrate the fix |

Remove duplicated validation and pass-through wrappers when a native call expresses the same behaviour. Keep ownership/business checks, cancellation, error mapping and other behaviour that the native replacement does not supply. Do not replace all storage with SQL, migrate UI versions or split actions merely to satisfy an example in this guide. Correct action/schema separators to `|` by updating registrations and callers together; check generated endpoints and preserve public URL compatibility. URL paths and plugin method paths keep their own separators.

Make corrections by coherent feature, preserving owner changes. A formatting rewrite and an endpoint redesign have different review risks; keep their intent explicit. Do not edit minified vendor assets, bundles or runtime databases as source.

## Verify the result

- Run `node --check` for changed JS; it does not cover inline scripts in HTML, templates or browser APIs.
- Exercise the affected route with valid and invalid input, anonymous and authorized users, and insufficient permissions. For record operations also check a different owner's record and a missing ID.
- Confirm the response shape expected by the caller, not just a successful HTTP status.
- In the browser, open and reopen the screen/form, create/edit/cancel, submit and confirm caller refresh. Check the served asset and console when the UI changes; test release output if compilation/minification matters.
- Use existing project checks and focused regression tests where behaviour warrants them. Record exactly what ran and what could not run, including unavailable DB, credentials or browser access.

Finish with the concrete changes, evidence and remaining limitations. A successful documentation test only validates this reference's structure; it does not prove an app follows every convention or that its runtime works.

## Project instruction snippet

Add this to a consuming project's instructions when adopting this reference:

```text
Follow the Total.js conventions at https://github.com/totaljs-es/conventions.
Read general/sources.md, general/workflow.md and the pages for this change.
Use the nearest compatible Total.js example. Use | between parts of action
and schema names, never / or \. Update registrations and callers together
when correcting names, checking endpoint compatibility. Preserve URLs,
permissions, storage model and UI major version during corrections.
Report convention findings with file/line, rule, proposed fix and checks run.
```
