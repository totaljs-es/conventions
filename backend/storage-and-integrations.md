# Storage and integrations

Choose the model already used by the feature. The apps do not all store data in SQL.

## Persistence and cache ownership

| Model | Source | How to extend it |
|---|---|---|
| CMS metadata in memory, serialized to FileStorage | CMS `definitions/db.js`, `definitions/func.js`, redirects actions | Mutate the existing collection, call `FUNC.save()`, refresh affected rendering caches when necessary |
| SQL through `DATA` and `querybuilderpg` | OpenPlatform groups; Todomator `definitions/init.js`, `schemas/tickets.js` | Keep projections, filters, identifiers, response shapes and adapter initialization |
| Named persisted memory object | Dashboard `modules/openplatform.js`, `plugins/views/index.js` | Keep `MEMORIZE` object ownership and existing save hooks |
| Flow state | FlowOS `definitions/init.js` | Keep flow load/save lifecycle and websocket permissions together |

The last two are observations, with no Enterprise code reproduced here. Do not switch models during a conventions cleanup.

CMS `FUNC.load` reads `meta`, initializes defaults, compiles widgets and emits reload. `FUNC.save` excludes compiled references before serialization. Changing a page/widget can therefore require cache refresh as well as saving metadata. Follow the feature's actual invalidation path rather than inventing a second cache.

## Outgoing requests

Use `RESTBuilder` and the existing integration configuration. The MIT Todomator source ends `schemas/tickets.js` with a small `TicketCallback` integration using `RESTBuilder.POST(...).callback(NOOP)`. Its notification is intentionally independent; use explicit error handling when an action's result depends on the remote call.

Illustrative request-dependent pattern (adapted to the request style in the framework's `builders.js`, `RESTP.promise`):

```js
var response = await RESTBuilder.GET(CONF.serviceurl).promise($);
```

Check the remote status and response shape required by the integration before returning success. Do not assume a network-success callback proves a valid business response. In a job without `$`, use an error-first callback or handle `.promise()` rejection. Reuse project timeouts, authentication and cancellation conventions when present; verify support in the installed version.

## Configuration and lifecycle

Read configuration through `CONF` and follow the target app's settings loader. CMS and Todomator use `LOADCONFIG` and `configure` hooks; their service listeners refresh or reload state periodically. Do not add a parallel environment/config system to a feature that already has settings.

- Startup work belongs in the existing ready/init path.
- React to configuration changes through the existing `ON('configure', ...)` / `EMIT('configure')` flow.
- Repeated maintenance uses the app's `ON('service', function(counter) { ... })` convention where available, rather than one timer per action call.
- Keep request-dependent errors observable. Use `ERROR('context')` where the surrounding app expects a logging callback; use `NOOP` only for deliberately ignored results.

Sources: CMS `definitions/init.js`, `definitions/func.js`; Todomator `definitions/init.js`, `definitions/func.js`, `definitions/auth.js`. Do not copy development credentials or permissive demo auth from a reference app into a new deployment.
