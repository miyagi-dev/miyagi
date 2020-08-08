const path = require("path");
const jsonToYaml = require("json-to-pretty-yaml");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const validateSchema = require("../../../validator/schema.js");
const {
  extendTemplateData,
  resolveData,
  getComponentErrorHtml,
  getDataForRenderFunction,
  getTemplateFilePathFromDirectoryPath,
} = require("../../helpers");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {Function} [object.cb] - callback function
 */
module.exports = async function renderIframeComponent({ app, res, file, cb }) {
  file = getTemplateFilePathFromDirectoryPath(app, file);
  const fullFilePath = helpers.getFullPathFromShortPath(app, file);

  const componentJson = helpers.cloneDeep(
    app.get("state").fileContents[
      helpers.getDataPathFromTemplatePath(app, fullFilePath)
    ]
  );
  const componentDocumentation = app.get("state").fileContents[
    helpers.getDocumentationPathFromTemplatePath(app, fullFilePath)
  ];
  const componentInfo = app.get("state").fileContents[
    helpers.getInfoPathFromTemplatePath(app, fullFilePath)
  ];
  const componentSchema = app.get("state").fileContents[
    helpers.getSchemaPathFromTemplatePath(app, fullFilePath)
  ];
  const componentMocks = app.get("state").fileContents[
    helpers.getDataPathFromTemplatePath(app, fullFilePath)
  ];

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
        }
      : null,
    mocks: componentMocks
      ? {
          string: componentMocksString,
          type: app.get("config").files.mocks.extension,
          selected: !componentSchema,
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
    const componentVariations = componentJson.$variants;

    if (Object.keys(componentData).length > 0) {
      componentData = await resolveData(app, componentData);
      componentData = await extendTemplateData(
        app.get("config"),
        componentData,
        file
      );

      if (!componentJson.$hidden) {
        context.push({
          component: file,
          data: componentData,
          name: componentJson.$name || config.defaultVariationName,
        });
      }
    } else {
      componentData = await extendTemplateData(
        app.get("config"),
        componentData,
        file
      );
    }

    if (componentVariations) {
      const promises = [];
      let startIndex = context.length;
      for (const [index, variationJson] of componentVariations.entries()) {
        if (variationJson.$name) {
          promises.push(
            new Promise((resolve) => {
              let variationData = helpers.removeInternalKeys(variationJson);

              resolveData(app, variationData, componentData).then(
                async (data) => {
                  data = await extendTemplateData(
                    app.get("config"),
                    data,
                    file
                  );

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
        await renderVariations({
          app,
          res,
          file,
          context: context.filter((entry) => entry !== null),
          componentDocumentation,
          fileContents,
          name: componentName,
          cb,
          fullFilePath,
        });
      });
    } else {
      await renderVariations({
        app,
        res,
        file,
        context,
        componentDocumentation,
        fileContents,
        name: componentName,
        cb,
        fullFilePath,
      });
    }
  } else {
    const componentData = await extendTemplateData(
      app.get("config"),
      {
        component: file,
        name: config.defaultVariationName,
      },
      file
    );

    await renderVariations({
      app,
      res,
      file,
      context: [componentData],
      componentDocumentation,
      fileContents,
      name: componentName,
      cb,
      fullFilePath,
    });
  }
};

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - short component path
 * @param {Array} object.context - mock data for each variation
 * @param {string} object.componentDocumentation - html string with documentation
 * @param {object} object.fileContents - file contents object
 * @param {object} object.fileContents.schema - schema object
 * @param {string} object.fileContents.schema.string - html string with schema
 * @param {("yaml"|"js")} object.fileContents.schema.type - the file type of the schema file
 * @param {boolean} object.fileContents.schema.selected - true if the schema tab should initially be visible
 * @param {object} object.fileContents.mocks - mocks object
 * @param {string} object.fileContents.mocks.string - html string with mocks
 * @param {("yaml"|"js")} object.fileContents.mocks.type - the file type of the mocks file
 * @param {boolean} object.fileContents.mocks.selected - true if the mocks tab should initially be visible
 * @param {string} object.name - component name
 * @param {Function} object.cb - callback function
 * @param {string} object.fullFilePath - the absolute component file path
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
  fullFilePath,
}) {
  const variations = [];
  const promises = [];
  const validatedSchema = validateSchema(app, file, context);

  for (let i = 0, len = context.length; i < len; i += 1) {
    const entry = context[i];

    promises.push(
      new Promise((resolve) => {
        app.render(
          fullFilePath,
          getDataForRenderFunction(app, entry.data),
          (err, result) => {
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
              html:
                typeof result === "string"
                  ? result
                  : getComponentErrorHtml(err),
              variation,
              standaloneUrl,
            };

            if (validatedSchema && Array.isArray(validatedSchema)) {
              variations[i].schemaValidation = {
                valid: validatedSchema[i],
                copy:
                  config.messages.schemaValidator[
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

  await Promise.all(promises).then(async () => {
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
        renderFileTabs: !!(fileContents.schema || fileContents.mocks),
        folder: path.join(
          app.get("config").components.folder,
          file.split(path.sep).slice(0, -1).join("/")
        ),
        name,
      },
      (err, html) => {
        if (res.send) {
          if (html) {
            res.send(html);
          } else {
            res.send(err);
          }
        }

        if (cb) {
          cb(html);
        }
      }
    );
  });
}
