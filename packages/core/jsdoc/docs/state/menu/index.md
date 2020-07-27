<a name="module_state/menu"></a>

## state/menu
Module for creating a menu object


* [state/menu](#module_state/menu)
    * [~getComponentFile(app, directory)](#module_state/menu..getComponentFile) ⇒ <code>object</code>
    * [~hasComponentFileWithCorrectNameAsChild(app, directory)](#module_state/menu..hasComponentFileWithCorrectNameAsChild) ⇒ <code>boolean</code>
    * [~getDataForLinkedDirectory(app, directory)](#module_state/menu..getDataForLinkedDirectory) ⇒ <code>object</code>
    * [~getDataForDirectory(directory)](#module_state/menu..getDataForDirectory) ⇒ <code>object</code>
    * [~restructureDirectory(app, directory)](#module_state/menu..restructureDirectory) ⇒ <code>object</code>
    * [~hasChildren(item)](#module_state/menu..hasChildren) ⇒ <code>boolean</code>
    * [~getMenu(app)](#module_state/menu..getMenu) ⇒ <code>Array.&lt;object&gt;</code>

<a name="module_state/menu..getComponentFile"></a>

### state/menu~getComponentFile(app, directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>object</code> - file tree object of the component file in the given directory  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_state/menu..hasComponentFileWithCorrectNameAsChild"></a>

### state/menu~hasComponentFileWithCorrectNameAsChild(app, directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>boolean</code> - returns true if the given directory has a component file with the same name  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_state/menu..getDataForLinkedDirectory"></a>

### state/menu~getDataForLinkedDirectory(app, directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>object</code> - adapted file tree object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_state/menu..getDataForDirectory"></a>

### state/menu~getDataForDirectory(directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>object</code> - adapted file tree object  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | file tree object |

<a name="module_state/menu..restructureDirectory"></a>

### state/menu~restructureDirectory(app, directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>object</code> - adapted file tree object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_state/menu..hasChildren"></a>

### state/menu~hasChildren(item) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>boolean</code> - returns true if the given file tree object has children  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>object</code> | file tree object |

<a name="module_state/menu..getMenu"></a>

### state/menu~getMenu(app) ⇒ <code>Array.&lt;object&gt;</code>
**Kind**: inner method of [<code>state/menu</code>](#module_state/menu)  
**Returns**: <code>Array.&lt;object&gt;</code> - array with adapted menu items  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

