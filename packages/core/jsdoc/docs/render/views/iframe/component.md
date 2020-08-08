<a name="renderVariations"></a>

## renderVariations(object)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | parameter object |
| object.app | <code>object</code> | the express instance |
| object.res | <code>object</code> | the express response object |
| object.file | <code>string</code> | short component path |
| object.context | <code>Array</code> | mock data for each variation |
| object.componentDocumentation | <code>string</code> | html string with documentation |
| object.fileContents | <code>object</code> | file contents object |
| object.fileContents.schema | <code>object</code> | schema object |
| object.fileContents.schema.string | <code>string</code> | html string with schema |
| object.fileContents.schema.type | <code>&quot;yaml&quot;</code> \| <code>&quot;js&quot;</code> | the file type of the schema file |
| object.fileContents.schema.selected | <code>boolean</code> | true if the schema tab should initially be visible |
| object.fileContents.mocks | <code>object</code> | mocks object |
| object.fileContents.mocks.string | <code>string</code> | html string with mocks |
| object.fileContents.mocks.type | <code>&quot;yaml&quot;</code> \| <code>&quot;js&quot;</code> | the file type of the mocks file |
| object.fileContents.mocks.selected | <code>boolean</code> | true if the mocks tab should initially be visible |
| object.name | <code>string</code> | component name |
| object.cb | <code>function</code> | callback function |
| object.fullFilePath | <code>string</code> | the absolute component file path |

