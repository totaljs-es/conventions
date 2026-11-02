# CSS

Source: the [official guidelines](https://github.com/totaljs-es/guidelines).

- File names lowercase, words separated by `-`.
- **One rule per line**: keep all declarations of a selector on the same line.
- Strings in `'` apostrophes.
- No vendor prefixes. Put `/*auto*/` at the top of the file and Total.js adds them.
- No LESS and no SASS: Total.js CSS supports variables and nested selectors.

```css
/*auto*/

.class { key1: value; key2: value; key3: value; }
.class > div { key1: value; key2: value; }
```

## In plugins

Style that belongs to a screen goes at the top of its HTML file, scoped with `CLASS`:

```html
<style>
	.CLASS .listing2 figure { margin-bottom: 10px; }
	.CLASS .listing2 .permanent { background-color: #F6E7EA; }
</style>
```

`CLASS` becomes a class unique to the plugin, so the rule cannot leak to other screens.

## Global style

`public/default.css` holds what is shared. Colors that change per user or theme are CSS variables (`:root { --color: ... }`), set once in the layout.

## Static files

`/img/`, `/css/`, `/js/`, `/fonts/`, `/videos/`. Images use the file-name rule: lowercase with dashes.
