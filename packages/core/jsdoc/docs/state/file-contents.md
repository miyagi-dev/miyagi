<a name="module_state/file-contents"></a>

## state/file-contents
Module for getting the content of all relevant files


* [state/file-contents](#module_state/file-contents)
    * [~requireUncached(module)](#module_state/file-contents..requireUncached) ⇒ <code>any</code>
    * [~checkIfFileNamesIncludeFile(file, fileNames)](#module_state/file-contents..checkIfFileNamesIncludeFile) ⇒ <code>boolean</code>
    * [~getFilePaths(components, files)](#module_state/file-contents..getFilePaths) ⇒ <code>Array.&lt;string&gt;</code>
    * [~getJsFileContent(fileName)](#module_state/file-contents..getJsFileContent) ⇒ <code>any</code>
    * [~getYamlFileContent(app, fileName)](#module_state/file-contents..getYamlFileContent) ⇒ <code>object</code>
    * [~getParsedJsonFileContent(app, fileName)](#module_state/file-contents..getParsedJsonFileContent) ⇒ <code>object</code>
    * [~getConvertedMarkdownFileContent(fileName)](#module_state/file-contents..getConvertedMarkdownFileContent) ⇒ <code>string</code>
    * [~readFile(app, fileName)](#module_state/file-contents..readFile) ⇒ <code>any</code>
    * [~getFileContents(app)](#module_state/file-contents..getFileContents) ⇒ <code>Promise</code>

<a name="module_state/file-contents..requireUncached"></a>

### state/file-contents~requireUncached(module) ⇒ <code>any</code>
Makes sure a requiring a module does not return a cached version

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type |
| --- | --- |
| module | <code>string</code> | 

<a name="module_state/file-contents..checkIfFileNamesIncludeFile"></a>

### state/file-contents~checkIfFileNamesIncludeFile(file, fileNames) ⇒ <code>boolean</code>
Checks if a given array of file paths includes a given file path

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type |
| --- | --- |
| file | <code>string</code> | 
| fileNames | <code>Array</code> | 

<a name="module_state/file-contents..getFilePaths"></a>

### state/file-contents~getFilePaths(components, files) ⇒ <code>Array.&lt;string&gt;</code>
Returns all component and README files from components.folder
except for template files

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of file paths  

| Param | Type | Description |
| --- | --- | --- |
| components | <code>object</code> | the components object from the config |
| files | <code>object</code> | the files object from the config |

<a name="module_state/file-contents..getJsFileContent"></a>

### state/file-contents~getJsFileContent(fileName) ⇒ <code>any</code>
Calls the export function of a CJS module and returns its return value
or returns the return value directly if it is not a funcation

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type |
| --- | --- |
| fileName | <code>string</code> | 

<a name="module_state/file-contents..getYamlFileContent"></a>

### state/file-contents~getYamlFileContent(app, fileName) ⇒ <code>object</code>
Returns the content of a YAML file parsed as JSON object

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> |  |

<a name="module_state/file-contents..getParsedJsonFileContent"></a>

### state/file-contents~getParsedJsonFileContent(app, fileName) ⇒ <code>object</code>
Returns the parsed content of a JSON file.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> |  |

<a name="module_state/file-contents..getConvertedMarkdownFileContent"></a>

### state/file-contents~getConvertedMarkdownFileContent(fileName) ⇒ <code>string</code>
Returns the as HTML rendered content of markdown files.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type |
| --- | --- |
| fileName | <code>string</code> | 

<a name="module_state/file-contents..readFile"></a>

### state/file-contents~readFile(app, fileName) ⇒ <code>any</code>
Calls different functions getting the file's content based on its type
and returns the (converted) file content.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fileName | <code>string</code> |  |

<a name="module_state/file-contents..getFileContents"></a>

### state/file-contents~getFileContents(app) ⇒ <code>Promise</code>
Returns a promise which will be resolved with an object,
including all component files (except for template files)
and their content.

**Kind**: inner method of [<code>state/file-contents</code>](#module_state/file-contents)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

