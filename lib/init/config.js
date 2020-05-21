"use strict";

const path = require("path");
const deepMerge = require("deepmerge");
const logger = require("../logger.js");
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

      logger.log(
        "warn",
        appConfig.messages.nodeEndAndKeysDontMatch
          .replace("${nodeEnv}", nodeEnv)
          .replace("${assetType}", assetType)
      );
    }
  }

  return files.map(sanitizePath);
}

function getCssArray(files) {
  return getAssetFilesArray(files, "css");
}

function getJsArray(files) {
  return getAssetFilesArray(files, "js");
}

module.exports = (userConfig = {}) => {
  if (userConfig.assets) {
    if (userConfig.assets.folder) {
      userConfig.assets.folder = arrayfy(userConfig.assets.folder).map(
        sanitizeDirectory
      );
    }

    if (userConfig.assets.css) {
      userConfig.assets.css = getCssArray(userConfig.assets.css);
    }

    if (userConfig.assets.js) {
      userConfig.assets.js = getJsArray(userConfig.assets.js);
    }
  }

  if (userConfig.ui && userConfig.ui.theme && userConfig.ui.theme.logo) {
    userConfig.ui.theme.logo = sanitizePath(userConfig.ui.theme.logo);
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

  if (userConfig.engine && userConfig.engine.namespaces) {
    const componentsFolder =
      userConfig.components && userConfig.components.folder
        ? userConfig.components.folder
        : ".";
    Object.entries(userConfig.engine.namespaces).forEach(([key, val]) => {
      userConfig.engine.namespaces[key] = path.join(
        process.cwd(),
        componentsFolder,
        val
      );
    });
  }

  if (userConfig.ui) {
    if (userConfig.ui.validations) {
      if (
        userConfig.ui.validations.accessibility &&
        typeof userConfig.ui.validations.accessibility == "string"
      ) {
        userConfig.ui.validations.accessibility =
          userConfig.ui.validations.accessibility === "false" ? false : true;
      }
      if (
        userConfig.ui.validations.html &&
        typeof userConfig.ui.validations.html == "string"
      ) {
        userConfig.ui.validations.html =
          userConfig.ui.validations.html === "false" ? false : true;
      }
    }
  }

  return deepMerge(defaultUserConfig, userConfig);
};
