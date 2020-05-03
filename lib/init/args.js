const yargs = require("yargs");

module.exports = yargs
  .command("start", "Starts the headman server", {
    reload: {
      description:
        "Defines if components should automatically be reloaded after files changed",
      type: "boolean",
    },
  })
  .command("build", "Creates a static build of all your components", {
    folder: {
      description: "The folder where your static build files will be saved",
      type: "string",
    },
  })
  .command(
    "new",
    "Creates a new component folder (including tpl, data, docs, css and js files)",
    {
      skip: {
        description:
          "files that will not be created\n(comma separated list of tpl, docs, data, css, js)",
        type: "string",
      },
      only: {
        description:
          "tells headman to only created the passes file types\n(comma separated list of tpl, docs, data, css, js)",
        type: "string",
      },
    }
  )
  .option("engine", {
    description:
      "The name of your template engine\n(see https://github.com/tj/consolidate.js)",
    type: "string",
  })
  .option("es6Modules", {
    description: "Defines if [type=module] should be added to script tags",
    type: "boolean",
  })
  .option("extension", {
    description: "The extension of your template files",
    type: "string",
  })
  .option("projectName", {
    description: "The name of your project",
    type: "string",
  })
  .option("srcFolder", {
    description: "The folder of your components",
    type: "string",
  })
  .option("srcFolderIgnores", {
    description:
      "Folders inside your srcFolder that should be ignored (comma separated list)",
    type: "string",
  })
  .help()
  .alias("help", "h")
  .demandCommand();
