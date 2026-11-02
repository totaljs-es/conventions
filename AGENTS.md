# AGENTS.md

This repository is a reference of conventions for Total.js 5 applications. Read it before writing or changing Total.js code.

## How to use it

1. Open [README.md](README.md) and pick the zone you work in: `general/`, `backend/`, `database/` or `frontend/`.
2. Read only the pages of that zone. Each page has rules with examples taken from real apps.
3. Copy the pattern of the nearest existing file in the project you are editing; use these pages to decide what is idiomatic.

## Rules that apply to every change

- Total.js 5 only. Do not use Total.js 4 APIs.
- ES5 over ES6: `var`, `function`, classic loops, `'{0}'.format()` instead of template literals. ES6 only when there is no ES5 way.
- Use Total.js prototypes (`findItem`, `format`, `parseJSON`, `slug`, `isEmail`...) in the backend and Tangular templates in the frontend before any other function.
- Do not `require()` Node.js modules: use `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.OS`, `Total.Zlib`, etc.
- Tabs, semicolons, `'` for short strings, lowercase file names with `-`.
- Actions are `NEWACTION('Collection|verb', { name, input, params, permissions, action })`.
- Routes live in `controllers/` or in the plugin's `index.js`: `ROUTE('+API ? -name --> Collection|verb')`.
- Data goes through `DATA` with `.promise($)`; ids are `UID()`, dates are `NOW`.
- Every text for people is `@(Text)`.
- After editing JavaScript run `node --check file.js`; start the app and call the route you changed.

## Keeping these pages true

Every rule here comes from code that exists. When you add a rule, add an example from a real file or from the framework source, and say which.
