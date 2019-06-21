const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const { pathEndsWithExtension } = require("../helpers.js");

function register(hbs, name, fullFilePath) {
  try {
    const readFile = fs.readFileSync(fullFilePath, "utf8");
    hbs.registerPartial(name, hbs.compile(readFile.toString()));
  } catch (e) {
    console.warn(
      config.messages.fileNotFound.replace("${fullFilePath}", fullFilePath)
    );
  }
}

function registerLayouts(hbs) {
  ["main", "iframe"].forEach(layout => {
    register(
      hbs,
      layout,
      path.join(
        __dirname,
        `../../${config.folders.views}/layouts/${layout}.hbs`
      )
    );
  });
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
