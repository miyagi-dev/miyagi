import tests from "../../tests.js";
import config from "../../../miyagi-config.js";
import { normalizeString } from "../../../helpers.js";
import { getThemeMode, getComponentTextDirection } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {string} [object.variation] - the variation name
 * @param {string} [object.buildDate] - the build date in machine readable format
 * @param {string} [object.formattedBuildDate] - the build date in human readable format
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
export default async function renderMainComponent({
  app,
  res,
  file,
  variation,
  buildDate,
  formattedBuildDate,
  cb,
  cookies,
}) {
  let iframeSrc = app.get("config").isBuild
    ? `component-${normalizeString(
        file.replace(`.${app.get("config").files.templates.extension}`, "")
      )}.html`
    : `/component?file=${file}`;
  const themeMode = getThemeMode(app, cookies);
  const componentTextDirection = getComponentTextDirection(app, cookies);
  const hideTests =
    !app.get("config").ui.validations.accessibility &&
    !app.get("config").ui.validations.html;

  if (variation) {
    if (app.get("config").isBuild) {
      iframeSrc = iframeSrc.replace(
        ".html",
        `-variation-${normalizeString(variation)}.html`
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
    "main.hbs",
    {
      folders: app.get("state").menu,
      flatMenu: app.get("state").flatMenu,
      flatUrlPattern: app.get("config").isBuild
        ? "/show-{{component}}.html"
        : "/show?file={{component}}",
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
      theme: themeMode
        ? Object.assign(app.get("config").ui.theme, { mode: themeMode })
        : app.get("config").ui.theme,
      componentTextDirection:
        componentTextDirection || app.get("config").components.textDirection,
      basePath: app.get("config").isBuild
        ? app.get("config").build.basePath
        : "/",
      buildDate,
      formattedBuildDate,
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
}
