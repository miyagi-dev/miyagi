<a name="module_generator/component"></a>

## generator/component
Module for creating component files based on the configuration cli params


| Param | Type | Description |
| --- | --- | --- |
| cliParams | <code>object</code> |  |
| config | <code>object</code> | the user's miyagi configuration object |


* [generator/component](#module_generator/component)
    * [~getFiles(fileNames, args)](#module_generator/component..getFiles) ⇒ <code>Promise</code>
    * [~getDummyFileContent(fileType)](#module_generator/component..getDummyFileContent) ⇒ <code>Promise</code>
    * [~createComponentFiles(filesConfig, componentPath, args)](#module_generator/component..createComponentFiles) ⇒ <code>Promise</code>
    * [~getFileNames(filesConfig, componentName)](#module_generator/component..getFileNames) ⇒ <code>object</code>
    * [~createComponentFolder(path)](#module_generator/component..createComponentFolder) ⇒ <code>Promise</code>

<a name="module_generator/component..getFiles"></a>

### generator/component~getFiles(fileNames, args) ⇒ <code>Promise</code>
Returns an array with file names, if necessary filtered based on args

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  

| Param | Type | Description |
| --- | --- | --- |
| fileNames | <code>object</code> | an object with file names for the component |
| args | <code>object</code> | the cli args |

<a name="module_generator/component..getDummyFileContent"></a>

### generator/component~getDummyFileContent(fileType) ⇒ <code>Promise</code>
Returns the dummy content for a component file

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  

| Param | Type |
| --- | --- |
| fileType | <code>string</code> | 

<a name="module_generator/component..createComponentFiles"></a>

### generator/component~createComponentFiles(filesConfig, componentPath, args) ⇒ <code>Promise</code>
Creates the component files

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  

| Param | Type | Description |
| --- | --- | --- |
| filesConfig | <code>object</code> | the files configuration from the user's miyagi config |
| componentPath | <code>string</code> | the path of the component folder |
| args | <code>object</code> | the cli args |

<a name="module_generator/component..getFileNames"></a>

### generator/component~getFileNames(filesConfig, componentName) ⇒ <code>object</code>
Returns an object with the file names for a given component name

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  

| Param | Type | Description |
| --- | --- | --- |
| filesConfig | <code>object</code> | the files configuration from the user's miyagi config |
| componentName | <code>string</code> | the name of the component |

<a name="module_generator/component..createComponentFolder"></a>

### generator/component~createComponentFolder(path) ⇒ <code>Promise</code>
Creates the component folder

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

