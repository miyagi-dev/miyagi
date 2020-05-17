All [available options](/configuration/options) can be set via command line.

You can use dot notation for the keys. If your value is an array, use a comma separated list:

```bash
headman start --files.template.engine=twig --files.template.extension=twig --assets.css=css/index.css,css/forms.css
```

If your value needs to be an object (e.g. for the [assets](/configuration/options#assets)), you need to define this in the [config file](/configuration/config-file).

_**Note:** If an option is passed as a CLI argument and defined in your `.headman.js`, the CLI argument is used._
