const path = require("path");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const {
  extendTemplateData,
  resolveData,
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
} = require("../../helpers.js");
const {
  getColors,
  getFonts,
  getSpacings,
  getMediaQueries,
} = require("../../../styleguide/index.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {Function} [object.cb] - callback function
 */
module.exports = async function renderIframeIndex({ app, res, cb }) {
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

    const colors = app.get("state").css
      ? getColors(
          app.get("state").css,
          app.get("config").assets.customProperties.prefixes.color
        )
      : [];
    const fonts = app.get("state").css
      ? getFonts(
          app.get("state").css,
          app.get("config").assets.customProperties.prefixes.typo
        )
      : [];
    const spacings = app.get("state").css
      ? getSpacings(
          app.get("state").css,
          app.get("config").assets.customProperties.prefixes.spacing
        )
      : [];
    const mediaQueries = app.get("state").css
      ? getMediaQueries(app.get("state").css)
      : [];

    await res.render(
      "iframe_index.hbs",
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
        colors:
          colors.map(({ styles }) => styles.length).reduce((a, b) => a + b, 0) >
          0
            ? colors
            : [],
        fonts: fonts.length > 0 ? fonts : null,
        spacings: spacings.length > 0 ? spacings : null,
        mediaQueries,
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
};
