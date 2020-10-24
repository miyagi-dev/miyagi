<a name="module_build"></a>

## build
Module for creating a static build


| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |


* [build](#module_build)
    * [~createJsonOutputFile(paths)](#module_build..createJsonOutputFile)
    * [~getFilePathsForJsonOutput(component)](#module_build..getFilePathsForJsonOutput) ⇒ <code>Array</code>
    * [~buildUserFavicon(buildFolder, faviconPath)](#module_build..buildUserFavicon) ⇒ <code>Promise</code>
    * [~buildDistDirectory(buildFolder)](#module_build..buildDistDirectory) ⇒ <code>Promise</code>
    * [~buildUserAssets(buildFolder, assetsConfig, logoPath)](#module_build..buildUserAssets) ⇒ <code>Promise</code>
    * [~buildIframeIndex(buildFolder, app)](#module_build..buildIframeIndex) ⇒ <code>Promise</code>
    * [~buildIndex(buildFolder, app, buildDate, formattedBuildDate)](#module_build..buildIndex) ⇒ <code>Promise</code>
    * [~buildVariation(object)](#module_build..buildVariation) ⇒ <code>Promise</code>
    * [~buildComponent(object)](#module_build..buildComponent) ⇒ <code>Promise</code>

<a name="module_build..createJsonOutputFile"></a>

### build~createJsonOutputFile(paths)
Creates an "output.json" file with the given array as content

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array</code> | all paths to standalone views of component variations |

<a name="module_build..getFilePathsForJsonOutput"></a>

### build~getFilePathsForJsonOutput(component) ⇒ <code>Array</code>
Accepts an array with arrays and returns its values with cwd and buildFolder

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Array</code> - the flattened arrays  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>Array</code> | an array containing arrays with file paths |

<a name="module_build..buildUserFavicon"></a>

### build~buildUserFavicon(buildFolder, faviconPath) ⇒ <code>Promise</code>
Copies the user favicon

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved after the favicon has been copied  

| Param | Type | Description |
| --- | --- | --- |
| buildFolder | <code>string</code> | the build folder from the user configuration |
| faviconPath | <code>string</code> | the favicon path from the user configuration |

<a name="module_build..buildDistDirectory"></a>

### build~buildDistDirectory(buildFolder) ⇒ <code>Promise</code>
Copies the dist directory

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved when the dist directory has been copied  

| Param | Type | Description |
| --- | --- | --- |
| buildFolder | <code>string</code> | the build folder from the user configuration |

<a name="module_build..buildUserAssets"></a>

### build~buildUserAssets(buildFolder, assetsConfig, logoPath) ⇒ <code>Promise</code>
Copies the user assets

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved when all assets have been copied  

| Param | Type | Description |
| --- | --- | --- |
| buildFolder | <code>string</code> | the build folder from the user configuration |
| assetsConfig | <code>object</code> | the assets object from the user configuration |
| logoPath | <code>string</code> | the logo path from the user configuration |

<a name="module_build..buildIframeIndex"></a>

### build~buildIframeIndex(buildFolder, app) ⇒ <code>Promise</code>
Rendeers and builds the component overview

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved when the view has been rendered  

| Param | Type | Description |
| --- | --- | --- |
| buildFolder | <code>string</code> | the build folder from the user configuration |
| app | <code>object</code> | the express instance |

<a name="module_build..buildIndex"></a>

### build~buildIndex(buildFolder, app, buildDate, formattedBuildDate) ⇒ <code>Promise</code>
Renders and builds the index view

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved when the view has been rendered  

| Param | Type | Description |
| --- | --- | --- |
| buildFolder | <code>string</code> | the build folder from the user configuration |
| app | <code>object</code> | the express instance |
| buildDate | <code>string</code> | a machine readable date time string of the current build |
| formattedBuildDate | <code>string</code> | a human readable date time string of the current build |

<a name="module_build..buildVariation"></a>

### build~buildVariation(object) ⇒ <code>Promise</code>
Renders and builds a variation

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved when all variation views have been rendered  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | parameter object |
| object.buildFolder | <code>string</code> | the build folder from the user configuration |
| object.app | <code>object</code> | the express instance |
| object.file | <code>string</code> | the template file path |
| object.normalizedFileName | <code>string</code> | the normalized template file path |
| object.variation | <code>string</code> | the variation name |
| object.buildDate | <code>string</code> | a date time string of the current build |
| object.formattedBuildDate | <code>string</code> | a formatted date time string of the current build |

<a name="module_build..buildComponent"></a>

### build~buildComponent(object) ⇒ <code>Promise</code>
Renders and builds a variation

**Kind**: inner method of [<code>build</code>](#module_build)  
**Returns**: <code>Promise</code> - gets resolved when all component views have been rendered  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | parameter object |
| object.file | <code>string</code> | the template file path |
| object.dir | <code>string</code> | the directory of the component |
| object.buildFolder | <code>string</code> | the build folder from the user configuration |
| object.app | <code>object</code> | the express instance |
| object.buildDate | <code>string</code> | a date time string of the current build |
| object.formattedBuildDate | <code>string</code> | a formatted date time string of the current build |

