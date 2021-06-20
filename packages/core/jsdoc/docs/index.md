<a name="module_index"></a>

## index
The miyagi module


* [index](#module_index)
    * [module.exports()](#exp_module_index--module.exports) ⏏
        * [~argsIncludeMockGenerator(args)](#module_index--module.exports..argsIncludeMockGenerator) ⇒ <code>boolean</code>
        * [~argsIncludeComponentGenerator(args)](#module_index--module.exports..argsIncludeComponentGenerator) ⇒ <code>boolean</code>
        * [~argsIncludeBuild(args)](#module_index--module.exports..argsIncludeBuild) ⇒ <code>boolean</code>
        * [~argsIncludeServer(args)](#module_index--module.exports..argsIncludeServer) ⇒ <code>boolean</code>
        * [~argsIncludeLint(args)](#module_index--module.exports..argsIncludeLint) ⇒ <code>boolean</code>
        * [~getAllAvailableTemplateExtensions(possibleExtensions, folder, ignores)](#module_index--module.exports..getAllAvailableTemplateExtensions) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [~guessExtensionFromEngine(engineName)](#module_index--module.exports..guessExtensionFromEngine) ⇒ <code>Object</code>
        * [~guessEngineFromExtension(extension)](#module_index--module.exports..guessEngineFromExtension) ⇒ <code>Object</code>
        * [~guessEngineAndExtensionFromFiles(config)](#module_index--module.exports..guessEngineAndExtensionFromFiles) ⇒ <code>Promise.&lt;({files: object, engine: object}\|null)&gt;</code>
        * [~runComponentGenerator(config, args)](#module_index--module.exports..runComponentGenerator)
        * [~runMockGenerator(config, args)](#module_index--module.exports..runMockGenerator)
        * [~initRendering(config)](#module_index--module.exports..initRendering)
        * [~initApi(config)](#module_index--module.exports..initApi)
        * [~updateConfigWithGuessedExtensionBasedOnEngine(config)](#module_index--module.exports..updateConfigWithGuessedExtensionBasedOnEngine) ⇒ <code>object</code> \| <code>boolean</code>
        * [~updateConfigWithGuessedEngineBasedOnExtension(config)](#module_index--module.exports..updateConfigWithGuessedEngineBasedOnExtension) ⇒ <code>object</code> \| <code>boolean</code>
        * [~updateConfigWithGuessedEngineAndExtensionBasedOnFiles(config)](#module_index--module.exports..updateConfigWithGuessedEngineAndExtensionBasedOnFiles) ⇒ <code>Promise.&lt;(object\|boolean)&gt;</code>
        * [~updateConfigForComponentGeneratorIfNecessary(config, args)](#module_index--module.exports..updateConfigForComponentGeneratorIfNecessary) ⇒ <code>Promise.&lt;object&gt;</code>
        * [~updateConfigForRendererIfNecessary(config)](#module_index--module.exports..updateConfigForRendererIfNecessary) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="exp_module_index--module.exports"></a>

### module.exports() ⏏
Requires the user config and initializes and calls correct modules based on command

**Kind**: Exported function  
<a name="module_index--module.exports..argsIncludeMockGenerator"></a>

#### module.exports~argsIncludeMockGenerator(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "mocks" command

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "mocks"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..argsIncludeComponentGenerator"></a>

#### module.exports~argsIncludeComponentGenerator(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "new" command

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "new"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..argsIncludeBuild"></a>

#### module.exports~argsIncludeBuild(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "build" command

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "new"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..argsIncludeServer"></a>

#### module.exports~argsIncludeServer(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "start" command

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "start"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..argsIncludeLint"></a>

#### module.exports~argsIncludeLint(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "lint" command

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  

| Param | Type |
| --- | --- |
| args | <code>object</code> | 

<a name="module_index--module.exports..getAllAvailableTemplateExtensions"></a>

#### module.exports~getAllAvailableTemplateExtensions(possibleExtensions, folder, ignores) ⇒ <code>Promise.&lt;Array&gt;</code>
Returns all extensions that belong to template files found in the components folder

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - an array of template files extension found in the component folder  

| Param | Type | Description |
| --- | --- | --- |
| possibleExtensions | <code>Array</code> | an array of possible template files extensions |
| folder | <code>string</code> | the component folder from the user configuration |
| ignores | <code>Array</code> | the folders to ignore from the user configuration |

<a name="module_index--module.exports..guessExtensionFromEngine"></a>

#### module.exports~guessExtensionFromEngine(engineName) ⇒ <code>Object</code>
Returns the template files extension that belongs to a given engine

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Object</code> - the related template files extension  

| Param | Type | Description |
| --- | --- | --- |
| engineName | <code>string</code> | the engine name from the user configuration |

<a name="module_index--module.exports..guessEngineFromExtension"></a>

#### module.exports~guessEngineFromExtension(extension) ⇒ <code>Object</code>
Returns the engine name that belongs to a given extension

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Object</code> - the related engine name  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> | the file extension from the user configuration |

<a name="module_index--module.exports..guessEngineAndExtensionFromFiles"></a>

#### module.exports~guessEngineAndExtensionFromFiles(config) ⇒ <code>Promise.&lt;({files: object, engine: object}\|null)&gt;</code>
Scans the files, tries to find template files and based on the result
returns an object with engine.name and files.templates.extension

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Promise.&lt;({files: object, engine: object}\|null)&gt;</code> - is either an object with `files` and `engine` or `null` if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index--module.exports..runComponentGenerator"></a>

#### module.exports~runComponentGenerator(config, args)
Runs the component generator

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..runMockGenerator"></a>

#### module.exports~runMockGenerator(config, args)
Runs the mock generator

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..initRendering"></a>

#### module.exports~initRendering(config)
Runs the renderer to either start the server or create a build

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index--module.exports..initApi"></a>

#### module.exports~initApi(config)
**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  

| Param | Type |
| --- | --- |
| config | <code>object</code> | 

<a name="module_index--module.exports..updateConfigWithGuessedExtensionBasedOnEngine"></a>

#### module.exports~updateConfigWithGuessedExtensionBasedOnEngine(config) ⇒ <code>object</code> \| <code>boolean</code>
Tries to guess the template files extension based on defined engine name.

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>object</code> \| <code>boolean</code> - is either the updated config or false if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index--module.exports..updateConfigWithGuessedEngineBasedOnExtension"></a>

#### module.exports~updateConfigWithGuessedEngineBasedOnExtension(config) ⇒ <code>object</code> \| <code>boolean</code>
Tries to guess the engine name based on defined template files extension.

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>object</code> \| <code>boolean</code> - is either the updated config or false if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index--module.exports..updateConfigWithGuessedEngineAndExtensionBasedOnFiles"></a>

#### module.exports~updateConfigWithGuessedEngineAndExtensionBasedOnFiles(config) ⇒ <code>Promise.&lt;(object\|boolean)&gt;</code>
Tries to guess the template files extension and engine name by scanning
the component folder and looking for possible template files.

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Promise.&lt;(object\|boolean)&gt;</code> - is either the updated config or false if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index--module.exports..updateConfigForComponentGeneratorIfNecessary"></a>

#### module.exports~updateConfigForComponentGeneratorIfNecessary(config, args) ⇒ <code>Promise.&lt;object&gt;</code>
Updates the config with smartly guessed template extension if missing
and tpls are not skipped for generating a component

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the updated config  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| args | <code>object</code> | the cli args |

<a name="module_index--module.exports..updateConfigForRendererIfNecessary"></a>

#### module.exports~updateConfigForRendererIfNecessary(config) ⇒ <code>Promise.&lt;object&gt;</code>
Updates the config with smartly guessed template extension and/or template engine
if missing

**Kind**: inner method of [<code>module.exports</code>](#exp_module_index--module.exports)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the updated config  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

