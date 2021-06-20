## Functions

<dl>
<dt><a href="#overwriteJsonLinksWithJsonData">overwriteJsonLinksWithJsonData(app, data)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#overwriteTplLinksWithTplContent">overwriteTplLinksWithTplContent(app, data)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#iterateOverTplData">iterateOverTplData(app, entry)</a> ⇒ <code>Promise.&lt;(object|Array|string|boolean)&gt;</code></dt>
<dd></dd>
<dt><a href="#iterateOverJsonData">iterateOverJsonData(app, entry)</a> ⇒ <code>Promise.&lt;(object|Array|string|boolean)&gt;</code></dt>
<dd></dd>
<dt><a href="#resolveTpl">resolveTpl(app, entry)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#resolveJson">resolveJson(app, entry)</a> ⇒ <code>Promise.&lt;(object|Array|string|boolean)&gt;</code></dt>
<dd></dd>
<dt><a href="#getRootOrVariantDataOfReference">getRootOrVariantDataOfReference(app, ref)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#overwriteRenderKey">overwriteRenderKey(app, data)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#mergeRootDataWithVariationData">mergeRootDataWithVariationData(rootData, variationData)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#mergeWithGlobalData">mergeWithGlobalData(app, data)</a> ⇒ <code>object</code></dt>
<dd></dd>
</dl>

<a name="overwriteJsonLinksWithJsonData"></a>

## overwriteJsonLinksWithJsonData(app, data) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - gets resolved with resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="overwriteTplLinksWithTplContent"></a>

## overwriteTplLinksWithTplContent(app, data) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - gets resolved with resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="iterateOverTplData"></a>

## iterateOverTplData(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: global function  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="iterateOverJsonData"></a>

## iterateOverJsonData(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: global function  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="resolveTpl"></a>

## resolveTpl(app, entry) ⇒ <code>Promise</code>
**Kind**: global function  
**Returns**: <code>Promise</code> - gets resolved with the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="resolveJson"></a>

## resolveJson(app, entry) ⇒ <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code>
**Kind**: global function  
**Returns**: <code>Promise.&lt;(object\|Array\|string\|boolean)&gt;</code> - the resolved value from the mock data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| entry | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>boolean</code> | a value from the mock data object |

<a name="getRootOrVariantDataOfReference"></a>

## getRootOrVariantDataOfReference(app, ref) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| ref | <code>string</code> | the reference to another mock data |

<a name="overwriteRenderKey"></a>

## overwriteRenderKey(app, data) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - the resolved data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

<a name="mergeRootDataWithVariationData"></a>

## mergeRootDataWithVariationData(rootData, variationData) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - the merged data  

| Param | Type | Description |
| --- | --- | --- |
| rootData | <code>object</code> | the root mock data of a component |
| variationData | <code>object</code> | a variation mock data of a component |

<a name="mergeWithGlobalData"></a>

## mergeWithGlobalData(app, data) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - the merged data object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| data | <code>object</code> | the mock data object that will be passed into the component |

