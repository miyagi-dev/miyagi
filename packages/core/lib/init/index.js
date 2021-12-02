/**
 * Module for initializing miyagi
 *
 * @module init
 */

const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const http = require("http");
const cookieParser = require("cookie-parser");

const appConfig = require("../config.json");
const build = require("../build/index.js");
const log = require("../logger.js");
const setEngines = require("./engines.js");
const setPartials = require("./partials.js");
const setRouter = require("./router.js");
const setState = require("../state");
const setStatic = require("./static.js");
const setViewHelpers = require("./view-helpers.js");
const setViews = require("./views.js");
const setWatcher = require("./watcher.js");

module.exports = async function init(mergedConfig) {
  const app = express();
  app.use(cookieParser());
  app.set("config", mergedConfig);
  app.set("view cache", false);
  app.set("cache", false);

  if (await setEngines(app)) {
    const port = process.env.PORT || appConfig.defaultPort;

    app.set("port", port);

    await setState(app, {
      sourceTree: true,
      menu: true,
      partials: true,
      fileContents: true,
      css: true,
    });

    setStatic(app);
    setRouter(app);
    setViews(app);
    setViewHelpers(app);
    await setPartials.registerAll(app);
    handlebarsLayouts.register(handlebars);

    if (app.get("config").isBuild) {
      return build(app)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    }

    const { server, port: actualPort } = await startServer(
      app,
      app.get("port")
    );

    setWatcher(server, app);

    log(
      "success",
      `${appConfig.messages.serverStarted.replace("{{port}}", actualPort)}\n`
    );

    return server;
  }

  return false;
};

/**
 * @param {object} app - the express instance
 * @param {number} port - the port that should be used
 * @returns {Promise} gets resolved with the server instance and the actual port
 */
function startServer(app, port) {
  const server = http.createServer(app);

  return new Promise((resolve) => {
    server
      .listen(port, function () {
        resolve({ server, port });
      })
      .on("error", (error) => {
        if (error.code === "EADDRINUSE") {
          log("error", appConfig.messages.portInUse.replace("{{port}}", port));
          server.close(async function () {
            const response = await startServer(app, port + 1);

            resolve(response);
          });
        }
      });
  });
}
