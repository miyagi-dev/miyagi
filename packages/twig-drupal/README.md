# @miyagi/twig-drupal

This extension adds support for specific twig and Drupal functionality to [@miyagi/core](https://npmjs.com/package/@miyagi/core).

## Features

### Drupal attributes

- `addClass`
- `setAttribute`

[More about Drupal attributes](https://www.drupal.org/docs/8/theming-drupal-8/using-attributes-in-templates)

To use Drupal attributes in your mock files, add `$drupal: true` to the object.

### twig

**NOTE:** If you need to add additional filters, functions or tags, please refer to the [_miyagi_ documentation](https://docs.miyagi.dev/configuration/extending-template-engine/).

#### Functions and filters

This plugin uses [twig-drupal-filters](https://www.npmjs.com/package/twig-drupal-filters), so all its functions and filters are supported.

#### Tags

- `trans` / `endtrans`
- `plural`

## Installation

```bash
npm i --save-dev @miyagi/twig-drupal
```

or

```bash
yarn add -D @miyagi/twig-drupal
```

### Usage

Add the extension to your `.miyagi.js` like this:

```js
module.exports = {
  extensions: [require('@miyagi/twig-drupal')],
  ...
}
```
