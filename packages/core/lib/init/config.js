/**
 * Module for sanitizing the user configuration and merging it with the default configuration
 *
 * @module init/config
 */

const deepMerge = require("deepmerge");
const log = require("../logger.js");
const appConfig = require("../config.json");

const { defaultUserConfig } = appConfig;

/**
 * @param path
 */
function sanitizePath(path) {
  let sanitizedPath = path;

  if (sanitizedPath.startsWith("./")) {
    sanitizedPath = sanitizedPath.slice(2);
  } else if (sanitizedPath.startsWith("/")) {
    sanitizedPath = sanitizedPath.slice(1);
  }

  if (sanitizedPath === "." || sanitizedPath === "/") {
    sanitizedPath = "";
  }

  if (sanitizedPath.endsWith("/")) {
    sanitizedPath = sanitizedPath.slice(0, -1);
  }

  return sanitizedPath;
}

/**
 * @param strOrArr
 */
function arrayfy(strOrArr) {
  const arr = typeof strOrArr === "string" ? [strOrArr] : strOrArr;

  return arr;
}

/**
 * @param obj
 */
function objectIsRealObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

/**
 * @param strOrArrOrObj
 * @param assetType
 */
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
        appConfig.messages.nodeEnvAndKeysDontMatch
          .replace("{{nodeEnv}}", nodeEnv)
          .replace("{{assetType}}", assetType)
      );
    }
  }

  return files.map(sanitizePath);
}

module.exports = (userConfig = {}) => {
  const config = { ...userConfig };

  if (config.build) {
    if (config.build.basePath) {
      if (!config.build.basePath.startsWith("/")) {
        config.build.basePath = `/${config.build.basePath}`;
      }

      if (!config.build.basePath.endsWith("/")) {
        config.build.basePath = `${config.build.basePath}/`;
      }
    }
  }

  if (config.assets) {
    if (config.assets.folder) {
      config.assets.folder = arrayfy(config.assets.folder).map(sanitizePath);
    }

    if (config.assets.css) {
      config.assets.css = getAssetFilesArray(config.assets.css, "css");
    }

    if (config.assets.js) {
      config.assets.js = getAssetFilesArray(config.assets.js, "js");
    }
  }

  if (config.components) {
    if (config.components.ignores) {
      config.components.ignores = arrayfy(config.components.ignores).map(
        sanitizePath
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

  const merged = deepMerge(defaultUserConfig, config);

  merged.components.folder = sanitizePath(merged.components.folder);

  return merged;
};
