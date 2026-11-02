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
- Frontend: use an existing jComponent component (catalogue: https://forge.totaljs.es/es/components/, markdown at `https://forge.totaljs.es/en/components/<name>.md`); if none exists, create a reusable `COMPONENT('name', ...)`. Load components only with `COMPONENTATOR()`.
- Every text for people is `@(Text)`.
- After editing JavaScript run `node --check file.js`; start the app and call the route you changed.

## Layout

- `general/`, `backend/`, `database/`, `frontend/`: the pages, one folder per zone.
- `llms.txt` (index) and `llms-full.txt` (every page in one file): for models. They are generated, do not edit them by hand.
- `scripts/llms.js`: builds the two files above and lists the pages in order.
- `.claude/skills/` and `.agents/skills/`: the skills to write and to review Total.js 5 code with these conventions.
- `tests/`: tests of the files for agents and of the links of the pages.

## Using these conventions from another project

Point your agent at `llms.txt` (an index with a link to every page) or at `llms-full.txt` (all the pages at once):

- https://raw.githubusercontent.com/totaljs-es/conventions/main/llms.txt
- https://raw.githubusercontent.com/totaljs-es/conventions/main/llms-full.txt

A project can add a line to its own `AGENTS.md`: "Follow the Total.js 5 conventions of https://github.com/totaljs-es/conventions".

## Checking this repository

- `npm test` checks that the pointers and skills exist, that every page is listed in `llms.txt`, that `llms.txt` and `llms-full.txt` match the pages, and that every link works.
- After you change or add a page, run `npm run llms` and `npm test`. A new page is also added to the list in `scripts/llms.js`.

## Keeping these pages true

Every rule here comes from code that exists. When you add a rule, add an example from a real file or from the framework source, and say which.
