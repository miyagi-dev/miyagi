<a name="module_render/helpers"></a>

## render/helpers
Helper functions for the render module


* [render/helpers](#module_render/helpers)
    * [~extendTemplateData(config, data, filePath)](#module_render/helpers..extendTemplateData)
    * [~resolveData(app, data, rootData)](#module_render/helpers..resolveData)
    * [~getDataForRenderFunction(app, data)](#module_render/helpers..getDataForRenderFunction)
    * [~mergeWithGlobalData(app, data)](#module_render/helpers..mergeWithGlobalData)
    * [~getFallbackData(variations, rootData)](#module_render/helpers..getFallbackData)
    * [~getComponentErrorHtml(err)](#module_render/helpers..getComponentErrorHtml)
    * [~getRootOrVariantData(app, value)](#module_render/helpers..getRootOrVariantData)
    * [~overwriteRenderKey(app, data)](#module_render/helpers..overwriteRenderKey)
    * [~resolveTpl(app, entry)](#module_render/helpers..resolveTpl)
    * [~resolveJson(app, entry)](#module_render/helpers..resolveJson)
    * [~iterateOverTplData(app, data)](#module_render/helpers..iterateOverTplData)
    * [~overwriteTplLinksWithTplContent(app, data)](#module_render/helpers..overwriteTplLinksWithTplContent)
    * [~iterateOverJsonData(app, data)](#module_render/helpers..iterateOverJsonData)
    * [~overwriteJsonLinksWithJsonData(app, data)](#module_render/helpers..overwriteJsonLinksWithJsonData)
    * [~mergeRootDataWithVariationData(rootData, variationData)](#module_render/helpers..mergeRootDataWithVariationData)
    * [~getTemplateFilePathFromDirectoryPath(app, directoryPath)](#module_render/helpers..getTemplateFilePathFromDirectoryPath)

<a name="module_render/helpers..extendTemplateData"></a>

### render/helpers~extendTemplateData(config, data, filePath)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param |
| --- |
| config | 
| data | 
| filePath | 

<a name="module_render/helpers..resolveData"></a>

### render/helpers~resolveData(app, data, rootData)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |
| rootData |  |  |

<a name="module_render/helpers..getDataForRenderFunction"></a>

### render/helpers~getDataForRenderFunction(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..mergeWithGlobalData"></a>

### render/helpers~mergeWithGlobalData(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..getFallbackData"></a>

### render/helpers~getFallbackData(variations, rootData)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param |
| --- |
| variations | 
| rootData | 

<a name="module_render/helpers..getComponentErrorHtml"></a>

### render/helpers~getComponentErrorHtml(err)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param |
| --- |
| err | 

<a name="module_render/helpers..getRootOrVariantData"></a>

### render/helpers~getRootOrVariantData(app, value)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| value |  |  |

<a name="module_render/helpers..overwriteRenderKey"></a>

### render/helpers~overwriteRenderKey(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..resolveTpl"></a>

### render/helpers~resolveTpl(app, entry)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry |  |  |

<a name="module_render/helpers..resolveJson"></a>

### render/helpers~resolveJson(app, entry)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry |  |  |

<a name="module_render/helpers..iterateOverTplData"></a>

### render/helpers~iterateOverTplData(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..overwriteTplLinksWithTplContent"></a>

### render/helpers~overwriteTplLinksWithTplContent(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..iterateOverJsonData"></a>

### render/helpers~iterateOverJsonData(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..overwriteJsonLinksWithJsonData"></a>

### render/helpers~overwriteJsonLinksWithJsonData(app, data)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data |  |  |

<a name="module_render/helpers..mergeRootDataWithVariationData"></a>

### render/helpers~mergeRootDataWithVariationData(rootData, variationData)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param |
| --- |
| rootData | 
| variationData | 

<a name="module_render/helpers..getTemplateFilePathFromDirectoryPath"></a>

### render/helpers~getTemplateFilePathFromDirectoryPath(app, directoryPath)
**Kind**: inner method of [<code>render/helpers</code>](#module_render/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directoryPath |  |  |

