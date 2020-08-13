<a name="module_initWatcher"></a>

## initWatcher
Module for watching user file changes


* [initWatcher](#module_initWatcher)
    * [~changeFileCallback([reload], [reloadParent])](#module_initWatcher..changeFileCallback)
    * [~triggeredEventsIncludes(triggered, events)](#module_initWatcher..triggeredEventsIncludes) ⇒ <code>boolean</code>
    * [~updateFileContents(app, events)](#module_initWatcher..updateFileContents) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~handleFileChange()](#module_initWatcher..handleFileChange)
    * [~getIgnoredPathsArr(srcFolderIgnores)](#module_initWatcher..getIgnoredPathsArr) ⇒ <code>Array.&lt;RegExp&gt;</code>

<a name="module_initWatcher..changeFileCallback"></a>

### initWatcher~changeFileCallback([reload], [reloadParent])
**Kind**: inner method of [<code>initWatcher</code>](#module_initWatcher)  

| Param | Type | Description |
| --- | --- | --- |
| [reload] | <code>boolean</code> | is true if the page should be reloaded |
| [reloadParent] | <code>boolean</code> | is true if the parent window should be reloaded |

<a name="module_initWatcher..triggeredEventsIncludes"></a>

### initWatcher~triggeredEventsIncludes(triggered, events) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>initWatcher</code>](#module_initWatcher)  
**Returns**: <code>boolean</code> - is true if the triggered events include the events to check against  

| Param | Type | Description |
| --- | --- | --- |
| triggered | <code>Array</code> | the triggered events |
| events | <code>Array</code> | array of events to check against |

<a name="module_initWatcher..updateFileContents"></a>

### initWatcher~updateFileContents(app, events) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: inner method of [<code>initWatcher</code>](#module_initWatcher)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the updated state.fileContents object  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| events | <code>Array.&lt;object&gt;</code> | array of event objects |

<a name="module_initWatcher..handleFileChange"></a>

### initWatcher~handleFileChange()
**Kind**: inner method of [<code>initWatcher</code>](#module_initWatcher)  
<a name="module_initWatcher..getIgnoredPathsArr"></a>

### initWatcher~getIgnoredPathsArr(srcFolderIgnores) ⇒ <code>Array.&lt;RegExp&gt;</code>
**Kind**: inner method of [<code>initWatcher</code>](#module_initWatcher)  
**Returns**: <code>Array.&lt;RegExp&gt;</code> - array of regexes with all folders to ignore  

| Param | Type | Description |
| --- | --- | --- |
| srcFolderIgnores | <code>Array.&lt;string&gt;</code> | the components.ignores array from the user configuration |

