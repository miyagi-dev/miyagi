<a name="module_index"></a>

## index
The miyagi module


* [index](#module_index)
    * [~argsIncludeMockGenerator(args)](#module_index..argsIncludeMockGenerator) ⇒ <code>boolean</code>
    * [~argsIncludeComponentGenerator(args)](#module_index..argsIncludeComponentGenerator) ⇒ <code>boolean</code>
    * [~argsIncludeBuild(args)](#module_index..argsIncludeBuild) ⇒ <code>boolean</code>
    * [~argsIncludeServer(args)](#module_index..argsIncludeServer) ⇒ <code>boolean</code>
    * [~getCliArgs(args)](#module_index..getCliArgs) ⇒ <code>object</code>
    * [~getAllAvailableTemplateExtensions(possibleExtensions, folder, ignores)](#module_index..getAllAvailableTemplateExtensions) ⇒ <code>Array</code>
    * [~guessExtensionFromEngine(engineName)](#module_index..guessExtensionFromEngine) ⇒ <code>string</code>
    * [~guessEngineFromExtension(extension)](#module_index..guessEngineFromExtension) ⇒ <code>string</code>
    * [~guessEngineAndExtensionFromFiles(config)](#module_index..guessEngineAndExtensionFromFiles) ⇒ <code>object</code> \| <code>null</code>
    * [~runComponentGenerator(config, args)](#module_index..runComponentGenerator)
    * [~runMockGenerator(config, args)](#module_index..runMockGenerator)
    * [~initRendering(config)](#module_index..initRendering)
    * [~updateConfigWithGuessedExtensionBasedOnEngine(config)](#module_index..updateConfigWithGuessedExtensionBasedOnEngine) ⇒ <code>object</code> \| <code>boolean</code>
    * [~updateConfigWithGuessedEngineBasedOnExtension(config)](#module_index..updateConfigWithGuessedEngineBasedOnExtension) ⇒ <code>object</code> \| <code>boolean</code>
    * [~updateConfigWithGuessedEngineAndExtensionBasedOnFiles(config)](#module_index..updateConfigWithGuessedEngineAndExtensionBasedOnFiles) ⇒ <code>object</code> \| <code>boolean</code>
    * [~updateConfigForComponentGeneratorIfNecessary(config, args)](#module_index..updateConfigForComponentGeneratorIfNecessary) ⇒ <code>object</code>
    * [~updateConfigForRendererIfNecessary(config)](#module_index..updateConfigForRendererIfNecessary) ⇒ <code>object</code>
    * [~Miyagi()](#module_index..Miyagi)

<a name="module_index..argsIncludeMockGenerator"></a>

### index~argsIncludeMockGenerator(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "mocks" command

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "mocks"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index..argsIncludeComponentGenerator"></a>

### index~argsIncludeComponentGenerator(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "new" command

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "new"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index..argsIncludeBuild"></a>

### index~argsIncludeBuild(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "build" command

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "new"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index..argsIncludeServer"></a>

### index~argsIncludeServer(args) ⇒ <code>boolean</code>
Checks if miyagi was started with "start" command

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>boolean</code> - is true if the miyagi was started with "start"  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index..getCliArgs"></a>

### index~getCliArgs(args) ⇒ <code>object</code>
Converts and removes unnecessary cli args

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> - configuration object based on cli args  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | the cli args |

<a name="module_index..getAllAvailableTemplateExtensions"></a>

### index~getAllAvailableTemplateExtensions(possibleExtensions, folder, ignores) ⇒ <code>Array</code>
Returns all extensions that belong to template files found in the components folder

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array</code> - an array of template files extension found in the component folder  

| Param | Type | Description |
| --- | --- | --- |
| possibleExtensions | <code>Array</code> | an array of possible template files extensions |
| folder | <code>string</code> | the component folder from the user configuration |
| ignores | <code>Array</code> | the folders to ignore from the user configuration |

<a name="module_index..guessExtensionFromEngine"></a>

### index~guessExtensionFromEngine(engineName) ⇒ <code>string</code>
Returns the template files extension that belongs to a given engine

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>string</code> - the related template files extension  

| Param | Type | Description |
| --- | --- | --- |
| engineName | <code>string</code> | the engine name from the user configuration |

<a name="module_index..guessEngineFromExtension"></a>

### index~guessEngineFromExtension(extension) ⇒ <code>string</code>
Returns the engine name that belongs to a given extension

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>string</code> - the related engine name  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> | the file extension from the user configuration |

<a name="module_index..guessEngineAndExtensionFromFiles"></a>

### index~guessEngineAndExtensionFromFiles(config) ⇒ <code>object</code> \| <code>null</code>
Scans the files, tries to find template files and based on the result
returns an object with engine.name and files.templates.extension

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> \| <code>null</code> - is either an object with `files` and `engine` or `null` if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index..runComponentGenerator"></a>

### index~runComponentGenerator(config, args)
Runs the component generator

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| args | <code>object</code> | the cli args |

<a name="module_index..runMockGenerator"></a>

### index~runMockGenerator(config, args)
Runs the mock generator

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| args | <code>object</code> | the cli args |

<a name="module_index..initRendering"></a>

### index~initRendering(config)
Runs the renderer to either start the server or create a build

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index..updateConfigWithGuessedExtensionBasedOnEngine"></a>

### index~updateConfigWithGuessedExtensionBasedOnEngine(config) ⇒ <code>object</code> \| <code>boolean</code>
Tries to guess the template files extension based on defined engine name.

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> \| <code>boolean</code> - is either the updated config or false if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index..updateConfigWithGuessedEngineBasedOnExtension"></a>

### index~updateConfigWithGuessedEngineBasedOnExtension(config) ⇒ <code>object</code> \| <code>boolean</code>
Tries to guess the engine name based on defined template files extension.

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> \| <code>boolean</code> - is either the updated config or false if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index..updateConfigWithGuessedEngineAndExtensionBasedOnFiles"></a>

### index~updateConfigWithGuessedEngineAndExtensionBasedOnFiles(config) ⇒ <code>object</code> \| <code>boolean</code>
Tries to guess the template files extension and engine name by scanning
the component folder and looking for possible template files.

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> \| <code>boolean</code> - is either the updated config or false if guessing failed  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index..updateConfigForComponentGeneratorIfNecessary"></a>

### index~updateConfigForComponentGeneratorIfNecessary(config, args) ⇒ <code>object</code>
Updates the config with smartly guessed template extension if missing
and tpls are not skipped for generating a component

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> - the updated config  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| args | <code>object</code> | the cli args |

<a name="module_index..updateConfigForRendererIfNecessary"></a>

### index~updateConfigForRendererIfNecessary(config) ⇒ <code>object</code>
Updates the config with smartly guessed template extension and/or template engine
if missing

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>object</code> - the updated config  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |

<a name="module_index..Miyagi"></a>

### index~Miyagi()
Requires the user config and initializes and calls correct modules based on command

**Kind**: inner method of [<code>index</code>](#module_index)  
