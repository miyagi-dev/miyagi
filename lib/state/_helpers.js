"use strict";

const path = require("path");
const config = require("../config.json");
const logger = require("../logger.js");
const { fileIsOfGivenType } = require("../helpers.js");

function fileIsInFolderWithSameName(app, file, ext, logError) {
  const pathFolder =
    path.dirname(file) === "."
      ? [app.get("config").srcFolder.slice(0, -1)]
      : path.dirname(file).split(path.sep);

  const isValid =
    pathFolder[pathFolder.length - 1] === path.basename(file, `.${ext}`);

  if (!isValid && logError) {
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

function isNotIgnored(file, ignoredFolders) {
  for (let i = 0; i < ignoredFolders.length; i += 1) {
    if (
      path
        .join(process.cwd(), file)
        .indexOf(path.join(process.cwd(), ignoredFolders[i])) === 0
    ) {
      return false;
    }
  }

  return true;
}

function filterFilesWithoutUnwantedFileType(app, file, extension, logError) {
  if (isNotIgnored(file, app.get("config").srcFolderIgnores)) {
    if (
      fileIsOfGivenType(file, extension) &&
      fileIsInFolderWithSameName(app, file, extension, logError)
    ) {
      return true;
    }
  }

  return false;
}

module.exports = {
  filterFilesWithoutUnwantedFileType,
  isNotIgnored
};
