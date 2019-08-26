"use strict";

const dirTree = require("directory-tree");
const path = require("path");
const config = require("../config.json");

function getSourceTree(app) {
  const exclude = [];

  app.get("config").srcFolderIgnores.forEach(ignore => {
    exclude.push(new RegExp(ignore));
  });

  return dirTree(path.join(process.cwd(), app.get("config").srcFolder), {
    extensions: new RegExp(
      `.(${app.get("config").extension}|${config.dataFileType})$`
    ),
    exclude
  });
}

module.exports = {
  getSourceTree
};
