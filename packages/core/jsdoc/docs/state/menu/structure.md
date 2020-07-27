<a name="module_state/menu/structure"></a>

## state/menu/structure
Module for getting the structure for the menu


* [state/menu/structure](#module_state/menu/structure)
    * [~getAllValidVariations(app, json, fullPath)](#module_state/menu/structure..getAllValidVariations) ⇒ <code>Array</code>
    * [~getData(app, mockFilePath)](#module_state/menu/structure..getData) ⇒ <code>Array.&lt;object&gt;</code>
    * [~getVariations(app, obj)](#module_state/menu/structure..getVariations) ⇒ <code>Array</code>
    * [~updateSourceObject(app, obj)](#module_state/menu/structure..updateSourceObject) ⇒ <code>object</code>
    * [~addIndices(obj, index)](#module_state/menu/structure..addIndices) ⇒ <code>object</code>

<a name="module_state/menu/structure..getAllValidVariations"></a>

### state/menu/structure~getAllValidVariations(app, json, fullPath) ⇒ <code>Array</code>
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  
**Returns**: <code>Array</code> - all valid variation objects  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| json | <code>object</code> | mock data object |
| fullPath | <code>string</code> | the path of the mock file |

<a name="module_state/menu/structure..getData"></a>

### state/menu/structure~getData(app, mockFilePath) ⇒ <code>Array.&lt;object&gt;</code>
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  
**Returns**: <code>Array.&lt;object&gt;</code> - all valid variations for the given mock file  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| mockFilePath | <code>string</code> | mock file to get the data from |

<a name="module_state/menu/structure..getVariations"></a>

### state/menu/structure~getVariations(app, obj) ⇒ <code>Array</code>
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  
**Returns**: <code>Array</code> - all variations for the mock file of the given file tree object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| obj | <code>object</code> | file tree object |

<a name="module_state/menu/structure..updateSourceObject"></a>

### state/menu/structure~updateSourceObject(app, obj) ⇒ <code>object</code>
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  
**Returns**: <code>object</code> - the updated object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| obj | <code>object</code> | the source object to update |

<a name="module_state/menu/structure..addIndices"></a>

### state/menu/structure~addIndices(obj, index) ⇒ <code>object</code>
Adds the given index to the given object and recursively calls this
method for its children

**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  
**Returns**: <code>object</code> - the updated object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | the object to which the index should be added |
| index | <code>number</code> | the index that should be added |

