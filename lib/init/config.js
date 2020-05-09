"use strict";

const path = require("path");
const deepMerge = require("deepmerge");
const logger = require("../logger.js");
const appConfig = require("../config.json");

const { defaultUserConfig } = appConfig;

defaultUserConfig.projectName = appConfig.projectName;

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
  if (userConfig.assetFolder) {
    userConfig.assetFolder = sanitizeDirectory(userConfig.assetFolder);
  }

  if (userConfig.srcFolder) {
    userConfig.srcFolder = sanitizeDirectory(userConfig.srcFolder);
  }

  if (userConfig.theme && userConfig.theme.logo) {
    userConfig.theme.logo = sanitizePath(userConfig.theme.logo);
  }

  if (userConfig.srcFolderIgnores) {
    userConfig.srcFolderIgnores = arrayfy(userConfig.srcFolderIgnores).map(
      sanitizeDirectory
    );
  }

  if (userConfig.cssFiles) {
    userConfig.cssFiles = getCssArray(userConfig.cssFiles);
  }

  if (userConfig.jsFiles) {
    userConfig.jsFiles = getJsArray(userConfig.jsFiles);
  }

  if (userConfig.namespaces) {
    Object.entries(userConfig.namespaces).forEach(([key, val]) => {
      userConfig.namespaces[key] = path.join(
        process.cwd(),
        userConfig.srcFolder,
        val
      );
    });
  }

  if (userConfig.validations) {
    if (
      userConfig.validations.accessibility &&
      typeof userConfig.validations.accessibility == "string"
    ) {
      userConfig.validations.accessibility =
        userConfig.validations.accessibility === "false" ? false : true;
    }
    if (
      userConfig.validations.html &&
      typeof userConfig.validations.html == "string"
    ) {
      userConfig.validations.html =
        userConfig.validations.html === "false" ? false : true;
    }
  }

  return deepMerge(defaultUserConfig, userConfig);
};
