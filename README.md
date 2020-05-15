# headman

[![Build Status](https://travis-ci.com/mgrsskls/headman.svg?token=PQ1wpfPsNbj5pQ6Nb2cJ&branch=master)](https://travis-ci.com/mgrsskls/headman) ![Codecov](https://img.shields.io/codecov/c/github/mgrsskls/headman?token=988e4e2b46be48ad94803ecfdfce7c1d) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mgrsskls/headman) ![GitHub repo size](https://img.shields.io/github/repo-size/mgrsskls/headman)

_headman_ is a component development tool. It renders and validates all your components and its variations. For maximum convenience, you can define test data in JSON files which can be reused from other components. This allows you to work independently from a backend. _headman_ uses [consolidate.js](https://github.com/tj/consolidate.js) internally, hence it automatically supports a lot of rendering engines.

## Benefits

- Make sure all possible variations of your components behave as expected
- Get your components immediately validated for html and accessibility violations
- Improve the code of your components by developing them encapsulated
- No need for a backend that provides data
- Document your components using markdown
- Show stakeholders the state of your development early
- No overhead in your project (except for the config file)
- Themeable, so it fits to your project

## Overview

- [Demo](#demo)
- [Data concept](#data-concept)
- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Commands](#commands)
    - [Starting _headman_ server](#starting-headman-server)
    - [Creating components via CLI](#creating-components-via-cli)
    - [Creating data files via CLI](#creating-data-files-via-cli)
    - [Creating a build](#creating-a-build)
  - [Organizing your components](#organizing-your-components)
  - [Creating test data](#creating-test-data)
  - [Global data](#global-data)
  - [Component status](#component-status)
  - [Rendering engines](#rendering-engines)
  - [Validations](#validations)
  - [Documentation of components](#documentation-of-components)
  - [Creating components via CLI](#creating-components-via-cli)
  - [Creating a build](#creating-a-build)
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

`npm install headman`

You can also install it globally via `npm install -g headman`.

## Usage

### Options

Create a `headman.json` in your project folder with the following options or pass them as cli arguments when starting `headman` (dot notation can be used for objects):

```js
{
  "assetFolder": "", // The folder where your static assets are located.
  "build": {
    "folder": "build", // The folder where your build files will be saved. Use `folder` when using as cli argument.
  },
  "cssFiles": { // Can either be a string, an array of strings or an object with your NODE_ENVs as key and `String` or `Array` as value
    "development": ["src/index.css"],
    "production": ["dist/index.css"]
  },
  "es6Modules": false, // Adds `type="module"` to the `script` tags of your included js files (useful when using unbundled javascript that uses es6 imports)
  "jsFiles": { // Can either be a string, an array of strings or an object with your NODE_ENVs as key and `String` or `Array` as value
    "development": ["src/index.js"],
    "production": ["dist/index.js"]
  },
  "projectName": "headman",
  "reload": true, // Defines if your component automatically reloads after saving.
  "srcFolder": "src", // The folder where your components live. Setting this value to a folder with nothing else but components is optimal, while using your root folder decreases performance.
  "srcFolderIgnores": [ // These folder are ignored when scanning the srcFolder
    "node_modules",
    ".git",
    "package.json",
    "package-lock.json",
    "headman.json"
  ],
  "templates": {
    "engine": "handlebars", // The name of your template engine (see https://github.com/tj/consolidate.js#supported-template-engines)
    "namespaces": {
      "custom-namespace": "path/to/folder" // twig e.g. allows custom namespaces, which can be set like this
    }
    "extension": "hbs", // The file extension of your template files
  },
  "theme": {
    "favicon": "src/favicon.ico",
    "logo": "src/logo.svg",
    "navigation": {
      "colorBackground": "#e0eeff",
      "colorLinks": "#233e6b",
      "colorLinksActive": "#fff"
    },
    "content": {
      "colorHeadlines": "#233e6b",
      "colorText": "#233e6b"
    }
  },
  "validations": {
    "html": true,
    "accessibility": true
  },
}
```

_**Note:** If an option is passed as a CLI argument and defined in your `headman.json`, the CLI argument is used._

### Commands

#### Starting _headman_ server

Start _headman_ with `NODE_ENV=(development|production) node node_modules/headman start` (or `NODE_ENV=(development|production) headman start` if installed globally). This will serve _headman_ at `http://localhost:5000`. You can change the port with `NODE_ENV=<development|production> PORT=<port> node node_modules/headman start`.

#### Creating components via CLI

Creating (empty) components via CLI is possible with `headman new <folderName>/<componentName>`.
This will create template (the type is based on your config), data, docs, schema, css and js files.
You can skip any of these like this: `headman new <folderName>/<componentName> --skip=css,js`.
Alternatively, you can explicitly say which files you need like this: `headman new <folderName>/<componentName> --only=tpl,docs`.

#### Creating data files via CLI

If you have a valid `schema.json` file in your component folder, you can create a data file with dummy content (based on [json-schema-faker](https://www.npmjs.com/package/json-schema-faker)) via `headman data path/to/your/component`.

#### Creating a build

You can create a production build with `node node_modules/headman build` (or `headman build`).

_headman_ automatically goes into production mode to create the build, so you can ommit the `NODE_ENV`.
By default, the build (static html files + assets) will be created in `<YOUR_PROJECT>/build`. You can change this in your `headman.json` (see [Options](#options)) or by passing `--folder=<folder>`.

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
│   │   │   ├── button.json
│   │   │   └── button.md
│   │   └── teaser
│   │       ├── teaser.css
│   │       ├── teaser.hbs
│   │       ├── teaser.js
│   │       ├── teaser.json
│   │       └── teaser.md
│   └── templates
│       └── homepage
│           ├── header
│           │   ├── header.css
│           │   ├── header.hbs
│           │   ├── header.js
│           │   ├── header.json
│           │   └── header.md
│           ├── footer
│           │   ├── header.css
│           │   ├── header.hbs
│           │   ├── header.js
│           │   ├── header.json
│           │   └── header.md
│           ├── homepage.css
│           ├── homepage.hbs
│           ├── homepage.js
│           ├── homepage.json
│           └── homepage.md
└── ...
```

You can call the folders whatever you want and you can nest them as deep as you want.

_**Note:** Files, that are not named the same as the folder they live in, will be ignored._

### Creating test data

Create a `json` file in your component folder with a structure like this:

```js
/* e.g. components/button/button.json */
{
  "name": "Button",
  "data": {
    "label": "Click me",
    "type": "submit"
  }
}

/* e.g. components/teaser/teaser.json */
{
  "name": "Teaser",
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
  "name": "Homepage",
  "data": {
    "content": "<p>Here goes my content html</p>",
    "teaser": {
      "$ref": "components/teaser"
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
          "$tpl": "components/button",
          "$ref": "components/button"
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
          "$ref": "components/teaser",
          "variation": "Teaser 2"
        }
      }
    },
    {
      "name": "With overwritte teaser variation",
      "data": {
        "teaser": {
          "$ref": "components/teaser",
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

The example above uses a `$ref` key in `templates/homepage/homepage.json` in multiple places. _headman_ then uses the data from the given files.
If you have variations defined in these files, you can tell _headman_ to use any of them like this:

```js
{
  "teaser": {
    "$ref": "components/teaser#teaser-2",
  }
}
```

This would use the variation with the name `Teaser 2` from `components/teaser/teaser.json`. If you omit the variation key, it uses the base `data` of the component.

_**Note:** You can also overwrite values of the imported data (see last variation in the `homepage.json` example above)._

Additionally you can also use a `$tpl` key to reference another template file (See the "With CTA" variation in `homepage.json`). That way the data object gets replaced with rendered HTML and the variable in your template file could directly render the HTML.

The `teaser.json` example above would be resolved like this:

```js
/* e.g. template.json */
{
  "name": "Teaser",
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
        "cta": '<button type="submit">Click me</button>' // or whatever your button template looks like
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

### Merging templates

You can merge multiple components into one html result by using `render()`:

```js
{
  "data": {
    "html": {
      "render()": [{
        "$tpl": "some/component",
        "$tpl": "some/component",
        "$tpl": "some/component",
      }]
    }
  }
}
```

This would resolve the templates and join them into one variable `html`.

### Global data

You can define global data by creating a `data.json` in your `srcFolder`. This data will be merged into your components data. The components data has higher priority, hence overwrites keys with the same name.

### Component status

Components can have a status, which is rendered in the component overview. Add a `status` key to the `data.json` of your component with any of the following values:

- done
- wip
- needs_work

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

### Documentation of components

For every component you can create a markdown file for documentation. Its content is rendered at the beginning of the overview page of a component.

## Good to know

- Your component is automatically reloaded as soon as you change it.
- _headman_ does not actually use the css and js files from your component folders. That is because _headman_ cannot know which other components are included in your component, hence does not know which other files to load additionally. If you rely on a build task for your asset files (that might be slower than `_headman_`), you can turn off the automatic reloading of your component (`reload` in the options).
- The start page of _headman_ renders all your components, but without variations. Opening a component either renders an overview of all of its variations or the component directly if it does not have any variations.
- Folders, that do not include a file with the same name and the given file extension (defined in `headman.json`), are shown in the menu, but disabled.
- You can open a standalone view of your component in a new tab by clicking on the small icon on the top right corner.

## Things to come (maybe)

- Manually triggering html/accessibility validation if it is disabled
- CSS validation
- Support for YAML data files
