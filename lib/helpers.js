"use strict";

const path = require("path");
const config = require("./config.json");

function fileIsOfGivenType(file, extension) {
  if (typeof file !== "string") return false;

  return file.endsWith(`.${extension}`);
}

function fileIsDataFile(file) {
  return helpers.fileIsOfGivenType(file, config.dataFileType);
}

function fileIsDocumentationFile(file) {
  return helpers.fileIsOfGivenType(file, config.documentationFileType);
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

function getNormalizedShortPath(app, filePath) {
  return `${normalizeString(
    filePath.replace(`.${app.get("config").extension}`, "")
  )}`;
}

function getDataPathFromTemplatePath(app, filePath) {
  return `${filePath.replace(
    `.${app.get("config").extension}`,
    `.${config.dataFileType}`
  )}`;
}

function getDocumentationPathFromTemplatePath(app, filePath) {
  return `${filePath.replace(
    `.${app.get("config").extension}`,
    `.${config.documentationFileType}`
  )}`;
}

function isBuild() {
  return process.argv.slice(2).includes("--build");
}

function normalizeString(str) {
  return str
    .replace(/[^\w\s]/gi, "-")
    .replace(/_/g, "-")
    .replace(/ /g, "-")
    .toLowerCase();
}

const helpers = {
  fileIsOfGivenType,
  fileIsDataFile,
  fileIsDocumentationFile,
  fileIsTemplateFile,
  getNormalizedShortPath,
  getDataPathFromTemplatePath,
  getDocumentationPathFromTemplatePath,
  getFullPathFromShortPath,
  getShortPathFromFullPath,
  isBuild,
  normalizeString,
};

module.exports = helpers;
