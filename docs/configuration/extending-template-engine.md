If you need to extend your template engine, you can do that by requiring it in your [config file](/configuration/config-file) via [`engine.instance`](/configuration/options#engine) and passing it to _roundup_.

This is an example for [twig](github.com/twigjs/twig.js/):

```js
const twig = require("twig");

twig.extendFunction("customFunction", function customFunction() { ... });

module.exports = {
  ...
  engine: {
    instance: twig.twig,
  },
  ...
}
```
