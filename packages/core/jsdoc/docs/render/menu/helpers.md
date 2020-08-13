<a name="module_renderMenuHelpers"></a>

## renderMenuHelpers
Helper functions for the render/menu module


* [renderMenuHelpers](#module_renderMenuHelpers)
    * [~arraysAreEqual(a, b)](#module_renderMenuHelpers..arraysAreEqual) ⇒ <code>boolean</code>
    * [~pathIsParentOfOrEqualRequestedPath(currentPath, requestedPath)](#module_renderMenuHelpers..pathIsParentOfOrEqualRequestedPath) ⇒ <code>boolean</code>
    * [~pathEqualsRequest(componentPath, variation, request)](#module_renderMenuHelpers..pathEqualsRequest) ⇒ <code>boolean</code>
    * [~childrenOfDirectoryContainDirectory(directory)](#module_renderMenuHelpers..childrenOfDirectoryContainDirectory) ⇒ <code>boolean</code>
    * [~componentHasVariations(component)](#module_renderMenuHelpers..componentHasVariations) ⇒ <code>boolean</code>
    * [~directoryIsNotTopLevel(directory)](#module_renderMenuHelpers..directoryIsNotTopLevel) ⇒ <code>boolean</code>
    * [~directoryHasComponent(directory)](#module_renderMenuHelpers..directoryHasComponent) ⇒ <code>boolean</code>

<a name="module_renderMenuHelpers..arraysAreEqual"></a>

### renderMenuHelpers~arraysAreEqual(a, b) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if both arrays are equal  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Array</code> | first array |
| b | <code>Array</code> | second array |

<a name="module_renderMenuHelpers..pathIsParentOfOrEqualRequestedPath"></a>

### renderMenuHelpers~pathIsParentOfOrEqualRequestedPath(currentPath, requestedPath) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if given path is parent of or equal requested path  

| Param | Type | Description |
| --- | --- | --- |
| currentPath | <code>string</code> | the current path in iterating over the menu |
| requestedPath | <code>string</code> | the requested path by the user |

<a name="module_renderMenuHelpers..pathEqualsRequest"></a>

### renderMenuHelpers~pathEqualsRequest(componentPath, variation, request) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if the current component and variation equals the request  

| Param | Type | Description |
| --- | --- | --- |
| componentPath | <code>string</code> | the path of the current component in the menu iteration |
| variation | <code>object</code> | the variation of the current component in the menu iteration |
| request | <code>object</code> | the request object |

<a name="module_renderMenuHelpers..childrenOfDirectoryContainDirectory"></a>

### renderMenuHelpers~childrenOfDirectoryContainDirectory(directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if the any of the children of the given directory also have children  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | menu tree object |

<a name="module_renderMenuHelpers..componentHasVariations"></a>

### renderMenuHelpers~componentHasVariations(component) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if the given component has variations  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>object</code> | menu tree object |

<a name="module_renderMenuHelpers..directoryIsNotTopLevel"></a>

### renderMenuHelpers~directoryIsNotTopLevel(directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if the given directory is not in the first level  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | menu tree object |

<a name="module_renderMenuHelpers..directoryHasComponent"></a>

### renderMenuHelpers~directoryHasComponent(directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>renderMenuHelpers</code>](#module_renderMenuHelpers)  
**Returns**: <code>boolean</code> - is true if the given directory is a component  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | menu tree object |

