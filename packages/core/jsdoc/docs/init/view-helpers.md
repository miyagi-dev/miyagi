<a name="module_init/view-helpers"></a>

## init/view-helpers
Module for registering handlebars view helpers


* [init/view-helpers](#module_init/view-helpers)
    * [~getMenuHtml(children, path, variation)](#module_init/view-helpers..getMenuHtml) ⇒ <code>string</code>
    * [~getCssFilesHtml(isBuild, files)](#module_init/view-helpers..getCssFilesHtml) ⇒ <code>string</code>
    * [~getJsFilesHtml(isBuild, files, es6Modules)](#module_init/view-helpers..getJsFilesHtml) ⇒ <code>string</code>

<a name="module_init/view-helpers..getMenuHtml"></a>

### init/view-helpers~getMenuHtml(children, path, variation) ⇒ <code>string</code>
Returns the menu html

**Kind**: inner method of [<code>init/view-helpers</code>](#module_init/view-helpers)  
**Returns**: <code>string</code> - the menu html  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>Array.&lt;object&gt;</code> | all items in the menu |
| path | <code>string</code> | the requested component |
| variation | <code>string</code> | the requested variation |

<a name="module_init/view-helpers..getCssFilesHtml"></a>

### init/view-helpers~getCssFilesHtml(isBuild, files) ⇒ <code>string</code>
Renders all link tags for given stylesheet files

**Kind**: inner method of [<code>init/view-helpers</code>](#module_init/view-helpers)  
**Returns**: <code>string</code> - the html with link tags  

| Param | Type | Description |
| --- | --- | --- |
| isBuild | <code>boolean</code> | defines if a build is created or not |
| files | <code>Array.&lt;string&gt;</code> | the paths to CSS files |

<a name="module_init/view-helpers..getJsFilesHtml"></a>

### init/view-helpers~getJsFilesHtml(isBuild, files, es6Modules) ⇒ <code>string</code>
Renders all script tags for given javascript files

**Kind**: inner method of [<code>init/view-helpers</code>](#module_init/view-helpers)  
**Returns**: <code>string</code> - the html with script tags  

| Param | Type | Description |
| --- | --- | --- |
| isBuild | <code>boolean</code> | defines if a build is created or not |
| files | <code>Array.&lt;string&gt;</code> | the paths to JS files |
| es6Modules | <code>boolean</code> | describes if the scripts should be rendered with type="module" |

