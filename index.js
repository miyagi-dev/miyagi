const engines = require("consolidate");
const express = require("express");
const fs = require("fs");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const helmet = require("helmet");
const http = require("http");
const path = require("path");

const fileWatcher = require("./src/fileWatcher.js");
const registerHelpers = require("./src/hbs/registerHelpers.js");
const registerPartials = require("./src/hbs/registerPartials.js");
const router = require("./src/router.js");
const setState = require("./src/setState.js");

function init(config) {
  const args = process.argv.slice(2);
  let port = 8000;

  args.forEach(arg => {
    const splitted = arg.split("=");

    if (splitted[0] === "port") {
      port = splitted[1];
    }
  });

  const app = express();
  const server = http.createServer(app);

  app.use(helmet());

  app.set(
    "config",
    Object.assign(
      {},
      {
        cssFiles: []
      },
      config
    )
  );

  setState(app);
  router(app);

  registerHelpers(app, handlebars);
  registerPartials(app, handlebars, true);

  handlebarsLayouts.register(handlebars);

  app.engine("hbs", engines.handlebars);
  app.engine(app.get("config").extension, engines[app.get("config").engine]);
  app.set("view engine", "hbs");
  app.set("view engine", app.get("config").extension);
  app.set("views", [
    path.join(__dirname, "views"),
    path.join(process.cwd(), app.get("config").srcFolder)
  ]);
  app.use(express.static(path.join(__dirname, "assets")));

  server.listen(port);

  fileWatcher(server, app, handlebars);

  console.log(`Running colib server at http://127.0.0.1:${port}`);
}

let config;

try {
  config = JSON.parse(fs.readFileSync("./styleguide.json"));
} catch (error) {
  config = {};
} finally {
  if (!config.extension) {
    console.error(
      "Please specify the file extension of your components in styleguide.json (key: 'extension', type: String)"
    );
  } else if (!config.srcFolder) {
    console.error(
      "Please specify the location of your components in styleguide.json (key: 'srcFolder', type: String)"
    );
  } else {
    init(config);
  }
}
