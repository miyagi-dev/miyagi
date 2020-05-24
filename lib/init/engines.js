"use strict";

const engines = require("consolidate");
const config = require("../config.json");
const log = require("../logger.js");

function setHeadmanEngine(app) {
  app.engine("hbs", engines.handlebars);
  app.set("view engine", "hbs");
}

function setUserEngine(app) {
  const { extension } = app.get("config").files.templates;
  const { name } = app.get("config").engine;

  try {
    app.engine(extension, engines[name]);
    app.set("view engine", extension);
  } catch (e) {
    log("error", config.messages.settingEngineFailed);
    return false;
  }

  return true;
}

module.exports = function(app) {
  setHeadmanEngine(app);
  const userEngineSet = setUserEngine(app);

  return userEngineSet;
};
