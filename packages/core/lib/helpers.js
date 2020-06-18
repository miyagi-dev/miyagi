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
   * @param {string} extension - File extension with like `twig` or `html.twig`
   * @returns {string}
   */
  getSingleFileExtension: function (extension = "") {
    return extension.slice(extension.lastIndexOf(".") + 1);
  },

  /**
   * Normalizes a string be replacing whitespace, underscore, / etc with - and lowercases it
   *
   * @param {string} str
   * @returns {string}
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
   * @returns {string}
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
   * @param {object} obj
   * @returns {object}
   */
  cloneDeep: function (obj) {
    return v8.deserialize(v8.serialize(obj));
  },

  /**
   * Accepts a path relative from the config.components.folder and returns the complete path based on the file system
   *
   * @param {object} app - the express instance
   * @param {string} shortPath
   * @returns {string}
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
   * @param {string} fullPath
   * @returns {string}
   */
  getShortPathFromFullPath: function (app, fullPath) {
    return fullPath.replace(
      path.join(process.cwd(), app.get("config").components.folder),
      ""
    );
  },

  /**
   * Accepts a template file path and returns the path to the corresponding mock file
   *
   * @param {object} app - the express instance
   * @param {string} filePath
   * @returns {string}
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
   * @param {string} filePath
   * @returns {string}
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
   * @param {string} filePath
   * @returns {string}
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
   * @param {string} filePath
   * @returns {string}
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
   * @param {string} filePath
   * @returns {boolean}
   */
  fileIsDataFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
        `${app.get("config").files.mocks.name}.${
          app.get("config").files.mocks.extension
        }` ||
      this.getShortPathFromFullPath(app, filePath) ===
        `data.${app.get("config").files.mocks.extension}`
    );
  },

  /**
   * Accepts a file path and checks if it is a documentation file
   *
   * @param {object} app - the express instance
   * @param {string} filePath
   * @returns {boolean}
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
   * @param {string} filePath
   * @returns {boolean}
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
   * @param {string} filePath
   * @returns {boolean}
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
   * @param {string} filePath
   * @returns {boolean}
   */
  fileIsAssetFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
        `${this.getResolvedFileName(
          app.get("config").files.css.name,
          path.basename(filePath, `.${app.get("config").files.css.extension}`)
        )}.${app.get("config").files.css.extension}` ||
      path.basename(filePath) ===
        `${this.getResolvedFileName(
          app.get("config").files.js.name,
          path.basename(filePath, `.${app.get("config").files.js.extension}`)
        )}.${app.get("config").files.js.extension}`
    );
  },

  /**
   * Accepts a file path and returns checks if it is a template file
   *
   * @param {object} app - the express instance
   * @param {string} filePath
   * @returns {boolean}
   */
  fileIsTemplateFile: function (app, filePath) {
    return (
      path.basename(filePath) ===
      `${this.getResolvedFileName(
        app.get("config").files.templates.name,
        path.basename(
          filePath,
          `.${app.get("config").files.templates.extension}`
        )
      )}.${app.get("config").files.templates.extension}`
    );
  },
};
