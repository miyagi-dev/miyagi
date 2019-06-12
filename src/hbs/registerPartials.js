const fs = require("fs");
const path = require("path");
const { pathEndsWithExtension } = require("../extensionHelper.js");

module.exports = function(app, hbs, initial) {
  if (initial) {
    hbs.registerPartial(
      "main",
      fs.readFileSync(
        path.join(__dirname, "../../views/layouts/main.hbs"),
        "utf8"
      )
    );
    hbs.registerPartial(
      "iframe",
      fs.readFileSync(
        path.join(__dirname, "../../views/layouts/iframe.hbs"),
        "utf8"
      )
    );
  }

  app.get("state").filePaths.forEach(filePath => {
    if (pathEndsWithExtension(filePath, app.get("config").extension)) {
      const fullFilePath = path.join(
        process.cwd(),
        `${app.get("config").srcFolder}/${filePath}`
      );
      let readFile;

      try {
        readFile = fs.readFileSync(fullFilePath, "utf8");
      } catch (e) {
        console.warn(
          `Couldn't find file ${fullFilePath}. Is the 'srcFolder' in your styleguide.json correct?`
        );
      }

      if (readFile) {
        hbs.registerPartial(filePath, hbs.compile(readFile.toString()));
      }
    }
  });
};
