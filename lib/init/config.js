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

  if (isFolder && path.length > 0 && path.slice(-1) !== "/") {
    path += "/";
  }

  return path;
}

function sanitizeAssetFiles(files) {
  if (typeof files === "string") {
    return sanitizePath(files);
  }

  const arr = [];

  files.forEach(file => {
    arr.push(sanitizePath(file));
  });

  return arr;
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
      if (entry instanceof Array) {
        userConfig[`${assetType}Files`] = sanitizeAssetFiles(entry);
      } else if (typeof entry === "string") {
        userConfig[`${assetType}Files`] = sanitizeAssetFiles(entry);
      } else {
        if (entry[process.env.NODE_ENV]) {
          entry[process.env.NODE_ENV] = sanitizeAssetFiles(
            entry[process.env.NODE_ENV]
          );
        } else {
          userConfig[`${assetType}Files`] = {};
          logger.log(
            "warn",
            appConfig.messages.nodeEndAndKeysDontMatch
              .replace("${nodeEnv}", process.env.NODE_ENV)
              .replace("${assetType}", assetType)
          );
        }
      }
    }
  });

  app.set(
    "config",
    deepMerge(
      {
        projectName: appConfig.projectName,
        srcFolder: "/",
        cssFiles: [],
        jsFiles: [],
        srcFolderIgnores: appConfig.srcFolderIgnores,
        validations: {
          html: true,
          accessibility: true
        }
      },
      userConfig
    )
  );
};
