<a name="module_render/menu/helpers"></a>

## render/menu/helpers
Helper functions for the render/menu module


* [render/menu/helpers](#module_render/menu/helpers)
    * [~arraysAreEqual(a, b)](#module_render/menu/helpers..arraysAreEqual) ⇒ <code>boolean</code>
    * [~pathIsParentOfOrEqualRequestedPath(currentPath, requestedPath)](#module_render/menu/helpers..pathIsParentOfOrEqualRequestedPath) ⇒ <code>boolean</code>
    * [~pathEqualsRequest(componentPath, variation, request)](#module_render/menu/helpers..pathEqualsRequest) ⇒ <code>boolean</code>
    * [~childrenOfDirectoryContainDirectory(directory)](#module_render/menu/helpers..childrenOfDirectoryContainDirectory) ⇒ <code>boolean</code>
    * [~componentHasVariations(component)](#module_render/menu/helpers..componentHasVariations) ⇒ <code>boolean</code>
    * [~directoryIsNotTopLevel(directory)](#module_render/menu/helpers..directoryIsNotTopLevel) ⇒ <code>boolean</code>
    * [~directoryHasComponent(directory)](#module_render/menu/helpers..directoryHasComponent) ⇒ <code>boolean</code>

<a name="module_render/menu/helpers..arraysAreEqual"></a>

### render/menu/helpers~arraysAreEqual(a, b) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if both arrays are equal  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Array</code> | first array |
| b | <code>Array</code> | second array |

<a name="module_render/menu/helpers..pathIsParentOfOrEqualRequestedPath"></a>

### render/menu/helpers~pathIsParentOfOrEqualRequestedPath(currentPath, requestedPath) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if given path is parent of or equal requested path  

| Param | Type | Description |
| --- | --- | --- |
| currentPath | <code>string</code> | the current path in iterating over the menu |
| requestedPath | <code>string</code> | the requested path by the user |

<a name="module_render/menu/helpers..pathEqualsRequest"></a>

### render/menu/helpers~pathEqualsRequest(componentPath, variation, request) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if the current component and variation equals the request  

| Param | Type | Description |
| --- | --- | --- |
| componentPath | <code>string</code> | the path of the current component in the menu iteration |
| variation | <code>object</code> | the variation of the current component in the menu iteration |
| request | <code>object</code> | the request object |

<a name="module_render/menu/helpers..childrenOfDirectoryContainDirectory"></a>

### render/menu/helpers~childrenOfDirectoryContainDirectory(directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if the any of the children of the given directory also have children  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | menu tree object |

<a name="module_render/menu/helpers..componentHasVariations"></a>

### render/menu/helpers~componentHasVariations(component) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if the given component has variations  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>object</code> | menu tree object |

<a name="module_render/menu/helpers..directoryIsNotTopLevel"></a>

### render/menu/helpers~directoryIsNotTopLevel(directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if the given directory is not in the first level  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | menu tree object |

<a name="module_render/menu/helpers..directoryHasComponent"></a>

### render/menu/helpers~directoryHasComponent(directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>render/menu/helpers</code>](#module_render/menu/helpers)  
**Returns**: <code>boolean</code> - is true if the given directory is a component  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | menu tree object |

