<a name="module_stateMenuStructure"></a>

## stateMenuStructure
Module for getting the structure for the menu


* [stateMenuStructure](#module_stateMenuStructure)
    * [~getAllValidVariations(app, json, fullPath)](#module_stateMenuStructure..getAllValidVariations) ⇒ <code>Array</code>
    * [~getData(app, mockFilePath)](#module_stateMenuStructure..getData) ⇒ <code>Array.&lt;object&gt;</code>
    * [~getVariations(app, obj)](#module_stateMenuStructure..getVariations) ⇒ <code>Array</code>
    * [~updateSourceObject(app, obj)](#module_stateMenuStructure..updateSourceObject) ⇒ <code>object</code>
    * [~addIndices(obj, index)](#module_stateMenuStructure..addIndices) ⇒ <code>object</code>

<a name="module_stateMenuStructure..getAllValidVariations"></a>

### stateMenuStructure~getAllValidVariations(app, json, fullPath) ⇒ <code>Array</code>
**Kind**: inner method of [<code>stateMenuStructure</code>](#module_stateMenuStructure)  
**Returns**: <code>Array</code> - all valid variation objects  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| json | <code>object</code> | mock data object |
| fullPath | <code>string</code> | the path of the mock file |

<a name="module_stateMenuStructure..getData"></a>

### stateMenuStructure~getData(app, mockFilePath) ⇒ <code>Array.&lt;object&gt;</code>
**Kind**: inner method of [<code>stateMenuStructure</code>](#module_stateMenuStructure)  
**Returns**: <code>Array.&lt;object&gt;</code> - all valid variations for the given mock file  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| mockFilePath | <code>string</code> | mock file to get the data from |

<a name="module_stateMenuStructure..getVariations"></a>

### stateMenuStructure~getVariations(app, obj) ⇒ <code>Array</code>
**Kind**: inner method of [<code>stateMenuStructure</code>](#module_stateMenuStructure)  
**Returns**: <code>Array</code> - all variations for the mock file of the given file tree object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| obj | <code>object</code> | file tree object |

<a name="module_stateMenuStructure..updateSourceObject"></a>

### stateMenuStructure~updateSourceObject(app, obj) ⇒ <code>object</code>
**Kind**: inner method of [<code>stateMenuStructure</code>](#module_stateMenuStructure)  
**Returns**: <code>object</code> - the updated object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| obj | <code>object</code> | the source object to update |

<a name="module_stateMenuStructure..addIndices"></a>

### stateMenuStructure~addIndices(obj, index) ⇒ <code>object</code>
Adds the given index to the given object and recursively calls this
method for its children

**Kind**: inner method of [<code>stateMenuStructure</code>](#module_stateMenuStructure)  
**Returns**: <code>object</code> - the updated object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | the object to which the index should be added |
| index | <code>number</code> | the index that should be added |

