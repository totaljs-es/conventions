# Routes and authentication

## Where routes live

In `exports.install` of a file in `controllers/` or of a plugin's `index.js`. One line per route, aligned in columns.

```js
exports.install = function() {

	// Tickets
	ROUTE('+API    ?       -tickets                   --> Tickets|list');
	ROUTE('+API    ?       -tickets_detail/{id}       --> Tickets|read');
	ROUTE('+API    ?       +tickets_create            --> Tickets|create', 1024 * 10);
	ROUTE('+API    ?       +tickets_update/{id}       --> Tickets|update', 1024 * 10);
	ROUTE('+API    ?       -tickets_remove/{id}       --> Tickets|remove');

};
```

Group the lines with a short comment per collection.

## Reading an API route

```
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
        |      |     |                     |                |
        |      |     |                     |                max body size in bytes
        |      |     |                     the action
        |      |     "+" the request has a body (input), "-" it has none
        |      the URL of the endpoint; "?" is replaced by CONF.$api ("/api/" by default)
        "+" only for logged-in users; without it the route is public
```

- Endpoint names are lowercase with `_`: `tickets_create`, `users_remove/{id}`. `{id}` fills `$.params.id`.
- Use `-` for reads and removals, `+` for creates and updates.
- A plugin may bind the endpoint to its own base: `ROUTE('+API /setup/ -users --> Users|list')`.
- Without a size, the default body limit applies. Give a limit to routes that take larger bodies.

## Other routes

```js
ROUTE('+GET    /setup/', setup);         // a page, only for logged-in users
ROUTE('POST    /notify/', notify);       // a public route with a handler function
```

A handler function is `function($)`. Prefer an API route plus an action; use a plain handler for pages, files and webhooks.

## A route declared in the action

`NEWACTION` also accepts `route: 'API ?'` (or `route: true`) and registers the endpoint itself. Total.js 5 apps keep routes in `controllers/`; use the `route:` property only in small apps that have no `controllers/` folder.

## Authentication

One `AUTH` in `definitions/auth.js`. It decides who the request is and calls `$.success(user)` or `$.invalid()`.

```js
AUTH(function($) {
	var token = $.headers['x-token'];
	if (token) {
		if (BLOCKED($, 10)) {      // too many wrong tries from this client
			$.invalid();
			return;
		}
		if (token === CONF.token) {
			BLOCKED($, -1);        // forget the failures
			$.success(BOT);
		} else
			$.invalid();
	} else
		$.invalid();
});
```

- The user object is small: `{ id, name, sa, permissions }`. `sa` marks a super administrator.
- Use `BLOCKED($, count)` to rate-limit failed logins.
- `+` routes call `AUTH` first; actions then check `permissions`.
- `$.ip` takes the first value of `X-Forwarded-For`, which a client can forge. For security limits use `$.req.socket.remoteAddress`, or trust the header only behind your own proxy.
