# Definitions and modules

## definitions/

Files here are loaded when the app starts. They export nothing: they register things on the framework. One file per concern.

| File | Holds |
|---|---|
| `auth.js` | the single `AUTH(...)` |
| `init.js` | config defaults and `ON('ready', ...)`: load caches, register UI components |
| `func.js` | shared helpers as `FUNC.name = function() {}` |
| `db.js` | shared state objects (`MAIN.id`, `MAIN.db`) |

```js
// definitions/init.js
CONF.version = '1';
if (!CONF.cdn)
	CONF.cdn = 'https://cdn.componentator.com';

ON('ready', function() {
	setTimeout(FUNC.load, 500);
	COMPONENTATOR('ui', 'exec,locale,input,form,validate,...', true);
});
```

```js
// definitions/func.js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

- Helpers are named in lowercase without separators: `FUNC.refreshtags`, `FUNC.notify`.
- Use `ON('ready')` for anything that needs the app and the database to be up.
- `EMIT('configure')` / `ON('configure')` is how parts of the app react to a config change.

## config

A plain file, one `key : value` per line. Read it with `CONF.key`. Settings the framework owns start with `$`: `$api`, `$minifyjs`. Secrets (keys, database URLs) do not belong in a repository: keep them in the deployment config.

## modules/

A module is an integration with another system or a self-contained service (`cdn.js`, `openplatform.js`, `visitors.js`). It uses the same `exports.install` pattern as a controller and may add its own globals (`OpenPlatform`). Keep a module independent: it reads `CONF`, not other modules' internals.

## Shared state

- `MAIN`: the application's own state (`MAIN.db`, `MAIN.cache`).
- `REPO`: cached lookups that the UI also needs (`REPO.tags`, `REPO.ui`).
- `FUNC`: functions shared by actions and controllers.

Do not create new globals. Hang things from these three.

## Config in the database

When settings live in a table (`cl_config`), load them with `LOADCONFIG(rows)` and emit `configure`, as `FUNC.reconfigure` does in Todomator.
