"use strict";

const path = require("path");
const express = require("express");
const config = require("../config.json");

function registerUserFiles(app, files) {
  if (app.get("config")[files] instanceof Array) {
    app.get("config")[files].forEach(file => {
      app.use(
        `/${path.dirname(file)}`,
        express.static(path.join(process.cwd(), path.dirname(file)))
      );
    });
  } else {
    if (app.get("config")[files][process.env.NODE_ENV]) {
      app.get("config")[files][process.env.NODE_ENV].forEach(file => {
        app.use(
          `/${path.dirname(file)}`,
          express.static(path.join(process.cwd(), path.dirname(file)))
        );
      });
    }
  }
}

function registerNodeModule(app, nodeModule) {
  app.use(
    `/${config.projectName}/js`,
    express.static(path.join(process.cwd(), `node_modules/${nodeModule}`))
  );
}

module.exports = function(app) {
  const assetFolder =
    config.folders.assets[
      process.env.NODE_ENV === "production" ? "production" : "development"
    ];

  registerUserFiles(app, "cssFiles");
  registerUserFiles(app, "jsFiles");
  registerNodeModule(app, "socket.io-client/dist");
  registerNodeModule(app, "axe-core");

  app.use(
    `/${config.projectName}`,
    express.static(path.join(__dirname, `../../${assetFolder}`))
  );
};