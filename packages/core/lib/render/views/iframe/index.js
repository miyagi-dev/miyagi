const path = require("path");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const { resolveVariationData } = require("../../../mocks");
const {
  extendTemplateData,
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
const log = require("../../../logger.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {Function} [object.cb] - callback function
 */
module.exports = function renderIframeIndex({ app, res, cb }) {
  const promises = [];

  const documentation =
    app.get("state").fileContents[
      helpers.getFullPathFromShortPath(
        app,
        `README.${app.get("config").files.docs.extension}`
      )
    ];

  return Promise.all(promises).then(async () => {
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

    const additionalCssFiles =
      app.get("config").assets?.customProperties?.files || [];

    await res.render(
      "iframe_index.hbs",
      {
        dev: process.env.NODE_ENV === "development",
        prod: process.env.NODE_ENV === "production",
        a11yTestsPreload: ui.validations.accessibility,
        projectName: config.projectName,
        userProjectName: app.get("config").projectName,
        isBuild: app.get("config").isBuild,
        theme: app.get("config").ui.theme,
        documentation,
        colors:
          colors.map(({ styles }) => styles.length).reduce((a, b) => a + b, 0) >
          0
            ? colors
            : [],
        fonts: fonts.length > 0 ? fonts : null,
        spacings: spacings.length > 0 ? spacings : null,
        mediaQueries,
        additionalCssFiles,
        uiTextDirection: app.get("config").ui.textDirection,
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
  });
};
