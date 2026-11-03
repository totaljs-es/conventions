# Sources and scope

Reviewed on 2026-11-03 against six downloaded Total.js 5 application snapshots and local framework source. The downloads have no Git history, so folder names such as `main` are not revision identifiers. `sources.json` records SHA-256 hashes for the specific files used; it does not claim to inventory every app file. Verify current behaviour against the target app's installed dependency, especially when `package.json` says `latest` or `beta`.

## What a rule means

- **Observed pattern:** present in the listed app files. Follow the nearest compatible example in the target app.
- **Repository default:** a choice for new code here, such as ES5 preference, pipe action IDs and dated SQL upgrades. It is not evidence that every Total.js app uses that choice.
- **Framework behaviour:** confirmed in the inspected framework source. Check the installed revision before depending on it.

Current project requirements and explicit user instructions take priority. Preserve existing contracts while correcting style. This reference cannot guarantee approval by an individual reviewer.

## Reference map

Paths below are relative to each downloaded app root. Public links are navigation aids; the hashes describe the local inspected files, not the current remote branch.

| App | Files to start with | Demonstrated pattern |
|---|---|---|
| [CMS](https://github.com/totaljs/cms) | `plugins/redirects/index.js`, `plugins/redirects/schemas/redirects.js`, `plugins/redirects/public/index.html`, `plugins/redirects/public/form.html`, `definitions/func.js`, `definitions/init.js`, `views/admin.html` | Explicit routes, slash action IDs, FileStorage metadata, plugin/form flow, jComponent 19 shell |
| [OpenPlatform](https://github.com/totaljs/openplatform) | `plugins/setup/schemas/groups.js`, `plugins/setup/index.js`, `database.sql`, `database-2024-10-30.sql` | Shared input, SQL actions, route params, dated upgrades |
| [Todomator](https://github.com/totaljs/todomator) | `schemas/tickets.js`, `definitions/init.js`, `definitions/func.js`, `views/index.html`, `views/login.html` | Grouped and standalone actions, ownership filters, `$.done`, service/configure events, different UI shells |
| Dashboard | `plugins/views/index.js`, `plugins/views/public/form.html`, `modules/openplatform.js`, `views/admin.html` | Actions with `route:` in plugin entry, pipe IDs, MEMORIZE, jComponent 20 |
| FlowOS | `definitions/init.js`, `views/index.html` | Flow persistence, websocket permissions, local jComponent 20 assets |
| IoT | `admin/plugins/devices/schemas/devices.js`, `admin/plugins/dataviews/index.js`, `admin/views/admin.html` | `route:` in schema files, paginated lists, permissions, jComponent 20 |

Dashboard and FlowOS declare a Total.js Enterprise license. They and IoT were inspected for patterns; this reference adds no source excerpts from those apps and grants no rights to redistribute them. The code excerpts added here are adapted from the MIT apps or are illustrative combinations explicitly identified as such. Avoid copying bundled libraries, configuration secrets or runtime data into this repository.

## Framework checks

In [Total.js framework5](https://github.com/totaljs/framework5):

- `index.js`, module initialization: `Total.Os`, `Total.Fs`, `Total.Path` and the other native module aliases; `COMPONENTATOR` and `MEMORIZE` implementations.
- `builders.js`, `exports.newaction` and action execution: automatic routes, `user`, `sa` and `permissions`; `Options.prototype.invalid`, `done` and action calling.
- `mcp.js`, tool-name sanitizer: `/` and `|` both become `_`; this is independent of this repository's `|` naming convention. Name corrections require coordinated caller and endpoint updates.
- `querybuilder.js`, `QBP.promise`, `callback`, `autoquery` and `CTP.list`: error flow and query operations.
- `controller.js`, `callback`, `invalid`, `csrf` and payload handling: controller APIs differ from action APIs.

The [official guidelines](https://github.com/totaljs-es/guidelines) remain a style reference; their older examples do not decide v5 API availability.

## Maintaining evidence

When adding a rule, record the file and operation that support it. Label an adapted example and describe any deliberate change (such as converting arrows to functions). When sources disagree, document the alternatives instead of silently presenting one as universal. Update hashes after a new source review; a matching hash proves file identity, not correctness or production readiness.

Verify the recorded files without modifying them:

```bash
node scripts/check-sources.js --apps /path/to/downloaded/apps --framework /path/to/framework5
```

Run this from the conventions repository root. Exit 0 means the selected files match, 1 means drift or missing files, and 2 means invalid arguments. It requires local reference copies; `npm test` uses isolated fixtures and does not need those apps.
