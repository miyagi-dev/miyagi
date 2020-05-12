"use strict";

const cloneDeep = require("clone-deep");
const path = require("path");
const tests = require("./tests.json");
const config = require("../config.json");
const helpers = require("../helpers.js");
const {
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
  mergeRootDataWithVariationData,
  mergeWithGlobalData,
  overwriteJsonLinksWithJsonData,
  overwriteTplLinksWithTplContent,
} = require("./_helpers.js");

function renderMain({ app, res, cb }) {
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
      headmanDev: !!process.env.HEADMAN_DEVELOPMENT,
      headmanProd: !process.env.HEADMAN_DEVELOPMENT,
      isBuild: app.get("config").isBuild,
      theme: app.get("config").theme,
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

async function renderMainWithComponent({ app, res, file, variation, cb }) {
  let iframeSrc = app.get("config").isBuild
    ? `/component-${helpers.normalizeString(
        file.replace(`.${app.get("config").templates.extension}`, "")
      )}.html`
    : `/component?file=${file}`;

  const hideTests =
    !app.get("config").validations.accessibility &&
    !app.get("config").validations.html;

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
      headmanDev: !!process.env.HEADMAN_DEVELOPMENT,
      headmanProd: !process.env.HEADMAN_DEVELOPMENT,
      isBuild: app.get("config").isBuild,
      theme: app.get("config").theme,
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
    headmanDev: !!process.env.HEADMAN_DEVELOPMENT,
    headmanProd: !process.env.HEADMAN_DEVELOPMENT,
    isBuild: app.get("config").isBuild,
    theme: app.get("config").theme,
  });
}

async function renderComponent({ app, res, file, variation, embedded, cb }) {
  const componentJson = cloneDeep(
    app.get("state").fileContents[
      helpers.getFullPathFromShortPath(
        app,
        helpers.getDataPathFromTemplatePath(app, file)
      )
    ] || {}
  );
  const componentVariations = componentJson.variations;
  let componentData = componentJson.data;

  if (componentVariations && variation) {
    const variationJson = componentVariations.find(
      (vari) => vari.name === decodeURI(variation)
    );

    if (variationJson) {
      componentData = mergeRootDataWithVariationData(
        componentData,
        variationJson.data ? variationJson.data : {}
      );
    }
  }

  componentData = mergeWithGlobalData(
    app,
    await overwriteJsonLinksWithJsonData(app, componentData)
  );

  componentData = await overwriteTplLinksWithTplContent(app, componentData);

  await renderSingleComponent({
    app,
    res,
    file,
    context: componentData,
    standaloneUrl: embedded
      ? app.get("config").isBuild
        ? `component-${helpers.normalizeString(
            file.replace(`.${app.get("config").templates.extension}`, "")
          )}-${helpers.normalizeString(variation)}.html`
        : `/component?file=${file}&variation=${variation}`
      : null,
    cb,
  });
}

async function renderComponentVariations({ app, res, file, cb }) {
  const splittedPath = file.split(path.sep);
  const fileName = splittedPath[splittedPath.length - 1];
  const componentJson = cloneDeep(
    app.get("state").fileContents[
      helpers.getFullPathFromShortPath(
        app,
        helpers.getDataPathFromTemplatePath(app, file)
      )
    ]
  );
  const componentDocumentation = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getDocumentationPathFromTemplatePath(app, file)
    )
  ];
  const componentSchema = Object.entries(
    app.get("state").fileContents[
      helpers.getFullPathFromShortPath(
        app,
        helpers.getSchemaPathFromTemplatePath(file, fileName)
      )
    ] || {}
  ).map((item) => {
    return { name: item[0], attrs: item[1] };
  });

  let componentName = fileName.replace(
    `.${app.get("config").templates.extension}`,
    ""
  );
  let componentStatus;

  if (componentJson) {
    const context = [];
    const componentData = componentJson.data;
    const componentVariations = componentJson.variations;

    if (componentJson.name) {
      componentName = componentJson.name;
    }

    if (componentJson.name) {
      componentStatus = componentJson.status;
    }

    if (componentData) {
      context.push({
        component: file,
        data: mergeWithGlobalData(
          app,
          componentData
            ? await overwriteTplLinksWithTplContent(
                app,
                await overwriteJsonLinksWithJsonData(app, componentData)
              )
            : {}
        ),
        name: config.defaultVariationName,
      });
    }

    if (componentVariations) {
      componentVariations.forEach((variationJson) => {
        if (variationJson.name) {
          context.push({
            component: file,
            data: componentData
              ? mergeRootDataWithVariationData(
                  componentData,
                  variationJson.data ? variationJson.data : {}
                )
              : variationJson.data
              ? variationJson.data
              : {},
            name: variationJson.name,
          });
        }
      });

      await Promise.all(
        context.map(async (entry, i) => {
          return new Promise(async (resolve) => {
            context[i].data = mergeWithGlobalData(
              app,
              await overwriteTplLinksWithTplContent(
                app,
                await overwriteJsonLinksWithJsonData(app, entry.data)
              )
            );
            resolve();
          });
        })
      ).then(async () => {
        await renderVariations({
          app,
          res,
          file,
          context,
          componentDocumentation,
          componentSchema,
          name: componentName,
          cb,
          status: componentStatus,
        });
      });
    } else {
      await renderVariations({
        app,
        res,
        file,
        context,
        componentDocumentation,
        componentSchema,
        name: componentName,
        cb,
        status: componentStatus,
      });
    }
  } else {
    await renderVariations({
      app,
      res,
      file,
      context: [
        {
          component: file,
          name: config.defaultVariationName,
        },
      ],
      componentDocumentation,
      componentSchema,
      name: componentName,
      cb,
      status: componentStatus,
    });
  }
}

async function renderComponentOverview({ app, res, embedded, cb }) {
  const arr = [];
  const promises = [];

  const documentation = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      `index.${config.documentationFileType}`
    )
  ];

  const components = Object.keys(app.get("state").partials).map(
    (partialPath) => {
      let componentJson =
        app.get("state").fileContents[
          helpers.getFullPathFromShortPath(
            app,
            helpers.getDataPathFromTemplatePath(app, partialPath)
          )
        ] || {};
      let componentData;

      if (componentJson.data) {
        componentData = componentJson.data;
      } else if (componentJson.variations && componentJson.variations.length) {
        componentData = getFallbackData(componentJson.variations);
      }

      return [
        partialPath,
        cloneDeep(componentData),
        componentJson.name ||
          path.basename(
            partialPath,
            `.${app.get("config").templates.extension}`
          ),
        partialPath.split(path.sep).slice(0, -2),
      ];
    }
  );

  components.forEach((component, i) => {
    promises.push(
      new Promise(async (resolve) => {
        const [componentPath] = component;
        let [, componentData] = component;

        if (componentData) {
          componentData = mergeWithGlobalData(
            app,
            await overwriteTplLinksWithTplContent(
              app,
              await overwriteJsonLinksWithJsonData(app, componentData)
            )
          );
        }

        app.render(
          componentPath,
          getDataForRenderFunction(app, componentData),
          (err, result) => {
            const [file, , name, folders] = components[i];
            arr[i] = {
              url: app.get("config").isBuild
                ? `component-${helpers.normalizeString(
                    componentPath.replace(
                      `.${app.get("config").templates.extension}`,
                      ""
                    )
                  )}-embedded.html`
                : `/component?file=${file}&embedded=true`,
              name,
              folders,
              html: result || getComponentErrorHtml(err),
            };

            resolve();
          }
        );
      })
    );
  });

  await Promise.all(promises).then(async () => {
    const { validations, projectName } = app.get("config");

    await res.render(
      "component_overview.hbs",
      {
        components: arr,
        dev: process.env.NODE_ENV === "development",
        prod: process.env.NODE_ENV === "production",
        a11yTestsPreload: validations.accessibility,
        projectName: config.projectName,
        userProjectName: projectName,
        isBuild: app.get("config").isBuild,
        theme: app.get("config").theme,
        documentation,
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
      async (err, result) => {
        const { validations, projectName } = app.get("config");

        await res.render(
          standaloneUrl ? "component_frame.hbs" : "component.hbs",
          {
            html: result || getComponentErrorHtml(err),
            htmlValidation: validations.html,
            accessibilityValidation: standaloneUrl && validations.accessibility,
            standalone: !standaloneUrl,
            standaloneUrl,
            dev: process.env.NODE_ENV === "development",
            prod: process.env.NODE_ENV === "production",
            projectName: config.projectName,
            userProjectName: projectName,
            isBuild: app.get("config").isBuild,
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

async function renderVariations({
  app,
  res,
  file,
  context,
  componentDocumentation,
  componentSchema,
  name,
  status,
  cb,
}) {
  const variations = [];
  const promises = [];
  const { extension } = app.get("config").templates;

  context.forEach((entry, i) => {
    promises.push(
      new Promise((resolve) => {
        app.render(
          file,
          getDataForRenderFunction(app, entry.data),
          (err, result) => {
            const { name } = context[i];
            const baseName = file.replace(`.${extension}`, "");
            const variation = name ? name : baseName;

            variations[i] = {
              url: app.get("config").isBuild
                ? `component-${helpers.normalizeString(
                    baseName
                  )}-${helpers.normalizeString(variation)}-embedded.html`
                : `/component?file=${file}&variation=${variation}&embedded=true`,
              file,
              html: result || getComponentErrorHtml(err),
              variation,
            };

            resolve(result);
          }
        );
      })
    );
  });

  await Promise.all(promises).then(async () => {
    const { validations, projectName } = app.get("config");
    const statusObj = status
      ? {
          key: status,
          label: config.messages.statuses[status],
        }
      : null;

    await res.render(
      "component_variations.hbs",
      {
        variations,
        dev: process.env.NODE_ENV === "development",
        prod: process.env.NODE_ENV === "production",
        a11yTestsPreload: validations.accessibility,
        projectName: config.projectName,
        userProjectName: projectName,
        isBuild: app.get("config").isBuild,
        theme: app.get("config").theme,
        documentation: componentDocumentation,
        schema: componentSchema,
        folder: file
          .split(path.sep)
          .slice(0, -1)
          .join("/"),
        name,
        status: statusObj,
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

async function renderComponentNotFound({ app, res, embedded, target }) {
  await res.render(embedded ? "component_frame.hbs" : "component.hbs", {
    html: `<p class="HeadmanError">${target} not found.</p>`,
    dev: process.env.NODE_ENV === "development",
    prod: process.env.NODE_ENV === "production",
    projectName: config.projectName,
    userProjectName: app.get("config").projectName,
    htmlValidation: false,
    accessibilityValidation: false,
    isBuild: app.get("config").isBuild,
    theme: app.get("config").theme,
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
