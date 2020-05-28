const deepMerge = require("deepmerge");
const log = require("../logger.js");
const appConfig = require("../config.json");

const { defaultUserConfig } = appConfig;

function sanitizePath(path) {
  let sanitizedPath = path;

  if (sanitizedPath.indexOf("./") === 0) {
    sanitizedPath = sanitizedPath.slice(2);
  }

  if (sanitizedPath.indexOf("/") === 0) {
    sanitizedPath = sanitizedPath.slice(1);
  }

  if (sanitizedPath === "." || sanitizedPath === "/") {
    sanitizedPath = "";
  }

  return sanitizedPath;
}

function sanitizeDirectory(path) {
  let sanitizedPath = path;

  sanitizedPath = sanitizePath(sanitizedPath);

  if (sanitizedPath.length > 1 && sanitizedPath.slice(-1) !== "/") {
    sanitizedPath += "/";
  }

  return sanitizedPath;
}

function arrayfy(strOrArr) {
  const arr = typeof strOrArr === "string" ? [strOrArr] : strOrArr;

  return arr;
}

function objectIsRealObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function getAssetFilesArray(strOrArrOrObj, assetType) {
  let files = strOrArrOrObj;

  if (typeof files === "string") {
    files = [files];
  } else if (objectIsRealObject(files)) {
    const nodeEnv = process.env.NODE_ENV;

    if (files[nodeEnv]) {
      files = arrayfy(files[nodeEnv]);
    } else {
      files = [];

      log(
        "warn",
        appConfig.messages.nodeEndAndKeysDontMatch
          .replace("{{nodeEnv}}", nodeEnv)
          .replace("{{assetType}}", assetType)
      );
    }
  }

  return files.map(sanitizePath);
}

module.exports = (userConfig = {}) => {
  const config = { ...userConfig };

  if (config.assets) {
    if (config.assets.folder) {
      config.assets.folder = arrayfy(config.assets.folder).map(
        sanitizeDirectory
      );
    }

    if (config.assets.css) {
      config.assets.css = getAssetFilesArray(config.assets.css, "css");
    }

    if (config.assets.js) {
      config.assets.js = getAssetFilesArray(config.assets.js, "js");
    }
  }

  if (config.components) {
    if (config.components.folder) {
      config.components.folder = sanitizeDirectory(config.components.folder);
    }

    if (config.components.ignores) {
      config.components.ignores = arrayfy(config.components.ignores).map(
        sanitizeDirectory
      );
    }
  }

  if (config.ui) {
    if (config.ui.theme) {
      if (config.ui.theme.logo) {
        config.ui.theme.logo = sanitizePath(config.ui.theme.logo);
      }
    }
  }

  return deepMerge(defaultUserConfig, config);
};
