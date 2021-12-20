const anymatch = require("anymatch");
const path = require("path");
const jsonToYaml = require("js-yaml");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const validateMocks = require("../../../validator/mocks.js");
const { getVariationData, getComponentData } = require("../../../mocks");
const {
  getDataForRenderFunction,
  getThemeMode,
  getComponentTextDirection,
} = require("../../helpers");
const log = require("../../../logger.js");
const { getTemplateFilePathFromDirectoryPath } = require("../../../helpers.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
module.exports = async function renderIframeComponent({
  app,
  res,
  file,
  cb,
  cookies,
}) {
  file = getTemplateFilePathFromDirectoryPath(app, file);
  const templateFilePath = helpers.getFullPathFromShortPath(app, file);
  const hasTemplate = Object.values(app.get("state").partials).includes(
    templateFilePath
  );

  const componentJson = await getComponentData(app, file);
  const componentDocumentation =
    app.get("state").fileContents[
      helpers.getDocumentationPathFromTemplatePath(app, templateFilePath)
    ];
  const componentInfo =
    app.get("state").fileContents[
      helpers.getInfoPathFromTemplatePath(app, templateFilePath)
    ];
  const schemaFilePath = helpers.getSchemaPathFromTemplatePath(
    app,
    templateFilePath
  );
  const componentSchema = app.get("state").fileContents[schemaFilePath];
  const mockFilePath = helpers.getDataPathFromTemplatePath(
    app,
    templateFilePath
  );
  const componentMocks = app.get("state").fileContents[mockFilePath];
  const componentTemplate = app.get("state").fileContents[templateFilePath];

  let componentSchemaString;
  if (componentSchema) {
    if (app.get("config").files.schema.extension === "yaml") {
      componentSchemaString = jsonToYaml.dump(componentSchema);
    } else {
      componentSchemaString = JSON.stringify(componentSchema, null, 2);
    }
  }

  let componentMocksString;
  if (componentMocks) {
    if (app.get("config").files.mocks.extension === "yaml") {
      componentMocksString = jsonToYaml.dump(componentMocks);
    } else {
      componentMocksString = JSON.stringify(componentMocks, null, 2);
    }
  }

  const fileContents = {
    schema: componentSchema
      ? {
          string: componentSchemaString,
          type: app.get("config").files.schema.extension,
          file: path.join(
            app.get("config").components.folder,
            helpers.getShortPathFromFullPath(app, schemaFilePath)
          ),
        }
      : null,
    mocks: componentMocks
      ? {
          string: componentMocksString,
          type: app.get("config").files.mocks.extension,
          file: path.join(
            app.get("config").components.folder,
            helpers.getShortPathFromFullPath(app, mockFilePath)
          ),
        }
      : null,
    template: componentTemplate
      ? {
          string: componentTemplate,
          type: app.get("config").engine.name,
          file: path.join(
            app.get("config").components.folder,
            helpers.getShortPathFromFullPath(app, templateFilePath)
          ),
        }
      : null,
  };

  let componentName = path.basename(path.dirname(file));

  if (componentInfo) {
    if (componentInfo.name) {
      componentName = componentInfo.name;
    }
  }

  let context;

  if (componentJson.length > 0) {
    context = componentJson.filter((entry) => entry !== null);
  } else {
    const componentData = hasTemplate
      ? await getVariationData(app, file)
      : { raw: {}, extended: {} };

    context = [];

    if (componentData) {
      context.push({
        component: file,
        data: componentData.extended,
        rawData: componentData.raw,
        name: config.defaultVariationName,
      });
    }
  }

  await renderVariations({
    app,
    res,
    file,
    context,
    componentDocumentation,
    fileContents,
    name: componentName,
    cb,
    templateFilePath: hasTemplate ? templateFilePath : null,
    cookies,
  });
};

/**
 * @typedef {object} FileContents
 * @property {object} schema - schema object
 * @property {string} schema.string - string with schema
 * @property {("yaml"|"json")} schema.type - the file type of the schema file
 * @property {boolean} schema.selected - true if the schema tab should initially be visible
 * @property {string} schema.file - the schema file path
 * @property {object} mocks - mocks object
 * @property {string} mocks.string - string with mocks
 * @property {("yaml"|"js"|"json")} mocks.type - the file type of the mocks file
 * @property {boolean} mocks.selected - true if the mocks tab should initially be visible
 * @property {string} mocks.file - the mock file path
 * @property {object} template - template object
 * @property {string} template.string - string with template
 * @property {string} template.type - the file type of the template file
 * @property {boolean} template.selected - true if the template tab should initially be visible
 * @property {string} template.file - the template file path
 */

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - short component path
 * @param {Array} object.context - mock data for each variation
 * @param {string} object.componentDocumentation - html string with documentation
 * @param {FileContents} object.fileContents - file contents object
 * @param {string} object.name - component name
 * @param {Function} object.cb - callback function
 * @param {string} object.templateFilePath - the absolute component file path
 * @param {object} object.cookies
 * @returns {Promise}
 */
async function renderVariations({
  app,
  res,
  file,
  context,
  componentDocumentation,
  fileContents,
  name,
  cb,
  templateFilePath,
  cookies,
}) {
  const variations = [];
  const promises = [];
  const validatedMocks = validateMocks(app, file, context);
  const baseName = path.dirname(file);
  const renderInIframe = getRenderInIframe(
    baseName,
    app.get("config").components.renderInIframe
  );

  if (templateFilePath) {
    for (let i = 0, len = context.length; i < len; i += 1) {
      const entry = context[i];

      variations[i] = getData(
        app,
        context[i].name,
        file,
        baseName,
        entry,
        validatedMocks,
        i
      );

      if (!renderInIframe) {
        promises.push(
          new Promise((resolve, reject) => {
            app.render(
              templateFilePath,
              getDataForRenderFunction(app, entry.data),
              (err, result) => {
                if (err) {
                  if (typeof err === "string") {
                    log("error", err);
                  } else if (err.message) {
                    log("error", err.message);
                    err = err.message;
                  }

                  if (app.get("config").isBuild) {
                    reject();
                  }
                }

                variations[i].html = result;
                variations[i].error = err;

                resolve(result);
              }
            );
          })
        );
      }
    }
  } else {
    promises.push(Promise.resolve());
  }

  return Promise.all(promises)
    .then(async () => {
      const { ui } = app.get("config");
      const themeMode = getThemeMode(app, cookies);
      const componentTextDirection = getComponentTextDirection(app, cookies);
      const renderFileTabs = !!(
        fileContents.schema ||
        fileContents.mocks ||
        fileContents.template
      );
      await res.render(
        "iframe_component.hbs",
        {
          variations,
          renderInIframe,
          dev: process.env.NODE_ENV === "development",
          prod: process.env.NODE_ENV === "production",
          a11yTestsPreload: ui.validations.accessibility,
          projectName: config.projectName,
          userProjectName: app.get("config").projectName,
          isBuild: app.get("config").isBuild,
          theme: themeMode
            ? Object.assign(app.get("config").ui.theme, { mode: themeMode })
            : app.get("config").ui.theme,
          documentation: componentDocumentation,
          schema: fileContents.schema,
          schemaError:
            typeof validatedMocks === "string" ? validatedMocks : null,
          mocks: fileContents.mocks,
          template: fileContents.template,
          renderInformation: renderFileTabs || variations.length > 0,
          renderFileTabs,
          folder: path.join(
            app.get("config").components.folder,
            file.split(path.sep).slice(0, -1).join("/")
          ),
          name,
          componentTextDirection:
            componentTextDirection ||
            app.get("config").components.textDirection,
          uiTextDirection: app.get("config").ui.textDirection,
          componentLanguage: app.get("config").components.lang,
        },
        (err, html) => {
          if (res.send) {
            if (err) {
              res.send(err);
            } else {
              res.send(html);
            }
          }

          if (cb) {
            cb(err, html);
          }
        }
      );
    })
    .catch(() => {
      if (cb) {
        cb(true);
      }
    });
}

/**
 * @param {string} baseName
 * @param {object} object
 * @param {boolean} object.default
 * @param {Array} object.except
 * @returns {boolean}
 */
function getRenderInIframe(
  baseName,
  { default: byDefaultRenderInIframe, except }
) {
  if (byDefaultRenderInIframe) {
    return !anymatch(except, baseName);
  }

  return anymatch(except, baseName);
}

/**
 * @param {object} app
 * @param {string} variation
 * @param {string} file
 * @param {string} baseName
 * @param {object} entry
 * @param {Array} validatedMocks
 * @param {number} i
 * @returns {object}
 */
function getData(app, variation, file, baseName, entry, validatedMocks, i) {
  let standaloneUrl;

  if (app.get("config").isBuild) {
    standaloneUrl = `component-${helpers.normalizeString(
      path.dirname(file)
    )}-variation-${helpers.normalizeString(variation)}.html`;
  } else {
    standaloneUrl = `/component?file=${path.dirname(
      file
    )}&variation=${encodeURIComponent(variation)}`;
  }

  const data = {
    url: app.get("config").isBuild
      ? `component-${helpers.normalizeString(
          baseName
        )}-variation-${helpers.normalizeString(variation)}-embedded.html`
      : `/component?file=${baseName}&variation=${variation}&embedded=true`,
    file,

    variation,
    normalizedVariation: helpers.normalizeString(variation),
    standaloneUrl,
    mockData:
      app.get("config").files.schema.extension === "yaml"
        ? jsonToYaml.dump(entry.rawData)
        : JSON.stringify(entry.rawData, null, 2),
  };

  if (validatedMocks && Array.isArray(validatedMocks)) {
    data.mockValidation = {
      valid: validatedMocks[i],
      copy: config.messages.validator.mocks[
        validatedMocks[i] ? "valid" : "invalid"
      ],
    };
  }

  return data;
}
