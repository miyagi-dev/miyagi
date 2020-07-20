/**
 * Rendering module
 *
 * @module render
 */

const path = require("path");
const jsonToYaml = require("json-to-pretty-yaml");
const tests = require("./tests.json");
const config = require("../config.json");
const helpers = require("../helpers.js");
const validateSchema = require("../validator/schema.js");
const {
  extendTemplateData,
  resolveData,
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
  getTemplateFilePathFromDirectoryPath,
} = require("./helpers.js");

/**
 * @param {object} obj
 * @param {object} obj.app
 * @param {object} obj.res
 * @param {string} obj.file
 * @param {Array} obj.context
 * @param {string} obj.componentDocumentation
 * @param {string} obj.componentSchema
 * @param {string} obj.name
 * @param {Function} obj.cb
 * @param {string} obj.schemaType
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
      "component_variations.hbs",
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
        basePath: app.get("config").isBuild
          ? app.get("config").build.basePath
          : "/",
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

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.file
 * @param object.context
 * @param object.standaloneUrl
 * @param object.cb
 * @returns {Promise} resolves when the component has been rendered
 */
async function renderSingleComponent({
  app,
  res,
  file,
  context,
  standaloneUrl,
  cb,
}) {
  return new Promise((resolve) => {
    app.render(
      file,
      getDataForRenderFunction(app, context),
      async (error, result) => {
        const { ui } = app.get("config");

        await res.render(
          standaloneUrl ? "component_frame.hbs" : "component.hbs",
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
            basePath: app.get("config").isBuild
              ? app.get("config").build.basePath
              : "/",
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
}

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.buildDate
 * @param object.formattedBuildDate
 * @param object.cb
 */
function renderMain({ app, res, buildDate, formattedBuildDate, cb }) {
  res.render(
    "index.hbs",
    {
      folders: app.get("state").menu,
      iframeSrc: app.get("config").isBuild
        ? "component-all-embedded.html"
        : "/component?file=all&embedded=true",
      showAll: true,
      hideTests: true,
      tests,
      projectName: config.projectName,
      userProjectName: app.get("config").projectName,
      indexPath: app.get("config").isBuild
        ? "component-all-embedded.html"
        : "/component?file=all&embedded=true",
      miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
      miyagiProd: !process.env.MIYAGI_DEVELOPMENT,
      isBuild: app.get("config").isBuild,
      theme: app.get("config").ui.theme,
      basePath: app.get("config").isBuild
        ? app.get("config").build.basePath
        : "/",
      buildDate,
      formattedBuildDate,
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
}

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.file
 * @param object.variation
 * @param object.buildDate
 * @param object.formattedBuildDate
 * @param object.cb
 */
async function renderMainWithComponent({
  app,
  res,
  file,
  variation,
  buildDate,
  formattedBuildDate,
  cb,
}) {
  let iframeSrc = app.get("config").isBuild
    ? `component-${helpers.normalizeString(
        file.replace(`.${app.get("config").files.templates.extension}`, "")
      )}.html`
    : `/component?file=${file}`;

  const hideTests =
    !app.get("config").ui.validations.accessibility &&
    !app.get("config").ui.validations.html;

  if (variation) {
    if (app.get("config").isBuild) {
      iframeSrc = iframeSrc.replace(
        ".html",
        `-${helpers.normalizeString(variation)}.html`
      );
    } else {
      iframeSrc += `&variation=${variation}`;
    }
  }

  if (app.get("config").isBuild) {
    iframeSrc = iframeSrc.replace(".html", "-embedded.html");
  } else {
    iframeSrc += "&embedded=true";
  }

  await res.render(
    "index.hbs",
    {
      folders: app.get("state").menu,
      iframeSrc,
      requestedComponent: file,
      requestedVariation: variation,
      hideTests,
      tests,
      projectName: config.projectName,
      userProjectName: app.get("config").projectName,
      indexPath: app.get("config").isBuild
        ? "component-all-embedded.html"
        : "/component?file=all&embedded=true",
      miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
      miyagiProd: !process.env.MIYAGI_DEVELOPMENT,
      isBuild: app.get("config").isBuild,
      theme: app.get("config").ui.theme,
      basePath: app.get("config").isBuild
        ? app.get("config").build.basePath
        : "/",
      buildDate,
      formattedBuildDate,
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
}

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.file
 * @param object.variation
 */
async function renderMainWith404({ app, res, file, variation }) {
  let iframeSrc = `/component?file=${file}`;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
  }

  iframeSrc += "&embedded=true";

  await res.render("index.hbs", {
    folders: app.get("state").menu,
    iframeSrc,
    requestedComponent: null,
    requestedVariation: null,
    hideTests: true,
    projectName: config.projectName,
    userProjectName: app.get("config").projectName,
    htmlValidation: false,
    accessibilityValidation: false,
    miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
    miyagiProd: !process.env.MIYAGI_DEVELOPMENT,
    isBuild: app.get("config").isBuild,
    theme: app.get("config").ui.theme,
    indexPath: app.get("config").isBuild
      ? "component-all-embedded.html"
      : "/component?file=all&embedded=true",
    basePath: app.get("config").isBuild
      ? app.get("config").build.basePath
      : "/",
  });
}

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.file
 * @param object.variation
 * @param object.embedded
 * @param object.cb
 */
async function renderComponent({ app, res, file, variation, embedded, cb }) {
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

  await renderSingleComponent({
    app,
    res,
    file: fullFilePath,
    context: componentData,
    standaloneUrl,
    cb,
  });
}

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.file
 * @param object.cb
 */
async function renderComponentVariations({ app, res, file, cb }) {
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
      componentSchemaString = JSON.stringify(componentSchema, 0, 2);
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
}

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.cb
 */
async function renderComponentOverview({ app, res, cb }) {
  const arr = [];
  const promises = [];
  let components;

  const documentation = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      `README.${app.get("config").files.docs.extension}`
    )
  ];

  if (app.get("config").ui.renderComponentOverview) {
    components = [];

    for (const partialPath in app.get("state").partials) {
      const fullPartialPath = helpers.getFullPathFromShortPath(
        app,
        partialPath
      );
      const directoryPath = path.dirname(partialPath);
      const componentInfo =
        app.get("state").fileContents[
          helpers.getInfoPathFromTemplatePath(app, fullPartialPath)
        ] || {};
      const componentJson =
        app.get("state").fileContents[
          helpers.getDataPathFromTemplatePath(app, fullPartialPath)
        ] || {};
      let componentData;
      const componentRootData = helpers.removeInternalKeys(componentJson);

      if (Object.keys(componentRootData).length > 0) {
        if (componentJson.$hidden) {
          if (componentJson.$variants && componentJson.$variants.length) {
            componentData = getFallbackData(
              componentJson.$variants,
              componentRootData
            );
          }
        } else {
          componentData = componentRootData;
        }
      } else if (componentJson.$variants && componentJson.$variants.length) {
        componentData = getFallbackData(componentJson.$variants);
      }

      components.push([
        directoryPath,
        componentData,
        componentInfo.name || path.basename(directoryPath),
        partialPath.split(path.sep).slice(0, -2),
        fullPartialPath,
      ]);
    }

    for (let i = 0, len = components.length; i < len; i += 1) {
      const component = components[i];
      promises.push(
        new Promise((resolve) => {
          const [componentPath, , , , partial] = component;

          let [, componentData = {}] = component;
          resolveData(app, componentData).then(async (data) => {
            data = await extendTemplateData(
              app.get("config"),
              data,
              componentPath
            );

            app.render(
              partial,
              getDataForRenderFunction(app, data),
              (err, result) => {
                const [file, , name, folders] = components[i];

                arr[i] = {
                  url: app.get("config").isBuild
                    ? `component-${helpers.normalizeString(
                        componentPath.replace(
                          `.${app.get("config").files.templates.extension}`,
                          ""
                        )
                      )}-embedded.html`
                    : `/component?file=${file}&embedded=true`,
                  name,
                  folders,
                  html:
                    typeof result === "string"
                      ? result
                      : getComponentErrorHtml(err),
                };

                resolve();
              }
            );
          });
        })
      );
    }
  }

  await Promise.all(promises).then(async () => {
    const { ui } = app.get("config");

    await res.render(
      "component_overview.hbs",
      {
        components: arr,
        dev: process.env.NODE_ENV === "development",
        prod: process.env.NODE_ENV === "production",
        a11yTestsPreload: ui.validations.accessibility,
        projectName: config.projectName,
        userProjectName: app.get("config").projectName,
        isBuild: app.get("config").isBuild,
        theme: app.get("config").ui.theme,
        documentation,
        renderComponentOverview: ui.renderComponentOverview,
        basePath: app.get("config").isBuild
          ? app.get("config").build.basePath
          : "/",
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

/**
 * @param object
 * @param object.app
 * @param object.res
 * @param object.embedded
 * @param object.target
 */
async function renderComponentNotFound({ app, res, embedded, target }) {
  await res.render(embedded ? "component_frame.hbs" : "component.hbs", {
    html: `<p class="MiyagiError">${target} not found.</p>`,
    dev: process.env.NODE_ENV === "development",
    prod: process.env.NODE_ENV === "production",
    projectName: config.projectName,
    userProjectName: app.get("config").projectName,
    htmlValidation: false,
    accessibilityValidation: false,
    isBuild: app.get("config").isBuild,
    theme: app.get("config").ui.theme,
    basePath: app.get("config").isBuild
      ? app.get("config").build.basePath
      : "/",
  });
}

module.exports = {
  renderMain,
  renderMainWithComponent,
  renderMainWith404,
  renderComponent,
  renderComponentVariations,
  renderComponentOverview,
  renderComponentNotFound,
};
