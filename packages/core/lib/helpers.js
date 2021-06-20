const v8 = require("v8");
const path = require("path");

/**
 * Module for globally used helper functions
 *
 * @module helpers
 */
module.exports = {
  /**
   * Removes all keys starting with $ from an object
   *
   * @param {object} [obj] the object whose keys with $ should be removed
   * @returns {object} the modified object
   */
  removeInternalKeys: function (obj = {}) {
    const o = {};

    for (const [key, value] of Object.entries(obj)) {
      if (!key.startsWith("$")) {
        o[key] = value;
      }
    }

    return o;
  },

  /**
   * Returns everything after the last "." of a file extension (e.g. `html.twig` -> `twig`)
   *
   * @param {string} [extension] - File extension like `twig` or `html.twig`
   * @returns {string} the last part of a the file extension
   */
  getSingleFileExtension: function (extension = "") {
    return extension.slice(extension.lastIndexOf(".") + 1);
  },

  /**
   * Normalizes a string be replacing whitespace, underscore, / etc with - and lowercases it
   *
   * @param {string} [str] string that should be normalized
   * @returns {string} the normalized string
   */
  normalizeString: function (str = "") {
    if (typeof str === "string") {
      return str
        .replace(/[^\w\s]/gi, "-")
        .replace(/_/g, "-")
        .replace(/ /g, "-")
        .toLowerCase();
    }

    return str;
  },

  /**
   * If '<component>' is set as the file name in the config, it returns the given file name, otherwise it returns the value from the config
   *
   * @param {string} nameInConfig - The defined name for a file in the config
   * @param {string} fileName - The actual file name
   * @returns {string} the filename based on the configuration file
   */
  getResolvedFileName: function (nameInConfig, fileName) {
    if (nameInConfig === "<component>") {
      return fileName;
    }

    return nameInConfig;
  },

  /**
   * Creates a deep clone of a object using internal v8 methods
   *
   * @param {object} obj - the object to clone
   * @returns {object} clone of rhe given object
   */
  cloneDeep: function (obj) {
    return v8.deserialize(v8.serialize(obj));
  },

  /**
   * Accepts a path relative from the config.components.folder and returns the complete path based on the file system
   *
   * @param {object} app - the express instance
   * @param {string} shortPath - a relative file path based from the components folder
   * @returns {string} absolute file path
   */
  getFullPathFromShortPath: function (app, shortPath) {
    return path.join(
      process.cwd(),
      `${app.get("config").components.folder}/${shortPath}`
    );
  },

  /**
   * Accepts an absolute (file system based) path and returns the short path relative from config.components.folder
   *
   * @param {object} app - the express instance
   * @param {string} fullPath - absolute file path
   * @returns {string} relative file path based from the components folder
   */
  getShortPathFromFullPath: function (app, fullPath) {
    return fullPath.replace(
      `${path.join(process.cwd(), app.get("config").components.folder)}/`,
      ""
    );
  },

  /**
   * Accepts a template file path and returns the path to the corresponding mock file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - file path to a template file
   * @returns {string} file path to the corresponding mock file
   */
  getDataPathFromTemplatePath: function (app, filePath) {
    return filePath.replace(
      path.basename(filePath),
      `${app.get("config").files.mocks.name}.${
        app.get("config").files.mocks.extension
      }`
    );
  },

  /**
   * Accepts a template file path and returns the path to the corresponding documentation file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - file path to a template file
   * @returns {string} file path to the corresponding doc file
   */
  getDocumentationPathFromTemplatePath: function (app, filePath) {
    return filePath.replace(
      path.basename(filePath),
      `${app.get("config").files.docs.name}.${
        app.get("config").files.docs.extension
      }`
    );
  },

  /**
   * Accepts a template file path and returns the path to the corresponding info file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - file path to a template file
   * @returns {string} file path to the corresponding info file
   */
  getInfoPathFromTemplatePath: function (app, filePath) {
    return filePath.replace(
      path.basename(filePath),
      `${app.get("config").files.info.name}.${
        app.get("config").files.info.extension
      }`
    );
  },

  /**
   * Accepts a template file path and returns the path to the corresponding schema file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - file path to a template file
   * @returns {string} file path to the corresponding schema file
   */
  getSchemaPathFromTemplatePath: function (app, filePath) {
    return filePath.replace(
      path.basename(filePath),
      `${app.get("config").files.schema.name}.${
        app.get("config").files.schema.extension
      }`
    );
  },

  /**
   * Accepts a file path and checks if it is a mock file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - path to any type of file
   * @returns {boolean} is true if the given file is a mock file
   */
  fileIsDataFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
        `${app.get("config").files.mocks.name}.${
          app.get("config").files.mocks.extension
        }` ||
      module.exports.getShortPathFromFullPath(app, filePath) ===
        `data.${app.get("config").files.mocks.extension}`
    );
  },

  /**
   * Accepts a file path and checks if it is a documentation file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - path to any type of file
   * @returns {boolean} is true if the given file is a doc file
   */
  fileIsDocumentationFile: function (app, filePath) {
    return (
      filePath.replace(`${process.cwd()}/`, "") ===
        path.join(
          app.get("config").components.folder,
          `README.${app.get("config").files.docs.extension}`
        ) ||
      path.basename(filePath) ===
        `${app.get("config").files.docs.name}.${
          app.get("config").files.docs.extension
        }`
    );
  },

  /**
   * Accepts a file path and checks if it is an info file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - path to any type of file
   * @returns {boolean} is true if the given file is a info file
   */
  fileIsInfoFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
      `${app.get("config").files.info.name}.${
        app.get("config").files.info.extension
      }`
    );
  },

  /**
   * Accepts a file path and checks if it is a schema file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - path to any type of file
   * @returns {boolean} is true if the given file is a schema file
   */
  fileIsSchemaFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
      `${app.get("config").files.schema.name}.${
        app.get("config").files.schema.extension
      }`
    );
  },

  /**
   * Accepts a file path and checks if it is component js or css file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - path to any type of file
   * @returns {boolean} is true if the given file is a css or js file
   */
  fileIsAssetFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
        `${module.exports.getResolvedFileName(
          app.get("config").files.css.name,
          path.basename(filePath, `.${app.get("config").files.css.extension}`)
        )}.${app.get("config").files.css.extension}` ||
      path.basename(filePath) ===
        `${module.exports.getResolvedFileName(
          app.get("config").files.js.name,
          path.basename(filePath, `.${app.get("config").files.js.extension}`)
        )}.${app.get("config").files.js.extension}`
    );
  },

  /**
   * Accepts a file path and returns checks if it is a template file
   *
   * @param {object} app - the express instance
   * @param {string} filePath - path to any type of file
   * @returns {boolean} is true if the given file is a template file
   */
  fileIsTemplateFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
      `${module.exports.getResolvedFileName(
        app.get("config").files.templates.name,
        path.basename(
          filePath,
          `.${app.get("config").files.templates.extension}`
        )
      )}.${app.get("config").files.templates.extension}`
    );
  },

  /**
   * @param {object} app - the express instance
   * @param {string} directoryPath - a component file path
   * @returns {string} the template file path
   */
  getTemplateFilePathFromDirectoryPath: function (app, directoryPath) {
    return path.join(
      directoryPath,
      `${module.exports.getResolvedFileName(
        app.get("config").files.templates.name,
        path.basename(directoryPath)
      )}.${app.get("config").files.templates.extension}`
    );
  },

  /**
   * @param {object} app
   * @param {string} templateFilePath
   * @returns {string}
   */
  getDirectoryPathFromFullTemplateFilePath: function (app, templateFilePath) {
    return path.dirname(
      module.exports.getShortPathFromFullPath(app, templateFilePath)
    );
  },
};
