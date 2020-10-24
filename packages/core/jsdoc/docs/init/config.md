<a name="module_initConfig"></a>

## initConfig
Module for sanitizing the user configuration and merging it with the default configuration


* [initConfig](#module_initConfig)
    * [module.exports([userConfig])](#exp_module_initConfig--module.exports) ⇒ <code>object</code> ⏏
        * [~sanitizePath(path)](#module_initConfig--module.exports..sanitizePath) ⇒ <code>string</code>
        * [~arrayfy(strOrArr)](#module_initConfig--module.exports..arrayfy) ⇒ <code>Array</code>
        * [~objectIsRealObject(obj)](#module_initConfig--module.exports..objectIsRealObject) ⇒ <code>boolean</code>
        * [~getAssetFilesArray(strOrArrOrObj, manifest, assetType)](#module_initConfig--module.exports..getAssetFilesArray) ⇒ <code>Array.&lt;string&gt;</code>

<a name="exp_module_initConfig--module.exports"></a>

### module.exports([userConfig]) ⇒ <code>object</code> ⏏
**Kind**: Exported function  
**Returns**: <code>object</code> - the user configuration merged with the default configuration  

| Param | Type | Description |
| --- | --- | --- |
| [userConfig] | <code>object</code> | the unmerged user configuration |

<a name="module_initConfig--module.exports..sanitizePath"></a>

#### module.exports~sanitizePath(path) ⇒ <code>string</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_initConfig--module.exports)  
**Returns**: <code>string</code> - the given path sanitized  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | unsanitized directory or file path |

<a name="module_initConfig--module.exports..arrayfy"></a>

#### module.exports~arrayfy(strOrArr) ⇒ <code>Array</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_initConfig--module.exports)  
**Returns**: <code>Array</code> - the given file path in an array or simply the given array  

| Param | Type | Description |
| --- | --- | --- |
| strOrArr | <code>string</code> \| <code>Array</code> | file path or array of file paths |

<a name="module_initConfig--module.exports..objectIsRealObject"></a>

#### module.exports~objectIsRealObject(obj) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_initConfig--module.exports)  
**Returns**: <code>boolean</code> - is true if the given object is a real object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | any value provided by the user |

<a name="module_initConfig--module.exports..getAssetFilesArray"></a>

#### module.exports~getAssetFilesArray(strOrArrOrObj, manifest, assetType) ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_initConfig--module.exports)  
**Returns**: <code>Array.&lt;string&gt;</code> - converts the given object to an array of asset file path strings  

| Param | Type | Description |
| --- | --- | --- |
| strOrArrOrObj | <code>string</code> \| <code>Array</code> \| <code>object</code> | user assets files, either one file as string, an array of files or an object with strings or array for each NODE_ENV |
| manifest | <code>object</code> | manifest object |
| manifest.file | <code>string</code> | manifest file path |
| manifest.content | <code>object</code> | parsed json content of manifest file |
| assetType | <code>&quot;css&quot;</code> \| <code>&quot;js&quot;</code> | the current asset type |

