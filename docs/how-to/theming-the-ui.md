# Theming the UI

You can customize the color scheme as well as fonts and the logo to match your current project. This can be done via `config.ui.theme`.

- `css`: string — custom CSS (not a file) you want to be added to _miyagi_
- `favicon`: string — the path to your favicon file
- `logo`: string|object — the path to your logo file
- `js`: string — custom JavaScript (not a file) you want to be added to _miyagi_
- `mode`: string — any of `"light"`, `"dark"` or `"auto"`. This is the default mode in which _miyagi_ is rendered. The user can change this in the UI.

## Changing colors, fonts etc

If you want to adapt the colors, font-family etc. of _miyagi_, it is easiest to use the custom properties _miyagi_ uses internally. You can find these at [https://github.com/miyagi-dev/miyagi/blob/HEAD/frontend/assets/css/tokens.css](https://github.com/miyagi-dev/miyagi/blob/HEAD/frontend/assets/css/tokens.css). You can either set these directly in your config file (`theme.css`) or use a CSS file (see further below).

Using the custom properties, you could also make sure that you do not have separate light and dark modes (in case this does not work for your project). You could do that for example like this:

```css
html {
	--color-IframeText: var(--color-IframeText--light);
	/* … */
}
```

That way, no matter which theme is applied, it would always use the custom properties for the light mode.

## Setting a logo

The `logo` option can either be a path that points to your logo. In this case it would be used for light as well as dark mode.
Alternatively you can use an object with a `light` and a `dark` key, both being paths pointing to individual logos for each of the modes.

## Using external CSS and JS files

If you want to use actual CSS and JS files to theme _miyagi_, you can do that by reading those files using `node:fs` and then use that result in the config:

```js
import fs from "node:fs";

const css = fs.readFileSync("my/custom/styles.css", "utf8");

export default {
	ui: {
		theme: {
			css,
		},
	},
};
```
