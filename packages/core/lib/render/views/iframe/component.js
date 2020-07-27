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

  let componentSchemaString;
  if (componentSchema) {
    if (app.get("config").files.schema.extension === "yaml") {
      componentSchemaString = jsonToYaml.stringify(componentSchema);
    } else {
      componentSchemaString = JSON.stringify(componentSchema, null, 2);
    }
  }

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
          componentSchema: componentSchemaString,
          name: componentName,
          cb,
          schemaType: app.get("config").files.schema.extension,
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
        componentSchema: componentSchemaString,
        name: componentName,
        cb,
        schemaType: app.get("config").files.schema.extension,
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
      componentSchema: componentSchemaString,
      name: componentName,
      cb,
      schemaType: app.get("config").files.schema.extension,
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
 * @param {string} object.componentSchema - html string with schema
 * @param {string} object.name - component name
 * @param {Function} object.cb - callback function
 * @param {("yaml"|"js")} object.schemaType - the file type of the schema file
 * @param {string} object.fullFilePath - the absolute component file path
 */
async function renderVariations({
  app,
  res,
  file,
  context,
  componentDocumentation,
  componentSchema,
  name,
  cb,
  schemaType,
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
        schema: componentSchema,
        folder: path.join(
          app.get("config").components.folder,
          file.split(path.sep).slice(0, -1).join("/")
        ),
        name,
        schemaType,
        schemaError:
          typeof validatedSchema === "string" ? validatedSchema : null,
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
