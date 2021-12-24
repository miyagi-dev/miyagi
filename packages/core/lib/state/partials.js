/**
 * Module for getting all partials
 *
 * @module statePartials
 */

import path from "path";
import { getFiles } from "./helpers.js";
import { getResolvedFileName, getShortPathFromFullPath } from "../helpers.js";

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

            if (basename === getResolvedFileName(name, basename)) {
              return getShortPathFromFullPath(app, res);
            }

            return null;
          }

          return null;
        }
      )
    );
  });
}

export const getPartials = function (app) {
  return new Promise((resolve) => {
    const partials = {};

    getFilePaths(app, app.get("config").components.folder).then((paths) => {
      if (paths) {
        for (const shortPath of paths) {
          // ignore files that live directly in the srcFolder
          if (shortPath !== path.basename(shortPath)) {
            partials[shortPath] = path.join(
              process.cwd(),
              `${app.get("config").components.folder}/${shortPath}`
            );
          }
        }
      }

      resolve(partials);
    });
  });
};
