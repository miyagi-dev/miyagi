"use strict";

const path = require("path");
const deepMerge = require("deepmerge");
const log = require("../logger.js");
const appConfig = require("../config.json");

const { defaultUserConfig } = appConfig;

function sanitizeDirectory(path) {
  let sanitizedPath = path;

  sanitizedPath = sanitizePath(sanitizedPath);

  if (sanitizedPath.length > 1 && sanitizedPath.slice(-1) !== "/") {
    sanitizedPath += "/";
  }

  return sanitizedPath;
}

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
          .replace("${nodeEnv}", nodeEnv)
          .replace("${assetType}", assetType)
      );
    }
  }

  return files.map(sanitizePath);
}

module.exports = (userConfig = {}) => {
  if (userConfig.assets) {
    if (userConfig.assets.folder) {
      userConfig.assets.folder = arrayfy(userConfig.assets.folder).map(
        sanitizeDirectory
      );
    }

    if (userConfig.assets.css) {
      userConfig.assets.css = getAssetFilesArray(userConfig.assets.css, "css");
    }

    if (userConfig.assets.js) {
      userConfig.assets.js = getAssetFilesArray(userConfig.assets.js, "js");
    }
  }

  if (userConfig.components) {
    if (userConfig.components.folder) {
      userConfig.components.folder = sanitizeDirectory(
        userConfig.components.folder
      );
    }

    if (userConfig.components.ignores) {
      userConfig.components.ignores = arrayfy(
        userConfig.components.ignores
      ).map(sanitizeDirectory);
    }
  }

  if (userConfig.ui) {
    if (userConfig.ui.theme) {
      if (userConfig.ui.theme.logo) {
        userConfig.ui.theme.logo = sanitizePath(userConfig.ui.theme.logo);
      }
    }
  }

  return deepMerge(defaultUserConfig, userConfig);
};
