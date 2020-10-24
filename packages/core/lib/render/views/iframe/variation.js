const path = require("path");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const validateSchema = require("../../../validator/schema.js");
const {
  extendTemplateData,
  resolveData,
  getComponentErrorHtml,
  getDataForRenderFunction,
  getTemplateFilePathFromDirectoryPath,
} = require("../../helpers.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {string} [object.variation] - the variation name
 * @param {boolean} [object.embedded] - defines if the component is rendered inside an iframe or not
 * @param {Function} [object.cb] - callback function
 * @returns {Promise} gets resolved when the variation has been rendered
 */
module.exports = async function renderIframeVariation({
  app,
  res,
  file,
  variation,
  embedded,
  cb,
}) {
  file = getTemplateFilePathFromDirectoryPath(app, file);
  const fullFilePath = helpers.getFullPathFromShortPath(app, file);

  const componentJson = helpers.cloneDeep(
    app.get("state").fileContents[
      helpers.getDataPathFromTemplatePath(app, fullFilePath)
    ] || {}
  );
  const componentVariations = componentJson.$variants;
  let componentRootData = helpers.removeInternalKeys(componentJson);
  let componentData;

  if (componentVariations && variation) {
    let variationJson = componentVariations.find(
      (vari) => vari.$name === decodeURI(variation)
    );

    if (variationJson) {
      componentData = helpers.removeInternalKeys(variationJson);
    }
  }

  componentData = await resolveData(app, componentData, componentRootData);

  componentData = await extendTemplateData(
    app.get("config"),
    componentData,
    file
  );

  validateSchema(app, file, [
    {
      data: componentData,
      name: variation,
    },
  ]);

  let standaloneUrl;

  if (embedded) {
    if (app.get("config").isBuild) {
      standaloneUrl = `component-${helpers.normalizeString(
        path.dirname(file)
      )}-variation-${helpers.normalizeString(variation)}.html`;
    } else {
      standaloneUrl = `/component?file=${path.dirname(
        file
      )}&variation=${encodeURIComponent(variation)}`;
    }
  } else {
    standaloneUrl = null;
  }

  return new Promise((resolve) => {
    app.render(
      file,
      getDataForRenderFunction(app, componentData),
      async (error, result) => {
        const { ui } = app.get("config");

        await res.render(
          standaloneUrl
            ? "iframe_component_variation.hbs"
            : "component_variation.hbs",
          {
            html:
              typeof result === "string"
                ? result
                : getComponentErrorHtml(error),
            htmlValidation: ui.validations.html,
            accessibilityValidation:
              standaloneUrl && ui.validations.accessibility,
            standalone: !standaloneUrl,
            standaloneUrl,
            dev: process.env.NODE_ENV === "development",
            prod: process.env.NODE_ENV === "production",
            projectName: config.projectName,
            userProjectName: app.get("config").projectName,
            isBuild: app.get("config").isBuild,
            theme: app.get("config").ui.theme,
          },
          (err, html) => {
            if (res.send) {
              if (html) {
                res.send(html);
              }
            }

            if (cb) {
              cb(html);
            }
          }
        );

        resolve();
      }
    );
  });
};
