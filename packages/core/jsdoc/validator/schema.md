<a name="module_validator/schema"></a>

## validator/schema ⇒ <code>null</code> \| <code>Array.&lt;boolean&gt;</code>
Module for validating mock data against JSON schema

**Returns**: <code>null</code> \| <code>Array.&lt;boolean&gt;</code> - null if there is no schema or an array with booleans defining the validity of the entries in the data array  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| filePath | <code>string</code> | the path to a template file |
| dataArray | <code>Array</code> | an array with mock data |

