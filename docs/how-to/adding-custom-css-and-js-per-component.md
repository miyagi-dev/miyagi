If you need to add custom CSS or JavaScript to a component to customize in the context of _miyagi_, you can add files inside the component folder for that:

- `<component>.miyagi.css`
- `<component>.miyagi.js`

`<component>` needs to be replaced with the component name.

Please note that on the component view, which renders all variations, these files are included only once (if `config.components.renderInIframe` is set to `false`). That means if you want to manipulate the components in some way, you might want to use `document.querySelectorAll` instead of `document.querySelector` to make sure it affects all variants.
