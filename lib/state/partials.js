/**
 * Module for getting all partials
 * @module state/partials
 */

const path = require("path");
const { getFiles } = require("./helpers.js");
const helpers = require("../helpers.js");

function getFilePaths(app, dir) {
  return new Promise((resolve) => {
    resolve(
      getFiles(app, dir, function (res) {
        const { name, extension } = app.get("config").files.templates;
        if (path.basename(res).endsWith(`.${extension}`)) {
          const basename = path.basename(res, `.${extension}`);

          if (basename === helpers.getResolvedFileName(name, basename)) {
            return helpers.getShortPathFromFullPath(app, res);
          }

          return null;
        }

        return null;
      })
    );
  });
}

module.exports = {
  getPartials: function (app) {
    return new Promise((resolve) => {
      const partials = {};

      getFilePaths(app, app.get("config").components.folder).then((paths) => {
        for (const shortPath of paths) {
          if (shortPath === path.basename(shortPath)) break; // ignore files that live directly in the srcFolder

          partials[shortPath] = path.join(
            process.cwd(),
            `${app.get("config").components.folder}/${shortPath}`
          );
        }

        resolve(partials);
      });
    });
  },
};
