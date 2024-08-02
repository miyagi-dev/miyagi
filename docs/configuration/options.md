## `assets`

_Settings for assets that miyagi serves (independently from your components)._

### `root`

default: `""`<br>
type: `string|object`

This setting can be helpful if assets are located in another folder, e.g. `public/assets`, but they should actually be served from `assets/`. In that case you could set this option to `public`.

It is also possible to define this for each `NODE_ENV` via an object like this:

```json
{
	"development": "some/folder",
	"production": ""
}
```

### `css`

default: `null`<br>
type: `object`

Can either be a string, an array of strings or an object with your `NODE_ENV`s as key and a string or array as values:

```json
{
	"development": ["src/reset.css", "src/theme.css"],
	"production": ["dist/index.css"]
}
```

This would serve different assets based on your `NODE_ENV`.

### `customProperties`

default:

```json
{
	"files": [],
	"prefixes": {
		"color": "color",
		"typo": "typo",
		"spacing": "spacing"
	}
}
```

type: `object`

This object is used to generate your automated styleguide.

[More information about automated styleguides](/automated-styleguide).

### `folder`

default: `null`<br>
type: `string|array|object`

If you need _miyagi_ to serve static assets (like images, SVGs, etc.), you can define one or multiple folders here.

Can either be a string, an array of strings or an object with your `NODE_ENV`s as key and a string or array as values:

```json
{
	"development": ["svgs", "templates"],
	"production": ["templates"]
}
```

This would serve different assets based on your `NODE_ENV`.

### `js`

default: `null`<br>
type: `string|array|object`

This would be the most complex way to define this option:

```json
{
  "development": [
    {
      "src": "src/index.js",
      "defer": false,
      "async": false,
      "type": null,
      "position": "head"
    }
  ],
  "production": [{ … }]
}
```

This would serve different assets based on your `NODE_ENV` (`"development"` or `"production"` in this case).
It can be simplified to by omitting the node envs, not using an array or simply using a string (for the source file).

Please also refer to How to: [Adding JS files](/how-to/adding-js-files/).

### `manifest`

default: `null`<br>
type: `string`

If you create CSS and JS files with hashes and have therefore a manifest file, you can set this here and then use the same keys of the manifest file for your CSS and JS files in `assets.css` and `assets.js`. _miyagi_ will then resolve these.

## `build`

_Settings for creating a static build._

### `basePath`

default: `/`<br>
type: `string`

If you deploy your build into a subfolder instead of the root folder, set this option to the path of the subfolder.

### `folder`

default: `"build/"`<br>
type: `string`

The folder where your build files will be saved. Use `--folder` when using as a cli argument.

### `outputFile`

default: `false`<br>
type: `boolean`

Defines if an `output.json` file (containing all paths to the standalone views of a component) should be created.

## `components`

### `folder`

default: `"src"`<br>
type: `string`

The folder where your components live.

### `ignores`

default: `["node_modules", ".git", "package.json", "package-lock.json", ".miyagi.js"]`<br>
type: `array`

_miyagi_ ignores these folders and files when looking for your components.

When setting a value, it is added to the default value and does not overwrite it.

### `lang`

default: `"en"`<br>
type: `string`

Used to determine the language of components. This will set the value for the `lang` attribute.

### `renderInIframe`

default: `{ default: false, except: [] }`<br>
type: `object`

Determines if variants on the component view should be rendered in an iframe or not. Rendering in iframe makes sense when for example the component depends on media queries or has elements which are positioned fixed.
If you have small components with a box-shadow for example, you might not want to render them inside an iframe, since the box-shadow would be cut off. Please also note that extensive usage of iframes slows down the page. So if you have a lot of variants, it might be better to not render the variants in iframes.

`except` accepts globs. Its meaning depends on the value of `default`. So, if by default variants are rendered in an iframe, components that match one of the globs from the `except` array, are not rendered in an iframe.
If `default` is false, these components are rendered in an iframe.

_**Note:** After the `load` and `DOMContentLoaded` events of the iframes have been fired, their height is set to the height of the variant inside the iframe if it is smaller than the window. That way it is basically not noticable that the variant is rendered inside an iframe. In case that the variant is higher than the window, the iframe will have the same height as the window and be scrollable. After the `load` event the height will not be updated anymore when the height of the variant changes. This is necessary to avoid resize loops._

### `textDirection`

default: `"ltr"`<br>
type: `string`

Used to determine the value of the `dir` attribute on the `<html>` element.

_**Note:** This only applies the text direction of the components, not if miyagi itself_

## docs

### folder

default: `"docs"`<br>
type: `string|null`

The folder where your documentation lives.

## engine

### render

default `null`<br>
type: `Function`
required: true

The render function for your templates. The function will be called with an object containing the following key/value pairs:

- `name`: type `string` — the template path
- `context`: type `object` — the data being passed to the template
- `cb`: type `Function` — callback functions that expects an error as the first, and the HTML response as a second argument.

#### Example

```js
{
	engine: {
		async render({ name, context, cb }) {
			try {
				return cb(null, await twing.render(name, context));
			} catch (err) {
				return cb(err.toString());
			}
		}
	}
}
```

## `extensions`

default: `[]`<br>
type: `array`

## `projectName`

default: `"miyagi"`<br>
type: `string`

## `files`

_This is the configuration for your actual component files._

Each entry accepts an object with the following keys:

- `extension`: the file extension in your components folder (type: `string`)
- `name`: the name of the file in your components folder (type: `string`)

### `css`

default:

```json
{
	"extension": "css",
	"name": "index"
}
```

_**Note:** You can use `"<component>"` for `name` if the file should have the same name as the component folder._

### `js`

default:

```json
{
	"extension": "js",
	"name": "index"
}
```

_**Note:** You can use `"<component>"` for `name` if the file should have the same name as the component folder._

### `mocks`

default:

```json
{
	"extension": ["json", "js"],
	"name": "mocks"
}
```

This option supports multiple file extension. This can be helpful if you usually have static mock data, but in some cases you want run some method which returns the mock data (see [Asynchronous mock data](/how-to/writing-mock-data/#asynchronous-mock-data)).

The main extension for mock data is always the first one of this array. So, for example, when creating components via `miyagi new` the mock data would be of type `json` (when using the default values).

If you provide a string instead of an array, you can still use `.js` files as well, as this is the fallback for the second extension.

### `schema`

default:

```json
{
	"extension": "json",
	"name": "schema"
}
```

### `templates`

default:

```json
{
	"name": "index",
	"extension": null
}
```

_**Note:** You can use `"<component>"` for `name` if the file should have the same name as the component folder._

## `namespaces`

Namespaces are often used in templating engines. While you need to add these to your templating engine directly, you can use the same namespaces also in your mock files to reference template or other mock files.

default: `{}`<br>
type: `object`

Example:

```json
{
	"@templates": "/path/to/your/templates"
}
```

You can then use `$tpl: "@templates/some-template"` or `$ref: "@templates/some-mocks"` in your mock data.

## `ui`

_Settings for the [web UI](/the-ui)._

### `reload`

default: `true`<br>
type: `boolean`

Defines if your component automatically reloads after saving.

### `reloadAfterChanges`

#### `componentAssets`

default: `false`<br>
type: `boolean`

Defines if your component automatically reloads after the css or js file of your component has been updated.

_**NOTE:** This is disabled by default for the case that you have a build process that bundles your components assets. These bundled files could be added to your configuration in the [`assets key`](#assets)._

### `textDirection`

default: `"ltr"`<br>
type: `string`

Defines the text direction (`dir` attribute on the `html` tag) of the _miyagi_ UI.

_**NOTE:** This does not set the text direction for the components. If you want to change that as well, please have a look at [`components.textDirection`](#textdirection)._

### `theme`

default:

```json
{
	"favicon": null, // path to a favicon
	"logo": null, // path to a logo — can be used if the same logo should be used for light and dark mode
	"mode": "light", // "light", "dark" or "auto" (means it uses the OS setting)
	"light": {
		// theming for light mode
		"logo": null, // path to a logo
		"navigation": {
			"colorText": "hsl(0, 0%, 12%)",
			"colorBackground": "hsl(0, 0%, 86%)",
			"colorLinks": "hsl(0, 0%, 12%)",
			"colorLinksActive": "hsl(0, 0%, 96%)",
			"colorSearchBorder": "rgba(0, 0, 0, 0.25)"
		},
		"content": {
			"colorBackground": "hsl(0, 0%, 100%)",
			"colorText": "hsl(0, 0%, 12%)",
			"colorHeadline1": "hsl(0, 0%, 12%)",
			"colorHeadline2": "hsl(0, 0%, 12%)"
		}
	},
	"dark": {
		// theming for light mode
		"logo": null, // path to a logo
		"navigation": {
			"colorText": "hsl(0, 0%, 100%)",
			"colorBackground": "hsl(0, 0%, 16%)",
			"colorLinks": "hsl(0, 0%, 100%)",
			"colorLinksActive": "hsl(0, 0%, 16%)",
			"colorSearchBorder": "rgba(255, 255, 255, 0.25)"
		},
		"content": {
			"colorBackground": "hsl(0, 0%, 16%)",
			"colorText": "hsl(0, 0%, 100%)",
			"colorHeadline1": "hsl(0, 0%, 100%)",
			"colorHeadline2": "hsl(0, 0%, 100%)"
		}
	},
	"css": null, // string of CSS which gets added to miyagi and components. can be used to changed the styling of miyagi or e.g. add custom fonts,
	"js": null // string of JS which gets added to components
}
```

## `schema`

default: `{}`<br>
type: `object`

This object gets passed to the instance of the [schema validator AJV](https://github.com/ajv-validator/ajv/). [See all available options](https://github.com/ajv-validator/ajv/#options).
You can use this to define custom formats e.g..
