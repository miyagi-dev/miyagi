<a name="module_index"></a>

## index
The headman module


* [index](#module_index)
    * [~argsIncludeMockGenerator(args)](#module_index..argsIncludeMockGenerator) ⇒ <code>Boolean</code>
    * [~argsIncludeComponentGenerator(args)](#module_index..argsIncludeComponentGenerator) ⇒ <code>Boolean</code>
    * [~argsIncludeBuild(args)](#module_index..argsIncludeBuild) ⇒ <code>Boolean</code>
    * [~argsIncludeServer(args)](#module_index..argsIncludeServer) ⇒ <code>Boolean</code>
    * [~getCliArgs(args)](#module_index..getCliArgs) ⇒ <code>Object</code>
    * [~Headman()](#module_index..Headman)

<a name="module_index..argsIncludeMockGenerator"></a>

### index~argsIncludeMockGenerator(args) ⇒ <code>Boolean</code>
Checks if headman was started with `mocks` command

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type |
| --- | --- |
| args | <code>Object</code> | 

<a name="module_index..argsIncludeComponentGenerator"></a>

### index~argsIncludeComponentGenerator(args) ⇒ <code>Boolean</code>
Checks if headman was started with `new` command

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type |
| --- | --- |
| args | <code>Object</code> | 

<a name="module_index..argsIncludeBuild"></a>

### index~argsIncludeBuild(args) ⇒ <code>Boolean</code>
Checks if headman was started with `build` command

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type |
| --- | --- |
| args | <code>Object</code> | 

<a name="module_index..argsIncludeServer"></a>

### index~argsIncludeServer(args) ⇒ <code>Boolean</code>
Checks if headman was started with `start` command

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type |
| --- | --- |
| args | <code>Object</code> | 

<a name="module_index..getCliArgs"></a>

### index~getCliArgs(args) ⇒ <code>Object</code>
Converts and removes unnecessary cli args

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type |
| --- | --- |
| args | <code>Object</code> | 

<a name="module_index..Headman"></a>

### index~Headman()
Requires the user config and initializes and calls correct modules based on command

**Kind**: inner method of [<code>index</code>](#module_index)  
