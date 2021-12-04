You can use the JavaScript API if you need to programmatically resolve mock data to valid JSON or render components.
This can be helpful if you want to you use your mock data or rendered variants e.g. for writing tests.

## Methods

- `getMockData` returns the resolved mock data as a plain JSON object.
- `getHtml` returns the rendered variant as a string of HTML.
- `getNode` returns the rendered variant as a DOM node. Please note that it will return your component wrapped in a `div` if your component returns more than one top level node.

All methods accept an object like the following:

```json
{
  "component": "path/to/component/folder",
  "variant": "default" // could be omitted, since "default" is the default
}
```

## Usage

```js
import Miyagi from "@miyagi/core/api";

const { getMockData } = await new Miyagi();

await getMockData({
  …
});
```
