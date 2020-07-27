<a name="module_init/config"></a>

## init/config
Module for sanitizing the user configuration and merging it with the default configuration


* [init/config](#module_init/config)
    * [module.exports([userConfig])](#exp_module_init/config--module.exports) ⇒ <code>object</code> ⏏
        * [~sanitizePath(path)](#module_init/config--module.exports..sanitizePath) ⇒ <code>string</code>
        * [~arrayfy(strOrArr)](#module_init/config--module.exports..arrayfy) ⇒ <code>Array</code>
        * [~objectIsRealObject(obj)](#module_init/config--module.exports..objectIsRealObject) ⇒ <code>boolean</code>
        * [~getAssetFilesArray(strOrArrOrObj, assetType)](#module_init/config--module.exports..getAssetFilesArray) ⇒ <code>Array.&lt;string&gt;</code>

<a name="exp_module_init/config--module.exports"></a>

### module.exports([userConfig]) ⇒ <code>object</code> ⏏
**Kind**: Exported function  
**Returns**: <code>object</code> - the user configuration merged with the default configuration  

| Param | Type | Description |
| --- | --- | --- |
| [userConfig] | <code>object</code> | the unmerged user configuration |

<a name="module_init/config--module.exports..sanitizePath"></a>

#### module.exports~sanitizePath(path) ⇒ <code>string</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_init/config--module.exports)  
**Returns**: <code>string</code> - the given path sanitized  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | unsanitized directory or file path |

<a name="module_init/config--module.exports..arrayfy"></a>

#### module.exports~arrayfy(strOrArr) ⇒ <code>Array</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_init/config--module.exports)  
**Returns**: <code>Array</code> - the given file path in an array or simply the given array  

| Param | Type | Description |
| --- | --- | --- |
| strOrArr | <code>string</code> \| <code>Array</code> | file path or array of file paths |

<a name="module_init/config--module.exports..objectIsRealObject"></a>

#### module.exports~objectIsRealObject(obj) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_init/config--module.exports)  
**Returns**: <code>boolean</code> - is true if the given object is a real object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | any value provided by the user |

<a name="module_init/config--module.exports..getAssetFilesArray"></a>

#### module.exports~getAssetFilesArray(strOrArrOrObj, assetType) ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>module.exports</code>](#exp_module_init/config--module.exports)  
**Returns**: <code>Array.&lt;string&gt;</code> - converts the given object to an array of asset file path strings  

| Param | Type | Description |
| --- | --- | --- |
| strOrArrOrObj | <code>string</code> \| <code>Array</code> \| <code>object</code> | user assets files, either one file as string, an array of files or an object with strings or array for each NODE_ENV |
| assetType | <code>&quot;css&quot;</code> \| <code>&quot;js&quot;</code> | the current asset type |

