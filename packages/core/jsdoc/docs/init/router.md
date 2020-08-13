<a name="module_initRouter"></a>

## initRouter
Module for accepting and routing requests


* [initRouter](#module_initRouter)
    * [~getDataForComponent(app, component)](#module_initRouter..getDataForComponent) ⇒ <code>object</code>
    * [~checkIfRequestedComponentIsValid(app, component)](#module_initRouter..checkIfRequestedComponentIsValid) ⇒ <code>boolean</code>
    * [~checkIfDataIncludesVariation(data, variation)](#module_initRouter..checkIfDataIncludesVariation) ⇒ <code>boolean</code>
    * [~checkIfRequestedVariationIsValid(app, component, variation)](#module_initRouter..checkIfRequestedVariationIsValid) ⇒ <code>boolean</code>
    * [~awaitHandlerFactory(middleware)](#module_initRouter..awaitHandlerFactory) ⇒ <code>function</code>

<a name="module_initRouter..getDataForComponent"></a>

### initRouter~getDataForComponent(app, component) ⇒ <code>object</code>
**Kind**: inner method of [<code>initRouter</code>](#module_initRouter)  
**Returns**: <code>object</code> - the mock data of the given component  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| component | <code>string</code> | the component directory |

<a name="module_initRouter..checkIfRequestedComponentIsValid"></a>

### initRouter~checkIfRequestedComponentIsValid(app, component) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>initRouter</code>](#module_initRouter)  
**Returns**: <code>boolean</code> - is true if the requested component is stored in state.partials  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| component | <code>string</code> | the component directory |

<a name="module_initRouter..checkIfDataIncludesVariation"></a>

### initRouter~checkIfDataIncludesVariation(data, variation) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>initRouter</code>](#module_initRouter)  
**Returns**: <code>boolean</code> - is true of the requested variation is in the given mock data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | mock data object |
| variation | <code>string</code> | requested variation name |

<a name="module_initRouter..checkIfRequestedVariationIsValid"></a>

### initRouter~checkIfRequestedVariationIsValid(app, component, variation) ⇒ <code>boolean</code>
**Kind**: inner method of [<code>initRouter</code>](#module_initRouter)  
**Returns**: <code>boolean</code> - is true if the requested variation exists in the mock data of the given component  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | the express instance |
| component | <code>string</code> | the component directory |
| variation | <code>string</code> | the requested variation name |

<a name="module_initRouter..awaitHandlerFactory"></a>

### initRouter~awaitHandlerFactory(middleware) ⇒ <code>function</code>
**Kind**: inner method of [<code>initRouter</code>](#module_initRouter)  
**Returns**: <code>function</code> - wrapped async function  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>function</code> | async callback function for requests |

