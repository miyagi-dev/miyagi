<a name="module_init/watcher"></a>

## init/watcher
Module for watching user file changes


* [init/watcher](#module_init/watcher)
    * [~changeFileCallback([reload], [reloadParent])](#module_init/watcher..changeFileCallback)
    * [~triggeredEventsIncludes(triggered, events)](#module_init/watcher..triggeredEventsIncludes) ⇒ <code>boolean</code>
    * [~updateFileContents(app, events)](#module_init/watcher..updateFileContents) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~handleFileChange()](#module_init/watcher..handleFileChange)
    * [~getIgnoredPathsArr(srcFolderIgnores)](#module_init/watcher..getIgnoredPathsArr) ⇒ <code>Array.&lt;RegExp&gt;</code>

<a name="module_init/watcher..changeFileCallback"></a>

### init/watcher~changeFileCallback([reload], [reloadParent])
**Kind**: inner method of [<code>init/watcher</code>](#module_init/watcher)  

| Param | Type | Description |
| --- | --- | --- |
| [reload] | <code>boolean</code> | is true if the page should be reloaded |
| [reloadParent] | <code>boolean</code> | is true if the parent window should be reloaded |

<a name="module_init/watcher..triggeredEventsIncludes"></a>

### init/watcher~triggeredEventsIncludes(triggered, events) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>init/watcher</code>](#module_init/watcher)  
**Returns**: <code>boolean</code> - is true if the triggered events include the events to check against  

| Param | Type | Description |
| --- | --- | --- |
| triggered | <code>Array</code> | the triggered events |
| events | <code>Array</code> | array of events to check against |

<a name="module_init/watcher..updateFileContents"></a>

### init/watcher~updateFileContents(app, events) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: inner method of [<code>init/watcher</code>](#module_init/watcher)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the updated state.fileContents object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| events | <code>Array.&lt;object&gt;</code> | array of event objects |

<a name="module_init/watcher..handleFileChange"></a>

### init/watcher~handleFileChange()
**Kind**: inner method of [<code>init/watcher</code>](#module_init/watcher)  
<a name="module_init/watcher..getIgnoredPathsArr"></a>

### init/watcher~getIgnoredPathsArr(srcFolderIgnores) ⇒ <code>Array.&lt;RegExp&gt;</code>
**Kind**: inner method of [<code>init/watcher</code>](#module_init/watcher)  
**Returns**: <code>Array.&lt;RegExp&gt;</code> - array of regexes with all folders to ignore  

| Param | Type | Description |
| --- | --- | --- |
| srcFolderIgnores | <code>Array.&lt;string&gt;</code> | the components.ignores array from the user configuration |

