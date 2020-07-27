<a name="module_render/helpers"></a>

## render/helpers
Helper functions for the render module


* [render/helpers](#module_render/helpers)
    * _static_
        * [.extendTemplateData(config, data, filePath)](#module_render/helpers.extendTemplateData) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.resolveData(app, data, [rootData])](#module_render/helpers.resolveData) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.getComponentErrorHtml(err)](#module_render/helpers.getComponentErrorHtml) ⇒ <code>string</code>
        * [.getDataForRenderFunction(app, data)](#module_render/helpers.getDataForRenderFunction) ⇒ <code>object</code>
        * [.getFallbackData(variations, [rootData])](#module_render/helpers.getFallbackData) ⇒ <code>object</code>
        * [.getTemplateFilePathFromDirectoryPath(app, directoryPath)](#module_render/helpers.getTemplateFilePathFromDirectoryPath) ⇒ <code>string</code>
    * _inner_
        * [~getRootOrVariantDataOfReference(app, ref)](#module_render/helpers..getRootOrVariantDataOfReference) ⇒ <code>object</code>
        * [~resolveTpl(app, entry)](#module_render/helpers..resolveTpl) ⇒ <code>Promise</code>
        * [~resolveJson(app, entry)](#module_render/helpers..resolveJson) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
        * [~iterateOverTplData(app, entry)](#module_render/helpers..iterateOverTplData) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
        * [~iterateOverJsonData(app, entry)](#module_render/helpers..iterateOverJsonData) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
        * [~overwriteJsonLinksWithJsonData(app, data)](#module_render/helpers..overwriteJsonLinksWithJsonData) ⇒ <code>Promise</code>
        * [~overwriteTplLinksWithTplContent(app, data)](#module_render/helpers..overwriteTplLinksWithTplContent) ⇒ <code>Promise</code>
        * [~overwriteRenderKey(app, data)](#module_render/helpers..overwriteRenderKey) ⇒ <code>object</code>
        * [~mergeRootDataWithVariationData(rootData, variationData)](#module_render/helpers..mergeRootDataWithVariationData) ⇒ <code>object</code>
        * [~mergeWithGlobalData(app, data)](#module_render/helpers..mergeWithGlobalData) ⇒ <code>object</code>

<a name="module_render/helpers.extendTemplateData"></a>

### render/helpers.extendTemplateData(config, data, filePath) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: static method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the extended data object  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| data | <code>object</code> | the mock data object that will be passed into the component |
| filePath | <code>string</code> | the path to the component file |

<a name="module_render/helpers.resolveData"></a>

### render/helpers.resolveData(app, data, [rootData]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: static method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |
| [rootData] | <code>object</code> | the root mock data object |

<a name="module_render/helpers.getComponentErrorHtml"></a>

### render/helpers.getComponentErrorHtml(err) ⇒ <code>string</code>
**Kind**: static method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>string</code> - html string including an error message  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | error message |

<a name="module_render/helpers.getDataForRenderFunction"></a>

### render/helpers.getDataForRenderFunction(app, data) ⇒ <code>object</code>
**Kind**: static method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_render/helpers.getFallbackData"></a>

### render/helpers.getFallbackData(variations, [rootData]) ⇒ <code>object</code>
**Kind**: static method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>object</code> - the fallback data object  

| Param | Type | Description |
| --- | --- | --- |
| variations | <code>Array</code> | the variations of the mock data of the component |
| [rootData] | <code>object</code> | the root mock data of the component |

<a name="module_render/helpers.getTemplateFilePathFromDirectoryPath"></a>

### render/helpers.getTemplateFilePathFromDirectoryPath(app, directoryPath) ⇒ <code>string</code>
**Kind**: static method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>string</code> - the template file path  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directoryPath | <code>string</code> | a component file path |

<a name="module_render/helpers..getRootOrVariantDataOfReference"></a>

### render/helpers~getRootOrVariantDataOfReference(app, ref) ⇒ <code>object</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| ref | <code>string</code> | the reference to another mock data |

<a name="module_render/helpers..resolveTpl"></a>

### render/helpers~resolveTpl(app, entry) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise</code> - gets resolved with the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_render/helpers..resolveJson"></a>

### render/helpers~resolveJson(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_render/helpers..iterateOverTplData"></a>

### render/helpers~iterateOverTplData(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_render/helpers..iterateOverJsonData"></a>

### render/helpers~iterateOverJsonData(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="module_render/helpers..overwriteJsonLinksWithJsonData"></a>

### render/helpers~overwriteJsonLinksWithJsonData(app, data) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise</code> - gets resolved with resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_render/helpers..overwriteTplLinksWithTplContent"></a>

### render/helpers~overwriteTplLinksWithTplContent(app, data) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>Promise</code> - gets resolved with resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_render/helpers..overwriteRenderKey"></a>

### render/helpers~overwriteRenderKey(app, data) ⇒ <code>object</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="module_render/helpers..mergeRootDataWithVariationData"></a>

### render/helpers~mergeRootDataWithVariationData(rootData, variationData) ⇒ <code>object</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>object</code> - the merged data  

| Param | Type | Description |
| --- | --- | --- |
| rootData | <code>object</code> | the root mock data of a component |
| variationData | <code>object</code> | a variation mock data of a component |

<a name="module_render/helpers..mergeWithGlobalData"></a>

### render/helpers~mergeWithGlobalData(app, data) ⇒ <code>object</code>
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  
**Returns**: <code>object</code> - the merged data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

