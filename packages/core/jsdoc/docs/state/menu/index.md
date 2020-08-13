<a name="module_stateMenu"></a>

## stateMenu
Module for creating a menu object


* [stateMenu](#module_stateMenu)
    * [~getComponentFile(app, directory)](#module_stateMenu..getComponentFile) ⇒ <code>object</code>
    * [~hasComponentFileWithCorrectNameAsChild(app, directory)](#module_stateMenu..hasComponentFileWithCorrectNameAsChild) ⇒ <code>boolean</code>
    * [~getDataForLinkedDirectory(app, directory)](#module_stateMenu..getDataForLinkedDirectory) ⇒ <code>object</code>
    * [~getDataForDirectory(directory)](#module_stateMenu..getDataForDirectory) ⇒ <code>object</code>
    * [~restructureDirectory(app, directory)](#module_stateMenu..restructureDirectory) ⇒ <code>object</code>
    * [~hasChildren(item)](#module_stateMenu..hasChildren) ⇒ <code>boolean</code>
    * [~getMenu(app)](#module_stateMenu..getMenu) ⇒ <code>Array.&lt;object&gt;</code>

<a name="module_stateMenu..getComponentFile"></a>

### stateMenu~getComponentFile(app, directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>object</code> - file tree object of the component file in the given directory  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_stateMenu..hasComponentFileWithCorrectNameAsChild"></a>

### stateMenu~hasComponentFileWithCorrectNameAsChild(app, directory) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>boolean</code> - returns true if the given directory has a component file with the same name  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_stateMenu..getDataForLinkedDirectory"></a>

### stateMenu~getDataForLinkedDirectory(app, directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>object</code> - adapted file tree object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_stateMenu..getDataForDirectory"></a>

### stateMenu~getDataForDirectory(directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>object</code> - adapted file tree object  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>object</code> | file tree object |

<a name="module_stateMenu..restructureDirectory"></a>

### stateMenu~restructureDirectory(app, directory) ⇒ <code>object</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>object</code> - adapted file tree object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| directory | <code>object</code> | file tree object |

<a name="module_stateMenu..hasChildren"></a>

### stateMenu~hasChildren(item) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>boolean</code> - returns true if the given file tree object has children  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>object</code> | file tree object |

<a name="module_stateMenu..getMenu"></a>

### stateMenu~getMenu(app) ⇒ <code>Array.&lt;object&gt;</code>
**Kind**: inner method of [<code>stateMenu</code>](#module_stateMenu)  
**Returns**: <code>Array.&lt;object&gt;</code> - array with adapted menu items  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

