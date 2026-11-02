---
name: totaljs-conventions-review
description: Use when you review a Total.js 5 change (a diff, a file, a pull request) against the conventions of these pages.
---

# Review a Total.js 5 change

Read `README.md`, then the pages of the zones that the change touches. Check each item and report the ones that fail with the file and line.

**General and style**
- Tabs, `;`, `'` for short strings; lowercase file names with `-`.
- ES5 where an ES5 way exists; no `for...in` over an array; `const` only for module-level constants.
- A Total.js prototype or helper exists for it? (`format`, `findItem`, `parseJSON`, `slug`, `isEmail`, `U.*`, `UID()`, `NOW`)
- No `require()` of Node.js modules (use `Total.*`); no new dependency that the framework covers.
- Comments say why, in one or two lines.

**Backend**
- `Collection|verb` names with a `name:`; `input:` / `params:` declare what the action accepts; `permissions:` on every action that is not public.
- Routes only in `controllers/` or the plugin's `index.js`; endpoint names lowercase with `_`.
- Exactly one answer per path (`$.callback`, `$.success`, `$.invalid`) followed by `return`.
- No raw user input concatenated into SQL; `PG_ESCAPE` when a value must go into the text.

**Database**
- `tbl_` / `cl_` / `view_` prefixes, lowercase, `text` columns, `dt` dates and `is` booleans, identifiers first and dates last, a dated upgrade script.

**Frontend**
- An existing component is used before new markup; components load only through `COMPONENTATOR()`; buttons use `exec`.
- Texts in `@(...)`; `CLASS` scopes the CSS of a plugin; intranetcss classes before new CSS.

Say plainly what you could not check (for example, that you did not run the app).
