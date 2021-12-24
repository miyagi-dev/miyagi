import config from "../../../miyagi-config.js";
import { getThemeMode, getComponentTextDirection } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {string} [object.variation] - the variation name
 * @param {object} object.cookies
 */
export default async function renderMain404({
  app,
  res,
  file,
  variation,
  cookies,
}) {
  const themeMode = getThemeMode(app, cookies);
  const componentTextDirection = getComponentTextDirection(app, cookies);
  let iframeSrc = `/component?file=${file}`;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
  }

  iframeSrc += "&embedded=true";

  await res.render("main.hbs", {
    folders: app.get("state").menu,
    flatMenu: app.get("state").flatMenu,
    flatUrlPattern: app.get("config").isBuild
      ? "/show-{{component}}.html"
      : "/show?file={{component}}",
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
    theme: themeMode
      ? Object.assign(app.get("config").ui.theme, { mode: themeMode })
      : app.get("config").ui.theme,
    componentTextDirection:
      componentTextDirection || app.get("config").components.textDirection,
    indexPath: app.get("config").isBuild
      ? "component-all-embedded.html"
      : "/component?file=all&embedded=true",
    basePath: app.get("config").isBuild
      ? app.get("config").build.basePath
      : "/",
    uiTextDirection: app.get("config").ui.textDirection,
  });
}
