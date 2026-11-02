---
name: totaljs-conventions-write
description: Use when you write or change Total.js 5 code (an action, a route, a plugin, a SQL script, a component, a view) and want it to follow the conventions of real Total.js apps.
---

# Write Total.js 5 code

1. Find the zone of the change and read only its pages in `README.md`: `general/`, `backend/`, `database/` or `frontend/`.
2. Open the nearest existing file of the project you are editing and copy its pattern; use the pages to decide what is idiomatic.
3. Apply the rules that hold for every change:
   - ES5 over ES6 (`var`, `function`, classic loops, `'{0}'.format()`); never `for...in` over an array.
   - Total.js first: prototypes (`findItem`, `findIndex('id', v)`, `parseJSON`, `slug`...) in the backend, Tangular in the frontend.
   - No `require()` of Node.js modules: `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.OS`...
   - Actions `NEWACTION('Collection|verb', { name, input, params, permissions, action })`; routes in `controllers/` or the plugin's `index.js`.
   - Data through `DATA` with `.promise($)`; `UID()` for ids, `NOW` for dates; text for people in `@(Text)`.
   - Frontend: an existing jComponent component first (`input`, `viewbox`, `loading`, `datagrid`, `exec`, `intranetcss`), loaded with `COMPONENTATOR()`; if none exists, a reusable `COMPONENT('name', ...)`.
4. Check what you wrote: `node --check` on each JavaScript file, then start the app and call the route or open the screen.
5. Report the checks you ran and the ones you could not run.

Do not assume a Total.js 4 API exists in version 5: look in the framework source or an existing app.
