"use strict";

const path = require("path");
const config = require("../config.json");

module.exports = function(app) {
  app.set("views", [
    path.join(__dirname, `../../${config.folders.views}`),
    path.resolve(app.get("config").components.folder),
  ]);
};
