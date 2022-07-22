## Methods

### `getMockData`

Returns the resolved mock data as a plain JSON object.

#### Options

```json
{
	"component": String, // Required — Path to the component directory, relative from config.components.folder.
	"variant": String // Optional — Variant name. If omitted, the default variant is used.
}
```

#### Response

```json
Promise<{
	"success": Boolean,
	"data": Object|Array, // The resolved mock data
	"message": String // Error message in case that no mock data could be returned
}>
```

### `getHtml`

Returns the rendered variant as a string of HTML.

#### Options

```json
{
	"component": String, // Required — Path to the component directory, relative from config.components.folder.
	"variant": String // Optional — Variant name. If omitted, the default variant is used.
}
```

#### Response

```json
Promise<{
	"success": Boolean,
	"data": String, // The HTML string
	"message": String // Error message in case that no HTML could be returned
}>
```

### `getNode`

Returns the rendered variant as a DOM node. Please note that it will return your component wrapped in a `div` if your component returns more than one top level node.

#### Options

```json
{
	"component": String, // Required — Path to the component directory, relative from config.components.folder.
	"variant": String // Optional — Variant name. If omitted, the default variant is used.
}
```

#### Response

```json
Promise<{
	"success": Boolean,
	"data": HTMLElement,
	"message": String // Error message in case that no node could be returned
}>
```

### `createMockData`

Creates a mock data file based on the components schema file, same as the CLI command.

#### Options

```json
{
	"component": String // Required — Path to the component directory, relative from config.components.folder.
}
```

#### Response

```json
Promise<{
	"success": Boolean,
	"message": String // Error message in case that the mock data could not be created
}>
```

### `createBuild`

Simply triggers a build, same as the CLI command.

#### Options

_None_

#### Response

```json
Promise<{
	"success": Boolean,
	"message": String // Error message in case that the build could not be created
}>
```

## Usage

```js
import Miyagi from "@miyagi/core/api";

const { getMockData } = await new Miyagi();

await getMockData({ … });
```
