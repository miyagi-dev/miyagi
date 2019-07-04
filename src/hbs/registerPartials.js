const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const logger = require("../logger.js");
const helpers = require("../helpers.js");
const { fileIsOfGivenType } = require("../helpers.js");

async function register(hbs, name, fullFilePath) {
  new Promise(resolve => {
    try {
      fs.readFile(fullFilePath, "utf8", (err, data) => {
        if (err) {
          logger.log(
            "warn",
            config.messages.fileNotFound.replace("${filePath}", name)
          );
        } else {
          hbs.registerPartial(name, hbs.compile(data.toString()));
        }
        resolve();
      });
    } catch (e) {
      logger.log(
        "warn",
        config.messages.fileNotFound.replace("${filePath}", name)
      );
      resolve();
    }
  });
}

async function registerLayouts(hbs) {
  const promises = [];

  ["main", "iframe"].forEach(layout => {
    promises.push(
      new Promise(resolve => {
        register(
          hbs,
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

async function registerComponents(hbs, app) {
  const promises = [];

  Object.keys(app.get("state").partials).forEach(shortPath => {
    if (fileIsOfGivenType(shortPath, app.get("config").extension)) {
      promises.push(
        new Promise(resolve => {
          register(
            hbs,
            shortPath,
            helpers.getFullPathFromShortPath(app, shortPath)
          ).then(resolve);
        })
      );
    }
  });

  return await Promise.all(promises);
}

async function registerPartial(app, hbs, fullPath) {
  return new Promise(resolve => {
    register(
      hbs,
      helpers.getShortPathFromFullPath(app, fullPath),
      fullPath
    ).then(resolve);
  });
}

async function registerAll(app, hbs, initial) {
  const promises = [];

  if (initial) {
    promises.push(
      new Promise(resolve => {
        registerLayouts(hbs).then(resolve);
      })
    );
  }

  promises.push(
    new Promise(resolve => {
      registerComponents(hbs, app).then(resolve);
    })
  );

  return await Promise.all(promises);
}

module.exports = {
  registerPartial,
  registerAll
};
