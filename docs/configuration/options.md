_headman_ only needs two options to be set: `engine.name` and `files.templates.extension`.
Apart from that all other options are optional.

## `assets`

_Settings for assets that headman serves (independently from your components)._

### `css`

default: `null`<br>
type: `string|array|object`

Can either be a string, an array of strings or an object with your `NODE_ENV`s as key and a string or array as values:

```json
{
  "development": ["src/reset.css", "src/theme.css"],
  "production": ["dist/index.css"]
}
```

This would serve different assets based on your `NODE_ENV`.

### `es6Modules`

default: `false`<br>
type: `boolean`

If you use ES6 modules, you can set this to true, so `type="module"` is added to the `script` tags of your included JS files (useful when using unbundled JavaScript).

### `folder`

default: `null`<br>
type: `string|array`

If you need _headman_ to serve static assets (like images, SVGs, etc.), you can define one or multiple folders here.

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

## `build`

_Settings for creating a static build._

### `folder`

default: `"build/"`<br>
type: `string`

The folder where your build files will be saved. Use `--folder` when using as a cli argument.

## `components`

### `folder`

default: `"."`<br>
type: `string`

The folder where your components live.

_**Tip:** You should set this value to a folder with nothing else but your components as it dramatically improves performance compared to using `"."` when there are a lot of other files in your project._

### `ignores`

default: `["node_modules", ".git", "package.json", "package-lock.json", ".headman.js"]`<br>
type: `array`

_headman_ ignores these folders and files when looking for your components.

When setting a value, it is added to the default value and does not overwrite it.

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

_**Note:** You can use `"<component>"` for  `name` if the file should have the same name as the component folder._

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

_**Note:** You can use `"<component>"` for  `name` if the file should have the same name as the component folder._

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

_**Note:** You can use `"<component>"` for  `name` if the file should have the same name as the component folder._

## `projectName`

default: `"headman"`<br>
type: `string`

## `ui`

_Settings for the [web UI](/web-ui/overview)._


### `reload`

default: `true`<br>
type: `boolean`

Defines if your component automatically reloads after saving.

### `theme`

default:

```json
{
  "favicon": null,
  "logo": null,
  "navigation": {
    "colorBackground": "#f5f5f5",
    "colorLinks": "#222222",
    "colorLinksActive": "#ffffff"
  },
  "content": {
    "colorHeadlines": "#222222",
    "colorText": "#222222"
  }
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
