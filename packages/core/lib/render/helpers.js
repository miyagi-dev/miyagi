/**
 * Helper functions for the render module
 *
 * @module renderHelpers
 */

const path = require("path");
const deepMerge = require("deepmerge");
const config = require("../config.json");
const helpers = require("../helpers.js");

module.exports = {
  /**
   * @param {object} config - the user configuration object
   * @param {object} data - the mock data object that will be passed into the component
   * @param {string} filePath - the path to the component file
   * @returns {Promise<object>} the extended data object
   */
  async extendTemplateData(config, data, filePath) {
    let o = {};
    let fullFilePath = filePath.endsWith(config.files.templates.extension)
      ? filePath
      : `${filePath}/${path.basename(filePath)}.${
          config.files.templates.extension
        }`;

    for (const extension of config.extensions) {
      if (extension.extendTemplateData) {
        o = {
          ...o,
          ...(await extension.extendTemplateData(
            path.join(config.components.folder, fullFilePath),
            config.engine.options,
            data
          )),
        };
      }
    }

    return deepMerge(data, o);
  },

  /**
   * @param {string} err - error message
   * @returns {string} html string including an error message
   */
  getComponentErrorHtml(err) {
    return `<p class="MiyagiError">${
      err === null ? config.messages.componentCouldNotBeRendered : err
    }</p>`;
  },

  /**
   * @param {object} app - the express instance
   * @param {object} data - the mock data object that will be passed into the component
   * @returns {object} the resolved data object
   */
  getDataForRenderFunction(app, data) {
    const fullPath = path.join(
      process.cwd(),
      app.get("config").components.folder
    );

    return {
      ...data,
      path: fullPath,
      partials: app.get("state").partials,
      basedir: fullPath, // for pug
      root: fullPath, // for ect
      settings: {
        views: fullPath, // for dust
      },
      ...app.get("config").engine.options,
    };
  },

  /**
   * @param {Array} variations - the variations of the mock data of the component
   * @param {object} [rootData] - the root mock data of the component
   * @returns {object} the fallback data object
   */
  getFallbackData(variations, rootData) {
    for (let i = 0; i < variations.length; i += 1) {
      const variationData = helpers.removeInternalKeys(variations[i]);

      if (Object.keys(variationData).length > 0) {
        if (rootData) {
          return deepMerge(rootData, variationData);
        }

        return variationData;
      }
    }

    return {};
  },

  /**
   * @param {object} app - the express instance
   * @param {string} directoryPath - a component file path
   * @returns {string} the template file path
   */
  getTemplateFilePathFromDirectoryPath(app, directoryPath) {
    return path.join(
      directoryPath,
      `${helpers.getResolvedFileName(
        app.get("config").files.templates.name,
        path.basename(directoryPath)
      )}.${app.get("config").files.templates.extension}`
    );
  },
};
