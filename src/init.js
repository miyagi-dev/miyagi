const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const helmet = require("helmet");
const http = require("http");
const compression = require("compression");

const config = require("./config.json");
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

function start(cnf) {
  const app = express();

  setConfig(app, cnf);

  if (setEngines(app)) {
    const port = process.env.PORT || config.defaultPort;
    const server = http.createServer(app);

    app.use(helmet());
    app.use(
      compression({
        threshold: 0
      })
    );
    app.set("port", port);

    setState(
      app,
      { sourceTree: true, menu: true, partials: true, data: true },
      () => {
        setRouter(app);
        setStaticFiles(app, config);
        setViews(app);

        registerHelpers(app, handlebars);
        registerPartials.registerAll(app, handlebars, true).then(() => {
          handlebarsLayouts.register(handlebars);

          server.listen(app.get("port"));

          fileWatcher(server, app, handlebars);

          logger.log(
            "info",
            config.messages.serverStarted.replace("${port}", port)
          );
        });
      }
    );
  }
}

module.exports = {
  start
};
