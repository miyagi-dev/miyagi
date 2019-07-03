const dirTree = require("directory-tree");
const path = require("path");
const config = require("../config.json");
const helpers = require("../helpers.js");

module.exports = app => {
  const exclude = [];

  app.get("config").srcFolderIgnores.forEach(ignore => {
    exclude.push(new RegExp(ignore));
  });

  return dirTree(
    path.join(process.cwd(), app.get("config").srcFolder),
    {
      extensions: new RegExp(
        `.(${app.get("config").extension}|${config.dataFileType})$`
      ),
      exclude
    },
    item => {
      item.shortPath = helpers.getShortPathFromFullPath(app, item.path);
    }
  );
};
