<a name="module_renderHelpers"></a>

## renderHelpers
Helper functions for the render module


* [renderHelpers](#module_renderHelpers)
    * _static_
        * [.extendTemplateData(config, data, filePath)](#module_renderHelpers.extendTemplateData) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.resolveData(app, data, [rootData])](#module_renderHelpers.resolveData) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.getComponentErrorHtml(err)](#module_renderHelpers.getComponentErrorHtml) ⇒ <code>string</code>
        * [.getDataForRenderFunction(app, data)](#module_renderHelpers.getDataForRenderFunction) ⇒ <code>object</code>
        * [.getFallbackData(variations, [rootData])](#module_renderHelpers.getFallbackData) ⇒ <code>object</code>
        * [.getTemplateFilePathFromDirectoryPath(app, directoryPath)](#module_renderHelpers.getTemplateFilePathFromDirectoryPath) ⇒ <code>string</code>
    * _inner_
        * [~getRootOrVariantDataOfReference(app, ref)](#module_renderHelpers..getRootOrVariantDataOfReference) ⇒ <code>object</code>
        * [~resolveTpl(app, entry)](#module_renderHelpers..resolveTpl) ⇒ <code>Promise</code>
        * [~resolveJson(app, entry)](#module_renderHelpers..resolveJson) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
        * [~iterateOverTplData(app, entry)](#module_renderHelpers..iterateOverTplData) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
        * [~iterateOverJsonData(app, entry)](#module_renderHelpers..iterateOverJsonData) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
        * [~overwriteJsonLinksWithJsonData(app, data)](#module_renderHelpers..overwriteJsonLinksWithJsonData) ⇒ <code>Promise</code>
        * [~overwriteTplLinksWithTplContent(app, data)](#module_renderHelpers..overwriteTplLinksWithTplContent) ⇒ <code>Promise</code>
        * [~overwriteRenderKey(app, data)](#module_renderHelpers..overwriteRenderKey) ⇒ <code>object</code>
        * [~mergeRootDataWithVariationData(rootData, variationData)](#module_renderHelpers..mergeRootDataWithVariationData) ⇒ <code>object</code>
        * [~mergeWithGlobalData(app, data)](#module_renderHelpers..mergeWithGlobalData) ⇒ <code>object</code>

<a name="module_renderHelpers.extendTemplateData"></a>

### renderHelpers.extendTemplateData(config, data, filePath) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the extended data object  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| data | <code>object</code> | the mock data object that will be passed into the component |
| filePath | <code>string</code> | the path to the component file |

<a name="module_renderHelpers.resolveData"></a>

### renderHelpers.resolveData(app, data, [rootData]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |
| [rootData] | <code>object</code> | the root mock data object |

<a name="module_renderHelpers.getComponentErrorHtml"></a>

### renderHelpers.getComponentErrorHtml(err) ⇒ <code>string</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>string</code> - html string including an error message  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | error message |

<a name="module_renderHelpers.getDataForRenderFunction"></a>

### renderHelpers.getDataForRenderFunction(app, data) ⇒ <code>object</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_renderHelpers.getFallbackData"></a>

### renderHelpers.getFallbackData(variations, [rootData]) ⇒ <code>object</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>object</code> - the fallback data object  

| Param | Type | Description |
| --- | --- | --- |
| variations | <code>Array</code> | the variations of the mock data of the component |
| [rootData] | <code>object</code> | the root mock data of the component |

<a name="module_renderHelpers.getTemplateFilePathFromDirectoryPath"></a>

### renderHelpers.getTemplateFilePathFromDirectoryPath(app, directoryPath) ⇒ <code>string</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>string</code> - the template file path  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directoryPath | <code>string</code> | a component file path |

<a name="module_renderHelpers..getRootOrVariantDataOfReference"></a>

### renderHelpers~getRootOrVariantDataOfReference(app, ref) ⇒ <code>object</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| ref | <code>string</code> | the reference to another mock data |

<a name="module_renderHelpers..resolveTpl"></a>

### renderHelpers~resolveTpl(app, entry) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise</code> - gets resolved with the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_renderHelpers..resolveJson"></a>

### renderHelpers~resolveJson(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_renderHelpers..iterateOverTplData"></a>

### renderHelpers~iterateOverTplData(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_renderHelpers..iterateOverJsonData"></a>

### renderHelpers~iterateOverJsonData(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_renderHelpers..overwriteJsonLinksWithJsonData"></a>

### renderHelpers~overwriteJsonLinksWithJsonData(app, data) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise</code> - gets resolved with resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_renderHelpers..overwriteTplLinksWithTplContent"></a>

### renderHelpers~overwriteTplLinksWithTplContent(app, data) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise</code> - gets resolved with resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_renderHelpers..overwriteRenderKey"></a>

### renderHelpers~overwriteRenderKey(app, data) ⇒ <code>object</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_renderHelpers..mergeRootDataWithVariationData"></a>

### renderHelpers~mergeRootDataWithVariationData(rootData, variationData) ⇒ <code>object</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>object</code> - the merged data  

| Param | Type | Description |
| --- | --- | --- |
| rootData | <code>object</code> | the root mock data of a component |
| variationData | <code>object</code> | a variation mock data of a component |

<a name="module_renderHelpers..mergeWithGlobalData"></a>

### renderHelpers~mergeWithGlobalData(app, data) ⇒ <code>object</code>
**Kind**: inner method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>object</code> - the merged data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

