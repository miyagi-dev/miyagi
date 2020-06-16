<a name="module_build"></a>

## build
Module for creating a static build


| Param | Type |
| --- | --- |
| obj.app | <code>require(&#x27;express&#x27;).default</code> | 


* [build](#module_build)
    * [~createJsonOutputFile(paths)](#module_build..createJsonOutputFile)
    * [~getFilePathForJsonOutput(component)](#module_build..getFilePathForJsonOutput) ⇒ <code>Array</code>
    * [~buildUserFavicon(buildFolder, faviconPath)](#module_build..buildUserFavicon) ⇒ <code>Promise</code>
    * [~buildDistDirectory(buildFolder)](#module_build..buildDistDirectory) ⇒ <code>Promise</code>
    * [~buildUserAssets(buildFolder, assetsConfig, logoPath)](#module_build..buildUserAssets) ⇒ <code>Promise</code>
    * [~buildComponentOverview(buildFolder, app)](#module_build..buildComponentOverview) ⇒ <code>Promise</code>
    * [~buildIndex(buildFolder, app)](#module_build..buildIndex) ⇒ <code>Promise</code>
    * [~buildVariation(obj)](#module_build..buildVariation) ⇒ <code>Promise</code>
    * [~buildComponent(obj)](#module_build..buildComponent) ⇒ <code>Promise</code>

<a name="module_build..createJsonOutputFile"></a>

### build~createJsonOutputFile(paths)
Creates an "output.json" file with the given array as content

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type |
| --- | --- |
| paths | <code>Array</code> | 

<a name="module_build..getFilePathForJsonOutput"></a>

### build~getFilePathForJsonOutput(component) ⇒ <code>Array</code>
Accepts an array with arrays and returns its values with cwd and buildFolder

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>Array</code> | An array with file paths |

<a name="module_build..buildUserFavicon"></a>

### build~buildUserFavicon(buildFolder, faviconPath) ⇒ <code>Promise</code>
Copies the user favicon

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type |
| --- | --- |
| buildFolder | <code>string</code> | 
| faviconPath | <code>string</code> | 

<a name="module_build..buildDistDirectory"></a>

### build~buildDistDirectory(buildFolder) ⇒ <code>Promise</code>
Copies the dist directory

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type |
| --- | --- |
| buildFolder | <code>string</code> | 

<a name="module_build..buildUserAssets"></a>

### build~buildUserAssets(buildFolder, assetsConfig, logoPath) ⇒ <code>Promise</code>
Copies the user assets

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type |
| --- | --- |
| buildFolder | <code>string</code> | 
| assetsConfig | <code>Object</code> | 
| logoPath | <code>string</code> | 

<a name="module_build..buildComponentOverview"></a>

### build~buildComponentOverview(buildFolder, app) ⇒ <code>Promise</code>
Rendeers and builds the component overview

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type |
| --- | --- |
| buildFolder | <code>string</code> | 
| app | <code>require(&#x27;express&#x27;).default</code> | 

<a name="module_build..buildIndex"></a>

### build~buildIndex(buildFolder, app) ⇒ <code>Promise</code>
Renders and builds the index view

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type |
| --- | --- |
| buildFolder | <code>string</code> | 
| app | <code>require(&#x27;express&#x27;).default</code> | 

<a name="module_build..buildVariation"></a>

### build~buildVariation(obj) ⇒ <code>Promise</code>
Renders and builds a variation

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.buildFolder | <code>string</code> |  |
| obj.app | <code>require(&#x27;express&#x27;).default</code> |  |
| obj.file | <code>string</code> | the template file path |
| obj.normalizedFileName | <code>string</code> | the normalized template file path |
| obj.variation | <code>string</code> | the variation name |

<a name="module_build..buildComponent"></a>

### build~buildComponent(obj) ⇒ <code>Promise</code>
Renders and builds a variation

**Kind**: inner method of [<code>build</code>](#module_build)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.file | <code>string</code> | the template file path |
| obj.buildFolder | <code>string</code> |  |
| obj.app | <code>require(&#x27;express&#x27;).default</code> |  |

