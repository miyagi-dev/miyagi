"use strict";

const path = require("path");
const engines = require("consolidate");
const config = require("../config.json");
const logger = require("../logger.js");

function overwriteTwigRenderFunction(app) {
  const { srcFolder } = app.get("config");
  const originalRender = app.render;

  return function render() {
    originalRender.call(
      this,
      arguments[0],
      Object.assign({}, arguments[1], {
        path: path.join(process.cwd(), srcFolder),
        allowInlineIncludes: true
      }),
      arguments[2]
    );
  };
}

function setHeadmanEngine(app) {
  app.engine("hbs", engines.handlebars);
  app.set("view engine", "hbs");
}

function setUserEngine(app) {
  const { extension, engine } = app.get("config");

  try {
    app.engine(extension, engines[engine]);
    app.set("view engine", extension);

    if (engine === "twig") {
      app.render = overwriteTwigRenderFunction(app);
    }
  } catch (e) {
    logger.log("error", config.messages.settingEngineFailed);
    return false;
  }

  return true;
}

module.exports = function(app) {
  setHeadmanEngine(app);
  const userEngineSet = setUserEngine(app);

  return userEngineSet;
};
