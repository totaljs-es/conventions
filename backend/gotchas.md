# Gotchas of the server

Things that behave differently from what you would guess. Each one is a rule.

## Answers

- In an **action**, `$.callback(data)` returns data. In a plain **route handler** (`function($)`), `$.callback(err, value)` takes the error first: answer with `$.json(data)` instead.
- A status code on a handler: `$.status = 401; $.invalid('...')`, or `$.response.status = 401; $.json(...)`.
- With `promise()` an action loses the HTTP code of the error. Put the code in `$.invalid('@(msg)', code)`.

## Request data

- Route parameters (`{id}`) are in `$.params`.
- `$.body` is already parsed. The raw body (for webhook signatures) is `$.payload`, a Buffer.
- `$.ip` is the first `X-Forwarded-For` value: forgeable. Use `$.req.socket.remoteAddress` for security limits.
- The CSRF token is bound to the IP and `@{csrf}` can fail in views; pass `encodeURIComponent($.csrf())` through the repository.
- The session is bound to the user agent: a request with another user agent (a mobile emulation in a test browser) is unauthorized.

## Schemas and input

- A `Boolean` that is absent is `false`. Use `partial: true` when absence must mean "unchanged".
- With `partial`, a `null` number is ignored; use `0` for "none".
- `*field:[String]` rejects an empty list; drop the `*` if empty is allowed.
- Never `for...in` over an array. Use `for...of`.

## Served JavaScript and static files

- The JavaScript minifier (on by default in release) can break code that `node --check` accepts: a regex literal containing `//` is cut as a comment (write `indexOf('https://')` instead), and spaces next to `${...}` in template literals are removed. Check the served file, or set `$minifyjs : false` in `config`.
- In release, static files are served from memory: restart the app after changing them. Browsers also cache: force a reload while testing.

## Data

- NoSQL: `NOSQL('x').find().where(...)`; `.sort(field, true)` is **descending**. Updates append a line and mark the old one, so the file grows until it is cleaned.
- NoSQL dates arrive on the server as `Date`, on the client as text.

## Tests

- `opt.config` passed to `Total.run` is overridden by `(env)` entries of the config: set `process.env` first.
- `total5 translate` scans the whole directory, `node_modules` included; run it on a copy of the sources or use a small script.
