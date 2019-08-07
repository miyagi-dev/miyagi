"use strict";

const deepMerge = require("deepmerge");
const logger = require("../logger.js");

function sanitizePath(path, isFolder) {
  while (path.indexOf("../") === 0) {
    path = path.slice(3);
  }

  if (path.indexOf("/") === 0) {
    path = path.slice(1);
  }

  if (isFolder && path.length > 1 && path.slice(-1) !== "/") {
    path += "/";
  }

  if (path === "." || path === "/") {
    path = "";
  }

  return path;
}

module.exports = (app, appConfig, userConfig = {}) => {
  if (userConfig.srcFolder) {
    userConfig.srcFolder = sanitizePath(userConfig.srcFolder, true);
  }

  if (userConfig.srcFolderIgnores) {
    userConfig.srcFolderIgnores =
      typeof userConfig.srcFolderIgnores === "string"
        ? [userConfig.srcFolderIgnores]
        : userConfig.srcFolderIgnores;
    userConfig.srcFolderIgnores = userConfig.srcFolderIgnores.map(folder =>
      sanitizePath(folder, true)
    );
  }

  ["css", "js"].forEach(assetType => {
    let entry = userConfig[`${assetType}Files`];

    if (entry) {
      if (typeof entry === "string") {
        userConfig[`${assetType}Files`] = [entry];
      } else if (Object.prototype.toString.call(entry) === "[object Object]") {
        if (entry[process.env.NODE_ENV]) {
          if (typeof entry[process.env.NODE_ENV] === "string") {
            userConfig[`${assetType}Files`] = [entry[process.env.NODE_ENV]];
          } else {
            userConfig[`${assetType}Files`] = entry[process.env.NODE_ENV];
          }
        } else {
          userConfig[`${assetType}Files`] = [];
          logger.log(
            "warn",
            appConfig.messages.nodeEndAndKeysDontMatch
              .replace("${nodeEnv}", process.env.NODE_ENV)
              .replace("${assetType}", assetType)
          );
        }
      }

      userConfig[`${assetType}Files`] = userConfig[`${assetType}Files`].map(
        file => sanitizePath(file)
      );
    }
  });

  app.set(
    "config",
    deepMerge(
      {
        projectName: appConfig.projectName,
        srcFolder: "",
        cssFiles: [],
        jsFiles: [],
        es6Modules: false,
        srcFolderIgnores: appConfig.srcFolderIgnores,
        validations: {
          html: true,
          accessibility: true
        },
        reload: true
      },
      userConfig
    )
  );
};
