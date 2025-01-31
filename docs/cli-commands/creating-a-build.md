# Creating a build

```bash
miyagi build
```

This will create a static build in the folder that is defined in [`build.folder` in your settings](/configuration/options#build) (default: `"build"`).

_**NOTE:**_

- _miyagi automatically uses `NODE_ENV=production` to create the build, hence uses the [assets you defined for `production`](/configuration/options#assets) (if you did)._

## Params

### --folder

Setting the build folder can also be done via CLI:

```bash
miyagi build --folder <folder>
```

This would overwrite the [`build.folder` value defined in your settings](/configuration/options#build).
