const config = require("../../../config.json");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {boolean} object.embedded - defines if the component is rendered inside an iframe or not
 * @param {string} object.target - name of the requested component
 */
module.exports = async function renderIframe404({
  app,
  res,
  embedded,
  target,
}) {
  await res.render(
    embedded ? "iframe_component_variation.hbs" : "component_variation.hbs",
    {
      html: `<p class="MiyagiError">${target} not found.</p>`,
      dev: process.env.NODE_ENV === "development",
      prod: process.env.NODE_ENV === "production",
      projectName: config.projectName,
      userProjectName: app.get("config").projectName,
      htmlValidation: false,
      accessibilityValidation: false,
      isBuild: app.get("config").isBuild,
      theme: app.get("config").ui.theme,
      textDirection: app.get("config").components.textDirection,
    }
  );
};
