# Adding documentation

_miyagi_ supports multiple ways of documentation:

1. You can create [documentation files in your components](/component-files/documentation/) to document their behavior.
1. You can put markdown files anywhere inside your [`config.components.folder` directory](/configuration/options/#folder_2). If you name them either `README.md`, `index.md` or `<directory>.md` (i.e. the file name equals the directory name), this file will be used as the index for the current directory.
1. [The `config.docs.folder` directory](/configuration/options/#folder_3) can be used as a dedicated directory for documentation. It would be shown on the same level as your components directory in the menu. If you do not use it, you can set `config.docs.folder` to `null`.
