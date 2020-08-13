<a name="module_stateHelpers"></a>

## stateHelpers
Helper functions for all state modules


* [stateHelpers](#module_stateHelpers)
    * [~getFiles(dir, ignores, check)](#module_stateHelpers..getFiles) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [~isNotIgnored(file, ignoredFolders)](#module_stateHelpers..isNotIgnored) ⇒ <code>boolean</code>

<a name="module_stateHelpers..getFiles"></a>

### stateHelpers~getFiles(dir, ignores, check) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
**Kind**: inner method of [<code>stateHelpers</code>](#module_stateHelpers)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - an array with file paths  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>object</code> | the directory in which to look for files |
| ignores | <code>Array.&lt;string&gt;</code> | an array of folders which should be ignored |
| check | <code>function</code> | checks if the file should be returned, returns null or the file path |

<a name="module_stateHelpers..isNotIgnored"></a>

### stateHelpers~isNotIgnored(file, ignoredFolders) ⇒ <code>boolean</code>
Checks if a given file is not in one of the ignored folders

**Kind**: inner method of [<code>stateHelpers</code>](#module_stateHelpers)  
**Returns**: <code>boolean</code> - returns true if the given file is not inside any of the given ignoredFolders  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | file path |
| ignoredFolders | <code>Array</code> | folders that should be ignored |

