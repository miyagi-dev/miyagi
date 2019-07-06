"use strict";

const path = require("path");
const config = require("./config.json");

function fileIsOfGivenType(file, extension) {
  if (typeof file !== "string") return false;

  return (
    file.lastIndexOf(`.${extension}`) > 0 &&
    file.lastIndexOf(`.${extension}`) === file.length - (extension.length + 1)
  );
}

function fileIsDataFile(file) {
  return helpers.fileIsOfGivenType(file, config.dataFileType);
}

function fileIsTemplateFile(app, file) {
  return helpers.fileIsOfGivenType(file, app.get("config").extension);
}

function getFullPathFromShortPath(app, shortPath) {
  return path.join(process.cwd(), `${app.get("config").srcFolder}${shortPath}`);
}

function getShortPathFromFullPath(app, fullPath) {
  return fullPath.replace(
    `${process.cwd()}/${app.get("config").srcFolder}`,
    ""
  );
}

function getTemplatePathFromDataPath(app, filePath) {
  return `${filePath.replace(
    `.${config.dataFileType}`,
    `.${app.get("config").extension}`
  )}`;
}

function getDataPathFromTemplatePath(app, filePath) {
  return `${filePath.replace(
    `.${app.get("config").extension}`,
    `.${config.dataFileType}`
  )}`;
}

const helpers = {
  fileIsOfGivenType,
  fileIsDataFile,
  fileIsTemplateFile,
  getDataPathFromTemplatePath,
  getFullPathFromShortPath,
  getShortPathFromFullPath,
  getTemplatePathFromDataPath
};

module.exports = helpers;
