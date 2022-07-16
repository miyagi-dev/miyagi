_miyagi_ comes with a light and a dark mode. By default the light mode is activated.

## Changing via configuration

The default mode can bet set in the configuration via `ui.theme.mode`. The available options are:

- `"light"` (default)
- `"dark"`
- `"auto"`

If `"auto"` is selected, _miyagi_ adheres to the settings of your operating system.

## Changing via UI

In the UI you can change the mode next to the list of your components. The same three options are available as when changing it via the configuration.

After changing the mode in the UI a cookie will be set to use the same mode when opening the UI again. Please note that the cookie will only be stored for the current port and project name. So, if either of them changes, the cookie will have no effect anymore.

For static builds, the cookie has no effect.

## Adapting the light and dark mode colors

If you want to adapt the colors of the light and dark modes, please refer to "[Theming the UI](/how-to/theming-the-ui/)".
