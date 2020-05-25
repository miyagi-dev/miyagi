"use strict";

const engines = require("consolidate");
const config = require("../config.json");
const log = require("../logger.js");

function setHeadmanEngine(app) {
  app.engine("hbs", engines.handlebars);
}

function setUserEngine(app) {
  const { extension } = app.get("config").files.templates;
  const { name, instance } = app.get("config").engine;

  if (instance) {
    engines.requires[name] = instance;
  }

  try {
    app.engine(extension, engines[name]);
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
