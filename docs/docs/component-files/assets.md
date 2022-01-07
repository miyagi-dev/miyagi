**File:** `index.css` and `index.js`

If the files should have the same name as the component folder, you can [define that in the config](/configuration/options#files).

_**NOTE:** miyagi does not actually use these files. That is because miyagi cannot know which other components are included in your component, hence does not know which other asset files to load additionally. Instead you can add [build files in your config](/configuration/assets) which miyagi serves._

**File:** `<component>.miyagi.css` and `<component>.miyagi.js`

If you need to add some custom CSS or JavaScript for a component just in the context of _miyagi_, you can use these files for that.
Please also refer to [Adding custom CSS and JS per component](/how-to/adding-custom-css-and-js-per-component).
