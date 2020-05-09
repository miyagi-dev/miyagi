"use strict";

const dirTree = require("directory-tree");
const path = require("path");
const config = require("../config.json");
const logger = require("../logger.js");

function getSourceTree(app) {
  const exclude = [];

  app.get("config").srcFolderIgnores.forEach((ignore) => {
    exclude.push(new RegExp(ignore));
  });

  const tree = dirTree(path.join(process.cwd(), app.get("config").srcFolder), {
    extensions: new RegExp(
      `.(${app.get("config").templates.extension}|${config.dataFileType})$`
    ),
    exclude,
  });

  if (!tree) {
    logger.log("warn", config.messages.srcFolderNotFound);
  }

  return tree || {};
}

module.exports = {
  getSourceTree,
};
