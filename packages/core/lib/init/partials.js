/**
 * Module for registering all partials
 *
 * @module initPartials
 */

import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import log from "../logger.js";
import { getShortPathFromFullPath } from "../helpers.js";
import config, { messages } from "../miyagi-config.js";
import __dirname from "../__dirname.js";

/**
 * @param {string} shortPath - relative template file path based from components folder
 * @param {string} fullFilePath - absolute template file path
 * @returns {Promise} gets resolved when the given file has been registered
 */
async function register(shortPath, fullFilePath) {
  return new Promise((resolve) => {
    fs.readFile(
      fullFilePath,
      "utf8",
      function registerPartialCallback(err, data) {
        if (typeof data === "string") {
          handlebars.registerPartial(
            shortPath,
            handlebars.compile(data.toString())
          );
        } else {
          log("warn", messages.fileNotFound.replace("{{filePath}}", shortPath));
        }
        resolve();
      }
    );
  });
}

/**
 * Register all internal layout partials
 *
 * @returns {Promise} gets resolved when all partials are registered
 */
async function registerLayouts() {
  return Promise.all(
    ["iframe_default", "iframe_index"].map(
      (layout) =>
        new Promise((resolve) => {
          register(
            layout,
            path.join(
              __dirname,
              `../${config.folders.views}/layouts/${layout}.hbs`
            )
          ).then(resolve);
        })
    )
  );
}

/**
 * Registers all user partials
 *
 * @param {object} app - the express instance
 * @returns {Promise} gets resolved when all partials are registered
 */
async function registerComponents(app) {
  return Promise.all(
    Object.entries(app.get("state").partials).map(
      (entry) =>
        new Promise((resolve) => {
          register(entry[0], entry[1]).then(resolve);
        })
    )
  );
}

/**
 * @param {object} app - the express instance
 * @param {string} fullPath - absolute template file path
 * @returns {Promise} gets resolved when the template has been registered
 */
async function registerPartial(app, fullPath) {
  return new Promise((resolve) => {
    register(getShortPathFromFullPath(app, fullPath), fullPath).then(resolve);
  });
}

/**
 * @param {object} app - the express instance
 * @returns {Promise} gets resolved when all components and layouts have been registered
 */
async function registerAll(app) {
  const promises = [];

  promises.push(
    new Promise((resolve) => {
      registerLayouts().then(resolve);
    })
  );

  promises.push(
    new Promise((resolve) => {
      registerComponents(app).then(resolve);
    })
  );

  return Promise.all(promises);
}

export default {
  registerPartial,
  registerAll,
};
