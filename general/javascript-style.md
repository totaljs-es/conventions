# JavaScript style

Source: the [official guidelines](https://github.com/totaljs-es/guidelines) plus what the Total.js 5 apps do. Three rules come first, because they decide most of the code you write:

1. **ES5 over ES6.** Always prefer the ES5 way.
2. **Total.js first.** Use the framework's prototypes (backend) and Tangular (frontend) before any other function.
3. **No imports from Node.js.** Use the modules Total.js already exposes.

## 1. ES5 over ES6

Write `var`, `function`, classic loops and string helpers. Use an ES6 feature only when there is no ES5 way to do the same.

| Prefer | Instead of |
|---|---|
| `var item = ...;` | `let` / `const` in a function |
| `function(item) { ... }` | `item => ...` |
| `for (var i = 0; i < arr.length; i++)` or `for (var m of arr)` | `forEach`, `map`, `filter`, `reduce` chains |
| `'Hello {0}'.format(name)` | template literal `` `Hello ${name}` `` |
| `var a = obj.a;` | destructuring, spread, optional chaining |
| `arr.findItem('id', id)` | `arr.find(x => x.id === id)` |

```js
// good
var item = db.redirects.findItem('id', model.id);
if (!item) {
	$.invalid(404);
	return;
}

// avoid
const item = db.redirects.find(m => m.id === model.id);
```

Notes:

- `async` / `await` stays where the framework's own code uses it (`await DATA.find(...).promise($)`): there the ES5 alternative is a callback chain (`.callback($)`), which is also valid when it reads better.
- Some source apps use `let`, arrows and template literals. Do not copy those from them: write the ES5 form.
- `const` is for module-level constants only: `const ADMIN = { id: 'admin', sa: true };`.
- **Never `for...in` over an array**: Total.js adds enumerable methods to `Array.prototype`. Use a classic `for` or `for...of`.

## 2. Total.js first

### Backend: prototypes

Total.js extends `String`, `Array`, `Number` and `Date`. Before writing a helper, a loop or a regular expression, check whether a prototype does it. These exist in Total.js 5:

- **String:** `format`, `parseJSON`, `parseInt`, `parseFloat`, `parseBoolean`, `parseDate`, `parseConfig`, `parseCSV`, `parseXML`, `slug`, `capitalize`, `pluralize`, `max`, `toSearch`, `toKeywords`, `removeTags`, `encode`, `decode`, `safehtml`, `md5`, `sha1`, `sha256`, `hash`, `crc32`, `encrypt`, `decrypt`, `isEmail`, `isPhone`, `isURL`, `isJSON`, `isUID`, `isGUID`, `isNumber`, `isBase64`, `isXSS`, `isSQLInjection`, `indent`, `tslash`.
- **Array:** `findItem`, `findIndex`, `findAll`, `findValue`, `remove`, `quicksort`, `trim`, `first`, `last`, `take`, `skip`, `limit`, `group`, `random`, `wait`, `async`.
- **Number:** `format`, `currency`, `round`, `floor`, `fixed`, `between`, `padLeft`, `padRight`, `filesize`, `pluralize`, `discount`, `parseDate`.
- **Date:** `format`, `add`, `diff`, `extend`, `toUTC`, `setTimeZone`, `parseDate`.

```js
var name = '{0} {1}'.format(first, last);                  // not a template literal
var index = items.findIndex('id', id);                     // not findIndex(m => m.id === id)
var data = text.parseJSON();                               // not try { JSON.parse(text) } catch
var slug = title.slug();                                   // not a hand-made regex
var keywords = body.toKeywords();
if (email.isEmail()) { ... }
```

If you are about to write a utility, search the framework source (`utils.js`) first. The helpers of `U.` (e.g. `U.normalize()`) and the globals (`UID()`, `NOW`, `CONF`, `DATA`) come before your own.

### Frontend: Tangular

In jComponent code and plugin HTML, build text and markup with **Tangular** templates (`{{ value }}`, `{{ foreach m in value }}`, `{{ if }}`) and its helpers, not with string concatenation or DOM-building code.

```html
<script type="text/html">
	{{ foreach m in value }}
	<figure class="exec" data-exec="?/edit" data-id="{{ m.id }}">{{ m.url }}</figure>
	{{ end }}
</script>
```

See [plugins-ui](../frontend/plugins-ui.md).

## 3. No imports from Node.js

Do not `require()` Node.js modules. Total.js exposes them:

| Instead of | Use |
|---|---|
| `require('fs')` | `Total.Fs` |
| `require('path')` | `Total.Path` |
| `require('crypto')` | `Total.Crypto` |
| `require('os')` | `Total.OS` |
| `require('http')` / `require('https')` | `Total.Http` / `Total.Https` (for requests prefer `RESTBuilder`) |
| `require('child_process')` | `Total.Child` |
| `require('zlib')` | `Total.Zlib` |
| `require('url')`, `require('util')`, `require('stream')` | `Total.Url`, `Total.Util`, `Total.Stream` |

Also available: `Total.Cluster`, `Total.Dns`, `Total.Net`, `Total.Tls`, `Total.Worker` and `Total.isBundle` (since v0.0.50). Third-party packages are the last resort: the framework usually covers the need.

```js
// good
var file = Total.Path.join(F.tmpdir, 'data.json');

// avoid
const Path = require('path');
```

(The official guide shows `const Path = require('path')`. That was for Total.js 4; in Total.js 5 use `Total.Path`.)

## Formatting

- Indent with **tabs** (width 4). No trailing white space.
- End every statement with `;`.
- Short strings in `'` apostrophes.
- A condition with one statement has no braces and no blank line:

```js
if (!item)
	return;

item && refresh();     // fine for a simple expression
```

## Variables and names

- Common names, the same in every project: `id`, `name`, `value`, `email`, `items` / `arr` (a collection), `item`, `tmp`, `dtcreated`, `dtupdated`.

| Thing | Convention | Example |
|---|---|---|
| Files, folders | lowercase, `-` | `form-offer.html` |
| Actions | `Collection\|verb` (pipe; exposed to MCP as `Collection_verb`) | `Redirects\|save` |
| Schemas | plural, first letter upper case; `@Name` for a reusable input | `NEWSCHEMA('Tickets', ...)`, `'@Group'` |
| API routes | lowercase, `_` between collection and verb | `tickets_create` |
| Plugins, components, `FUNC.`, `MAIN.`, `REPO.` keys | lowercase | `FUNC.refreshtags` |
| Table and column names | lowercase | `tbl_user`, `dtcreated` |

## Framework globals

Use the globals that exist instead of writing your own: `UID()` for identifiers, `NOW` for the current date, `CONF` for config, `DATA` for the database, `EMPTYARRAY` / `EMPTYOBJECT` for read-only defaults.

```js
model.id = UID();
model.dtcreated = NOW;
```

## Comments

A comment says why, in one or two lines, above the code it explains. Do not narrate what the next line does.

## Dependencies

Avoid adding any. If the framework has a helper (`RESTBuilder`, `FILESTORAGE`, `U.*`, `DATA`, a prototype), use it.
