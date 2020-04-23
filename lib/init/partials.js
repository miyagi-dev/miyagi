"use strict";

const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const logger = require("../logger.js");
const helpers = require("../helpers.js");
const util = require("util");

async function register(name, fullFilePath) {
  return new Promise(async (resolve) => {
    try {
      const readFileAsync = util.promisify(fs.readFile);
      const data = await readFileAsync(fullFilePath, "utf8");

      handlebars.registerPartial(name, handlebars.compile(data.toString()));
    } catch (e) {
      logger.log(
        "warn",
        config.messages.fileNotFound.replace("${filePath}", name)
      );
    } finally {
      resolve();
    }
  });
}

async function registerLayouts() {
  return await Promise.all(
    ["main", "iframe"].map(
      (layout) =>
        new Promise((resolve) => {
          register(
            layout,
            path.join(
              __dirname,
              `../../${config.folders.views}/layouts/${layout}.hbs`
            )
          ).then(resolve);
        })
    )
  );
}

async function registerComponents(app) {
  return await Promise.all(
    Object.entries(app.get("state").partials).map(
      (entry) =>
        new Promise((resolve) => {
          register(entry[0], entry[1]).then(resolve);
        })
    )
  );
}

async function registerPartial(app, fullPath) {
  return new Promise((resolve) => {
    register(helpers.getShortPathFromFullPath(app, fullPath), fullPath).then(
      resolve
    );
  });
}

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

  return await Promise.all(promises);
}

module.exports = {
  registerPartial,
  registerAll,
};
