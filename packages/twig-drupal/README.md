# @miyagi/twig-drupal

This extension adds support for specific twig and Drupal functionality to [@miyagi/core](https://npmjs.com/package/@miyagi/core).

## Features

### Drupal attributes

- `addClass`
- `setAttribute`

[More about Drupal attributes](https://www.drupal.org/docs/8/theming-drupal-8/using-attributes-in-templates)

### twig

The following filters, functions and tags do not actually do anything in _miyagi_. Using this extension merely makes sure that compilation does not fail.

**NOTE:** If you need to add additional filters, functions or tags, please refer to the [_miyagi_ documentation](https://docs.miyagi.dev/configuration/extending-template-engine/).

#### Filters

- `clean_class`
- `clean_id`
- `safe_join`
- `t`
- `without`

#### Functions

- `attach_library`

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
