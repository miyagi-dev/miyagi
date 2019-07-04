const deepMerge = require("deepmerge");
const config = require("./config.json");
const logger = require("./logger.js");

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
  const arr = [];

  files.forEach(file => {
    arr.push(sanitizePath(file));
  });

  return arr;
}

module.exports = (app, userConfig = {}) => {
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
    if (userConfig[`${assetType}Files`]) {
      if (userConfig[`${assetType}Files`] instanceof Array) {
        userConfig[`${assetType}Files`] = sanitizeAssetFiles(
          userConfig[`${assetType}Files`]
        );
      } else {
        if (userConfig[`${assetType}Files`][process.env.NODE_ENV]) {
          userConfig[`${assetType}Files`][
            process.env.NODE_ENV
          ] = sanitizeAssetFiles(
            userConfig[`${assetType}Files`][process.env.NODE_ENV]
          );
        } else {
          userConfig[`${assetType}Files`] = {};
          logger.log(
            "warn",
            config.messages.nodeEndAndKeysDontMatch
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
        projectName: config.projectName,
        srcFolder: "/",
        cssFiles: [],
        jsFiles: [],
        srcFolderIgnores: config.srcFolderIgnores,
        validations: {
          html: true,
          accessibility: true
        }
      },
      userConfig
    )
  );
};
