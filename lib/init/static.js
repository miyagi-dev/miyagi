"use strict";

const path = require("path");
const express = require("express");
const config = require("../config.json");

function registerUserFiles(app, files) {
  app.get("config")[files].forEach((file) => {
    app.use(
      `/${path.dirname(file)}`,
      express.static(path.resolve(path.dirname(file)))
    );
  });
}

function registerNodeModule(app, nodeModule) {
  app.use(
    `/${config.projectName}/js`,
    express.static(path.resolve(`node_modules/${nodeModule}`))
  );
}

function registerAssetFolder(app) {
  const assetFolder =
    config.folders.assets[
      process.env.HEADMAN_DEVELOPMENT ? "development" : "production"
    ];

  app.use(
    `/${config.projectName}`,
    express.static(path.join(__dirname, `../../${assetFolder}`))
  );
}

module.exports = function initStatic(app) {
  registerUserFiles(app, "cssFiles");
  registerUserFiles(app, "jsFiles");
  registerNodeModule(app, "socket.io-client/dist");
  registerNodeModule(app, "axe-core");
  registerAssetFolder(app);
};
