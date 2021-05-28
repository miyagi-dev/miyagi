You can use the JavaScript API if you need to programmatically resolve mock data to valid JSON.
This can be helpful if you want to you use your mock data e.g. for writing tests.

## With Node >= 14.8

```js
import Miyagi from "@miyagi/core/api/index.js";

const { getMockData } = await new Miyagi();

await getMockData({
  component: "path/to/component/folder", // relative to your config.components.folder
  variant: "default", // could be omitted, since "default" is the default
});
```

## With Node < 14.8

```js
import Miyagi from "@miyagi/core/api/index.js";

new Miyagi().then(async ({ getMockData }) => {
  await getMockData({
    component: "path/to/component/folder", // relative to your config.components.folder
    variant: "default", // could be omitted, since "default" is the default
  });
});
```
