"use strict";

const engines = require("consolidate");
const config = require("../config.json");
const logger = require("../logger.js");

function setHeadmanEngine(app) {
  app.engine("hbs", engines.handlebars);
  app.set("view engine", "hbs");
}

function setUserEngine(app) {
  const { extension, engine } = app.get("config");

  try {
    app.engine(extension, engines[engine]);
    app.set("view engine", extension);
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
