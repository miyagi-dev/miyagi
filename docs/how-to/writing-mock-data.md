# Writing mock data

_miyagi_ tries to make using mock data as convenient as possible. Therefore you can create multiple [variants](#variants) in one file, [reference other mock files](#referencing-other-mock-files), [reference template files](#referencing-template-files) and [join those](#joining-templates). It is even possible to use ES modules if you want to [asynchronously create mock data](#asynchronous-mock-data).

_**NOTE:** Please do not use keys that start with `$` as miyagi uses these for specific functionality (more about that below)._

_**NOTE:** The concept of inheriting mock data works best with template engines which allow you to pass data objects into an include. Please check the section [supported template engines](/template-engines) for limitations with certain template engines._

## Default data

The most basic mock file would look something like this:

```json
{
	"label": "Save",
	"type": "submit"
}
```

In the UI this would be shown as a variant with the name "default". If you want to change this name, you can add a `$name` property:

```json
{
	"$name": "save",
	"label": "Save",
	"type": "submit"
}
```

## Variants

You can also add variants, which would be merged with the default data:

```json
{
	"label": "Save",
	"type": "submit",
	"$variants": [
		{
			"$name": "reset disabled",
			"label": "Disabled",
			"disabled": true
		}
	]
}
```

So, the data of the variation `"reset disabled"` would be:

```json
{
	"label": "Disabled",
	"type": "submit",
	"disabled": true
}
```

_**NOTE:** You can also omit the default data if you have variants defined._

### Merging arrays

When you have an array in your default mock data as well as your variant mock data, by default they are merged by concatenation. Example:

```json
{
	"items": [1, 2, 3],
	"$variant": [
		{
			"$name": "variant",
			"items": [4, 5, 6]
		}
	]
}
```

becomes

```json
{
	"items": [1, 2, 3, 4, 5, 6]
}
```

If you want to change this behavior, you can use `$opts` to define a different merging strategy.

#### `overwrite`

`overwrite` simply replaces the first array with the second array:

```json
{
	"item": [1, 2, 3],
	"$variant": [
		{
			"$name": "variant",
			"item": [4, 5, 6],
			"$opts": {
				"item": "overwrite"
			}
		}
	]
}
```

becomes

```json
{
	"item": [4, 5, 6]
}
```

#### `combine`

`combine` is the most complex way to merge two arrays. It does a deep merge of objects at the same index. Other values will be replaced:

```json
{
	"item": [1, { "a": 2 }, { "a": null }],
	"$variants": [
		{
			"$name": "variant",
			"item": [2, { "b": 2 }, { "a": 3 }],
			"$opts": {
				"item": "combine"
			}
		}
	]
}
```

becomes

```json
{
	"item": [2, { "a": 2, "b": 2 }, { "a": 3 }]
}
```

## Referencing other mock files

Instead of manually defining data, you can also reference other mock files like this:

```json
{
	"$ref": "some/other/component"
}
```

It is not necessary to explicitely reference `"some/other/component/mocks.json".` Instead, pointing to the component folder is enough.

When referencing other mock files, you can also overwrite its values:

```json
// some/other/component/mocks.json

{
  "oneVar": "oneValue",
  "anotherVar": "anotherValue"
}

// The referencing mock file:

{
  "$ref": "some/other/component",
  "oneVar": "someOtherValue"
}
```

would result in

```json
{
	"oneVar": "someOtherValue",
	"anotherVar": "anotherValue"
}
```

### Referencing a variation

If you need to reference a variation from another mock file, you can do so by using `#`:

```json
{
	"$ref": "some/other/component#variation-name"
}
```

_**NOTE:** You need to use the normalized variation name, so instead of using `"#Variation name"`, use `"#variation-name".`_

## Using definitions

You can create definitions in mock files, so mock data can be reused in multiple places:

```json
{
	"$defs": {
		"customDefinitionName": {
			"oneVar": "someOtherValue",
			"anotherVar": "anotherValue"
		}
	}
}
```

These definitions can then either be used in the same mock file like this:

```json
{
	"$ref": "#/$defs/customDefinitionName"
}
```

Or you can reference definitions from other mock files:

```json
{
	"$ref": "some/other/component/#/$defs/customDefinitionName"
}
```

## Referencing template files

By referencing a template file using `$tpl`, the object would be converted into a HTML string:

```json
{
	"oneVar": {
		"$tpl": "some/other/component",
		"$ref": "some/other/component"
	}
}
```

would result in

```json
{
	"oneVar": "<someHtml></someHtml>"
}
```

`"<someHtml></someHtml>"` would be the result of rendering the template file in `"some/other/component"` using the data of the mock file in `"some/other/component"`.

### Joining templates

If you want to use multiple components for one HTML string, you can do that by using `$render`:

```json
{
	"html": {
		"$render": [
			{
				"$tpl": "some/component"
			},
			{
				"$tpl": "another/component"
			}
		]
	}
}
```

In this case `html` would be the joined result of rendering `"some/component"` and `"another/component"`.

## Asynchronous mock data

If you want to fetch mock data from an API or do any other asynchronous operations, you can [change the type of your mock files](/configuration/options/#mocks) to `js` and use ES modules:

```js
export default async function returnMockData() {
	const data = await fetchData();

	return data;
}
```

_**NOTE:** Please note, that the returned value should be a JSON object with the same format as described above._

## Hiding the default variation

If you want to define default mock data, so your variants inherit it, but not render the default variation, you can do that using `$hidden`:

```json
{
  "$hidden": true,
  "someKey": "someData",
  "$variants": [...]
}
```

## Global mock data

You can define global mock data by creating a `mocks.json` (or whatever you defined the mock files to be named like in `files.mocks`) in your [`components.folder`](/configuration/options#components). This mock data will be merged into your components mock data. The components mock data has higher priority, hence overwrites keys with the same name.

You can also add definitions (see above) to the global mock data. When referencing them, you can do this with `mocks/#/$defs/…`. `mocks` needs to be replaced with whatever you defined in `files.mocks.name`.
