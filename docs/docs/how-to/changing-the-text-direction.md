By default, both the _miyagi_ UI and the components are rendered with a text direction from left to right.

You can set both individually via the configuration options `ui.textDirection` and `components.textDirection`.
Both accept the values `"ltr"` and `"rtl"`.

The options behave independently of each other, so that, for example, setting `ui.textDirection` to `"rtl"` results in the components still being rendered with the text direction from left to right.
