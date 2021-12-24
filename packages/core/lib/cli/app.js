/**
 * Module for initializing miyagi
 *
 * @module init
 */

import express from "express";
import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";

import setEngines from "../init/engines.js";
import setPartials from "../init/partials.js";
import setRouter from "../init/router.js";
import setState from "../state/index.js";
import setStatic from "../init/static.js";
import setViewHelpers from "../init/view-helpers.js";
import setViews from "../init/views.js";

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
