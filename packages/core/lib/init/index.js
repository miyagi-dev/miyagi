/**
 * Module for initializing miyagi
 *
 * @module init
 */

import express from "express";
import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";
import http from "http";
import cookieParser from "cookie-parser";

import appConfig, { messages } from "../miyagi-config.js";
import build from "../build/index.js";
import log from "../logger.js";
import setEngines from "./engines.js";
import setPartials from "./partials.js";
import setRouter from "./router.js";
import setState from "../state/index.js";
import setStatic from "./static.js";
import setViewHelpers from "./view-helpers.js";
import setViews from "./views.js";
import setWatcher from "./watcher.js";

export default async function init(mergedConfig) {
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
      `${messages.serverStarted.replace("{{port}}", actualPort)}\n`
    );

    return server;
  }

  return false;
}

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
          log("error", messages.portInUse.replace("{{port}}", port));
          server.close(async function () {
            const response = await startServer(app, port + 1);

            resolve(response);
          });
        }
      });
  });
}
