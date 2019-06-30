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
  const env = process.env.NODE_ENV || "development";

  userConfig.srcFolder = sanitizePath(userConfig.srcFolder, true);

  ["css", "js"].forEach(assetType => {
    if (userConfig[`${assetType}Files`]) {
      if (userConfig[`${assetType}Files`] instanceof Array) {
        userConfig[`${assetType}Files`] = sanitizeAssetFiles(
          userConfig[`${assetType}Files`]
        );
      } else {
        if (userConfig[`${assetType}Files`][env]) {
          userConfig[`${assetType}Files`] = sanitizeAssetFiles(
            userConfig[`${assetType}Files`][env]
          );
        } else {
          logger.log(
            "error",
            `Please define your css files for the ${env} environment.`
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
        cssFiles: [],
        jsFiles: [],
        srcFolderIgnores: config.srcFolderIgnores,
        watch: config.watch.concat([userConfig.extension]),
        validations: {
          html: true,
          accessibility: true
        }
      },
      userConfig
    )
  );
};
