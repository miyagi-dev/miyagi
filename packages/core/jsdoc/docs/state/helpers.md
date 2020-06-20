<a name="module_state/helpers"></a>

## state/helpers
Helper functions for all state modules


* [state/helpers](#module_state/helpers)
    * [~getFiles(dir, ignores, check)](#module_state/helpers..getFiles) ⇒ <code>Array.&lt;string&gt;</code>
    * [~isNotIgnored(file, ignoredFolders)](#module_state/helpers..isNotIgnored) ⇒ <code>boolean</code>

<a name="module_state/helpers..getFiles"></a>

### state/helpers~getFiles(dir, ignores, check) ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>state/helpers</code>](#module_state/helpers)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array with file paths  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>object</code> | the directory in which to look for files |
| ignores | <code>Array.&lt;string&gt;</code> | an array of folders which should be ignored |
| check | <code>function</code> | checks if the file should be returned, returns null or the file path |

<a name="module_state/helpers..isNotIgnored"></a>

### state/helpers~isNotIgnored(file, ignoredFolders) ⇒ <code>boolean</code>
Checks if a given file is not in one of the ignored folders

**Kind**: inner method of [<code>state/helpers</code>](#module_state/helpers)  

| Param | Type |
| --- | --- |
| file | <code>string</code> | 
| ignoredFolders | <code>Array</code> | 

