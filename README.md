<div align="center">
  <img src="logo.svg" width="300" height="60" alt="miyagi">
</div>

# miyagi

This is the monorepo for _miyagi_, a node based component development tool for JavaScript template engines.

- [Packages](#packages)
  - [core](#core)
  - [twig-drupal](#twig-drupal)
  - [twig-laravel](#twig-laravel)
- [Requirements](#requirements)
- [VS Code extension](#vs-code-extension)
- [Sponsor](#sponsor)

This repository includes the source code for:

- Demos:
  - Web Components ([web-components.demos.miyagi.dev](https://web-components.demos.miyagi.dev)):<br>[/demos/web-components](/demos/web-components)
  - Handlebars ([handlebars.demos.miyagi.dev](https://handlebars.demos.miyagi.dev)):<br>[/demos/handlebars](/demos/handlebars)
- Docs ([docs.miyagi.dev](https://docs.miyagi.dev)): [/docs](/docs)
- All packages

## Packages

### core

[core](/packages/core) is the main package for _miyagi_ and should usually be sufficient. Please check out the [documentation](https://docs.miyagi.dev) for a full list of its features.

### twig-drupal

[twig-drupal](/packages/twig-drupal) is an extension which adds support for [Drupal attributes](https://www.drupal.org/docs/8/theming-drupal-8/using-attributes-in-templates) and other Drupal and twig functions and filters. For a full list of supported features, please refer to its [README](/packages/twig-drupal/README.md).

### twig-laravel

[twig-laravel](/packages/twig-laravel/) mainly allows you to use the `trans()` and `trans_choice()` methods by Laravel, but also adds support for some others functions. For a full list of supported features, please refer to its [README](/packages/twig-laravel/README.md).

## Requirements

- node `>=16.7.0`

## VS Code extension

Fynn Becker ([@mvsde](https://twitter.com/mvsde), [fynn.be](https://fynn.be)) created a VS Code extension for _miyagi_, that can be found here: [https://marketplace.visualstudio.com/items?itemName=fynn.miyagi](https://marketplace.visualstudio.com/items?itemName=fynn.miyagi)

## Sponsor

<a href="https://factorial.io"><img src="https://logo.factorial.io/color.png" width="40" height="56" alt="Factorial"></a>
