<a name="module_initPartials"></a>

## initPartials
Module for registering all partials


* [initPartials](#module_initPartials)
    * [~register(shortPath, fullFilePath)](#module_initPartials..register) ⇒ <code>Promise</code>
    * [~registerLayouts()](#module_initPartials..registerLayouts) ⇒ <code>Promise</code>
    * [~registerComponents(app)](#module_initPartials..registerComponents) ⇒ <code>Promise</code>
    * [~registerPartial(app, fullPath)](#module_initPartials..registerPartial) ⇒ <code>Promise</code>
    * [~registerAll(app)](#module_initPartials..registerAll) ⇒ <code>Promise</code>

<a name="module_initPartials..register"></a>

### initPartials~register(shortPath, fullFilePath) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>initPartials</code>](#module_initPartials)  
**Returns**: <code>Promise</code> - gets resolved when the given file has been registered  

| Param | Type | Description |
| --- | --- | --- |
| shortPath | <code>string</code> | relative template file path based from components folder |
| fullFilePath | <code>string</code> | absolute template file path |

<a name="module_initPartials..registerLayouts"></a>

### initPartials~registerLayouts() ⇒ <code>Promise</code>
Register all internal layout partials

**Kind**: inner method of [<code>initPartials</code>](#module_initPartials)  
**Returns**: <code>Promise</code> - gets resolved when all partials are registered  
<a name="module_initPartials..registerComponents"></a>

### initPartials~registerComponents(app) ⇒ <code>Promise</code>
Registers all user partials

**Kind**: inner method of [<code>initPartials</code>](#module_initPartials)  
**Returns**: <code>Promise</code> - gets resolved when all partials are registered  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

<a name="module_initPartials..registerPartial"></a>

### initPartials~registerPartial(app, fullPath) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>initPartials</code>](#module_initPartials)  
**Returns**: <code>Promise</code> - gets resolved when the template has been registered  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fullPath | <code>string</code> | absolute template file path |

<a name="module_initPartials..registerAll"></a>

### initPartials~registerAll(app) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>initPartials</code>](#module_initPartials)  
**Returns**: <code>Promise</code> - gets resolved when all components and layouts have been registered  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

