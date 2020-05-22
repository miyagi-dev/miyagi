const yargs = require("yargs");

module.exports = yargs
  .command("start", "Starts the headman server")
  .command("build", "Creates a static build of all your components", {
    folder: {
      description: "The folder where your static build files will be saved",
      type: "string",
    },
  })
  .command(
    "new",
    "Creates a new component folder (including template, mock, documentation, info, css and js files)",
    {
      skip: {
        description:
          "files that will not be created\n(comma separated list of css, docs, info, js, mocks, tpl)",
        type: "string",
      },
      only: {
        description:
          "tells headman to only created the passes file types\n(comma separated list of tpl, docs, data, css, js)",
        type: "string",
      },
    }
  )
  .command(
    "mocks",
    "Creates a mock data file with dummy content based on the schema file"
  )
  .help()
  .alias("help", "h")
  .array("assets.css")
  .array("assets.folder")
  .array("assets.js")
  .array("components.ignores")
  .boolean("ui.reload")
  .boolean("ui.validations.accessibility")
  .boolean("ui.validations.html")
  .demandCommand()
  .epilogue("Please check http://example.com for all options");
