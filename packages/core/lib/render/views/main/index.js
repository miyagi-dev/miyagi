const tests = require("../../tests.json");
const config = require("../../../config.json");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} object.res - the express response object
 * @param {string} [object.buildDate] - the build date in machine readable format
 * @param {string} [object.formattedBuildDate] - the build date in human readable format
 * @param {Function} [object.cb] - callback function
 */
module.exports = function renderMainIndex({
  app,
  res,
  buildDate,
  formattedBuildDate,
  cb,
}) {
  res.render(
    "main.hbs",
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
};
