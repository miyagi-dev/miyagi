```bash
headman new <folderName>/<componentName>`
```

This will create a component folder including the following files:

- `tpl`: index.twig
- `css`: index.css
- `js`: index.js
- `docs`: docs.md
- `mocks`: mocks.json
- `schema`: schema.json

_**NOTE:** The component will be located based on your [`components.folder` setting](/configuration/options#components) and the file names depend on your [`files` settings](/configuration/options#files)._

**--skip:**

You can skip any of the files like this:

```bash
headman new <folderName>/<componentName> --skip=css,js
```

**--only:**

Alternatively, you can explicitly say which files you need like this:

```bash
headman new <folderName>/<componentName> --only=tpl,docs
```
