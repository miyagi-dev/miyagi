# @miyagi/twig-laravel

When using Laravel together with twig, this extension adds support for specific functionality to [@miyagi/core](https://npmjs.com/package/@miyagi/core).

## Features

### Laravel localization

In your templates, you might want to use translations with dot notation like `{{ trans('foo.bar') }}` or `{{ trans_choice('foo.bar', 2) }}`.
By using this extension, `miyagi` can load the translations from your localization files and use these.

By default the english localilzation files are used, which can be overwritten though.

See [Usage](#usage) for more information.

### twig

**NOTE:** If you need to add additional filters, functions or tags, please refer to the [_miyagi_ documentation](https://docs.miyagi.dev/configuration/extending-template-engine/).

#### Functions

This extension adds mocking to functions like `csrf_field` or `asset`, so `miyagi` does not throw an error when using these in your templates.

## Installation

```bash
npm i --save-dev @miyagi/twig-laravel
```

or

```bash
yarn add -D @miyagi/twig-laravel
```

### Usage

Add the extension to your `.miyagi.js` like this:

```js
module.exports = {
  extensions: [[require('@miyagi/twig-laravel'), {
    engine: Twig // optional, only necessary if you extended Twig in your configuration file,
    // the `locales` object is optional, the values below are the default values
    locales: {
      rootFolder: "resources/lang",
      lang: "en",
    }
  }]],
  ...
}
```
