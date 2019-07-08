"use strict";

const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const logger = require("../logger.js");
const helpers = require("../helpers.js");
const util = require("util");

async function register(name, fullFilePath) {
  new Promise(async resolve => {
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
  const promises = [];

  ["main", "iframe"].forEach(layout => {
    promises.push(
      new Promise(resolve => {
        register(
          layout,
          path.join(
            __dirname,
            `../../${config.folders.views}/layouts/${layout}.hbs`
          )
        ).then(resolve);
      })
    );
  });

  return await Promise.all(promises);
}

async function registerComponents(app) {
  const promises = [];

  Object.entries(app.get("state").partials).forEach(entry => {
    promises.push(
      new Promise(resolve => {
        register(entry[0], entry[1]).then(resolve);
      })
    );
  });

  return await Promise.all(promises);
}

async function registerPartial(app, fullPath) {
  return new Promise(resolve => {
    register(helpers.getShortPathFromFullPath(app, fullPath), fullPath).then(
      resolve
    );
  });
}

async function registerAll(app, initial) {
  const promises = [];

  if (initial) {
    promises.push(
      new Promise(resolve => {
        registerLayouts().then(resolve);
      })
    );
  }

  promises.push(
    new Promise(resolve => {
      registerComponents(app).then(resolve);
    })
  );

  return await Promise.all(promises);
}

module.exports = {
  registerPartial,
  registerAll
};
