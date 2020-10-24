/**
 * Module for initializing miyagi
 *
 * @module init
 */

const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const http = require("http");

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
  app.set("config", mergedConfig);
  app.set("view cache", false);
  app.set("cache", false);

  if (setEngines(app)) {
    const port = (process.env.PORT || appConfig.defaultPort).toString();

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
      return build(app);
    }

    const server = http.createServer(app);
    server.listen(app.get("port"));

    setWatcher(server, app);

    log(
      "success",
      `${appConfig.messages.serverStarted.replace("{{port}}", port)}\n`
    );

    return server;
  }

  return false;
};
