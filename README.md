# freitag

_freitag_ gives you an overview over all your components and allows you to develop them independently from a backend.
For maximum convenience, you can define json data which can be inherited and reused from including components. _freitag_ uses [consolidate.js](https://github.com/tj/consolidate.js) under the hood, so it automatically supports a lot of rendering engines.

[![Build Status](https://travis-ci.com/mgrsskls/freitag.svg?token=PQ1wpfPsNbj5pQ6Nb2cJ&branch=master)](https://travis-ci.com/mgrsskls/freitag) [![codecov](https://codecov.io/gh/mgrsskls/freitag/branch/master/graph/badge.svg?token=h0X0KpG03T)](https://codecov.io/gh/mgrsskls/freitag)

## Demo

[freitag.mgrossklaus.de](https://freitag.mgrossklaus.de)

## Data reusage

### Variation inheritance

For every component, you can define variations. These variations inherit data from the base definition (if defined), which can then easily be overwritten or extended.

### Data inclusion

If you have a component, that includes another component, you can easily include the data (or one of its variations) of the latter into the data of including component. That way it's enough to define data for a specific component only once.

## Installation

`npm install freitag`
or
`yarn install freitag`

## Usage

Create a `freitag.json` in your project folder with the following options:

| option             | required/optional | type            | default                               | Note                                                                                                                                                    |
| ------------------ | ----------------- | --------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projectName`      | required          | String          | -                                     |
| `srcFolder`        | required          | String          | `/`                                   | Setting this value to a folder with nothing else but components is optimal, while using your root folder decreases performance.                         |
| `srcFolderIgnores` | optional          | Array           | `[".git", "node_modules"]`            | Values will be merged with the default. value                                                                                                           |
| `cssFiles`         | optional          | Array or Object | `[]`                                  | Can either be an array of files or an object with the NODE_ENVs as key, e.g.: `{ development: ["dev/css/index.css"], productions: ["dist/index.css"] }` |
| `jsFiles`          | optional          | Array or Object | `[]`                                  | See `cssFiles`.                                                                                                                                         |
| `validations`      | optional          | Object          | `{ html: true, accessibility: true }` |

Start _freitag_ with `node node_modules/freitag`. This will serve _freitag_ at `http://127.0.0.1:5000`. You can change the port with `PORT=1234 node node_modules/freitag`.

### Organizing your components

_freitag_ assumes that you have a dedicated folder for each of your components, including a template-, css- and js file, all named like the folder.

#### Example

```
├── src
│   ├── components
│   │   ├── button
│   │   │   ├── button.css
│   │   │   ├── button.hbs
│   │   │   ├── button.js
│   │   │   └── button.json
│   │   └── teaser
│   │       ├── teaser.css
│   │       ├── teaser.hbs
│   │       ├── teaser.js
│   │       └── teaser.json
│   └── templates
│       └── homepage
│           ├── header
│           │   ├── header.css
│           │   ├── header.hbs
│           │   ├── header.js
│           │   └── header.json
│           ├── footer
│           │   ├── header.css
│           │   ├── header.hbs
│           │   ├── header.js
│           │   └── header.json
│           ├── homepage.css
│           ├── homepage.hbs
│           ├── homepage.js
│           └── homepage.json
└── ...
```

You can call the folders whatever you want and you can nest them as deep as you want.

_**Note:** Files, that are not named the same as the folder they live in, will be ignored._

### Creating test data for your components

Create a `json` file in your component folder with a structure like this:

```js
/* e.g. components/button/button.json */
{
  "data": {
    "label": "Click me",
    "type": "submit"
  }
}

/* e.g. components/teaser/teaser.json */
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

/* e.g. templates/homepage/homepage.json */
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
        "cta": {
          "component": "components/button/button.json"
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
        "teaser": {
          "component": "components/teaser/teaser.json",
          "variation": "Teaser 2"
        }
      }
    },
    {
      "name": "With overwritte teaser variation",
      "data": {
        "teaser": {
          "component": "components/teaser/teaser.json",
          "variation": "Teaser 2",
          "title": "Overwritten title"
        }
      }
    }
  ]
}
```

The simplest way is to just a have a `data` key in which you have some key/value pairs.

Additionally you can create `variations`. Each entry needs a `name` key and its own `data` key in which you overwrite or add variables for your variation. All variables, that are not overwritten, will be inherited by the root `data` key.

_**NOTE**: The default `data` key is optinal, that means you can also create variations only._

**Instead of defining data manually, you can also use data from included components:**

The example above uses `"components/teaser/teaser.json"` as the value for `data.teaser` in `templates/homepage/homepage.json`. _freitag_ detects that this is a data file for your component and doesn't interpret it as a simple string, but uses the data from this file for `data.teaser`.
If you have variations defined in this file, you can tell _freitag_ to use any of them like this:

```js
{
  "teaser": {
    "component": "components/teaser/teaser.json",
    "variation": "Teaser 2"
  }
}
```

This would use the variation with the name `Teaser 2` from `components/teaser/teaser.json`. If you omit the variation key, it uses the default `data` of the component.

_**Note:** You can also load overwrite values of the imported data (see last variation in the `homepage.json` example above)_

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
    },
    {
      "name": "With teaser variation",
      "data": {
        "teaser":  {
          "title": "Overwritten title"
        }
      }
    }
  ]
}
```

_freitag_'s concept of inheriting data works best with rendering engines which allow you to pass data objects into an include.
Please check the section [Rendering engines](#rendering-engines) for limitations with certain rendering engines.

_**Note:** There is no way to create a variation of a variation. Variations can only go one level deep._

### Rendering engines

As _freitag_ uses [consolidate.js](https://github.com/tj/consolidate.js), most of its rendering engines should work out of the box.

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

**The following engines don't allow passing data into includes, but the data is globally available:**

- [hogan.js](https://github.com/twitter/hogan.js)
- [mustache.js](https://github.com/janl/mustache.js)
- [pug](https://github.com/pugjs/pug)

Because of that, _freitag_'s concept of data inclusion doesn't work. Nevertheless, you can still define all variables manually in your data files. These variables will then be available in your included components.

If you use `pug`, you could also use a `mixin` and would then be able to use data inclusion. However, _freitag_ is not able to render mixins independently, so you could only render them in the context of the including file.

**The following engines don't allow passing data into includes and the data is not globally available:**

- [nunjucks](https://github.com/mozilla/nunjucks)

If you use `nunjucks`, you could set a variable in your component (e.g. `{% set myVar = myData.myVar %}` which creates a global variable. This would be available in the included component. Alternatively you could use a `macro`, but _freitag_ is not able to render these independently, so you could only render them in the context of the including file.

**Engines that don't support includes at all:**

- [underscore](https://github.com/jashkenas/underscore)
- [haml.js](https://github.com/tj/haml.js)

**_freitag_ doesn't work with the following rendering engines:**

- [doT](https://github.com/olado/doT)
- [marko](https://github.com/marko-js/marko)

### Validations

By default components are tested for accessibility and html errors.
The accessibility validation uses a local [axe-core](https://github.com/dequelabs/axe-core/) installation, whiile the html validation uses an external service from [https://validator.w3.org/nu/](https://validator.w3.org/nu/).

[https://validator.w3.org/nu/](https://validator.w3.org/nu/) has a rate limit (max. 10 requests per minute). So, if you're updating your components a lot, you might want to deactivate the the html validation, otherwise your IP will be blocked.

_**Note:** Just because the accessibility validation doesn't result in any errors, it doesn't mean that your component is accessible._

## Good to know

- Your component is automatically reloaded as soon as you change it.
- The start page of _freitag_ renders all your components, but without variations. Opening a component either renders an overview of all of its variations or the component directly if it doesn't have any variations.
- Folders, that don't include a file with the same name and the given file extension (defined in `freitag.json`), are shown in the menu, but disabled.
