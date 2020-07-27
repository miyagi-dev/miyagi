<a name="module_init/router"></a>

## init/router
Module for accepting and routing requests


* [init/router](#module_init/router)
    * [~getDataForComponent(app, component)](#module_init/router..getDataForComponent) ⇒ <code>object</code>
    * [~checkIfRequestedComponentIsValid(app, component)](#module_init/router..checkIfRequestedComponentIsValid) ⇒ <code>boolean</code>
    * [~checkIfDataIncludesVariation(data, variation)](#module_init/router..checkIfDataIncludesVariation) ⇒ <code>boolean</code>
    * [~checkIfRequestedVariationIsValid(app, component, variation)](#module_init/router..checkIfRequestedVariationIsValid) ⇒ <code>boolean</code>
    * [~awaitHandlerFactory(middleware)](#module_init/router..awaitHandlerFactory) ⇒ <code>function</code>

<a name="module_init/router..getDataForComponent"></a>

### init/router~getDataForComponent(app, component) ⇒ <code>object</code>
**Kind**: inner method of [<code>init/router</code>](#module_init/router)  
**Returns**: <code>object</code> - the mock data of the given component  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| component | <code>string</code> | the component directory |

<a name="module_init/router..checkIfRequestedComponentIsValid"></a>

### init/router~checkIfRequestedComponentIsValid(app, component) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>init/router</code>](#module_init/router)  
**Returns**: <code>boolean</code> - is true if the requested component is stored in state.partials  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| component | <code>string</code> | the component directory |

<a name="module_init/router..checkIfDataIncludesVariation"></a>

### init/router~checkIfDataIncludesVariation(data, variation) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>init/router</code>](#module_init/router)  
**Returns**: <code>boolean</code> - is true of the requested variation is in the given mock data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | mock data object |
| variation | <code>string</code> | requested variation name |

<a name="module_init/router..checkIfRequestedVariationIsValid"></a>

### init/router~checkIfRequestedVariationIsValid(app, component, variation) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>init/router</code>](#module_init/router)  
**Returns**: <code>boolean</code> - is true if the requested variation exists in the mock data of the given component  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| component | <code>string</code> | the component directory |
| variation | <code>string</code> | the requested variation name |

<a name="module_init/router..awaitHandlerFactory"></a>

### init/router~awaitHandlerFactory(middleware) ⇒ <code>function</code>
**Kind**: inner method of [<code>init/router</code>](#module_init/router)  
**Returns**: <code>function</code> - wrapped async function  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>function</code> | async callback function for requests |

