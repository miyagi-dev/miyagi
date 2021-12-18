```bash
miyagi build
```

This will create a static build in the folder that is defined in [`build.folder` in your settings](/configuration/options#build) (default: `"build"`).

_**NOTE:**_

- _miyagi automatically uses `NODE_ENV=production` to create the build, hence uses the [assets you defined for `production`](/configuration/options#assets) (if you did)._
- _[Validations](/the-ui/#validations) are turned off for builds._

## Params

### --folder

Setting the build folder can also be done via CLI:

```bash
miyagi build --folder <folder>
```

This would overwrite the [`build.folder` value defined in your settings](/configuration/options#build).

### --outputFile

`miyagi` can create an `output.json` file, which contains the paths to the standalone HTML files of your components (including variants). You can e.g. use this file to run visual regression tests against those paths.
By default, this is turned off. You can enable it via

```bash
miyagi build --outputFile true
```

This would overwrite the [`build.outputFile` value defined in your settings](/configuration/options#build).
