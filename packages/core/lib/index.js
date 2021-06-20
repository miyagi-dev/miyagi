/**
 * The miyagi module
 *
 * @module index
 */

const path = require("path");
const deepMerge = require("deepmerge");
const { messages, engines } = require("./config.json");
const init = require("./init");
const log = require("./logger.js");
const yargs = require("./init/args.js");
const mockGenerator = require("./generator/mocks");
const componentGenerator = require("./generator/component");
const getConfig = require("./config.js");
const { lint } = require("./cli");
const { getFiles } = require("./state/helpers.js");

/* preload rendering modules */
require("./render/helpers.js");
require("./render");
require("./render/tests.json");
require("./render/menu/classes.js");
require("./render/menu/helpers.js");
require("./render/menu/component.js");
require("./render/menu/directory.js");
require("./render/menu");
require("./render/menu/list-item.js");
require("./render/menu/list.js");
require("./render/menu/menu-item.js");
require("./render/menu/toggle.js");
require("./render/menu/variation-link.js");
require("./render/menu/variations.js");

/**
 * Checks if miyagi was started with "mocks" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "mocks"
 */
function argsIncludeMockGenerator(args) {
  return args._.includes("mocks");
}

/**
 * Checks if miyagi was started with "new" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "new"
 */
function argsIncludeComponentGenerator(args) {
  return args._.includes("new");
}

/**
 * Checks if miyagi was started with "build" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "new"
 */
function argsIncludeBuild(args) {
  return args._.includes("build");
}

/**
 * Checks if miyagi was started with "start" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "start"
 */
function argsIncludeServer(args) {
  return args._.includes("start");
}

/**
 * Checks if miyagi was started with "lint" command
 *
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeLint(args) {
  return args._.includes("lint");
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

  return extensions.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });
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
 * Returns the engine name that belongs to a given extension
 *
 * @param {string} extension - the file extension from the user configuration
 * @returns {{engine: string, extension: string}} the related engine name
 */
function guessEngineFromExtension(extension) {
  return engines.find((engine) => engine.extension === extension);
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
 * Runs the component generator
 *
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 */
async function runComponentGenerator(config, args) {
  config = await updateConfigForComponentGeneratorIfNecessary(config, args);

  if (config) {
    componentGenerator(args, config);
  }
}

/**
 * Runs the mock generator
 *
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 */
function runMockGenerator(config, args) {
  mockGenerator(args._.slice(1)[0], config.files);
}

/**
 * Runs the renderer to either start the server or create a build
 *
 * @param {object} config - the user configuration object
 */
async function initRendering(config) {
  config = await updateConfigForRendererIfNecessary(config);

  if (config) {
    init(config);
  }
}

/**
 * @param {object} config
 */
async function initApi(config) {
  config = await updateConfigForRendererIfNecessary(config);

  return await require("../api/app")(config);
}

/**
 * Tries to guess the template files extension based on defined engine name.
 *
 * @param {object} config - the user configuration object
 * @returns {object|boolean} is either the updated config or false if guessing failed
 */
function updateConfigWithGuessedExtensionBasedOnEngine(config) {
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
}

/**
 * Tries to guess the engine name based on defined template files extension.
 *
 * @param {object} config - the user configuration object
 * @returns {object|boolean} is either the updated config or false if guessing failed
 */
function updateConfigWithGuessedEngineBasedOnExtension(config) {
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
}

/**
 * Tries to guess the template files extension and engine name by scanning
 * the component folder and looking for possible template files.
 *
 * @param {object} config - the user configuration object
 * @returns {Promise<object|boolean>} is either the updated config or false if guessing failed
 */
async function updateConfigWithGuessedEngineAndExtensionBasedOnFiles(config) {
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
}

/**
 * Updates the config with smartly guessed template extension if missing
 * and tpls are not skipped for generating a component
 *
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 * @returns {Promise<object>} the updated config
 */
async function updateConfigForComponentGeneratorIfNecessary(config, args) {
  if (
    !config.files.templates.extension &&
    ((args.only && args.only.includes("tpl")) ||
      (args.skip && !args.skip.includes("tpl")) ||
      !args.skip)
  ) {
    if (config.engine && config.engine.name) {
      config = updateConfigWithGuessedExtensionBasedOnEngine(config);
    } else {
      config = await updateConfigWithGuessedEngineAndExtensionBasedOnFiles(
        config
      );
    }
  }

  return config;
}

/**
 * Updates the config with smartly guessed template extension and/or template engine
 * if missing
 *
 * @param {object} config - the user configuration object
 * @returns {Promise<object>} the updated config
 */
async function updateConfigForRendererIfNecessary(config) {
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
}

/**
 * Requires the user config and initializes and calls correct modules based on command
 */
module.exports = async function Miyagi(cmd) {
  if (cmd === "api") {
    process.env.NODE_ENV = "development";

    const config = getConfig();

    return await initApi(config);
  } else {
    const args = yargs.argv;
    const isServer = argsIncludeServer(args);
    const isBuild = argsIncludeBuild(args);
    const isComponentGenerator = argsIncludeComponentGenerator(args);
    const isMockGenerator = argsIncludeMockGenerator(args);
    const isLinter = argsIncludeLint(args);

    if (isLinter) {
      lint(args);
    } else if (isBuild || isComponentGenerator || isServer || isMockGenerator) {
      if (isBuild) {
        process.env.NODE_ENV = "production";
        log("info", messages.buildStarting);
      } else {
        if (!process.env.NODE_ENV) {
          process.env.NODE_ENV = "development";
        }

        if (isComponentGenerator) {
          log("info", messages.generator.starting);
        } else if (isServer) {
          log(
            "info",
            messages.serverStarting.replace(
              "{{node_env}}",
              process.env.NODE_ENV
            )
          );
        }
      }

      const config = getConfig(args, isBuild, isComponentGenerator);

      if (isMockGenerator) {
        runMockGenerator(config, args);
      } else if (isComponentGenerator) {
        runComponentGenerator(config, args);
      } else {
        return initRendering(config);
      }
    } else {
      log("error", messages.commandNotFound);
      process.exit(1);
    }
  }
};
