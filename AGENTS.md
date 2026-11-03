# AGENTS.md

This repository is a reference of conventions for Total.js 5 applications. Read it before writing or changing Total.js code.

## How to use it

1. Open [README.md](README.md) and pick the zone you work in: `general/`, `backend/`, `database/` or `frontend/`.
2. Read the general rules and the pages for the affected zones. Start with `general/sources.md` and `general/workflow.md` when choosing a pattern or correcting existing code.
3. Copy the pattern of the nearest existing file in the project you are editing; use these pages to decide what is idiomatic.

## Rules that apply to every change

- Total.js 5 only. Do not use Total.js 4 APIs.
- Repository default for new code — ES5 over ES6: `var`, `function`, classic loops, `'{0}'.format()` instead of template literals. ES6 only when there is no ES5 way.
- Use Total.js prototypes (`findItem`, `format`, `parseJSON`, `slug`, `isEmail`...) in the backend and Tangular templates in the frontend before any other function.
- In initialized app code, do not `require()` exposed Node.js modules: use `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`, `Total.Zlib`, etc.
- Runtime code and inputs use recognizable Total.js folders; internal runtime files belong under `private/`, and development documentation, evaluations and standalone examples under `docs/`. The running app must not depend on `docs/`. Update readers, exports, tests and deployment allowlists when moving files.
- Loaded application modules are accessed through `MODS`, not repeated path-based imports. Preserve direct imports in standalone tools and respect module-loading order; see `backend/definitions-and-modules.md`.
- Tabs, semicolons, `'` for short strings, lowercase file names with `-`.
- Use `|` as the separator in action and schema names: `Tickets|list`, `Reports|Categories|list`, `@Reports|Categories`. Do not use `/` or `\` as name separators. When correcting an existing name, update registrations and every caller together, checking generated endpoints and compatibility. See `backend/actions.md`.
- Follow the app's route style: explicit `ROUTE()` or an action's `route:`. Never register the same endpoint twice.
- Keep the existing storage model: `DATA` for SQL, `FILESTORAGE` for files/CMS metadata, `MEMORIZE` where the app uses it. In request queries use `.promise($)` / `.callback($)`; ids are `UID()`, dates are `NOW`.
- Verify APIs against the installed Total.js and UI versions; the source apps mix versions and patterns. Distinguish repository policy from a framework requirement.
- Preserve URLs, permissions, input/output shapes, settings keys and model paths during a style correction. Do not add an abstraction when a direct native call fits; see `general/native-patterns.md`.
- Frontend: match the app's jComponent major version; use an existing jComponent component (catalogue: https://forge.totaljs.es/es/components/, markdown at `https://forge.totaljs.es/en/components/<name>.md`); if none exists, create a reusable `COMPONENT('name', ...)`. Load catalogue components with `COMPONENTATOR()`; load app-owned components from app assets.
- Every text for people is `@(Text)`.
- After editing JavaScript run `node --check file.js`; start the app and call the route you changed.

## Layout

- `general/`, `backend/`, `database/`, `frontend/`: the pages, one folder per zone.
- `llms.txt` (index) and `llms-full.txt` (every page in one file): for models. They are generated, do not edit them by hand.
- `scripts/llms.js`: builds the two files above and lists the pages in order.
- `.claude/skills/` and `.agents/skills/`: the skills to write and to review Total.js 5 code with these conventions.
- `tests/`: tests of the files for agents and of the links of the pages.

## Using these conventions from another project

Point your agent at `llms.txt` (an index with a link to every page) or at `llms-full.txt` (all the pages at once):

- https://raw.githubusercontent.com/totaljs-es/conventions/main/llms.txt
- https://raw.githubusercontent.com/totaljs-es/conventions/main/llms-full.txt

A project can add a line to its own `AGENTS.md`: "Follow the Total.js 5 conventions of https://github.com/totaljs-es/conventions".

## Checking this repository

- `npm test` checks that the pointers and skills exist, that every page is listed in `llms.txt`, that `llms.txt` and `llms-full.txt` match the pages, and that every link works.
- After you change or add a page, run `npm run llms` and `npm test`. A new page is also added to the list in `scripts/llms.js`.

## Keeping these pages true

Every rule here comes from code that exists. When you add a rule, add an example from a real file or from the framework source, and say which.
