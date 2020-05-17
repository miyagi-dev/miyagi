"use strict";

const path = require("path");
const config = require("./config.json");

function fileIsDataFile(app, file) {
  return (
    path.basename(file) ==
    `${app.get("config").files.mocks.name}.${
      app.get("config").files.mocks.extension
    }`
  );
}

function fileIsDocumentationFile(app, file) {
  return (
    path.basename(file) ==
    `${app.get("config").files.docs.name}.${
      app.get("config").files.docs.extension
    }`
  );
}

function fileIsSchemaFile(app, file) {
  return (
    path.basename(file) ==
    `${app.get("config").files.schema.name}.${
      app.get("config").files.schema.extension
    }`
  );
}

function fileIsTemplateFile(app, file) {
  return (
    path.basename(file) ==
    `${app.get("config").files.templates.name}.${
      app.get("config").files.templates.extension
    }`
  );
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
  const extension = path.extname(filePath);
  return `${normalizeString(filePath.slice(0, -1 * extension.length))}`;
}

function getDataPathFromTemplatePath(app, filePath) {
  return `${filePath.replace(
    `${app.get("config").files.templates.name}.${
      app.get("config").files.templates.extension
    }`,
    `${app.get("config").files.mocks.name}.${
      app.get("config").files.mocks.extension
    }`
  )}`;
}

function getDocumentationPathFromTemplatePath(app, filePath) {
  return `${filePath.replace(
    `${app.get("config").files.templates.name}.${
      app.get("config").files.templates.extension
    }`,
    `${app.get("config").files.docs.name}.${
      app.get("config").files.docs.extension
    }`
  )}`;
}

function getSchemaPathFromTemplatePath(app, filePath) {
  return `${filePath.replace(
    `${app.get("config").files.templates.name}.${
      app.get("config").files.templates.extension
    }`,
    `${app.get("config").files.schema.name}.${
      app.get("config").files.schema.extension
    }`
  )}`;
}

function isDataGenerator(args) {
  return args._.includes("data");
}

function isGenerator(args) {
  return args._.includes("new");
}

function isBuild(args) {
  return args._.includes("build");
}

function isServer(args) {
  return args._.includes("start");
}

function normalizeString(str) {
  return str
    .replace(/[^\w\s]/gi, "-")
    .replace(/_/g, "-")
    .replace(/ /g, "-")
    .toLowerCase();
}

const helpers = {
  fileIsDataFile,
  fileIsDocumentationFile,
  fileIsSchemaFile,
  fileIsTemplateFile,
  getNormalizedShortPath,
  getDataPathFromTemplatePath,
  getDocumentationPathFromTemplatePath,
  getSchemaPathFromTemplatePath,
  getFullPathFromShortPath,
  getShortPathFromFullPath,
  isDataGenerator,
  isGenerator,
  isBuild,
  isServer,
  normalizeString,
};

module.exports = helpers;
