const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const logger = require("../logger.js");
const { pathEndsWithExtension } = require("../helpers.js");

async function register(hbs, name, fullFilePath) {
  new Promise(resolve => {
    try {
      fs.readFile(fullFilePath, "utf8", (err, data) => {
        if (err) {
          logger.log(
            "warn",
            config.messages.fileNotFound.replace(
              "${fullFilePath}",
              fullFilePath
            )
          );
        } else {
          hbs.registerPartial(name, hbs.compile(data.toString()));
        }
        resolve();
      });
    } catch (e) {
      logger.log(
        "warn",
        config.messages.fileNotFound.replace("${fullFilePath}", fullFilePath)
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

function registerComponents(hbs, app) {
  app.get("state").filePaths.forEach(filePath => {
    if (pathEndsWithExtension(filePath, app.get("config").extension)) {
      const fullFilePath = path.join(
        process.cwd(),
        `${app.get("config").srcFolder}/${filePath}`
      );

      register(hbs, filePath, fullFilePath);
    }
  });
}

module.exports = function(app, hbs, initial) {
  if (initial) {
    registerLayouts(hbs);
  }

  registerComponents(hbs, app);
};
