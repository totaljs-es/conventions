# Instructions for GitHub Copilot

The full instructions of this repository are in `AGENTS.md`. The ones that matter most when you write Total.js 5 code:

- ES5 over ES6: `var`, `function`, classic loops, `'{0}'.format()` instead of template literals.
- Use the Total.js prototypes (`findItem`, `parseJSON`, `slug`...) in the backend and Tangular in the frontend before any other function.
- Do not `require()` Node.js modules: use `Total.Fs`, `Total.Path`, `Total.Crypto`...
- Actions are named `Collection|verb`; routes live in `controllers/` or the plugin's `index.js`.
- In the frontend use an existing jComponent component, and load components only with `COMPONENTATOR()`.
