<a name="module_helpers"></a>

## helpers
Module for globally used helper functions


* [helpers](#module_helpers)
    * [.removeInternalKeys(obj)](#module_helpers.removeInternalKeys)
    * [.getSingleFileExtension(extension)](#module_helpers.getSingleFileExtension) ⇒ <code>string</code>
    * [.normalizeString(str)](#module_helpers.normalizeString) ⇒ <code>string</code>
    * [.getResolvedFileName(nameInConfig, fileName)](#module_helpers.getResolvedFileName) ⇒ <code>string</code>
    * [.cloneDeep(obj)](#module_helpers.cloneDeep) ⇒ <code>obj</code>
    * [.getFullPathFromShortPath(app, shortPath)](#module_helpers.getFullPathFromShortPath) ⇒ <code>string</code>
    * [.getShortPathFromFullPath(app, fullPath)](#module_helpers.getShortPathFromFullPath) ⇒ <code>string</code>
    * [.getNormalizedShortPath(app, shortPath)](#module_helpers.getNormalizedShortPath) ⇒ <code>string</code>
    * [.getDataPathFromTemplatePath(app, filePath)](#module_helpers.getDataPathFromTemplatePath) ⇒ <code>string</code>
    * [.getDocumentationPathFromTemplatePath(app, filePath)](#module_helpers.getDocumentationPathFromTemplatePath) ⇒ <code>string</code>
    * [.getInfoPathFromTemplatePath(app, filePath)](#module_helpers.getInfoPathFromTemplatePath) ⇒ <code>string</code>
    * [.getSchemaPathFromTemplatePath(app, filePath)](#module_helpers.getSchemaPathFromTemplatePath) ⇒ <code>string</code>
    * [.fileIsDataFile(app, filePath)](#module_helpers.fileIsDataFile) ⇒ <code>Boolean</code>
    * [.fileIsDocumentationFile(app, filePath)](#module_helpers.fileIsDocumentationFile) ⇒ <code>Boolean</code>
    * [.fileIsInfoFile(app, filePath)](#module_helpers.fileIsInfoFile) ⇒ <code>Boolean</code>
    * [.fileIsSchemaFile(app, filePath)](#module_helpers.fileIsSchemaFile) ⇒ <code>Boolean</code>
    * [.fileIsAssetFile(app, filePath)](#module_helpers.fileIsAssetFile) ⇒ <code>Boolean</code>
    * [.fileIsTemplateFile(app, filePath)](#module_helpers.fileIsTemplateFile) ⇒ <code>Boolean</code>

<a name="module_helpers.removeInternalKeys"></a>

### helpers.removeInternalKeys(obj)
Removes all keys starting with $ from an object

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_helpers.getSingleFileExtension"></a>

### helpers.getSingleFileExtension(extension) ⇒ <code>string</code>
Returns everything after the last "." of a file extension (e.g. `html.twig` -> `twig`)

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> | File extension with like `twig` or `html.twig` |

<a name="module_helpers.normalizeString"></a>

### helpers.normalizeString(str) ⇒ <code>string</code>
Normalizes a string be replacing whitespace, underscore, / etc with - and lowercases it

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="module_helpers.getResolvedFileName"></a>

### helpers.getResolvedFileName(nameInConfig, fileName) ⇒ <code>string</code>
If '<component>' is set as the file name in the config, it returns the given file name, otherwise it returns the value from the config

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type | Description |
| --- | --- | --- |
| nameInConfig | <code>string</code> | The defined name for a file in the config |
| fileName | <code>string</code> | The actual file name |

<a name="module_helpers.cloneDeep"></a>

### helpers.cloneDeep(obj) ⇒ <code>obj</code>
Creates a deep clone of a object using internal v8 methods

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_helpers.getFullPathFromShortPath"></a>

### helpers.getFullPathFromShortPath(app, shortPath) ⇒ <code>string</code>
Accepts a path relative from the config.components.folder and returns the complete path based on the file system

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| shortPath | <code>string</code> | 

<a name="module_helpers.getShortPathFromFullPath"></a>

### helpers.getShortPathFromFullPath(app, fullPath) ⇒ <code>string</code>
Accepts an absolute (file system based) path and returns the short path relative from config.components.folder

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| fullPath | <code>string</code> | 

<a name="module_helpers.getNormalizedShortPath"></a>

### helpers.getNormalizedShortPath(app, shortPath) ⇒ <code>string</code>
Accepts a short path and returns the normalized version of it

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| shortPath | <code>string</code> | 

<a name="module_helpers.getDataPathFromTemplatePath"></a>

### helpers.getDataPathFromTemplatePath(app, filePath) ⇒ <code>string</code>
Accepts a template file path and returns the path to the corresponding mock file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.getDocumentationPathFromTemplatePath"></a>

### helpers.getDocumentationPathFromTemplatePath(app, filePath) ⇒ <code>string</code>
Accepts a template file path and returns the path to the corresponding documentation file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.getInfoPathFromTemplatePath"></a>

### helpers.getInfoPathFromTemplatePath(app, filePath) ⇒ <code>string</code>
Accepts a template file path and returns the path to the corresponding info file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.getSchemaPathFromTemplatePath"></a>

### helpers.getSchemaPathFromTemplatePath(app, filePath) ⇒ <code>string</code>
Accepts a template file path and returns the path to the corresponding schema file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.fileIsDataFile"></a>

### helpers.fileIsDataFile(app, filePath) ⇒ <code>Boolean</code>
Accepts a file path and checks if it is a mock file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.fileIsDocumentationFile"></a>

### helpers.fileIsDocumentationFile(app, filePath) ⇒ <code>Boolean</code>
Accepts a file path and checks if it is a documentation file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.fileIsInfoFile"></a>

### helpers.fileIsInfoFile(app, filePath) ⇒ <code>Boolean</code>
Accepts a file path and checks if it is an info file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.fileIsSchemaFile"></a>

### helpers.fileIsSchemaFile(app, filePath) ⇒ <code>Boolean</code>
Accepts a file path and checks if it is a schema file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.fileIsAssetFile"></a>

### helpers.fileIsAssetFile(app, filePath) ⇒ <code>Boolean</code>
Accepts a file path and checks if it is component js or css file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

<a name="module_helpers.fileIsTemplateFile"></a>

### helpers.fileIsTemplateFile(app, filePath) ⇒ <code>Boolean</code>
Accepts a file path and returns checks if it is a template file

**Kind**: static method of [<code>helpers</code>](#module_helpers)  

| Param | Type |
| --- | --- |
| app | <code>require(&#x27;express&#x27;).default</code> | 
| filePath | <code>string</code> | 

