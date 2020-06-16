/**
 * Module for registering static files
 * @module init/static
 */

const path = require("path");
const express = require("express");
const config = require("../config.json");

function registerUserAssetFolder(app) {
  const { assets } = app.get("config");

  if (assets && assets.folder) {
    for (const folder of assets.folder) {
      app.use(
        folder.startsWith("/") ? folder : `/${folder}`,
        express.static(path.resolve(folder))
      );
    }
  }
}

function registerThemeFavicon(app) {
  if (app.get("config").ui && app.get("config").ui.theme) {
    const file = app.get("config").ui.theme.favicon;

    if (file) {
      app.use(`/favicon.ico`, express.static(path.resolve(file)));
    }
  }
}

function registerThemeLogo(app) {
  if (app.get("config").ui && app.get("config").ui.theme) {
    const file = app.get("config").ui.theme.logo;

    if (file) {
      app.use(
        `/${path.dirname(file)}`,
        express.static(path.resolve(path.dirname(file)))
      );
    }
  }
}

function registerUserFiles(app, files) {
  if (app.get("config").assets) {
    for (const file of app.get("config").assets[files]) {
      app.use(
        `/${path.dirname(file)}`,
        express.static(path.resolve(path.dirname(file)))
      );
    }
  }
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
      process.env.ROUNDUP_DEVELOPMENT ? "development" : "production"
    ];

  app.use(
    `/${config.projectName}`,
    express.static(path.join(__dirname, `../../${assetFolder}`))
  );
}

module.exports = function initStatic(app) {
  registerThemeFavicon(app);
  registerThemeLogo(app);
  registerUserAssetFolder(app);
  registerUserFiles(app, "css");
  registerUserFiles(app, "js");
  registerNodeModule(app, "socket.io-client/dist");
  registerNodeModule(app, "axe-core");
  registerAssetFolder(app);
};
