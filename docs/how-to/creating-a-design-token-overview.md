If you use CSS custom properties in your project, which are named based on a certain logic, _miyagi_ can automatically create a visual overview of your design tokens based on these custom properties.

To do so, add the following to your configuration:

```json
"assets": {
  "customProperties": {
    "files": ["file/with/custom/properties.css"]
  }
}
```

## Naming of custom properties

_miyagi_ scans the CSS files for custom properties, which start with a specific prefix. By default these prefixes are:

- `color`
- `typo`
- `spacing`

### Colors

Custom properties, that are named `--color-${name}`, are interpreted as colors, which can be used for typography but also as decorative colors.
You can also name the custom properties like `--color-typo-${name}` or `--color-decoration-${name}`. That way _miyagi_ knows that this color is only supposed to be used for typography or decorations like background, border etc., and will render them accordingly.

#### Examples

- `--color-Primary`
- `--color-decoration-Gold`
- `--color-typo-Headline`

### Typography

As typography consists of multiple CSS properties (as opposed to colors and spacings), _miyagi_ looks for custom properties, that start with `--typo-${name}` and end with any of the following:

- `-font-family`
- `-font-feature-settings`
- `-font-kerning`
- `-font-size-adjust`
- `-font-size`
- `-font-stretch`
- `-font-style`
- `-font-variant-caps`
- `-font-variant`
- `-font-weight`
- `-letter-spacing`
- `-line-height`
- `-text-shadow`
- `-text-transform`

_miyagi_ will then use all these custom properties to render an exemplary text node.

#### Examples

- `--typo-Headline-font-family`
- `--typo-Headline-font-size`
- `--typo-Headline-line-height`

### Spacings

Custom properties for spacings need to be simply called `--spacing-${name}`.

#### Examples

- `--spacing-12`
- `--spacing-24`
- `--spacing-32`

### Customization

You can customize the prefixes in your configuration like this:

```json
"assets": {
  "customProperties": {
    "prefixes": {
      "color": "color",
      "typo": "typo",
      "spacing": "spacing"
    }
  }
}
```
