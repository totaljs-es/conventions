# JavaScript style

Source: the [official guidelines](https://github.com/totaljs-es/guidelines) plus what the Total.js 5 apps do.

## Formatting

- Indent with **tabs** (width 4). No trailing white space.
- End every statement with `;`.
- Short strings in `'` apostrophes.
- A condition with one statement has no braces and no blank line:

```js
// good
if (!item)
	return;

// fine for a simple expression
item && refresh();
```

- Prefer classic `for` / `for...of` loops to `forEach()`.
- **Never use `for...in` on an array**: Total.js adds enumerable methods to `Array.prototype`. Use `for...of` or `Object.keys()`.

## Variables

- Inside functions use `var` or `let`. The official guide says not to use `const` in method scopes; Total.js 5 apps follow it in actions and use `let` in loops (`for (let m of items)`).
- `const` is for module-level constants and for `require()`:

```js
const Path = require('path');   // first letter upper case
const ADMIN = { id: 'admin', sa: true, name: 'Admin', permissions: [] };
```

- Common names, the same in every project: `id`, `name`, `value`, `email`, `items` / `arr` (a collection), `item`, `tmp`, `dtcreated`, `dtupdated`.

## Names

| Thing | Convention | Example |
|---|---|---|
| Files, folders | lowercase, `-` | `form-offer.html` |
| Actions | `Collection/verb` | `Redirects/save` |
| Schemas | plural, first letter upper case; `@Name` for a reusable input | `NEWSCHEMA('Tickets', ...)`, `'@Group'` |
| API routes | lowercase, `_` between collection and verb | `tickets_create` |
| Plugins, components, `FUNC.`, `MAIN.`, `REPO.` keys | lowercase | `FUNC.refreshtags` |
| Table and column names | lowercase | `tbl_user`, `dtcreated` |

## Framework globals

Use the globals that exist instead of writing your own: `UID()` for identifiers, `NOW` for the current date, `CONF` for config, `DATA` for the database, `EMPTYARRAY` / `EMPTYOBJECT` for read-only defaults, `U.normalize()` and other `U.` helpers.

```js
model.id = UID();
model.dtcreated = NOW;
```

## Comments

A comment says why, in one or two lines, above the code it explains. Do not narrate what the next line does.

## Dependencies

Avoid adding any. If the framework has a helper (`RESTBuilder`, `FILESTORAGE`, `U.*`, `DATA`), use it.
