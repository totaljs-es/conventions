# Total.js conventions

How Total.js 5 applications are written, learned from real production apps and from the official style guide. It is a reference for people and for AI agents: read the zone you are working in, copy the pattern, keep the names.

Every rule comes with an example taken from the code of the Total.js apps (CMS, Dashboard, OpenPlatform, Todomator) or from the [official guidelines](https://github.com/totaljs-es/guidelines). Where the two differ, the page says so.

## Zones

Each zone is a folder. Read only the one you need.

| Zone | What it covers |
|---|---|
| [`general/`](general) | Project layout, JavaScript style, naming. Applies everywhere. |
| [`backend/`](backend) | Actions, routes, authentication, definitions, modules, gotchas of the server. |
| [`database/`](database) | PostgreSQL scripts and how the code queries them with `DATA`. |
| [`frontend/`](frontend) | Plugins with UI, views and layouts, components, CSS. |

## Pages

- general: [project-structure](general/project-structure.md), [javascript-style](general/javascript-style.md)
- backend: [actions](backend/actions.md), [routes-and-auth](backend/routes-and-auth.md), [definitions-and-modules](backend/definitions-and-modules.md), [gotchas](backend/gotchas.md)
- database: [sql-scripts](database/sql-scripts.md), [queries](database/queries.md)
- frontend: [plugins-ui](frontend/plugins-ui.md), [views-and-layout](frontend/views-and-layout.md), [css](frontend/css.md)

## Principles

1. Follow the code that is already next to yours. A new file looks like its neighbours.
2. Keep names short, lowercase and the same across projects: `id`, `name`, `body`, `dtcreated`, `items`.
3. Declare input once (`input:` / `params:`) and let the framework validate it. The action body trusts what it receives.
4. Keep routes in one place (`controllers/` or the plugin's `index.js`), logic in actions, data access in `DATA`.
5. Add no dependency that the framework already covers.
6. Check what you changed: `node --check file.js`, then run the app and call the route.

## Versions

Written for **Total.js 5** (`total5` on npm). The official guidelines were written for Total.js 4 (`NEWSCHEMA`, `var`); the pages mark the places where Total.js 5 code differs. Do not assume a Total.js 4 API exists in version 5: check the framework source or an existing app.
