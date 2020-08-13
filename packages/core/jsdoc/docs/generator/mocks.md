<a name="module_generatorMocks"></a>

## generatorMocks
Module for creating dummy mock data based on JSON schema


| Param | Type | Description |
| --- | --- | --- |
| folderPath | <code>string</code> | the path for the component that should be created |
| filesConfig | <code>object</code> | the files configuration from the user configuration object |


* [generatorMocks](#module_generatorMocks)
    * [~getContent(fileType, schema)](#module_generatorMocks..getContent) ⇒ <code>string</code>
    * [~createFile(content, mockFilePath)](#module_generatorMocks..createFile)
    * [~readFile(filePath)](#module_generatorMocks..readFile) ⇒ <code>Promise</code>

<a name="module_generatorMocks..getContent"></a>

### generatorMocks~getContent(fileType, schema) ⇒ <code>string</code>
Returns the dummy mock data in the correct format

**Kind**: inner method of [<code>generatorMocks</code>](#module_generatorMocks)  
**Returns**: <code>string</code> - the dummy mock data  

| Param | Type | Description |
| --- | --- | --- |
| fileType | <code>string</code> | the file type of the mock data that should be created |
| schema | <code>object</code> | the JSON schema object |

<a name="module_generatorMocks..createFile"></a>

### generatorMocks~createFile(content, mockFilePath)
Creates the mock file with the dummy mock data

**Kind**: inner method of [<code>generatorMocks</code>](#module_generatorMocks)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | the content for the mock file |
| mockFilePath | <code>string</code> | the path to the mock file |

<a name="module_generatorMocks..readFile"></a>

### generatorMocks~readFile(filePath) ⇒ <code>Promise</code>
Reads the content of a given file

**Kind**: inner method of [<code>generatorMocks</code>](#module_generatorMocks)  
**Returns**: <code>Promise</code> - gets resolved when the file has been read  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | path to a file that should be read |

