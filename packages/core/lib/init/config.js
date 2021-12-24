/**
 * Module for sanitizing the user configuration and merging it with the default configuration
 *
 * @module initConfig
 */

import deepMerge from "deepmerge";
import log from "../logger.js";
import appConfig, { messages } from "../miyagi-config.js";
import fs from "fs";
import path from "path";

const { defaultUserConfig } = appConfig;

/**
 * @param {string} path - unsanitized directory or file path
 * @returns {string} the given path sanitized
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
 * @param {string|Array} strOrArr - file path or array of file paths
 * @returns {Array} the given file path in an array or simply the given array
 */
function arrayfy(strOrArr) {
  return Array.isArray(strOrArr) ? strOrArr : [strOrArr];
}

/**
 * @param {any} obj - any value provided by the user
 * @returns {boolean} is true if the given object is a real object
 */
function objectIsRealObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function getJsFileObject({
  src,
  defer = false,
  async = false,
  type = null,
  position = "head",
}) {
  return {
    src,
    defer,
    async,
    type,
    position,
  };
}

/**
 * @param {string|Array|object} strOrArrOrObj - user assets files, either one file as string, an array of files or an object with strings or array for each NODE_ENV
 * @param {object} manifest - manifest object
 * @param {string} manifest.file - manifest file path
 * @param {object} manifest.content - parsed json content of manifest file
 * @returns {string[]} converts the given object to an array of asset file path strings
 */
function getJsFilesArray(strOrArrOrObj, manifest) {
  let files = strOrArrOrObj;

  if (typeof files === "string") {
    files = [getJsFileObject({ src: files })];
  } else if (Array.isArray(files)) {
    files = files.map((entry) =>
      typeof entry === "string" ? getJsFileObject({ src: entry }) : entry
    );
  } else if (objectIsRealObject(files)) {
    const nodeEnv = process.env.NODE_ENV;

    if (files[nodeEnv]) {
      files = arrayfy(files[nodeEnv]).map((entry) =>
        typeof entry === "string" ? getJsFileObject({ src: entry }) : entry
      );
    } else if (files.src) {
      files = [files];
    } else {
      files = [];

      log(
        "warn",
        messages.nodeEnvAndKeysDontMatchCssOrJs
          .replace("{{nodeEnv}}", nodeEnv)
          .replace(/{{assetType}}/g, "js")
      );
    }
  }
  if (files.length > 0 && manifest) {
    files = files.map((file) => {
      const manifestEntry = Object.entries(manifest.content).find(([key]) => {
        return (
          path.resolve(path.dirname(manifest.file.src), sanitizePath(key)) ===
          path.resolve(sanitizePath(file.src))
        );
      });

      if (manifestEntry) {
        return {
          ...file,
          src: path.join(path.dirname(manifest.file), manifestEntry[1]),
        };
      } else {
        return file;
      }
    });
  }
  return files
    .filter((file) => typeof file.src === "string")
    .map((file) => ({
      ...file,
      src: sanitizePath(file.src),
    }));
}

/**
 * @param {string|Array|object} strOrArrOrObj - user assets files, either one file as string, an array of files or an object with strings or array for each NODE_ENV
 * @param {object} manifest - manifest object
 * @param {string} manifest.file - manifest file path
 * @param {object} manifest.content - parsed json content of manifest file
 * @returns {string[]} converts the given object to an array of asset file path strings
 */
function getCssFilesArray(strOrArrOrObj, manifest) {
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
        messages.nodeEnvAndKeysDontMatchCssOrJs
          .replace("{{nodeEnv}}", nodeEnv)
          .replace(/{{assetType}}/g, "css")
      );
    }
  }
  if (files.length > 0 && manifest) {
    files = files.map((file) => {
      const manifestEntry = Object.entries(manifest.content).find(([key]) => {
        return (
          path.resolve(path.dirname(manifest.file), sanitizePath(key)) ===
          path.resolve(sanitizePath(file))
        );
      });

      if (manifestEntry) {
        return path.join(path.dirname(manifest.file), manifestEntry[1]);
      } else {
        return file;
      }
    });
  }

  return files.map(sanitizePath);
}

/**
 * @param {string|Array|object} strOrArrOrObj
 * @returns {string[]} the given param converted to an array of asset file path strings
 */
function getAssetFoldersArray(strOrArrOrObj) {
  let folders = strOrArrOrObj;

  if (typeof folders === "string") {
    folders = [folders];
  } else if (objectIsRealObject(folders)) {
    const nodeEnv = process.env.NODE_ENV;

    if (folders[nodeEnv]) {
      folders = arrayfy(folders[nodeEnv]);
    } else {
      folders = [];

      log(
        "warn",
        messages.nodeEnvAndKeysDontMatchAssetFolders.replace(
          "{{nodeEnv}}",
          nodeEnv
        )
      );
    }
  }

  return folders.map(sanitizePath);
}

/**
 * @param {object} [userConfig] the unmerged user configuration
 * @returns {object} the user configuration merged with the default configuration
 */
export default (userConfig = {}) => {
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
    const nodeEnv = process.env.NODE_ENV;
    let manifest;

    if (config.assets.root && objectIsRealObject(config.assets.root)) {
      if (config.assets.root[nodeEnv]) {
        config.assets.root = config.assets.root[nodeEnv];
      } else {
        config.assets.root = "";
      }
    }

    if (config.assets.manifest) {
      try {
        const manifestContent = fs.readFileSync(
          path.resolve(path.join(config.assets.root, config.assets.manifest)),
          "utf-8"
        );

        manifest = {
          file: path.join(config.assets.root, config.assets.manifest),
          content: JSON.parse(manifestContent),
        };
      } catch (e) {
        log(
          "warn",
          messages.manifestNotFound.replace(
            "{{manifest}}",
            path.join(config.assets.root, config.assets.manifest)
          )
        );
      }
    }

    if (config.assets.folder) {
      config.assets.folder = getAssetFoldersArray(config.assets.folder);
    }

    if (config.assets.css) {
      config.assets.css = getCssFilesArray(config.assets.css, manifest);
    }

    if (config.assets.js) {
      config.assets.js = getJsFilesArray(config.assets.js, manifest);
    }

    if (!config.assets.customProperties) {
      config.assets.customProperties = {};
    }
    if (config.assets.customProperties.files) {
      config.assets.customProperties.files = arrayfy(
        config.assets.customProperties.files
      );
    } else {
      config.assets.customProperties.files = [];
    }
  }

  if (config.components) {
    if (config.components.ignores) {
      config.components.ignores = arrayfy(config.components.ignores).map(
        sanitizePath
      );
    }
  }

  if (!config.ui) config.ui = {};
  if (!config.ui.theme) config.ui.theme = {};
  if (!config.ui.theme.light) config.ui.theme.light = {};
  if (!config.ui.theme.dark) config.ui.theme.dark = {};

  if (config.ui.theme.logo) {
    if (!config.ui.theme.light.logo) {
      config.ui.theme.light.logo = config.ui.theme.logo;
    }

    if (!config.ui.theme.dark.logo) {
      config.ui.theme.dark.logo = config.ui.theme.logo;
    }

    delete config.ui.theme.logo;
  }

  if (!config.ui.theme.light.logo && config.ui.theme.dark.logo) {
    config.ui.theme.light.logo = config.ui.theme.dark.logo;
  } else if (!config.ui.theme.dark.logo && config.ui.theme.light.logo) {
    config.ui.theme.dark.logo = config.ui.theme.light.logo;
  }

  if (config.ui.theme.content || config.ui.theme.navigation) {
    config.ui.theme.light.content = config.ui.theme.content;
    config.ui.theme.light.navigation = config.ui.theme.navigation;

    log(
      "warn",
      "Please note that `config.ui.theme.content` and `config.ui.theme.navigation` are deprecated and are going to be removed in future versions. Please use `config.ui.theme.(light|dark).content` and `config.ui.theme.(light|dark).navigation` instead."
    );

    delete config.ui.theme.content;
    delete config.ui.theme.navigation;
  }

  if (config.ui.theme.light.logo) {
    config.ui.theme.light.logo = sanitizePath(config.ui.theme.light.logo);
  }
  if (config.ui.theme.dark.logo) {
    config.ui.theme.dark.logo = sanitizePath(config.ui.theme.dark.logo);
  }

  const merged = deepMerge(defaultUserConfig, config);

  merged.components.folder = sanitizePath(merged.components.folder);

  return merged;
};
