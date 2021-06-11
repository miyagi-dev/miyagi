const path = require("path");
const jsonToYaml = require("json-to-pretty-yaml");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const validateSchema = require("../../../validator/schema.js");
const { resolveVariationData } = require("../../../mocks");
const {
  extendTemplateData,
  getComponentErrorHtml,
  getDataForRenderFunction,
  getTemplateFilePathFromDirectoryPath,
} = require("../../helpers");
const log = require("../../../logger.js");
const { cloneDeep } = require("../../../helpers.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {Function} [object.cb] - callback function
 */
module.exports = async function renderIframeComponent({ app, res, file, cb }) {
  file = getTemplateFilePathFromDirectoryPath(app, file);
  const templateFilePath = helpers.getFullPathFromShortPath(app, file);
  const hasTemplate = Object.values(app.get("state").partials).includes(
    templateFilePath
  );

  const componentJson = helpers.cloneDeep(
    app.get("state").fileContents[
      helpers.getDataPathFromTemplatePath(app, templateFilePath)
    ]
  );
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
      componentSchemaString = jsonToYaml.stringify(componentSchema);
    } else {
      componentSchemaString = JSON.stringify(componentSchema, null, 2);
    }
  }

  let componentMocksString;
  if (componentMocks) {
    if (app.get("config").files.mocks.extension === "yaml") {
      componentMocksString = jsonToYaml.stringify(componentMocks);
    } else {
      componentMocksString = JSON.stringify(componentMocks, null, 2);
    }
  }

  const fileContents = {
    schema: componentSchema
      ? {
          string: componentSchemaString,
          type: app.get("config").files.schema.extension,
          selected: true,
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
          selected: !componentSchema,
          file: path.join(
            app.get("config").components.folder,
            helpers.getShortPathFromFullPath(app, mockFilePath)
          ),
        }
      : null,
    template: componentTemplate
      ? {
          string: componentTemplate,
          type: "html",
          selected: !componentSchema,
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

  if (componentJson) {
    let context = [];
    let componentData = helpers.removeInternalKeys(componentJson);
    const rootData = cloneDeep(componentData);
    const componentVariations = componentJson.$variants;

    if (Object.keys(componentData).length > 0) {
      componentData = await resolveVariationData(app, componentData);
    }

    if (componentVariations) {
      const promises = [];
      let startIndex = context.length;
      for (const [index, variationJson] of componentVariations.entries()) {
        if (variationJson.$name) {
          promises.push(
            new Promise((resolve) => {
              const variationData = helpers.removeInternalKeys(variationJson);

              resolveVariationData(app, variationData, rootData).then(
                async (data) => {
                  data = hasTemplate
                    ? await extendTemplateData(app.get("config"), data, file)
                    : {};

                  context[startIndex + index] = {
                    component: file,
                    data: data || {},
                    name: variationJson.$name,
                  };
                  resolve();
                }
              );
            })
          );
        }
      }

      await Promise.all(promises).then(async () => {
        if (Object.keys(componentData).length > 0) {
          componentData = await extendTemplateData(
            app.get("config"),
            componentData,
            file
          );

          if (!componentJson.$hidden) {
            context.unshift({
              component: file,
              data: componentData,
              name: componentJson.$name || config.defaultVariationName,
            });
          }
        } else {
          componentData = hasTemplate
            ? await extendTemplateData(app.get("config"), componentData, file)
            : {};
        }

        await renderVariations({
          app,
          res,
          file,
          context: context.filter((entry) => entry !== null),
          componentDocumentation,
          fileContents,
          name: componentName,
          cb,
          templateFilePath: hasTemplate ? templateFilePath : null,
        });
      });
    } else {
      if (Object.keys(componentData).length > 0) {
        componentData = await resolveVariationData(app, componentData);
        componentData = await extendTemplateData(
          app.get("config"),
          componentData,
          file
        );

        if (!componentJson.$hidden) {
          context.unshift({
            component: file,
            data: componentData,
            name: componentJson.$name || config.defaultVariationName,
          });
        }
      } else {
        componentData = hasTemplate
          ? await extendTemplateData(app.get("config"), componentData, file)
          : {};
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
      });
    }
  } else {
    const componentData = hasTemplate
      ? await extendTemplateData(app.get("config"), {}, file)
      : {};

    await renderVariations({
      app,
      res,
      file,
      context: [
        {
          component: file,
          data: componentData,
          name: config.defaultVariationName,
        },
      ],
      componentDocumentation,
      fileContents,
      name: componentName,
      cb,
      templateFilePath: hasTemplate ? templateFilePath : null,
    });
  }
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
}) {
  const variations = [];
  const promises = [];
  const validatedSchema = validateSchema(app, file, context);

  if (templateFilePath) {
    for (let i = 0, len = context.length; i < len; i += 1) {
      const entry = context[i];

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
                }

                if (app.get("config").isBuild) {
                  reject();
                }
              }

              const baseName = path.dirname(file);
              const variation = context[i].name;
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

              variations[i] = {
                url: app.get("config").isBuild
                  ? `component-${helpers.normalizeString(
                      baseName
                    )}-variation-${helpers.normalizeString(
                      variation
                    )}-embedded.html`
                  : `/component?file=${baseName}&variation=${variation}&embedded=true`,
                file,
                html: err
                  ? getComponentErrorHtml(
                      `${err}<br><br>${config.messages.checkShellForFurtherErrors}`
                    )
                  : typeof result === "string"
                  ? result
                  : getComponentErrorHtml(err),
                variation,
                standaloneUrl,
              };

              if (validatedSchema && Array.isArray(validatedSchema)) {
                variations[i].schemaValidation = {
                  valid: validatedSchema[i],
                  copy: config.messages.schemaValidator[
                    validatedSchema[i] ? "valid" : "invalid"
                  ],
                };
              }

              resolve(result);
            }
          );
        })
      );
    }
  } else {
    promises.push(Promise.resolve());
  }

  return Promise.all(promises)
    .then(async () => {
      const { ui } = app.get("config");
      await res.render(
        "iframe_component.hbs",
        {
          variations,
          dev: process.env.NODE_ENV === "development",
          prod: process.env.NODE_ENV === "production",
          a11yTestsPreload: ui.validations.accessibility,
          projectName: config.projectName,
          userProjectName: app.get("config").projectName,
          isBuild: app.get("config").isBuild,
          theme: app.get("config").ui.theme,
          documentation: componentDocumentation,
          schema: fileContents.schema,
          schemaError:
            typeof validatedSchema === "string" ? validatedSchema : null,
          mocks: fileContents.mocks,
          template: fileContents.template,
          renderFileTabs: !!(
            fileContents.schema ||
            fileContents.mocks ||
            fileContents.template
          ),
          folder: path.join(
            app.get("config").components.folder,
            file.split(path.sep).slice(0, -1).join("/")
          ),
          name,
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
