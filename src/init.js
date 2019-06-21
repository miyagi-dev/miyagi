const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const helmet = require("helmet");
const http = require("http");
const path = require("path");

const config = require("./config.json");
const fileWatcher = require("./fileWatcher.js");
const getPort = require("./getPort.js");
const registerHelpers = require("./hbs/registerHelpers.js");
const registerPartials = require("./hbs/registerPartials.js");
const router = require("./router.js");
const setConfig = require("./setConfig.js");
const setEngines = require("./setEngines.js");
const setState = require("./setState.js");

module.exports = cnf => {
  const port = getPort();
  const app = express();
  const server = http.createServer(app);
  const assetFolder =
    process.env.NODE_ENV === "development"
      ? config.folders.assets
      : config.folders.dist;
  app.use(helmet());

  setConfig(app, cnf);
  setState(app);
  setEngines(app);
  router(app);

  registerHelpers(app, handlebars);
  registerPartials(app, handlebars, true);

  handlebarsLayouts.register(handlebars);

  app.set("views", [
    path.join(__dirname, `../${config.folders.views}`),
    path.join(process.cwd(), app.get("config").srcFolder)
  ]);

  app.use(express.static(process.cwd()));
  app.use(express.static(path.join(__dirname, `../${assetFolder}/js`)));
  app.use(express.static(path.join(__dirname, `../${assetFolder}/css`)));

  server.listen(port);

  fileWatcher(server, app, handlebars);

  console.log(config.messages.serverStarted.replace("${port}", port));
};
