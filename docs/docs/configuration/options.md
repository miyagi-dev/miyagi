_miyagi_ works without setting any configuration by analyzing your files and guessing the correct template engine and template files extension. If this does not work or you want to customize it further, _miyagi_ offers many configuration options.

## `assets`

_Settings for assets that miyagi serves (independently from your components)._

### `root`

default: `""`<br>
type: `string`

This settings can be helpful if assets are located in another folder, e.g. `public/assets`, but they should actually be served from `assets/`. In that case you could set this option to `public`.

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

### `es6Modules`

default: `false`<br>
type: `boolean|object`

If you use ES6 modules, you can set this to true, so `type="module"` is added to the `script` tags of your included JS files (useful when using unbundled JavaScript). It is also possible to define this for each `NODE_ENV` via an object like this:

```json
{
  "development": true,
  "production": false
}
```

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

Can either be a string, an array of strings or an object with your `NODE_ENV`s as key and a string or array as values:

```json
{
  "development": ["src/index.js", "src/module.js"],
  "production": ["dist/index.js"]
}
```

This would serve different assets based on your `NODE_ENV`.

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

## engine

### instance

default `null`<br>

See [Extending template engine](/configuration/extending-template-engine)

### name

default: `null`<br>
type: `string`<br>
required: `true`

The name of your template engine (see [supported template engines](/template-engines))

### options

default: `null`<br>
type: `object`

These options are passed to the rendering function of your template engine. You can use that for setting a custom namespace e.g..

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

### `docs`

default:

```json
{
  "extension": "md",
  "name": "index"
}
```

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
  "extension": "json",
  "name": "mocks"
}
```

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

## `projectName`

default: `"miyagi"`<br>
type: `string`

## `ui`

_Settings for the [web UI](/web-ui/overview)._

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
  "logo": null, // path to a logo
  "mode": "light", // "light" or "dark"
  "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  "navigation": {
    "colorText": "#707070",
    "colorBackground": "#f5f5f5",
    "colorLinks": "#222222",
    "colorLinksActive": "#ffffff",
    "colorLinksActiveBackground": "#707070"
  },
  "content": {
    "colorBackground": "#ffffff",
    "colorHeadline1": "#222222",
    "colorHeadline2": "#222222",
    "colorText": "#222222"
  },
  "css": "", // string of CSS which gets added to miyagi and components. can be used to changed the styling of miyagi or e.g. add custom fonts defined in `fontFamily`,
  "js": "" // string of JS which gets added to components
}
```

### `validations`

[Read more about validations](/web-ui/variation#validations) in the Web UI section.

#### `accessibility`

default: `true`<br>
type: `boolean`

#### `html`

default: `true`<br>
type: `boolean`

## `schema`

default: `{}`<br>
type: `object`

This object gets passed to the instance of the [schema validator AJV](https://github.com/ajv-validator/ajv/). [See all available options](https://github.com/ajv-validator/ajv/#options).
You can use this to define custom formats e.g..
