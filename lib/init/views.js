/**
 * Module for registering the views in express
 * @module init/views
 */

const path = require("path");
const config = require("../config.json");

module.exports = function initViews(app) {
  app.set("views", [
    path.join(__dirname, `../../${config.folders.views}`),
    path.resolve(app.get("config").components.folder),
  ]);
};
