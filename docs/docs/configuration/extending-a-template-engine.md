If you need to extend your template engine, you can do that by requiring it in your [config file](/configuration/config-file) via [`engine.instance`](/configuration/options#engine) and passing it to _miyagi_.

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

If you are using the `twig-drupal` or `twig-laravel` extension, you need to extend `twig` like this:

```js
const twig = require("twig");

module.exports = {
  ...
  engine: {
    instance: twig.twig,
  },
  extensions: [
    [
      twigDrupal,
      {
        init(twig) {
          twig.extendFunction("customFunction", function customFunction() { ... });
        },
      },
    ],
  ],
  ...
}
```
