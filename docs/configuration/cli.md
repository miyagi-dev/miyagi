# CLI

All [available options](/configuration/options) — except for `engine.render()` can be set via command line.

- You can use dot notation for the keys. That way you can also set complex values like objects for [assets](/configuration/options#assets)).
- You can set an array as value by separating the values with a space.

**Example:**

```bash
miyagi start --files.template.extension twig --assets.css.development css/index.css css/forms.css
```

_**Note:** If an option is passed as a CLI argument and defined in your `.miyagi.js`, the CLI argument is used._
