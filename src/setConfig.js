const deepMerge = require("deepmerge");
const config = require("./config.json");

function sanitizePath(path, isFolder) {
  while (path.indexOf("../") === 0) {
    path = path.slice(3);
  }

  if (path.indexOf("/") === 0) {
    path = path.slice(1);
  }

  if (isFolder && path.slice(-1) !== "/") {
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
  userConfig.srcFolder = sanitizePath(userConfig.srcFolder, true);

  if (userConfig.cssFiles) {
    userConfig.cssFiles = sanitizeAssetFiles(userConfig.cssFiles);
  }

  if (userConfig.jsFiles) {
    userConfig.jsFiles = sanitizeAssetFiles(userConfig.jsFiles);
  }

  app.set(
    "config",
    deepMerge(
      {
        projectName: config.projectName,
        cssFiles: [],
        jsFiles: [],
        validations: {
          html: true,
          accessibility: true
        }
      },
      userConfig
    )
  );
};
