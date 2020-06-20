<a name="module_state/menu/structure"></a>

## state/menu/structure
Module for getting the structure for the menu


* [state/menu/structure](#module_state/menu/structure)
    * [~handleFileResult(app, json, obj, fullPath)](#module_state/menu/structure..handleFileResult)
    * [~getData(app, obj, jsonChild)](#module_state/menu/structure..getData)
    * [~getVariations(app, obj)](#module_state/menu/structure..getVariations)
    * [~updateSourceObject(app, obj)](#module_state/menu/structure..updateSourceObject) ⇒ <code>object</code>
    * [~addIndices(obj, index)](#module_state/menu/structure..addIndices) ⇒ <code>object</code>

<a name="module_state/menu/structure..handleFileResult"></a>

### state/menu/structure~handleFileResult(app, json, obj, fullPath)
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| json |  |  |
| obj |  |  |
| fullPath |  |  |

<a name="module_state/menu/structure..getData"></a>

### state/menu/structure~getData(app, obj, jsonChild)
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| obj |  |  |
| jsonChild |  |  |

<a name="module_state/menu/structure..getVariations"></a>

### state/menu/structure~getVariations(app, obj)
**Kind**: inner method of [<code>state/menu/structure</code>](#module_state/menu/structure)  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| obj |  |  |

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

