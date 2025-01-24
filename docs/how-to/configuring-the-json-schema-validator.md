# Configuring the JSON Schema validator

## Configuring the JSON Schema specification

If you do not configure anything, _miyagi_ uses the default of AJV, which is currently draft-07.

If you want to change this to e.g. draft-2012, you can do that by importing the correct AJV dist and adding it to your config export:

```js
// .miyagi.js

import { Ajv2020 } from "ajv/dist/2020.js";

/* … */

export default {
	/* … */
	schema: {
		ajv: Ajv2020,
	},
};
```

## Configuring options

_miyagi_ uses [Ajv](https://www.npmjs.com/package/ajv) for validating your mock data against JSON schema files.
If you want to configure _Ajv_, please refer to the the [Ajv options](https://ajv.js.org/options.html) on its website.
You can pass these options via `config.schema.options`.
