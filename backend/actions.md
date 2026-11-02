# Actions

An action is one unit of server logic: a name, the input it accepts, who may call it, and a function. Define it with `NEWACTION` in a `schemas/` file.

```js
NEWACTION('Redirects|save', {
	name: 'Save redirect',
	input: 'id,*url,*target,permanent:Boolean',
	permissions: 'redirects,admin',
	action: function($, model) {

		if (model.id) {
			var item = MAIN.db.redirects.findItem('id', model.id);
			if (!item) {
				$.invalid(404);
				return;
			}
			item.dtupdated = NOW;
			item.url = model.url;
		} else {
			model.id = UID();
			model.dtcreated = NOW;
			MAIN.db.redirects.push(model);
		}

		FUNC.save();
		$.success();
	}
});
```

## Naming

`Collection|verb`, collection in plural and capitalized: `Tickets|list`, `Groups|create`, `Users|remove`. Separate the two parts with a pipe `|`.

The pipe is the convention because of MCP: the MCP router of Total.js 5 documents actions as `Notes|create` and exposes them as the tool `Notes_create` (tool names allow only letters, digits, `_` and `-`). The apps used as source for these pages (CMS, OpenPlatform, Todomator) write `Tickets/list` with a slash; their examples are shown here with a pipe. Use the pipe in new code, so the name an MCP client sees matches the action.

The usual verbs:

| Verb | Does | Input |
|---|---|---|
| `list` | returns a collection, often with `autoquery` | query string |
| `read` | returns one record | `params: '*id:UID'` |
| `create` | inserts, answers with the new id | `input` |
| `update` | modifies one record | `params` + `input` |
| `save` | create or update by `id` | `input` with optional `id` |
| `remove` | deletes or flags one record | `params` |

Always give the action a human `name:` ("Save redirect"): it is used in logs and tools.

## Input and params

- `input:` is the body, `params:` is the route parameters (`{id}`), `query:` is the query string.
- A text spec: `'*name,color:Color,icon:Icon,permissions:[String]'`. A leading `*` makes a field required. After `:` goes the type (`Boolean`, `Number`, `UID`, `Email`, `Phone`, `Color`, `Date`, `String(100)`, `[String]`).
- Reuse a definition with a named schema and `@`:

```js
NEWSCHEMA('@Group', '*name,color:Color,icon:Icon,reference,permissions:[String]');

NEWACTION('Groups|create', {
	name: 'Create group',
	input: '@Group',
	action: async function($, model) { /* ... */ }
});
```

- Route parameters arrive in `$.params`, not as an argument: `$.params.id`.
- A list typed `*field:[String]` is required: an empty list counts as missing. If empty is valid, drop the `*`.

## Answering

| Call | Use |
|---|---|
| `$.callback(data)` | return data (a record, a list, an id) |
| `$.success()` / `$.success(id)` | the success answer of the app (`DEF.onSuccess`: by default `{ success: true }`, with the value if you pass one) |
| `$.invalid(404)` | not found; the number is the HTTP status |
| `$.invalid('@(Text for the user)')` | validation or business error; `@(...)` marks it for translation |

Call exactly one of them, then `return`. An action that never answers hangs the request.

## Permissions

`permissions: 'redirects,admin'` allows users that have any of those permissions. Put it on every action that is not public, even when the route is already authorized.

## Async and data

Actions are `async` when they await `DATA` calls. Pass `$` to `.promise($)` so errors answer the request for you:

```js
action: async function($) {
	var params = $.params;
	var model = await DATA.read('op.tbl_group').id(params.id).error('@(Group not found)').promise($);
	$.callback(model);
}
```

See [queries](../database/queries.md) for `DATA`.

## Calling one action from another

`$.action('Items|types').promise()` (or `ACTION('Items|types', model).promise()` outside a request). Keep shared pieces in an action instead of copying code.

## Keep an action small

If one action grows beyond what fits on a screen, move the parts to `FUNC.` helpers or to other actions. Large filter builders (e.g. a `makefilter($, builder)` function inside the schema) stay next to the actions that use them.
