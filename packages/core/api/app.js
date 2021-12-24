/**
 * Module for initializing miyagi
 *
 * @module init
 */

import express from "express";
import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";

import setEngines from "../lib/init/engines.js";
import setPartials from "../lib/init/partials.js";
import setRouter from "../lib/init/router.js";
import setState from "../lib/state/index.js";
import setStatic from "../lib/init/static.js";
import setViewHelpers from "../lib/init/view-helpers.js";
import setViews from "../lib/init/views.js";

export default async function init(mergedConfig) {
  const app = express();
  app.set("config", mergedConfig);
  app.set("view cache", false);
  app.set("cache", false);

  if (await setEngines(app)) {
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

    return app;
  }

  return false;
}
