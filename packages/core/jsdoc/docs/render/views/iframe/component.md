## Functions

<dl>
<dt><a href="#renderVariations">renderVariations(object)</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FileContents">FileContents</a> : <code>object</code></dt>
<dd></dd>
</dl>

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
| object.fileContents | [<code>FileContents</code>](#FileContents) | file contents object |
| object.name | <code>string</code> | component name |
| object.cb | <code>function</code> | callback function |
| object.templateFilePath | <code>string</code> | the absolute component file path |

<a name="FileContents"></a>

## FileContents : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| schema | <code>object</code> | schema object |
| schema.string | <code>string</code> | string with schema |
| schema.type | <code>&quot;yaml&quot;</code> \| <code>&quot;json&quot;</code> | the file type of the schema file |
| schema.selected | <code>boolean</code> | true if the schema tab should initially be visible |
| schema.file | <code>string</code> | the schema file path |
| mocks | <code>object</code> | mocks object |
| mocks.string | <code>string</code> | string with mocks |
| mocks.type | <code>&quot;yaml&quot;</code> \| <code>&quot;js&quot;</code> \| <code>&quot;json&quot;</code> | the file type of the mocks file |
| mocks.selected | <code>boolean</code> | true if the mocks tab should initially be visible |
| mocks.file | <code>string</code> | the mock file path |
| template | <code>object</code> | template object |
| template.string | <code>string</code> | string with template |
| template.type | <code>string</code> | the file type of the template file |
| template.selected | <code>boolean</code> | true if the template tab should initially be visible |
| template.file | <code>string</code> | the template file path |

