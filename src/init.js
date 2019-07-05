const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const helmet = require("helmet");
const http = require("http");
const compression = require("compression");

const fileWatcher = require("./fileWatcher.js");
const logger = require("./logger.js");
const registerHelpers = require("./hbs/registerHelpers.js");
const registerPartials = require("./hbs/registerPartials.js");
const setConfig = require("./setConfig.js");
const setEngines = require("./setEngines.js");
const setRouter = require("./setRouter.js");
const setState = require("./setState.js");
const setStaticFiles = require("./setStaticFiles.js");
const setViews = require("./setViews.js");

module.exports = async function(appConfig, userConfig) {
  const app = express();
  setConfig(app, appConfig, userConfig);

  if (setEngines(app)) {
    const port = process.env.PORT || appConfig.defaultPort;
    const server = http.createServer(app);

    app.use(helmet());
    app.use(
      compression({
        threshold: 0
      })
    );
    app.set("port", port);

    await setState(app, {
      sourceTree: true,
      menu: true,
      partials: true,
      data: true
    });
    setStaticFiles(app);
    setRouter(app);
    setViews(app);
    registerHelpers(app, handlebars);
    await registerPartials.registerAll(app, handlebars, true);
    handlebarsLayouts.register(handlebars);
    server.listen(app.get("port"));

    fileWatcher(server, app, handlebars);

    logger.log(
      "info",
      appConfig.messages.serverStarted.replace("${port}", port)
    );

    return server;
  }
};
