<a name="module_renderHelpers"></a>

## renderHelpers
Helper functions for the render module


* [renderHelpers](#module_renderHelpers)
    * [.extendTemplateData(config, data, filePath)](#module_renderHelpers.extendTemplateData) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getComponentErrorHtml(err)](#module_renderHelpers.getComponentErrorHtml) ⇒ <code>string</code>
    * [.getDataForRenderFunction(app, data)](#module_renderHelpers.getDataForRenderFunction) ⇒ <code>object</code>
    * [.getFallbackData(variations, [rootData])](#module_renderHelpers.getFallbackData) ⇒ <code>object</code>

<a name="module_renderHelpers.extendTemplateData"></a>

### renderHelpers.extendTemplateData(config, data, filePath) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: static method of [<code>renderHelpers</code>](#module_renderHelpers)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the extended data object  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the user configuration object |
| data | <code>object</code> | the mock data object that will be passed into the component |
| filePath | <code>string</code> | the path to the component file |

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

