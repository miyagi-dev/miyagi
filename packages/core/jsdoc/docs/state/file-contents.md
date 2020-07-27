<a name="module_state/file-contents"></a>

## state/file-contents
Module for getting the content of all relevant files


* [state/file-contents](#module_state/file-contents)
    * [~requireUncached(module)](#module_state/file-contents..requireUncached) ⇒ <code>object</code>
    * [~checkIfFileNamesIncludeFile(file, fileNames)](#module_state/file-contents..checkIfFileNamesIncludeFile) ⇒ <code>boolean</code>
    * [~getFilePaths(components, files)](#module_state/file-contents..getFilePaths) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [~getJsFileContent(fileName)](#module_state/file-contents..getJsFileContent) ⇒ <code>Promise.&lt;string&gt;</code>
    * [~getYamlFileContent(app, fileName)](#module_state/file-contents..getYamlFileContent) ⇒ <code>object</code>
    * [~getParsedJsonFileContent(app, fileName)](#module_state/file-contents..getParsedJsonFileContent) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~getConvertedMarkdownFileContent(fileName)](#module_state/file-contents..getConvertedMarkdownFileContent) ⇒ <code>Promise.&lt;string&gt;</code>
    * [~readFile(app, fileName)](#module_state/file-contents..readFile) ⇒ <code>Promise.&lt;(string\|object\|Array)&gt;</code>
    * [~getFileContents(app)](#module_state/file-contents..getFileContents) ⇒ <code>Promise</code>

<a name="module_state/file-contents..requireUncached"></a>

### state/file-contents~requireUncached(module) ⇒ <code>object</code>
Makes sure a requiring a module does not return a cached version

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>object</code> - the required cjs module  

| Param | Type | Description |
| --- | --- | --- |
| module | <code>string</code> | cjs module name |

<a name="module_state/file-contents..checkIfFileNamesIncludeFile"></a>

### state/file-contents~checkIfFileNamesIncludeFile(file, fileNames) ⇒ <code>boolean</code>
Checks if a given array of file paths includes a given file path

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>boolean</code> - is true if given array includes given file path  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | file path string |
| fileNames | <code>Array</code> | array of file path string |

<a name="module_state/file-contents..getFilePaths"></a>

### state/file-contents~getFilePaths(components, files) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns all component and README files from components.folder
except for template files

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - an array of file paths  

| Param | Type | Description |
| --- | --- | --- |
| components | <code>object</code> | the components object from the config |
| files | <code>object</code> | the files object from the config |

<a name="module_state/file-contents..getJsFileContent"></a>

### state/file-contents~getJsFileContent(fileName) ⇒ <code>Promise.&lt;string&gt;</code>
Calls the export function of a CJS module and returns its return value
or returns the return value directly if it is not a function

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - the default export of the cjs module or - if the default export is a function - its return value  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | file path string |

<a name="module_state/file-contents..getYamlFileContent"></a>

### state/file-contents~getYamlFileContent(app, fileName) ⇒ <code>object</code>
Returns the content of a YAML file parsed as JSON object

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>object</code> - the content of the given file as an object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> | path to a yaml file |

<a name="module_state/file-contents..getParsedJsonFileContent"></a>

### state/file-contents~getParsedJsonFileContent(app, fileName) ⇒ <code>Promise.&lt;object&gt;</code>
Returns the parsed content of a JSON file.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the parsed content of the given file  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> | path to a json file |

<a name="module_state/file-contents..getConvertedMarkdownFileContent"></a>

### state/file-contents~getConvertedMarkdownFileContent(fileName) ⇒ <code>Promise.&lt;string&gt;</code>
Returns the as HTML rendered content of markdown files.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the markdown of the given file converted into HTML  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | path to a markdown file |

<a name="module_state/file-contents..readFile"></a>

### state/file-contents~readFile(app, fileName) ⇒ <code>Promise.&lt;(string\|object\|Array)&gt;</code>
Calls different functions getting the file's content based on its type
and returns the (converted) file content.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Promise.&lt;(string\|object\|Array)&gt;</code> - content of the given file based on its type  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> | path to a file of any type |

<a name="module_state/file-contents..getFileContents"></a>

### state/file-contents~getFileContents(app) ⇒ <code>Promise</code>
Returns a promise which will be resolved with an object,
including all component files (except for template files)
and their content.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Promise</code> - gets resolved with the content of all docs, mocks, schema, info files  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

