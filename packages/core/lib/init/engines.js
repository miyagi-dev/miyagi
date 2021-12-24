/**
 * Module for setting the express engines
 *
 * @module initEngines
 */

import engines from "consolidate";
import { messages } from "../miyagi-config.js";
import log from "../logger.js";
import { getSingleFileExtension } from "../helpers.js";

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
  const { engine, extensions } = app.get("config");

  if (engine.instance) {
    engines.requires[engine.name] = engine.instance;
  }

  for (const extension of extensions) {
    const ext = Array.isArray(extension) ? extension[0] : extension;
    const opts =
      Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

    if (ext.extendEngine) {
      engines.requires[engine.name] = await ext.extendEngine(opts);
    }

    if (!engines.requires[engine.name]) {
      if (ext.engine) {
        engines.requires[engine.name] = ext.engine;
      }
    }
  }

  try {
    app.engine(getSingleFileExtension(extension), engines[engine.name]);
  } catch (e) {
    log("error", messages.settingEngineFailed);
    return false;
  }

  return true;
}

export default function initEngines(app) {
  setMiyagiEngine(app);
  const userEngineSet = setUserEngine(app);

  return userEngineSet;
}
