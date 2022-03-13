/**
 * Module for registering the views in express
 *
 * @module initViews
 */

const path = require("path");
const config = require("../config.json");

module.exports = function initViews(app) {
  app.set("views", [
    path.join(__dirname, `../../${config.folders.views}`),
    ...app
      .get("config")
      .components.folder.map((folder) => path.resolve(folder)),
  ]);
};
