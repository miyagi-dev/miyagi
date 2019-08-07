# headman

[![Build Status](https://travis-ci.com/mgrsskls/headman.svg?token=PQ1wpfPsNbj5pQ6Nb2cJ&branch=master)](https://travis-ci.com/mgrsskls/headman) [![codecov](https://codecov.io/gh/mgrsskls/headman/branch/master/graph/badge.svg?token=h0X0KpG03T)](https://codecov.io/gh/mgrsskls/headman)

_headman_ renders and validates all your components and its variations. For maximum convenience, you can define json test data which can be reused from other components. This allows you to work independently from a backend. _headman_ uses [consolidate.js](https://github.com/tj/consolidate.js) internally, hence it automatically supports a lot of rendering engines.

## Benefits

- Make sure all possible variations of your components behave as expected
- Get your components immediately validated for html and accessibility violations
- Improve the code of your components by developing them encapsulated
- No need for a backend that provides data
- Show stakeholders the state of your development early
- No overhead in your project (except for the config file)

## Overview

- [Demo](#demo)
- [Data concept](#data-concept)
- [Installation](#installation)
- [Usage](#usage)
  - [Starting _headman_](#starting-headman)
  - [Organizing your components](#organizing-your-components)
  - [Creating test data](#creating-test-data)
  - [Global data](#global-data)
  - [Rendering engines](#rendering-engines)
  - [Validations](#validations)
- [Good to know](#good-to-know)
- [Things to come (maybe)](#things-to-come-maybe)

## Demo

[headman.mgrossklaus.de](https://headman.mgrossklaus.de) (Code: [https://github.com/mgrsskls/headman-demo](https://github.com/mgrsskls/headman-demo))

## Data concept

### Variation inheritance

You can define variations for each of your components. These variations inherit data from the components base definition (if defined), which can then easily be overwritten or extended.

### Data inclusion

If you have a component that includes another component, you can easily include the data (or one of its variations) of the latter into the data of including component. That way, it is enough to define data for a specific component once.

## Installation

`npm install headman` or `yarn install headman`.
You can also install it globally via `npm install -g headman` or `yarn global add headman`.

## Usage

### Starting _headman_

Create a `headman.json` in your project folder with the following options:

| option             | required/optional | type                      | default                               | Note                                                                                                                                                                                                  |
| ------------------ | ----------------- | ------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projectName`      | required          | String                    | -                                     |
| `srcFolder`        | required          | String                    | `/`                                   | Setting this value to a folder with nothing else but components is optimal, while using your root folder decreases performance.                                                                       |
| `srcFolderIgnores` | optional          | Array                     | `[".git", "node_modules"]`            | Values will be merged with the default value.                                                                                                                                                         |
| `cssFiles`         | optional          | String or Array or Object | `[]`                                  | Can either be a string, an array of strings or an object with your NODE_ENVs as key and `String` or `Array` as value, e.g.: `{ development: ["dev/css/index.css"], productions: ["dist/index.css"] }` |
| `jsFiles`          | optional          | String or Array or Object | `[]`                                  | See `cssFiles`.                                                                                                                                                                                       |
| `es6Modules`       | optional          | Boolean                   | `false`                               | Adds `type="module"` to the `script` tags of your included js files (useful when using unbundled javascript that uses es6 imports)                                                                    |
| `validations`      | optional          | Object                    | `{ html: true, accessibility: true }` |
| `reload`           | optional          | Boolean                   | `true`                                | Defines if your component automatically reloads after saving.                                                                                                                                         |

Start _headman_ with `NODE_ENV=(development|production) node node_modules/headman` (or `NODE_ENV=(development|production) headman` if installed globally). This will serve _headman_ at `http://localhost:5000`. You can change the port with `NODE_ENV=(development|production) PORT=1234 node node_modules/headman`.

### Organizing your components

_headman_ assumes that you have a dedicated folder for each of your components, including a template, css and js file, all named like the folder.

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

### Creating test data

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
    "teaser": {
      "dataFile": "components/teaser/teaser.json"
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
          "dataFile": "components/button/button.json"
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
          "dataFile": "components/teaser/teaser.json",
          "variation": "Teaser 2"
        }
      }
    },
    {
      "name": "With overwritte teaser variation",
      "data": {
        "teaser": {
          "dataFile": "components/teaser/teaser.json",
          "variation": "Teaser 2",
          "title": "Overwritten title"
        }
      }
    }
  ]
}
```

The simplest way is to only have a `data` key in which you have some key/value pairs.

Additionally, you can create `variations`. Each entry needs a `name` key and its own `data` key in which you overwrite or add variables for your variation. All variables, that are not overwritten, will be inherited by the base `data` key.

_**NOTE**: The base `data` key is optional, that means you can also create variations only._

**Instead of defining data manually, you can also use data from included components:**

The example above uses a `dataFile` key in `templates/homepage/homepage.json` in multiple places. _headman_ then uses the data from the given files.
If you have variations defined in these files, you can tell _headman_ to use any of them like this:

```js
{
  "teaser": {
    "dataFile": "components/teaser/teaser.json",
    "variation": "Teaser 2"
  }
}
```

This would use the variation with the name `Teaser 2` from `components/teaser/teaser.json`. If you omit the variation key, it uses the base `data` of the component.

_**Note:** You can also overwrite values of the imported data (see last variation in the `homepage.json` example above)._

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

_headman_'s concept of inheriting data works best with rendering engines which allow you to pass data objects into an include. Please check the section [Rendering engines](#rendering-engines) for limitations with certain rendering engines.

_**Note:** There is no way to create a named variation of a variation._

### Global data

You can define global data by creating a `data.json` in your `srcFolder`. This data will be merged into your components data. The components data has higher priority, hence overwrites keys with the same name.

### Rendering engines

As _headman_ uses [consolidate.js](https://github.com/tj/consolidate.js), most of its rendering engines should work out of the box.

The following rendering engines have been tested and appear to work without problems:

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

Due to the nature of their APIs, there might be some constraints.

**The following engines do not allow passing data into includes, but the data is globally available:**

- [hogan.js](https://github.com/twitter/hogan.js)
- [mustache.js](https://github.com/janl/mustache.js)
- [pug](https://github.com/pugjs/pug)

Because of that, _headman_'s concept of data inclusion does not work. Nevertheless, you can still define all variables manually in your data files. These variables will then be available in your included components.

If you use `pug`, you could also use a `mixin` and would then be able to use data inclusion. However, _headman_ is not able to render mixins independently, so you could only render them in the context of the including file.

**The following engines do not allow passing data into includes and the data is not globally available:**

- [nunjucks](https://github.com/mozilla/nunjucks)

If you use `nunjucks`, you could set a variable in your component (e.g. `{% set myVar = myData.myVar %}` which creates a global variable. This would be available in the included component. Alternatively, you could use a `macro`, but _headman_ is not able to render these independently, so you could only render them in the context of the including file.

**Engines that do not support includes at all:**

- [underscore](https://github.com/jashkenas/underscore)
- [haml.js](https://github.com/tj/haml.js)

**_headman_ does not work with the following rendering engines:**

- [doT](https://github.com/olado/doT)
- [marko](https://github.com/marko-js/marko)

### Validations

By default, components are tested for accessibility and html violations.
The accessibility validation uses a local [axe-core](https://github.com/dequelabs/axe-core/) installation, while the html validation uses an external service from [https://validator.w3.org/nu/](https://validator.w3.org/nu/).

[https://validator.w3.org/nu/](https://validator.w3.org/nu/) has a rate limit of max. 10 requests per minute. If you are updating your components often, you might want to deactivate the html validation, otherwise your IP will be blocked.

_**Note:** Just because the accessibility validation does not result in any errors, it does not mean that your component is accessible._

## Good to know

- Your component is automatically reloaded as soon as you change it.
- `headman` does not actually use the css and js files from your component folders. That is because `headman` cannot know which other components are included in your component, hence does not know which other files to load additionally. If you rely on a build task for your asset files (that might be slower than `_headman_`), you can turn off the automatic reloading of your component (`reload` in the options).
- The start page of _headman_ renders all your components, but without variations. Opening a component either renders an overview of all of its variations or the component directly if it does not have any variations.
- Folders, that do not include a file with the same name and the given file extension (defined in `headman.json`), are shown in the menu, but disabled.
- You can open a standalone view of your component in a new tab by clicking on the small icon on the top right corner.

## Things to come (maybe)

- Manually triggering html/accessibility validation if it is disabled
- Creating a production build (static html files)
- CSS validation
- Global data that is available in every component
- Support for YAML data files
- Referencing a template file in the data to be able to render dynamic content (useful for rich text elements e.g.)
