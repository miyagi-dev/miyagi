<a name="module_initViewhelpers"></a>

## initViewhelpers
Module for registering handlebars view helpers


* [initViewhelpers](#module_initViewhelpers)
    * [~getMenuHtml(children, path, variation)](#module_initViewhelpers..getMenuHtml) ⇒ <code>string</code>
    * [~getCssFilesHtml(isBuild, files)](#module_initViewhelpers..getCssFilesHtml) ⇒ <code>string</code>
    * [~getJsFilesHtml(isBuild, files, es6Modules)](#module_initViewhelpers..getJsFilesHtml) ⇒ <code>string</code>

<a name="module_initViewhelpers..getMenuHtml"></a>

### initViewhelpers~getMenuHtml(children, path, variation) ⇒ <code>string</code>
Returns the menu html

**Kind**: inner method of [<code>initViewhelpers</code>](#module_initViewhelpers)  
**Returns**: <code>string</code> - the menu html  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>Array.&lt;object&gt;</code> | all items in the menu |
| path | <code>string</code> | the requested component |
| variation | <code>string</code> | the requested variation |

<a name="module_initViewhelpers..getCssFilesHtml"></a>

### initViewhelpers~getCssFilesHtml(isBuild, files) ⇒ <code>string</code>
Renders all link tags for given stylesheet files

**Kind**: inner method of [<code>initViewhelpers</code>](#module_initViewhelpers)  
**Returns**: <code>string</code> - the html with link tags  

| Param | Type | Description |
| --- | --- | --- |
| isBuild | <code>boolean</code> | defines if a build is created or not |
| files | <code>Array.&lt;string&gt;</code> | the paths to CSS files |

<a name="module_initViewhelpers..getJsFilesHtml"></a>

### initViewhelpers~getJsFilesHtml(isBuild, files, es6Modules) ⇒ <code>string</code>
Renders all script tags for given javascript files

**Kind**: inner method of [<code>initViewhelpers</code>](#module_initViewhelpers)  
**Returns**: <code>string</code> - the html with script tags  

| Param | Type | Description |
| --- | --- | --- |
| isBuild | <code>boolean</code> | defines if a build is created or not |
| files | <code>Array.&lt;string&gt;</code> | the paths to JS files |
| es6Modules | <code>boolean</code> | describes if the scripts should be rendered with type="module" |

