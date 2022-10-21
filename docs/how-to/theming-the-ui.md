You can customize the color scheme as well as fonts and the logo to match your current project. This can be done via `config.ui.theme`.

The following options are applied to both color modes, `"light"` and `"dark"`:

- `css`: string — custom CSS (not a file) you want to be added to _miyagi_
- `favicon`: string — the path to your favicon file
- `js`: string — custom JavaScript (not a file) you want to be added to _miyagi_
- `mode`: string — any of `"light"`, `"dark"` or `"auto"`

The following options can be applied to both `config.ui.theme.light` and `config.ui.theme.dark`:

- `logo`: string — the path to your logo file
- `navigation.colorText`: string
- `navigation.colorBackground`: string
- `navigation.colorLinks`: string
- `navigation.colorLinksActive`: string
- `navigation.colorSearchBorder`: string
- `content.colorBackground`: string
- `content.colorText`: string
- `content.colorHeadline1`: string
- `content.colorHeadline2`: string

All color options expect any kind of valid CSS color.

Note that you can apply these options also directly to `config.ui.theme` instead of `config.ui.theme.(light|dark)`. This might make sense for the logo for example, if you can use the same one for light and dark mode.

Please also refer to the [configuration options](/configuration/options/#theme).

## Using external CSS and JS files

If you want to use actual CSS and JS files to theme miyagi, you can do that by reading those files with `fs` and then use that result in the config:

```js
const fs = require("fs");
const css = fs.readFileSync("my/custom/styles.css", "utf8");

module.exports = {
	ui: {
		theme: {
			css,
		},
	},
};
```
