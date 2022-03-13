/**
 * Module for getting all partials
 *
 * @module statePartials
 */

const path = require("path");
const { getFiles } = require("./helpers.js");
const helpers = require("../helpers.js");

/**
 * @param {object} app - the express instance
 * @param {object} dir - the directory in which to look for files
 * @returns {Promise} gets resolved with an array of path strings
 */
function getFilePaths(app, dir) {
  return new Promise((resolve) => {
    resolve(
      getFiles(
        dir === "" ? "/" : dir,
        app.get("config").components.ignores,
        function (res) {
          const { name, extension } = app.get("config").files.templates;
          if (path.basename(res).endsWith(`.${extension}`)) {
            const basename = path.basename(res, `.${extension}`);

            if (basename === helpers.getResolvedFileName(name, basename)) {
              return helpers.getShortPathFromFullPath(res);
            }

            return null;
          }

          return null;
        }
      )
    );
  });
}

module.exports = {
  getPartials: function (app) {
    return new Promise((resolve) => {
      const partials = {};

      app.get("config").components.folder.forEach((folder) => {
        getFilePaths(app, folder)
          .then((paths) => {
            if (paths) {
              for (const shortPath of paths) {
                // ignore files that live directly in the srcFolder
                if (shortPath !== path.basename(shortPath)) {
                  partials[shortPath] = path.join(process.cwd(), shortPath);
                }
              }
            }
            resolve(partials);
          })
          .catch((err) => console.error(err));
      });
    });
  },
};
