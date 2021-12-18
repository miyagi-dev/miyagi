You can customize the color scheme as well as fonts and the logo to match your current project. This can be done via `config.theme`.

The following options are applied to both color modes, `"light"` and `"dark"`:

- `css`: string — custom CSS (not a file) you want to be added to _miyagi_
- `favicon`: string — the path to your favicon file
- `fontFamily`: string — the name of your custom font (you might need to at the font-face declaration via `config.theme.css`)
- `js`: string — custom JavaScript (not a file) you want to be added to _miyagi_
- `mode`: string — any of `"light"`, `"dark"` or `"auto"`

The following options can be applied to both `config.theme.light` and `config.theme.dark`:

- `logo`: string — the path to your logo file
- `navigation.colorText`: string
- `navigation.colorBackground`: string
- `navigation.colorLinks`: string
- `navigation.colorLinksActive`: string
- `navigation.colorLinksActiveBackground"`: string
- `navigation.colorSearchText`: string
- `navigation.colorSearchBackground`: string
- `navigation.colorSearchBorder`: string
- `content.colorBackground`: string
- `content.colorText`: string
- `content.colorHeadline1`: string
- `content.colorHeadline2`: string

All color options expect any kind of valid CSS color.

Note that you can apply these options also directly to `config.theme` instead of `config.theme.(light|dark)`. This might make sense for the logo for example, if you can use the same one for light and dark mode.

Please also refer to the [configuration options](/configuration/options/#theme).
