"use strict";

const deepMerge = require("deepmerge");
const logger = require("../logger.js");
const appConfig = require("../config.json");

const defaultUserConfig = {
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
};

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

module.exports = (app, userConfig = {}) => {
  if (userConfig.srcFolder) {
    userConfig.srcFolder = sanitizeDirectory(userConfig.srcFolder);
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

  app.set("config", deepMerge(defaultUserConfig, userConfig));
};
