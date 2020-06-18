<a name="module_render"></a>

## render
Rendering module


* [render](#module_render)
    * [~renderVariations(obj)](#module_render..renderVariations)
    * [~renderSingleComponent(object)](#module_render..renderSingleComponent) ⇒ <code>Promise</code>
    * [~renderMain(object)](#module_render..renderMain)
    * [~renderMainWithComponent(object)](#module_render..renderMainWithComponent)
    * [~renderMainWith404(object)](#module_render..renderMainWith404)
    * [~renderComponent(object)](#module_render..renderComponent)
    * [~renderComponentVariations(object)](#module_render..renderComponentVariations)
    * [~renderComponentOverview(object)](#module_render..renderComponentOverview)
    * [~renderComponentNotFound(object)](#module_render..renderComponentNotFound)

<a name="module_render..renderVariations"></a>

### render~renderVariations(obj)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 
| obj.app | <code>object</code> | 
| obj.res | <code>object</code> | 
| obj.file | <code>string</code> | 
| obj.context | <code>Array</code> | 
| obj.componentDocumentation | <code>string</code> | 
| obj.componentSchema | <code>string</code> | 
| obj.name | <code>string</code> | 
| obj.cb | <code>function</code> | 
| obj.schemaType | <code>string</code> | 

<a name="module_render..renderSingleComponent"></a>

### render~renderSingleComponent(object) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>render</code>](#module_render)  
**Returns**: <code>Promise</code> - resolves when the component has been rendered  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.file | 
| object.context | 
| object.standaloneUrl | 
| object.cb | 

<a name="module_render..renderMain"></a>

### render~renderMain(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.cb | 

<a name="module_render..renderMainWithComponent"></a>

### render~renderMainWithComponent(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.file | 
| object.variation | 
| object.cb | 

<a name="module_render..renderMainWith404"></a>

### render~renderMainWith404(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.file | 
| object.variation | 

<a name="module_render..renderComponent"></a>

### render~renderComponent(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.file | 
| object.variation | 
| object.embedded | 
| object.cb | 

<a name="module_render..renderComponentVariations"></a>

### render~renderComponentVariations(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.file | 
| object.cb | 

<a name="module_render..renderComponentOverview"></a>

### render~renderComponentOverview(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.cb | 

<a name="module_render..renderComponentNotFound"></a>

### render~renderComponentNotFound(object)
**Kind**: inner method of [<code>render</code>](#module_render)  

| Param |
| --- |
| object | 
| object.app | 
| object.res | 
| object.embedded | 
| object.target | 

