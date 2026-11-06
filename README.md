# Total.js conventions

How Total.js 5 applications are written. It is a reference for people and for AI agents: read the zone you are working in, copy the pattern, keep the names.


## Zones

Each zone is a folder. Read the general rules, then the pages relevant to your change.

| Zone | What it covers |
|---|---|
| [`general/`](general) | Project layout, JavaScript style, naming. Applies everywhere. |
| [`backend/`](backend) | Actions, routes, authentication, definitions, modules, gotchas of the server. |
| [`database/`](database) | PostgreSQL scripts and how the code queries them with `DATA`. |
| [`frontend/`](frontend) | jComponent components (use the existing ones, `COMPONENTATOR()`), plugins with UI, views and layouts, CSS. |

## Pages

- general: [workflow](general/workflow.md), [native-patterns](general/native-patterns.md), [project-structure](general/project-structure.md), [javascript-style](general/javascript-style.md), [testing](general/testing.md)
- backend: [storage-and-integrations](backend/storage-and-integrations.md), [actions](backend/actions.md), [action-kits](backend/action-kits.md), [routes-and-auth](backend/routes-and-auth.md), [definitions-and-modules](backend/definitions-and-modules.md), [gotchas](backend/gotchas.md)
- database: [sql-scripts](database/sql-scripts.md), [queries](database/queries.md)
- frontend: [binding-and-forms](frontend/binding-and-forms.md), [components](frontend/components.md), [plugins-ui](frontend/plugins-ui.md), [views-and-layout](frontend/views-and-layout.md), [css](frontend/css.md), [CMS widgets](frontend/cms-widgets.md)

## For AI agents

- [`AGENTS.md`](AGENTS.md): how to use these pages and the rules for every change (also `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md`, which point to it).
- [`llms.txt`](llms.txt): an index with a link to every page; [`llms-full.txt`](llms-full.txt): every page in one file.
- Skills to write and to review code with these conventions: [`skills/`](skills).
- [`tools/check.js`](tools/check.js): `node tools/check.js <path>` checks files against the rules a script can decide.

## Claude Code plugin

The plugin `totaljs-conventions` adds two skills (write and review Total.js 5 code) and a hook that runs the check after each edit, so Claude gets told when it writes a rule-breaking line. Install it once and it works in every Total.js project:

```bash
/plugin marketplace add totaljs-es/conventions
```

```bash
/plugin install totaljs-conventions@totaljs-es
```

Update it later with `/plugin marketplace update totaljs-es`. The hook only acts on projects that depend on `total5`, inside the Total.js folders (`schemas/`, `controllers/`, `definitions/`, `modules/`, `plugins/`, `actions/`, `views/`). It reports what it finds in the file you edited and changes nothing by itself.

Other agents: point them at [`AGENTS.md`](AGENTS.md) or [`llms.txt`](llms.txt). To run the check without Claude Code: `node tools/check.js <file|directory>`.

## Principles

1. **ES5 over ES6**: `var`, `function`, classic loops. ES6 only when there is no ES5 way.
2. **Total.js first**: prototypes (`'{0}'.format()`, `findItem()`, `parseJSON()`...) in the backend and Tangular in the frontend, before any other function.
3. **No imports from Node.js**: use `Total.Fs`, `Total.Path`, `Total.Crypto`... instead of `require()`.
4. Keep runtime code and inputs in recognizable Total.js folders. Use `private/` for internal runtime files, `docs/` for development material, and `MODS` for loaded application modules. Follow the code that is already next to yours. A new file looks like its neighbours.
5. Keep names short, lowercase and the same across projects: `id`, `name`, `body`, `dtcreated`, `items`. Use `|` between parts of action and schema names (`Tickets|list`, `@Reports|Categories`), never `/` or `\`.
6. Declare types once (`input:` / `params:` / `query:`). In the action, still check ownership, permissions, existence and business constraints.
7. Follow the app's route registration pattern: explicit `ROUTE()` or the action's `route:`. Keep business logic in actions and use the existing storage model.
8. Add no dependency that the framework already covers.
9. Check what you changed: `node --check file.js`, then run the app and call the route.

## Creating and correcting apps

Start with the [write and refactor workflow](general/workflow.md). It covers choosing a reference, preserving contracts, reviewing existing code and recording checks. Use [native patterns](general/native-patterns.md) to replace unnecessary wrappers, [storage and integrations](backend/storage-and-integrations.md) for persistence and outgoing HTTP, and [binding and forms](frontend/binding-and-forms.md) for a complete UI flow.

## Versions

Written for **Total.js 5** (`total5` on npm). Do not use Total.js 4 APIs.

## License

[MIT](LICENSE).
