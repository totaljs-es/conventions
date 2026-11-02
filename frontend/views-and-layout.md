# Views and layout

## Layout

The shell of an app is one HTML file in `views/` (`admin.html`, `index.html`). It sets the title, loads the UI library, registers global components once and mounts the plugins.

```html
@{layout('')}
@{title(config.name)}

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link href="@{'%cdn'}/spa.min@19.css" rel="stylesheet" />
	<script src="@{'%cdn'}/spa.min@19.js"></script>
	<script src="@{REPO.ui}"></script>
	@{import('meta', 'head', 'default.js + func.js', 'default.css', 'favicon.ico')}
</head>
<body class="invisible">

	<ui-component name="exec"></ui-component>
	<ui-component name="errorhandler"></ui-component>
	<ui-component name="locale" config="requests:1;language:@{language}"></ui-component>
	<ui-component name="LAZY menu" config="style:2"></ui-component>

</body>
</html>
```

- Directives start with `@{...}`: `@{title()}`, `@{import()}`, `@{if}` / `@{fi}`, `@{REPO.ui}`, `@{'%cdn'}` (a config value).
- Global components are declared once in the layout. `LAZY` loads a component only when it is first used.
- The component bundle is loaded with `COMPONENTATOR('ui', 'exec,locale,input,...', true)` in `definitions/init.js`. List only the components the app uses; see [components](components.md).
- `<body class="invisible">` hides the page until the UI is ready.

## Translations

Every text a person reads is wrapped in `@(...)`, in views, in plugin HTML and in server messages: `@(Save)`. The text in English is the key.

## Two kinds of pages

- **App screens** (admin, tools): plugin HTML mounted in the layout, driven by `PLUGIN`.
- **Public pages**: server-rendered views returned by a controller (`$.view('index')`) or compiled from the CMS. They carry no `PLUGIN` logic.

## Naming

Lowercase file names with `-`: `search-results.html`, `form-offer.html`.
