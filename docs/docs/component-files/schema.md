**File:** `schema.json` or `schema.yaml`

You can use this file to define a [JSON schema](http://json-schema.org/) for your component.

When creating a new component via `miyagi new <component>`, the schema file is created with this content:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "required": [],
  "properties": {}
}
```

Your mock data will be validated against your schema. The result will be rendered on the [component view](/the-ui/#component) and logged in the console (if the validation failed).
