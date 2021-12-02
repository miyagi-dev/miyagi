/**
 * Module for registering static files
 *
 * @module initStatic
 */

const path = require("path");
const express = require("express");
const config = require("../config.json");

/**
 * @param {object} app - the express instance
 */
function registerUserAssetFolder(app) {
  const { assets } = app.get("config");

  if (assets && assets.folder) {
    for (const folder of assets.folder) {
      app.use(
        path.join("/", folder),
        express.static(path.join(assets.root, folder))
      );
    }
  }
}

/**
 * @param {object} app - the express instance
 */
function registerThemeFavicon(app) {
  if (app.get("config").ui && app.get("config").ui.theme) {
    const file = app.get("config").ui.theme.favicon;

    if (file) {
      app.use(`/favicon.ico`, express.static(path.resolve(file)));
    }
  }
}

/**
 * @param {object} app - the express instance
 */
function registerThemeLogo(app) {
  const files = [
    app.get("config").ui.theme.light.logo,
    app.get("config").ui.theme.dark.logo,
  ];

  files.forEach((file) => {
    if (file) {
      app.use(
        path.join("/", path.dirname(file)),
        express.static(path.resolve(path.dirname(file)))
      );
    }
  });
}

/**
 * @param {object} app - the express instance
 * @param {("css"|"js")} files - the type of user assets that should be registered
 */
function registerUserFiles(app, files) {
  const { assets } = app.get("config");

  if (assets) {
    for (const file of assets[files]) {
      app.use(
        path.join("/", path.dirname(file)),
        express.static(path.join(assets.root, path.dirname(file)))
      );
    }
  }
}

/**
 * @param {object} app - the express instance
 */
function registerCustomPropertyFiles(app) {
  const { assets } = app.get("config");

  if (assets?.customProperties?.files) {
    for (const file of assets.customProperties.files) {
      app.use(
        path.join("/", path.dirname(path.join(assets.root, file))),
        express.static(path.dirname(path.join(assets.root, file)))
      );
    }
  }
}

/**
 * @param {object} app - the express instance
 * @param {string} nodeModule - node module path basename
 */
function registerNodeModule(app, nodeModule) {
  app.use(
    `/${config.projectName}/js`,
    express.static(path.resolve(`node_modules/${nodeModule}`))
  );
}

/**
 * @param {object} app - the express instance
 */
function registerAssetFolder(app) {
  const assetFolder =
    config.folders.assets[
      process.env.MIYAGI_DEVELOPMENT ? "development" : "production"
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
  registerCustomPropertyFiles(app);
  registerNodeModule(app, "socket.io/client-dist");
  registerNodeModule(app, "axe-core");
  registerAssetFolder(app);
};
