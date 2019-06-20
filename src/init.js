const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const helmet = require("helmet");
const http = require("http");
const path = require("path");

const fileWatcher = require("./fileWatcher.js");
const getPort = require("./getPort.js");
const registerHelpers = require("./hbs/registerHelpers.js");
const registerPartials = require("./hbs/registerPartials.js");
const router = require("./router.js");
const setConfig = require("./setConfig.js");
const setEngines = require("./setEngines.js");
const setState = require("./setState.js");

module.exports = config => {
  const port = getPort();
  const app = express();
  const server = http.createServer(app);
  const assetFolder =
    process.env.NODE_ENV === "development" ? "assets" : "dist";
  app.use(helmet());

  setConfig(app, config);
  setState(app);
  setEngines(app);
  router(app);

  registerHelpers(app, handlebars);
  registerPartials(app, handlebars, true);

  handlebarsLayouts.register(handlebars);

  app.set("views", [
    path.join(__dirname, "../views"),
    path.join(process.cwd(), app.get("config").srcFolder)
  ]);

  app.use(express.static(process.cwd()));
  app.use(express.static(path.join(__dirname, `../${assetFolder}/js`)));
  app.use(express.static(path.join(__dirname, `../${assetFolder}/css`)));

  server.listen(port);

  fileWatcher(server, app, handlebars);

  console.log(`Running colib server at http://127.0.0.1:${port}`);
};
