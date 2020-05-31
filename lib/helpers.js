const v8 = require("v8");
const path = require("path");

/**
 * @param {string} extension - File extension with like `twig` or `html.twig`
 * @returns {string} Returns everything after the last "." (e.g. `html.twig` -> `twig`)
 */
function getSingleFileExtension(extension = "") {
  return extension.slice(extension.lastIndexOf(".") + 1);
}

function normalizeString(str = "") {
  return str
    .replace(/[^\w\s]/gi, "-")
    .replace(/_/g, "-")
    .replace(/ /g, "-")
    .toLowerCase();
}

function getResolvedFileName(name, fileName) {
  if (name === "<component>") {
    return fileName;
  }

  return name;
}

function cloneDeep(obj) {
  return v8.deserialize(v8.serialize(obj));
}

function getFullPathFromShortPath(app, shortPath) {
  return path.join(
    process.cwd(),
    `${app.get("config").components.folder}/${shortPath}`
  );
}

function getShortPathFromFullPath(app, fullPath) {
  return fullPath.replace(
    `${process.cwd()}/${app.get("config").components.folder}/`,
    ""
  );
}

function getNormalizedShortPath(app, filePath) {
  const extension = path.extname(filePath);
  return `${normalizeString(filePath.slice(0, -1 * extension.length))}`;
}

function getDataPathFromTemplatePath(app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.mocks.name}.${
      app.get("config").files.mocks.extension
    }`
  );
}

function getDocumentationPathFromTemplatePath(app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.docs.name}.${
      app.get("config").files.docs.extension
    }`
  );
}

function getInfoPathFromTemplatePath(app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.info.name}.${
      app.get("config").files.info.extension
    }`
  );
}

function getSchemaPathFromTemplatePath(app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.schema.name}.${
      app.get("config").files.schema.extension
    }`
  );
}

function fileIsDataFile(app, file) {
  return (
    path.basename(file) ===
      `${app.get("config").files.mocks.name}.${
        app.get("config").files.mocks.extension
      }` ||
    getShortPathFromFullPath(app, file) ===
      `data.${app.get("config").files.mocks.extension}`
  );
}

function fileIsDocumentationFile(app, file) {
  return (
    path.basename(file) ===
    `${app.get("config").files.docs.name}.${
      app.get("config").files.docs.extension
    }`
  );
}

function fileIsInfoFile(app, file) {
  return (
    path.basename(file) ===
    `${app.get("config").files.info.name}.${
      app.get("config").files.info.extension
    }`
  );
}

function fileIsSchemaFile(app, file) {
  return (
    path.basename(file) ===
    `${app.get("config").files.schema.name}.${
      app.get("config").files.schema.extension
    }`
  );
}

function fileIsAssetFile(app, file) {
  return (
    path.basename(file) ===
      `${getResolvedFileName(
        app.get("config").files.css.name,
        path.basename(file, `.${app.get("config").files.css.extension}`)
      )}.${app.get("config").files.css.extension}` ||
    path.basename(file) ===
      `${getResolvedFileName(
        app.get("config").files.jc.name,
        path.basename(file, `.${app.get("config").files.jc.extension}`)
      )}.${app.get("config").files.jc.extension}`
  );
}

function fileIsTemplateFile(app, file) {
  return (
    path.basename(file) ===
    `${getResolvedFileName(
      app.get("config").files.templates.name,
      path.basename(file, `.${app.get("config").files.templates.extension}`)
    )}.${app.get("config").files.templates.extension}`
  );
}

function isDataGenerator(args) {
  return args._.includes("mocks");
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

const helpers = {
  cloneDeep,
  fileIsAssetFile,
  fileIsDataFile,
  fileIsDocumentationFile,
  fileIsInfoFile,
  fileIsSchemaFile,
  fileIsTemplateFile,
  getDataPathFromTemplatePath,
  getDocumentationPathFromTemplatePath,
  getFullPathFromShortPath,
  getInfoPathFromTemplatePath,
  getNormalizedShortPath,
  getResolvedFileName,
  getSchemaPathFromTemplatePath,
  getShortPathFromFullPath,
  getSingleFileExtension,
  isBuild,
  isDataGenerator,
  isGenerator,
  isServer,
  normalizeString,
};

module.exports = helpers;
