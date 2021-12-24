import v8 from "v8";
import path from "path";
import deepMerge from "deepmerge";

import log from "./logger.js";
import { messages, engines } from "./miyagi-config.js";
import { getFiles } from "./state/helpers.js";

/**
 * Removes all keys starting with $ from an object
 *
 * @param {object} [obj] the object whose keys with $ should be removed
 * @returns {object} the modified object
 */
export const removeInternalKeys = function (obj = {}) {
  const o = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith("$") || key === "$ref") {
      o[key] = value;
    }
  }

  return o;
};

/**
 * Returns everything after the last "." of a file extension (e.g. `html.twig` -> `twig`)
 *
 * @param {string} [extension] - File extension like `twig` or `html.twig`
 * @returns {string} the last part of a the file extension
 */
export const getSingleFileExtension = function (extension = "") {
  return extension.slice(extension.lastIndexOf(".") + 1);
};

/**
 * Normalizes a string be replacing whitespace, underscore, / etc with - and lowercases it
 *
 * @param {string} [str] string that should be normalized
 * @returns {string} the normalized string
 */
export const normalizeString = function (str = "") {
  if (typeof str === "string") {
    return str
      .replace(/[^\w\s]/gi, "-")
      .replace(/_/g, "-")
      .replace(/ /g, "-")
      .toLowerCase();
  }

  return str;
};

/**
 * If '<component>' is set as the file name in the config, it returns the given file name, otherwise it returns the value from the config
 *
 * @param {string} nameInConfig - The defined name for a file in the config
 * @param {string} fileName - The actual file name
 * @returns {string} the filename based on the configuration file
 */
export const getResolvedFileName = function (nameInConfig, fileName) {
  if (nameInConfig === "<component>") {
    return fileName;
  }

  return nameInConfig;
};

/**
 * Creates a deep clone of a object using internal v8 methods
 *
 * @param {object} obj - the object to clone
 * @returns {object} clone of rhe given object
 */
export const cloneDeep = function (obj) {
  return v8.deserialize(v8.serialize(obj));
};

/**
 * Accepts a path relative from the config.components.folder and returns the complete path based on the file system
 *
 * @param {object} app - the express instance
 * @param {string} shortPath - a relative file path based from the components folder
 * @returns {string} absolute file path
 */
export const getFullPathFromShortPath = function (app, shortPath) {
  return path.join(
    process.cwd(),
    `${app.get("config").components.folder}/${shortPath}`
  );
};

/**
 * Accepts an absolute (file system based) path and returns the short path relative from config.components.folder
 *
 * @param {object} app - the express instance
 * @param {string} fullPath - absolute file path
 * @returns {string} relative file path based from the components folder
 */
export const getShortPathFromFullPath = function (app, fullPath) {
  return fullPath.replace(
    `${path.join(process.cwd(), app.get("config").components.folder)}/`,
    ""
  );
};

/**
 * Accepts a template file path and returns the path to the corresponding mock file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - file path to a template file
 * @returns {string} file path to the corresponding mock file
 */
export const getDataPathFromTemplatePath = function (app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.mocks.name}.${
      app.get("config").files.mocks.extension
    }`
  );
};

/**
 * Accepts a template file path and returns the path to the corresponding documentation file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - file path to a template file
 * @returns {string} file path to the corresponding doc file
 */
export const getDocumentationPathFromTemplatePath = function (app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.docs.name}.${
      app.get("config").files.docs.extension
    }`
  );
};

/**
 * Accepts a template file path and returns the path to the corresponding info file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - file path to a template file
 * @returns {string} file path to the corresponding info file
 */
export const getInfoPathFromTemplatePath = function (app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.info.name}.${
      app.get("config").files.info.extension
    }`
  );
};

/**
 * Accepts a template file path and returns the path to the corresponding schema file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - file path to a template file
 * @returns {string} file path to the corresponding schema file
 */
export const getSchemaPathFromTemplatePath = function (app, filePath) {
  return filePath.replace(
    path.basename(filePath),
    `${app.get("config").files.schema.name}.${
      app.get("config").files.schema.extension
    }`
  );
};

/**
 * Accepts a file path and checks if it is a mock file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - path to any type of file
 * @returns {boolean} is true if the given file is a mock file
 */
export const fileIsDataFile = function (app, filePath) {
  return (
    path.basename(filePath) ===
      `${app.get("config").files.mocks.name}.${
        app.get("config").files.mocks.extension
      }` ||
    getShortPathFromFullPath(app, filePath) ===
      `data.${app.get("config").files.mocks.extension}`
  );
};

/**
 * Accepts a file path and checks if it is a documentation file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - path to any type of file
 * @returns {boolean} is true if the given file is a doc file
 */
export const fileIsDocumentationFile = function (app, filePath) {
  return (
    filePath.replace(`${process.cwd()}/`, "") ===
      path.join(
        app.get("config").components.folder,
        `README.${app.get("config").files.docs.extension}`
      ) ||
    path.basename(filePath) ===
      `${app.get("config").files.docs.name}.${
        app.get("config").files.docs.extension
      }`
  );
};

/**
 * Accepts a file path and checks if it is an info file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - path to any type of file
 * @returns {boolean} is true if the given file is a info file
 */
export const fileIsInfoFile = function (app, filePath) {
  return (
    path.basename(filePath) ===
    `${app.get("config").files.info.name}.${
      app.get("config").files.info.extension
    }`
  );
};

/**
 * Accepts a file path and checks if it is a schema file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - path to any type of file
 * @returns {boolean} is true if the given file is a schema file
 */
export const fileIsSchemaFile = function (app, filePath) {
  return (
    path.basename(filePath) ===
    `${app.get("config").files.schema.name}.${
      app.get("config").files.schema.extension
    }`
  );
};

/**
 * Accepts a file path and checks if it is component js or css file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - path to any type of file
 * @returns {boolean} is true if the given file is a css or js file
 */
export const fileIsAssetFile = function (app, filePath) {
  return (
    path.basename(filePath) ===
      `${getResolvedFileName(
        app.get("config").files.css.name,
        path.basename(filePath, `.${app.get("config").files.css.extension}`)
      )}.${app.get("config").files.css.extension}` ||
    path.basename(filePath) ===
      `${getResolvedFileName(
        app.get("config").files.js.name,
        path.basename(filePath, `.${app.get("config").files.js.extension}`)
      )}.${app.get("config").files.js.extension}`
  );
};

/**
 * Accepts a file path and returns checks if it is a template file
 *
 * @param {object} app - the express instance
 * @param {string} filePath - path to any type of file
 * @returns {boolean} is true if the given file is a template file
 */
export const fileIsTemplateFile = function (app, filePath) {
  return (
    path.basename(filePath) ===
    `${getResolvedFileName(
      app.get("config").files.templates.name,
      path.basename(filePath, `.${app.get("config").files.templates.extension}`)
    )}.${app.get("config").files.templates.extension}`
  );
};

/**
 * @param {object} app - the express instance
 * @param {string} directoryPath - a component file path
 * @returns {string} the template file path
 */
export const getTemplateFilePathFromDirectoryPath = function (
  app,
  directoryPath
) {
  return path.join(
    directoryPath,
    `${getResolvedFileName(
      app.get("config").files.templates.name,
      path.basename(directoryPath)
    )}.${app.get("config").files.templates.extension}`
  );
};

/**
 * @param {object} app
 * @param {string} templateFilePath
 * @returns {string}
 */
export const getDirectoryPathFromFullTemplateFilePath = function (
  app,
  templateFilePath
) {
  return path.dirname(getShortPathFromFullPath(app, templateFilePath));
};

/**
 * Updates the config with smartly guessed template extension and/or template engine
 * if missing
 *
 * @param {object} config - the user configuration object
 * @returns {Promise<object>} the updated config
 */
export const updateConfigForRendererIfNecessary = async function (config) {
  if (
    config.engine &&
    config.engine.name &&
    !config.files.templates.extension
  ) {
    config = updateConfigWithGuessedExtensionBasedOnEngine(config);
  } else if (
    (!config.engine || (config.engine && !config.engine.name)) &&
    config.files.templates.extension
  ) {
    config = updateConfigWithGuessedEngineBasedOnExtension(config);
  } else if (
    (!config.engine || (config.engine && !config.engine.name)) &&
    !config.files.templates.extension
  ) {
    config = await updateConfigWithGuessedEngineAndExtensionBasedOnFiles(
      config
    );
  } else {
    log("info", messages.scanningFiles);
  }

  return config;
};

/**
 * Tries to guess the template files extension based on defined engine name.
 *
 * @param {object} config - the user configuration object
 * @returns {object|boolean} is either the updated config or false if guessing failed
 */
export const updateConfigWithGuessedExtensionBasedOnEngine = function (config) {
  log("info", messages.tryingToGuessExtensionBasedOnEngine);

  const engineFromConfig = guessExtensionFromEngine(config.engine.name);

  if (engineFromConfig) {
    config.files.templates.extension = engineFromConfig.extension;
    log(
      "warn",
      messages.templateExtensionGuessedBasedOnTemplateEngine.replace(
        "{{extension}}",
        config.files.templates.extension
      )
    );
    return config;
  } else {
    log("error", messages.guessingExtensionFailed);
    log("error", messages.missingExtension);
    return false;
  }
};

/**
 * Tries to guess the engine name based on defined template files extension.
 *
 * @param {object} config - the user configuration object
 * @returns {object|boolean} is either the updated config or false if guessing failed
 */
export const updateConfigWithGuessedEngineBasedOnExtension = function (config) {
  log("info", messages.tryingToGuessEngineBasedOnExtension);

  const guessedEngine = guessEngineFromExtension(
    config.files.templates.extension
  );

  if (guessedEngine) {
    config.engine.name = guessedEngine.engine;
    log(
      "warn",
      messages.engineGuessedBasedOnExtension.replace(
        "{{engine}}",
        config.engine.name
      )
    );
    return config;
  } else {
    log("error", messages.guessingEngineFailed);
    log("error", messages.missingEngine);
    return false;
  }
};

/**
 * Tries to guess the template files extension and engine name by scanning
 * the component folder and looking for possible template files.
 *
 * @param {object} config - the user configuration object
 * @returns {Promise<object|boolean>} is either the updated config or false if guessing failed
 */
export const updateConfigWithGuessedEngineAndExtensionBasedOnFiles =
  async function (config) {
    log("info", messages.tryingToGuessEngineAndExtension);
    log("info", messages.scanningFiles);

    const guessedConf = await guessEngineAndExtensionFromFiles(config);

    if (guessedConf) {
      log(
        "warn",
        messages.engineAndExtensionGuessedBasedOnFiles
          .replace("{{engine}}", guessedConf.engine.name)
          .replace("{{extension}}", guessedConf.files.templates.extension)
      );
      return deepMerge(config, guessedConf);
    } else {
      log("error", messages.guessingEngineAndExtensionFailed);
      log("error", messages.missingEngine);
      return false;
    }
  };

/**
 * Returns the engine name that belongs to a given extension
 *
 * @param {string} extension - the file extension from the user configuration
 * @returns {{engine: string, extension: string}} the related engine name
 */
function guessEngineFromExtension(extension) {
  return engines.find((engine) => engine.extension === extension);
}

/**
 * Returns the template files extension that belongs to a given engine
 *
 * @param {string} engineName - the engine name from the user configuration
 * @returns {{engine: string, extension: string}} the related template files extension
 */
function guessExtensionFromEngine(engineName) {
  return engines.find(({ engine }) => engine === engineName);
}

/**
 * Scans the files, tries to find template files and based on the result
 * returns an object with engine.name and files.templates.extension
 *
 * @param {object} config - the user configuration object
 * @returns {Promise<{files: object, engine: object}|null>} is either an object with `files` and `engine` or `null` if guessing failed
 */
async function guessEngineAndExtensionFromFiles(config) {
  const extensions = await getAllAvailableTemplateExtensions(
    Object.values(engines).map((engine) => engine.extension),
    config.components.folder,
    config.components.ignores
  );

  if (extensions.length === 1) {
    return {
      files: {
        templates: {
          extension: extensions[0],
        },
      },
      engine: {
        name: engines.find((engine) => engine.extension === extensions[0])
          .engine,
      },
    };
  }

  return null;
}

/**
 * Returns all extensions that belong to template files found in the components folder
 *
 * @param {Array} possibleExtensions - an array of possible template files extensions
 * @param {string} folder - the component folder from the user configuration
 * @param {Array} ignores - the folders to ignore from the user configuration
 * @returns {Promise<Array>} an array of template files extension found in the component folder
 */
async function getAllAvailableTemplateExtensions(
  possibleExtensions,
  folder,
  ignores
) {
  const extensions = await getFiles(folder, ignores, function (res) {
    const extname = path.extname(res);
    const extension = extname.startsWith(".") ? extname.slice(1) : extname;

    if (possibleExtensions.includes(extension)) {
      return extension;
    }

    return null;
  });

  return extensions
    ? extensions.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      })
    : [];
}
