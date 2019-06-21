const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const { pathEndsWithExtension } = require("../extensionHelper.js");

function register(hbs, name, fullFilePath) {
  let readFile;

  try {
    readFile = fs.readFileSync(fullFilePath, "utf8");
  } catch (e) {
    console.warn(
      config.messages.fileNotFound.replace("${fullFilePath}", fullFilePath)
    );
  }

  if (readFile) {
    hbs.registerPartial(name, hbs.compile(readFile.toString()));
  }
}

module.exports = function(app, hbs, initial) {
  if (initial) {
    register(
      hbs,
      "main",
      path.join(__dirname, `../../${config.folders.views}/layouts/main.hbs`)
    );
    register(
      hbs,
      "iframe",
      path.join(__dirname, `../../${config.folders.views}/layouts/iframe.hbs`)
    );
  }

  app.get("state").filePaths.forEach(filePath => {
    if (pathEndsWithExtension(filePath, app.get("config").extension)) {
      const fullFilePath = path.join(
        process.cwd(),
        `${app.get("config").srcFolder}/${filePath}`
      );

      register(hbs, filePath, fullFilePath);
    }
  });
};
