# Components (jComponent)

For widgets, forms, lists, inputs and every other piece of UI, **use a component that already exists**. If none fits, **create a component** (do not build the piece with ad hoc markup and scripts). Load components with `COMPONENTATOR()`, always.

## 1. Look for the component first

The catalogue of jComponent components, with the options and examples of each, is in Forge: <https://forge.totaljs.es/es/components/> (also in `/en/components/`).

Before writing UI:

1. Find the component that does the job (input, form, listing, datagrid, notify, menu, approve...).
2. Read its page: what it does, its **configuration** and its context (what path and data it expects, what it needs around it).
3. Use it from markup with `<ui-component name="..." path="..." config="...">`.

Machine-readable forms of the same catalogue (use these from code or an agent):

| What | URL |
|---|---|
| One component as markdown | `https://forge.totaljs.es/en/components/<name>.md` (e.g. `input.md`) |
| The whole catalogue as one text | `https://forge.totaljs.es/llms-components.txt` |
| The catalogue as JSON lines | `https://forge.totaljs.es/components/dataset.jsonl` |
| Index of all Forge pages | `https://forge.totaljs.es/index.json` |

Each page carries its framework version (`jcomponent@20`) and a content hash, so you can tell which version a rule refers to.

## 2. If it does not exist, create a component

A piece of UI that has behaviour is a component, not a block of script inside a page.

```js
COMPONENT('name', function(self, config, cls) {
	// keep the names: "self", "config" and "cls"
});
```

- Names of components, plugins, variables and settings in **lowercase**.
- Keep at most 2-3 levels of nesting in objects.
- Avoid `_` in variable names.
- **Think reusable**: a component takes its data from `path` and its options from `config`, and knows nothing about the screen that uses it.
- Use the same name across projects for the same thing. Check the catalogue before choosing one.

## 3. Load components with COMPONENTATOR()

Never link a component file by hand. List the components the app uses in `definitions/init.js`:

```js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,locale,page,input,form,validate,loading,message,menu,approve,notify,errorhandler', true);
});
```

`COMPONENTATOR(name, components, removeprev, attrs)`:

- `name`: the name of the bundle (`'ui'`).
- `components`: the components of the bundle, comma-separated, without the `j-` prefix.
- `removeprev` (default `true`): deletes the older bundles of the same name when the list changes.
- `attrs`: optional extra parameters for the bundle.

The framework downloads the bundle once, saves it in `public/` as `ui-<name>-<hash>.min.js` and stores its address in `REPO.<name>`. The layout loads it:

```html
<script src="@{REPO.ui}"></script>
```

Rules:

- One `COMPONENTATOR()` call per bundle (`ui` for the app, `webui` for public pages).
- List **only** the components the app uses: the bundle is what every user downloads.
- When you start using a component, add it to the list; when no screen uses it any more, remove it.
- A component you created yourself is a normal file of the app (`public/` or the plugin's `public/`), not a `COMPONENTATOR()` entry.

## 4. Quick check

- Is there a component for this in the catalogue? Use it.
- Did you read its configuration and context before using it? Do.
- Is it in the `COMPONENTATOR()` list? Add it.
- Is there none? Create a reusable `COMPONENT('name', ...)` and use it from markup.

See [plugins-ui](plugins-ui.md) for how screens and forms use components, and [views-and-layout](views-and-layout.md) for the layout that loads the bundle.
