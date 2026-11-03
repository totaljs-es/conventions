# Project structure

A Total.js 5 app is a folder that the framework loads by convention. Put each kind of file where the framework (and the next reader) expects it.

```
index.js            starts the app: require('total5'); F.run(options)
config              settings, one "key : value" per line
package.json        "total5" is the runtime dependency
controllers/        routes: exports.install = function() { ROUTE(...) }
definitions/        auth.js, init.js, func.js, db.js: loaded at start, no exports
modules/            integrations with other systems (cdn, openplatform, tapi...)
plugins/<name>/     a feature: index.js (server), index.html (UI), schemas/, public/
schemas/            actions that are not part of a plugin
views/              layout and pages (HTML with @{...} directives)
public/             static files: default.css, default.js, img/, fonts/
database.sql        the full schema; changes go to dated files next to it
```

Optional, when the app is shipped: `Dockerfile`, `docker-compose.yaml`, `bundle.sh` (writes `--bundles--/app.bundle`), `license.txt`, `readme.md`.

## index.js

The start script is the same in every app and has almost no logic:

```js
require('total5');

var options = {};
options.release = process.argv.indexOf('--release') !== -1;
options.servicemode = process.argv.indexOf('--service') !== -1 || process.argv.indexOf('--servicemode') !== -1;

F.run(options);
```

Run it with `node index.js 8000` (add `--release` for release mode).

## Where things go

- **A route** follows the app's existing pattern: `controllers/*.js` / plugin `index.js`, or the action's `route:` property (Dashboard/IoT/Todomator).
- **Business logic** belongs in actions: usually `schemas/` or `plugins/<name>/schemas/`; compact plugins may declare actions in `index.js` (Dashboard).
- **Shared helpers** hang from `FUNC` (`FUNC.notify`, `FUNC.save`) and live in `definitions/func.js`.
- **Shared state in memory** hangs from `MAIN` (the app) or `REPO` (cached lookups, e.g. `REPO.tags`).
- **Startup work** (config defaults, loading caches, registering UI components) goes in `ON('ready', ...)` in `definitions/init.js`.
- **Authentication** is one `AUTH(...)` in `definitions/auth.js`.

## Files and folders

- All lowercase, words separated by `-`, never `_`: `search-results.html`.
- Static files by type: `/img/`, `/js/`, `/css/`, `/fonts/`, `/videos/`.
- One plugin per feature, named after the feature: `plugins/redirects`, `plugins/users`.
- Generated output (`--bundles--/`, `tmp/`, `databases/`) is not edited by hand.

## Checks

- `node --check path/to/file.js` for every JavaScript file you change.
- Start the app and call the route you touched. If the project has no test script, do not say tests passed.
