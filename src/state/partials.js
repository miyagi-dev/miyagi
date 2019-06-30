const path = require("path");
const readDir = require("fs-readdir-recursive");
const config = require("../config.json");
const logger = require("../logger.js");
const { pathEndsWithExtension, isNotIgnored } = require("../helpers.js");

function fileIsInFolderWithSameName(file, ext) {
  const isValid = path.dirname(file).endsWith(path.basename(file, `.${ext}`));

  if (!isValid) {
    logger.log(
      "warn",
      config.messages.fileNotRenderedDueToUnmatchingFolderName.replace(
        "${file}",
        file
      )
    );
  }

  return isValid;
}

function filterUnwantedFilePath(app, file) {
  if (isNotIgnored(file, app.get("config").srcFolderIgnores)) {
    if (
      pathEndsWithExtension(file, app.get("config").extension) &&
      fileIsInFolderWithSameName(file, app.get("config").extension)
    ) {
      return true;
    }
  }

  return false;
}

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").srcFolder)
  ).filter(file => filterUnwantedFilePath(app, file));

  return paths;
}

module.exports = function getPartials(app) {
  const partials = {};

  getFilePaths(app).forEach(filePath => {
    partials[filePath] = path.join(
      process.cwd(),
      `${app.get("config").srcFolder}/${filePath}`
    );
  });

  return partials;
};
