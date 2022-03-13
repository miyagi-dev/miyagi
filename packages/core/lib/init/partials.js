/**
 * Module for registering all partials
 *
 * @module initPartials
 */

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const log = require("../logger.js");
const helpers = require("../helpers.js");
const config = require("../config.json");

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
          log(
            "warn",
            config.messages.fileNotFound.replace("{{filePath}}", shortPath)
          );
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
        new Promise((resolve, reject) => {
          register(
            layout,
            path.join(
              __dirname,
              `../../${config.folders.views}/layouts/${layout}.hbs`
            )
          )
            .then(resolve)
            .catch((err) => {
              console.error(err);
              reject();
            });
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
        new Promise((resolve, reject) => {
          register(entry[0], entry[1])
            .then(resolve)
            .catch((err) => {
              console.error(err);
              reject();
            });
        })
    )
  );
}

/**
 * @param {string} fullPath - absolute template file path
 * @returns {Promise} gets resolved when the template has been registered
 */
async function registerPartial(fullPath) {
  return new Promise((resolve, reject) => {
    register(helpers.getShortPathFromFullPath(fullPath), fullPath)
      .then(resolve)
      .catch((err) => {
        console.error(err);
        reject();
      });
  });
}

/**
 * @param {object} app - the express instance
 * @returns {Promise} gets resolved when all components and layouts have been registered
 */
async function registerAll(app) {
  const promises = [];

  promises.push(
    new Promise((resolve, reject) => {
      registerLayouts()
        .then(resolve)
        .catch((err) => {
          console.error(err);
          reject();
        });
    })
  );

  promises.push(
    new Promise((resolve, reject) => {
      registerComponents(app)
        .then(resolve)
        .catch((err) => {
          console.error(err);
          reject();
        });
    })
  );

  return Promise.all(promises);
}

module.exports = {
  registerPartial,
  registerAll,
};
