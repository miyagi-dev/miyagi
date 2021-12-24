import config from "../../../miyagi-config.js";
import { getThemeMode, getComponentTextDirection } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {boolean} object.embedded - defines if the component is rendered inside an iframe or not
 * @param {string} object.target - name of the requested component
 * @param {object} object.cookies
 */
export default async function renderIframe404({
  app,
  res,
  embedded,
  target,
  cookies,
}) {
  const themeMode = getThemeMode(app, cookies);
  const componentTextDirection = getComponentTextDirection(app, cookies);

  await res.render(
    embedded ? "iframe_component_variation.hbs" : "component_variation.hbs",
    {
      error: `${target} not found.`,
      dev: process.env.NODE_ENV === "development",
      prod: process.env.NODE_ENV === "production",
      projectName: config.projectName,
      userProjectName: app.get("config").projectName,
      htmlValidation: false,
      accessibilityValidation: false,
      isBuild: app.get("config").isBuild,
      theme: themeMode
        ? Object.assign(app.get("config").ui.theme, { mode: themeMode })
        : app.get("config").ui.theme,
      componentTextDirection:
        componentTextDirection || app.get("config").components.textDirection,
      uiTextDirection: app.get("config").ui.textDirection,
      componentLanguage: app.get("config").components.lang,
    }
  );
}
