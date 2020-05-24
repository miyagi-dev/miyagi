"use strict";

const dirTree = require("directory-tree");
const path = require("path");
const config = require("../config.json");
const logger = require("../logger.js");

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
        }|${app.get("config").files.schema.extension}|${
          app.get("config").files.templates.extension
        })$`
      ),
      exclude,
    }
  );

  if (!tree) {
    logger.log("warn", config.messages.srcFolderNotFound);
  }

  return tree || {};
}

module.exports = {
  getSourceTree,
};
