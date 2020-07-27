<a name="module_generator/component"></a>

## generator/component
Module for creating component files based on the configuration cli params


| Param | Type | Description |
| --- | --- | --- |
| cliParams | <code>object</code> | the cli params object |
| config | <code>object</code> | the user configuration object |


* [generator/component](#module_generator/component)
    * [~getFiles(fileNames, args)](#module_generator/component..getFiles) ⇒ <code>Array</code>
    * [~getDummyFileContent(fileType, filesConfig)](#module_generator/component..getDummyFileContent) ⇒ <code>string</code>
    * [~createComponentFiles(filesConfig, componentPath, args)](#module_generator/component..createComponentFiles) ⇒ <code>Promise</code>
    * [~getFileNames(filesConfig, componentName)](#module_generator/component..getFileNames) ⇒ <code>object</code>
    * [~createComponentFolder(path)](#module_generator/component..createComponentFolder) ⇒ <code>Promise</code>

<a name="module_generator/component..getFiles"></a>

### generator/component~getFiles(fileNames, args) ⇒ <code>Array</code>
Returns an array with file names, if necessary filtered based on args

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  
**Returns**: <code>Array</code> - all file paths that should be created  

| Param | Type | Description |
| --- | --- | --- |
| fileNames | <code>object</code> | an object with file names for the component |
| args | <code>object</code> | the cli args |

<a name="module_generator/component..getDummyFileContent"></a>

### generator/component~getDummyFileContent(fileType, filesConfig) ⇒ <code>string</code>
Returns the dummy content for a component file

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  
**Returns**: <code>string</code> - dummy file content based on the given file type  

| Param | Type | Description |
| --- | --- | --- |
| fileType | <code>string</code> | the file type that should be created |
| filesConfig | <code>object</code> | the files object from the user congiguration object |

<a name="module_generator/component..createComponentFiles"></a>

### generator/component~createComponentFiles(filesConfig, componentPath, args) ⇒ <code>Promise</code>
Creates the component files

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  
**Returns**: <code>Promise</code> - gets resolved when all files have been created  

| Param | Type | Description |
| --- | --- | --- |
| filesConfig | <code>object</code> | the files configuration from the user configuration object |
| componentPath | <code>string</code> | the path of the component folder |
| args | <code>object</code> | the cli args |

<a name="module_generator/component..getFileNames"></a>

### generator/component~getFileNames(filesConfig, componentName) ⇒ <code>object</code>
Returns an object with the file names for a given component name

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  
**Returns**: <code>object</code> - all file names based on the user configuration  

| Param | Type | Description |
| --- | --- | --- |
| filesConfig | <code>object</code> | the files configuration from the user configuration object |
| componentName | <code>string</code> | the name of the component |

<a name="module_generator/component..createComponentFolder"></a>

### generator/component~createComponentFolder(path) ⇒ <code>Promise</code>
Creates the component folder

**Kind**: inner method of [<code>generator/component</code>](#module_generator/component)  
**Returns**: <code>Promise</code> - gets resolved when the folder has been created  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | component folder path that should be created |

