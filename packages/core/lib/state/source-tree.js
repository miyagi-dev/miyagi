/**
 * Module for getting a source tree of the project
 *
 * @module state/source-tree
 */

const dirTree = require("directory-tree");
const path = require("path");
const config = require("../config.json");
const log = require("../logger.js");
const helpers = require("../helpers.js");

/**
 * @param {object} app - the express instance
 * @returns {object} the source tree object
 */
function getSourceTree(app) {
  const exclude = [];

  const { ignores } = app.get("config").components;
  for (const ignore of ignores) {
    exclude.push(new RegExp(ignore));
  }

  const tree = dirTree(
    path.join(process.cwd(), app.get("config").components.folder),
    {
      extensions: new RegExp(
        `.(${app.get("config").files.css.extension}|${
          app.get("config").files.docs.extension
        }|${app.get("config").files.js.extension}|${
          app.get("config").files.mocks.extension
        }|${
          app.get("config").files.schema.extension
        }|${helpers.getSingleFileExtension(
          app.get("config").files.templates.extension
        )})$`
      ),
      exclude,
    }
  );

  if (!tree) {
    log("warn", config.messages.srcFolderNotFound);
  }

  return tree || {};
}

module.exports = {
  getSourceTree,
};
