_miyagi_ tries to make using mock data as convenient as possible. Therefore you can create multiple [variants](#variants) in one file, [reference other mock files](#referencing-other-mock-files), [reference template files](#referencing-template-files) and [join those](#joining-templates). It is even possible to use CommonJS modules if you want to [asynchronously create mock data](#asynchronous-mock-data).

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

If you want to fetch mock data from an API or do any other asynchronous operations, you can [change the type of your mock files](/configuration/options/#mocks) to `js` and use CommonJS modules:

```js
module.exports = async function returnMockData() {
  const data = await fetchData();

  return data;
};
```

_**NOTE:** Please note, that the returned value should be a JSON object with the same format as described above._

## Hiding the default variation

If you want to define default mock data, so your variants inherit it, but not render the default variation, you can do that like this:

```json
{
  "$hidden": true,
  "someKey": "someData",
  "$variants": [...]
}
```

## Global mock data

You can define global mocks by creating a `data.json` (`data.js` or `data.yaml`) in your [`components.folder`](/configuration/options#components). This mock data will be merged into your components mock data. The components mock data has higher priority, hence overwrites keys with the same name.
