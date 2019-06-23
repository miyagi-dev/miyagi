# roundup

roundup gives you an overview over all your components and allows you to develop them independently from a backend by defining inheritable json data. It uses [consolidate.js](https://github.com/tj/consolidate.js) under the hood, so it automatically supports a lot of rendering engines that are supported by [consolidate.js](https://github.com/tj/consolidate.js).

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

Start _roundup_ with `node node_modules/roundup`. This will serve _roundup_ at `http://127.0.0.1:8000`. You can change the port with `node node_modules/roundup port=1234`.

### Organizing your components

_roundup_ assumes that you have a dedicated folder for each of your components, including a template-, css- and js file.

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

/* e.g. teaser.json */
{
  "data": {
    "title": "Teaser 1 title"
  },
  "variations": [
    {
      "name": "Teaser 2",
      "data": {
        "title": "Teaser 2 title"
      }
    }
  ]
}

/* e.g. button.json */
{
  "data": {
    "label": "Click me",
    "type": "submit"
  }
}
```

The simplest way is to just a have a `data` key in which you have some dummy values for your variables.

Additionally you can create variations (using the `variations` key obviously). Each entry needs a `name` key and its own `data` key in which you overwrite or add variables for your variation. **All variables, that are not overwritten, will be inherited by the top level `data` key.**

**Instead of defining data manually, you can also use data from included components:**

The example above uses `"components/teaser/teaser.json"` as the value for `data.teaser`. _roundup_ detects that this is a data file for your component and doesn't interpret it as a simple string, but uses the data from this file for `data.teaser`.
If you have variations defined in this file, you can tell _roundup_ to use any of them like this:

```js
{
  "teaser": {
    "component": "components/teaser/teaser.json",
    "variation": "Teaser 2"
  }
}
```

This would use the variation with the name `Teaser 2` from `components/teaser/teaser.json`. If you omit the variation key, it uses the root data, just as in the previous example.

The `teaser.json` example above would be resolved like this:

```js
/* e.g. template.json */
{
  "data": {
    "content": "<p>Here goes my content html</p>",
    "teaser":  {
      "title": "Teaser 1 title"
    },
    "header": {
      "title": "The page title"
    }
  },
  "variations": [
    {
      "name": "With CTA",
      "data": {
        "cta": {
          "label": "Click me",
          "type": "submit"
        }
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
        "teaser":  {
          "title": "Teaser 2 title"
        }
      }
    }
  ]
}
```

_roundup_'s concept of inheriting data works best with rendering engines which allow you to pass data objects into an include.
Please check the section [Rendering engines](#rendering-engines) for limitations with certain rendering engines.

_**Note:** There is no way to create a variation of a variation. Variations can only go one level deep._

### Rendering engines

As _roundup_ uses [consolidate.js](https://github.com/tj/consolidate.js), most of its rendering engines should work out of the box.

The following rendering engines have been tested and seem to work with without problems:

- [dustjs](https://github.com/linkedin/dustjs)
- [ect](https://github.com/baryshev/ect)
- [ejs](https://github.com/mde/ejs)
- [haml.js](https://github.com/tj/haml.js)
- [handlebars.js](https://github.com/wycats/handlebars.js/)
- [hogan.js](https://github.com/twitter/hogan.js)
- [mustache.js](https://github.com/janl/mustache.js)
- [nunjucks](https://github.com/mozilla/nunjucks)
- [pug](https://github.com/pugjs/pug)
- [twig.js](https://github.com/twigjs/twig.js)

Due to their implementations, their might be some constraints though.

**The following engines don't allow passing data into includes, but the data is global:**

- [hogan.js](https://github.com/twitter/hogan.js)
- [mustache.js](https://github.com/janl/mustache.js)
- [pug](https://github.com/pugjs/pug)

Because of that, _roundup_'s concept of data inheritance doesn't work. Nevertheless, you can still define all variables manually in your data files. These variables will then be available in your included components.

If you use `pug`, you could also use a mixin and would then be able to use data inheritance. However, _roundup_ is not able to render mixins independently, so you could only render them in the context of the including file.

**The following engines don't allow passing data into includes and the data is not global:**

- [nunjucks](https://github.com/mozilla/nunjucks)

If you use `nunjucks`, you could set a variable in your component (e.g. `{% set myVar = myData.myVara %}` which creates a global variable which would be available in the include component. Alternatively you could use macros, but _roundup_ is not able to render these independently, so you could only render them in the context of the including file.

Engines that don't support includes at all:

- [underscore](https://github.com/jashkenas/underscore)
- [haml.js](https://github.com/tj/haml.js)

Due to the nature of the following rendering engines and conflicts with _roundup_, the following engines don't work:

- [doT](https://github.com/olado/doT)
- [marko](https://github.com/marko-js/marko)

### Validations

By default components are tested for accessibility and html errors.
The accessibility validation uses a local [axe-core](https://github.com/dequelabs/axe-core/) installation, whiile the html validation uses an external service from [https://validator.w3.org/nu/](https://validator.w3.org/nu/).

[https://validator.w3.org/nu/](https://validator.w3.org/nu/) has a rate limit (max. 10 requests per minute). So, if you're updating your components a lot, you might want to deactivate the the html validation, otherwise your IP will be blocked.

_**Note:** Just because the accessibility validation doesn't result in any errors, it doesn't mean that your component is accessible._

## Good to know

- Your component is automatically reloaded as soon as you change it.
- Your components are rendered inside an iframe. If you want to work directly on your component without the iframe, the menu and the validations, you can do so by opening it via the menu in a new tab (right click) or by replacing the `?show` parameter of the url by `?component`.
- The start page of _roundup_ renders all your components, but without variations. Opening a component either renders an overview of all of its variations or the component directly if it doesn't have any variations.
- Folders, that don't include a file with the same name and the given file extension (defined in `roundup.json`), are shown in the menu, but disabled.
