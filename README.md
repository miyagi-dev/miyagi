# roundup

roundup gives you an overview over all your components and allows you to develop them independently from a backend by defining inheritable json data. It uses [consolidate.js](https://github.com/tj/consolidate.js) under the hood, so it automatically supports all rendering engines that are supported by [consolidate.js](https://github.com/tj/consolidate.js).

## Installation

`npm install roundup`
or
`yarn install roundup`

## Usage

Create a `roundup.json` in your project folder with the following options:

```js
// roundup.json

{
  "extension": "hbs",         /* the file extension of your components */
  "engine": "handlebars",     /* the rendering engine for your components */
  "srcFolder": "src/",        /* the source folder for your components */
  "cssFiles": [               /* additional css files you want to be included */
    "src/reset.css",
    "src/index.css"
  ],
  "jsFiles": ["src/index.js"] /* additional js files you want to be included */
  "validations": {
    "html": true,
    "accessibility": true
  }
}
```

Start `roundup` with `node node_modules/roundup`. This will serve `roundup` at `http://127.0.0.1:8000`. You can change the port with `node node_modules/roundup port=1234`.

### Organizing your components

`roundup` assumes that you have a dedicated folder for each of your components, including a template-, css- and js file.

#### Example

```
├── src
│   ├── components
│   │   ├── button
│   │   │   ├── button.css
│   │   │   ├── button.hbs
│   │   │   └── button.js
│   │   └── teaser
│   │       ├── teaser.css
│   │       ├── teaser.hbs
│   │       └── teaser.js
│   └── templates
│       └── homepage
│           ├── header
│           │   ├── header.css
│           │   ├── header.hbs
│           │   └── header.js
│           ├── footer
│           │   ├── header.css
│           │   ├── header.hbs
│           │   └── header.js
│           ├── homepage.css
│           ├── homepage.hbs
│           └── homepage.js
└── ...
```

You can call the folders whatever you want and you can nest them as deep as you want.

_**Note:** Files, that are not named the same as the folder they live in, will be ignored._

### Creating test data for your components

Create a `json` file in your component folder with a structure like this:

```js
/* e.g. template.json */

{
  "data": {
    "content": "<p>Here goes my content html</p>",
    "teaser": "components/teaser/teaser.json",
    "header": {
      "title": "The page title"
    }
  },
  "variations": [
    {
      "name": "With CTA",
      "data": {
        "cta": "components/button/button.json"
      }
    },
    {
      "name": "With different title",
      "data": {
        "title": "Another page title"
      }
    },
    {
      "name": "With teaser variation",
      "data": {
        "teaser": {
          "component": "components/teaser/teaser.json",
          "variation": "Teaser 2"
        }
      }
    }
  ]
}
```

The simplest way is to just a have a `data` key in which you have some dummy values for your variables.

Additionally you can create variations (using the `variations` key obviously). Each entry needs a `name` key and its own `data` key in which you overwrite or add variables for your variation. All variables, that are not overwritten, will be inherited by the top level `data` key.

**Instead of defining data manually, you can also use data from included components:**

The example above uses `"components/teaser/teaser.json"` as the value for `data.teaser`. `roundup` detects that this is a data file for your component and doesn't interpret it as a simple string, but uses the data from this file for `data.teaser`.
If you have variations defined in this file, you can tell `roundup` to use any of them like this:

```js
{
  "teaser": {
    "component": "components/teaser/teaser.json",
    "variation": "Teaser 2"
  }
}
```

This would use the variation with the name `Teaser 2` from `components/teaser/teaser.json`. If you omit the variation key, it uses the root data, just as in the previous example.

_**Note:** There is no way to create a variation of a variation. Variations can only go one level deep._

### Rendering engines

tbd

### Validations

By default components are tested for accessibility and html errors.
The accessibility validation uses a local [axe-core](https://github.com/dequelabs/axe-core/) installation, whiile the html validation uses an external service from [https://validator.w3.org/nu/](https://validator.w3.org/nu/).

[https://validator.w3.org/nu/](https://validator.w3.org/nu/) has a rate limit (max. 10 requests per minute). So, if you're updating your components a lot, you might want to deactivate the the html validation, otherwise your IP will be blocked.

_**Note:** Just because the accessibility validation doesn't result in any errors, it doesn't mean that your component is accessible._

## Good to know

- Your component is automatically reloaded as soon as you change it.
- Your components are rendered inside an iframe. If you want to work directly on your component without the iframe, the menu and the validations, you can do so by opening it via the menu in a new tab (right click) or by replacing the `?show` parameter of the url by `?component`.
- The start page of `roundup` renders all your components, but without variations. Opening a component either renders an overview of all of its variations or the component directly if it doesn't have any variations.
- Folders, that don't include a file with the same name and the given file extension (defined in `roundup.json`), are shown in the menu, but disabled.
