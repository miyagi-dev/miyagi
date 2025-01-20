## Methods

### `getMockData`

Returns the resolved mock data as a plain JSON object.

#### Options

```
{
	"component": String, // Required — Path to the component directory, relative from config.components.folder.
	"variant": String // Optional — Variant name. If omitted, the default variant is used.
}
```

#### Response

```
Promise<{
	"success": Boolean,
	"data": Object|Array, // The resolved mock data
	"message": String // Error message in case that no mock data could be returned
}>
```

### `getHtml`

Returns the rendered variant as a string of HTML.

#### Options

```
{
	"component": String, // Required — Path to the component directory, relative from config.components.folder.
	"variant": String // Optional — Variant name. If omitted, the default variant is used.
}
```

#### Response

```
Promise<{
	"success": Boolean,
	"data": String, // The HTML string
	"message": String // Error message in case that no HTML could be returned
}>
```

#### Options

```
{
	"component": String, // Required — Path to the component directory, relative from config.components.folder.
	"variant": String // Optional — Variant name. If omitted, the default variant is used.
}
```

#### Response

```
Promise<{
	"success": Boolean,
	"data": HTMLElement,
	"message": String // Error message in case that no node could be returned
}>
```

### `createMockData`

Creates a mock data file based on the components schema file, same as the CLI command.

#### Options

```
{
	"component": String // Required — Path to the component directory, relative from config.components.folder.
}
```

#### Response

```
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

```
Promise<{
	"success": Boolean,
	"message": String // Error message in case that the build could not be created
}>
```

### `createComponent`

Creates component files for a given path.

#### Options

```
{
	"component": String, // Required — Path to component directory.
	"only": Array // Optional — Values can be any of "tpl", "css", js", "mocks", "schema", "docs". If omitted, all files are created.
	"skip": Array // Optional — Values can be any of "tpl", "css", js", "mocks", "schema", "docs". If omitted, all files are created.
}
```

Please note that only either `only` or `skip` should be passed. If both are passed, `only` is used and `skip` is ignored.

#### Response

```
Promise<{
	"success": Boolean,
	"message": String // Error or success message
}>
```

### `lintComponent`

Validates the schema and mock data for a single component.

#### Options

```
{
	"component": String // Required — Path to component directory.
}
```

#### Response

```
Promise<{
	"success": Boolean, // only indicates if linting in general was successful for not, not if there are errors or not
	"data": [{
		"type": String, // Any of "mocks", "schema"
		"data": [{
			"message": String
		}]
	}],
	"message": String // Error message in case success was false
}>
```

### `lintComponents`

Validates the schema and mock data for all components.

#### Options

_None_

#### Response

```
Promise<{
	"success": Boolean, // only indicates if linting in general was successful for not, not if there are errors or not
	"data": [{
		"component": String, // Path to component directory.
		"errors": [{
			"type": String, // Any of "mocks", "schema"
			"data": [{
				"message": String
			}]
		}]
	}],
	"message": String // Error message in case success was false
}>
```

## Usage

```js
import { getMockData } from "@miyagi/core/api";

await getMockData({ … });
```
