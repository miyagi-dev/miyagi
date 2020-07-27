<a name="module_generator/mocks"></a>

## generator/mocks
Module for creating dummy mock data based on JSON schema


| Param | Type | Description |
| --- | --- | --- |
| folderPath | <code>string</code> | the path for the component that should be created |
| filesConfig | <code>object</code> | the files configuration from the user configuration object |


* [generator/mocks](#module_generator/mocks)
    * [~getContent(fileType, schema)](#module_generator/mocks..getContent) ⇒ <code>string</code>
    * [~createFile(content, mockFilePath)](#module_generator/mocks..createFile)
    * [~readFile(filePath)](#module_generator/mocks..readFile) ⇒ <code>Promise</code>

<a name="module_generator/mocks..getContent"></a>

### generator/mocks~getContent(fileType, schema) ⇒ <code>string</code>
Returns the dummy mock data in the correct format

**Kind**: inner method of [<code>generator/mocks</code>](#module_generator/mocks)  
**Returns**: <code>string</code> - the dummy mock data  

| Param | Type | Description |
| --- | --- | --- |
| fileType | <code>string</code> | the file type of the mock data that should be created |
| schema | <code>object</code> | the JSON schema object |

<a name="module_generator/mocks..createFile"></a>

### generator/mocks~createFile(content, mockFilePath)
Creates the mock file with the dummy mock data

**Kind**: inner method of [<code>generator/mocks</code>](#module_generator/mocks)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | the content for the mock file |
| mockFilePath | <code>string</code> | the path to the mock file |

<a name="module_generator/mocks..readFile"></a>

### generator/mocks~readFile(filePath) ⇒ <code>Promise</code>
Reads the content of a given file

**Kind**: inner method of [<code>generator/mocks</code>](#module_generator/mocks)  
**Returns**: <code>Promise</code> - gets resolved when the file has been read  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | path to a file that should be read |

