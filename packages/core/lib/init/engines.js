/**
 * Module for setting the express engines
 *
 * @module initEngines
 */

const engines = require("consolidate");
const config = require("../config.json");
const log = require("../logger.js");
const helpers = require("../helpers.js");

/**
 * @param {object} app - the express instance
 */
function setMiyagiEngine(app) {
  app.engine("hbs", engines.handlebars);
}

/**
 * @param {object} app - the express instance
 * @returns {boolean} describes if setting the engine was successful
 */
async function setUserEngine(app) {
  const { extension } = app.get("config").files.templates;
  const { engine, extensions, isBuild } = app.get("config");

  if (engine.instance) {
    engines.requires[engine.name] = engine.instance;
  }

  for (const extension of extensions) {
    const ext = Array.isArray(extension) ? extension[0] : extension;
    const opts =
      Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

    if (ext.extendEngine) {
      engines.requires[engine.name] = await ext.extendEngine(opts, isBuild);
    }

    if (!engines.requires[engine.name]) {
      if (ext.engine) {
        engines.requires[engine.name] = ext.engine;
      }
    }
  }

  try {
    app.engine(helpers.getSingleFileExtension(extension), engines[engine.name]);
  } catch (e) {
    log("error", config.messages.settingEngineFailed);
    return false;
  }

  return true;
}

module.exports = function initEngines(app) {
  setMiyagiEngine(app);
  const userEngineSet = setUserEngine(app);

  return userEngineSet;
};
