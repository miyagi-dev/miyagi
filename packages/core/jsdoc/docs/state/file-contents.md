<a name="module_stateFilecontents"></a>

## stateFilecontents
Module for getting the content of all relevant files


* [stateFilecontents](#module_stateFilecontents)
    * [~requireUncached(module)](#module_stateFilecontents..requireUncached) ⇒ <code>object</code>
    * [~checkIfFileNamesIncludeFile(file, fileNames)](#module_stateFilecontents..checkIfFileNamesIncludeFile) ⇒ <code>boolean</code>
    * [~getFilePaths(components, files)](#module_stateFilecontents..getFilePaths) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [~getJsFileContent(fileName)](#module_stateFilecontents..getJsFileContent) ⇒ <code>Promise.&lt;string&gt;</code>
    * [~getYamlFileContent(app, fileName)](#module_stateFilecontents..getYamlFileContent) ⇒ <code>object</code>
    * [~getParsedJsonFileContent(app, fileName)](#module_stateFilecontents..getParsedJsonFileContent) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~getConvertedMarkdownFileContent(fileName)](#module_stateFilecontents..getConvertedMarkdownFileContent) ⇒ <code>Promise.&lt;string&gt;</code>
    * [~readFile(app, fileName)](#module_stateFilecontents..readFile) ⇒ <code>Promise.&lt;(string\|object\|Array)&gt;</code>
    * [~getFileContents(app)](#module_stateFilecontents..getFileContents) ⇒ <code>Promise</code>

<a name="module_stateFilecontents..requireUncached"></a>

### stateFilecontents~requireUncached(module) ⇒ <code>object</code>
Makes sure a requiring a module does not return a cached version

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>object</code> - the required cjs module  

| Param | Type | Description |
| --- | --- | --- |
| module | <code>string</code> | cjs module name |

<a name="module_stateFilecontents..checkIfFileNamesIncludeFile"></a>

### stateFilecontents~checkIfFileNamesIncludeFile(file, fileNames) ⇒ <code>boolean</code>
Checks if a given array of file paths includes a given file path

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>boolean</code> - is true if given array includes given file path  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | file path string |
| fileNames | <code>Array</code> | array of file path string |

<a name="module_stateFilecontents..getFilePaths"></a>

### stateFilecontents~getFilePaths(components, files) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns all component and README files from components.folder
except for template files

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - an array of file paths  

| Param | Type | Description |
| --- | --- | --- |
| components | <code>object</code> | the components object from the config |
| files | <code>object</code> | the files object from the config |

<a name="module_stateFilecontents..getJsFileContent"></a>

### stateFilecontents~getJsFileContent(fileName) ⇒ <code>Promise.&lt;string&gt;</code>
Calls the export function of a CJS module and returns its return value
or returns the return value directly if it is not a function

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - the default export of the cjs module or - if the default export is a function - its return value  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | file path string |

<a name="module_stateFilecontents..getYamlFileContent"></a>

### stateFilecontents~getYamlFileContent(app, fileName) ⇒ <code>object</code>
Returns the content of a YAML file parsed as JSON object

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>object</code> - the content of the given file as an object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> | path to a yaml file |

<a name="module_stateFilecontents..getParsedJsonFileContent"></a>

### stateFilecontents~getParsedJsonFileContent(app, fileName) ⇒ <code>Promise.&lt;object&gt;</code>
Returns the parsed content of a JSON file.

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the parsed content of the given file  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> | path to a json file |

<a name="module_stateFilecontents..getConvertedMarkdownFileContent"></a>

### stateFilecontents~getConvertedMarkdownFileContent(fileName) ⇒ <code>Promise.&lt;string&gt;</code>
Returns the as HTML rendered content of markdown files.

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the markdown of the given file converted into HTML  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | path to a markdown file |

<a name="module_stateFilecontents..readFile"></a>

### stateFilecontents~readFile(app, fileName) ⇒ <code>Promise.&lt;(string\|object\|Array)&gt;</code>
Calls different functions getting the file's content based on its type
and returns the (converted) file content.

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>Promise.&lt;(string\|object\|Array)&gt;</code> - content of the given file based on its type  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> | path to a file of any type |

<a name="module_stateFilecontents..getFileContents"></a>

### stateFilecontents~getFileContents(app) ⇒ <code>Promise</code>
Returns a promise which will be resolved with an object,
including all component files (except for template files)
and their content.

**Kind**: inner method of [<code>stateFilecontents</code>](#module_stateFilecontents)  
**Returns**: <code>Promise</code> - gets resolved with the content of all docs, mocks, schema, info files  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

