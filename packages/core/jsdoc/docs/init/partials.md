<a name="module_init/partials"></a>

## init/partials
Module for registering all partials


* [init/partials](#module_init/partials)
    * [~register(shortPath, fullFilePath)](#module_init/partials..register) ⇒ <code>Promise</code>
    * [~registerLayouts()](#module_init/partials..registerLayouts) ⇒ <code>Promise</code>
    * [~registerComponents(app)](#module_init/partials..registerComponents) ⇒ <code>Promise</code>
    * [~registerPartial(app, fullPath)](#module_init/partials..registerPartial) ⇒ <code>Promise</code>
    * [~registerAll(app)](#module_init/partials..registerAll) ⇒ <code>Promise</code>

<a name="module_init/partials..register"></a>

### init/partials~register(shortPath, fullFilePath) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>init/partials</code>](#module_init/partials)  
**Returns**: <code>Promise</code> - gets resolved when the given file has been registered  

| Param | Type | Description |
| --- | --- | --- |
| shortPath | <code>string</code> | relative template file path based from components folder |
| fullFilePath | <code>string</code> | absolute template file path |

<a name="module_init/partials..registerLayouts"></a>

### init/partials~registerLayouts() ⇒ <code>Promise</code>
Register all internal layout partials

**Kind**: inner method of [<code>init/partials</code>](#module_init/partials)  
**Returns**: <code>Promise</code> - gets resolved when all partials are registered  
<a name="module_init/partials..registerComponents"></a>

### init/partials~registerComponents(app) ⇒ <code>Promise</code>
Registers all user partials

**Kind**: inner method of [<code>init/partials</code>](#module_init/partials)  
**Returns**: <code>Promise</code> - gets resolved when all partials are registered  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

<a name="module_init/partials..registerPartial"></a>

### init/partials~registerPartial(app, fullPath) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>init/partials</code>](#module_init/partials)  
**Returns**: <code>Promise</code> - gets resolved when the template has been registered  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| fullPath | <code>string</code> | absolute template file path |

<a name="module_init/partials..registerAll"></a>

### init/partials~registerAll(app) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>init/partials</code>](#module_init/partials)  
**Returns**: <code>Promise</code> - gets resolved when all components and layouts have been registered  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |

