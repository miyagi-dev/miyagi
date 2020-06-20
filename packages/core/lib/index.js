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
const getMergedConfig = require("./init/config.js");
const yargs = require("./init/args.js");
const mockGenerator = require("./generator/mocks");
const componentGenerator = require("./generator/component");
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
 * Checks if miyagi was started with `mocks` command
 *
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeMockGenerator(args) {
  return args._.includes("mocks");
}

/**
 * Checks if miyagi was started with `new` command
 *
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeComponentGenerator(args) {
  return args._.includes("new");
}

/**
 * Checks if miyagi was started with `build` command
 *
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeBuild(args) {
  return args._.includes("build");
}

/**
 * Checks if miyagi was started with `start` command
 *
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeServer(args) {
  return args._.includes("start");
}

/**
 * Converts and removes unnecessary cli args
 *
 * @param {object} args
 * @returns {object}
 */
function getCliArgs(args) {
  const cliArgs = { ...args };
  const buildArgs = {};

  delete cliArgs._;
  delete cliArgs.$0;

  if (cliArgs.folder) {
    buildArgs.folder = cliArgs.folder;
    delete cliArgs.folder;
  }

  if (cliArgs.outputFile) {
    buildArgs.outputFile = cliArgs.outputFile;
    delete cliArgs.outputFile;
  }

  cliArgs.build = buildArgs;

  if (cliArgs.assets) {
    if (cliArgs.assets.es6Modules) {
      cliArgs.assets.es6Modules = cliArgs.assets.es6Modules !== "false";
    }
  }

  return cliArgs;
}

/**
 * Returns all extensions that belong to template files found in the components folder
 *
 * @param {Array} possibleExtensions
 * @param {string} folder
 * @param {Array} ignores
 * @returns {Array}
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
 * @param {string} engineName
 * @returns {string}
 */
function guessExtensionFromEngine(engineName) {
  return engines.find(({ engine }) => engine === engineName);
}

/**
 * Returns the engine name that belongs to a given extension
 *
 * @param {string} extension
 * @returns {string}
 */
function guessEngineFromExtension(extension) {
  return engines.find((engine) => engine.extension === extension);
}

/**
 * Scans the files, tries to find template files and based on the result
 * returns an object with engine.name and files.templates.extension
 *
 * @param {object} config
 * @returns {object|null}
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
 * Requires the user config and initializes and calls correct modules based on command
 */
function Miyagi() {
  (async function () {
    const args = yargs.argv;
    const isServer = argsIncludeServer(args);
    const isBuild = argsIncludeBuild(args);
    const isComponentGenerator = argsIncludeComponentGenerator(args);
    const isMockGenerator = argsIncludeMockGenerator(args);

    if (isBuild || isComponentGenerator || isServer || isMockGenerator) {
      if (isBuild) {
        process.env.NODE_ENV = "production";
        log("info", messages.buildStarting);
      } else if (isComponentGenerator) {
        log("info", messages.generator.starting);
      } else if (isServer) {
        if (!process.env.NODE_ENV) {
          process.env.NODE_ENV = "development";
        }
        console.clear();
        log(
          "info",
          messages.serverStarting.replace("{{node_env}}", process.env.NODE_ENV)
        );
      }

      let userFile = {};

      try {
        userFile = require(path.resolve(process.cwd(), ".miyagi"));
      } catch (err) {
        log("warn", messages.userConfigUnparseable);
      }

      let userConfig = deepMerge(userFile, getCliArgs(args));

      userConfig.isBuild = isBuild;
      userConfig.isComponentGenerator = isComponentGenerator;

      delete userConfig._;

      const config = getMergedConfig(userConfig);

      if (isMockGenerator) {
        mockGenerator(args._.slice(1)[0], config.files);
      } else {
        if (isComponentGenerator) {
          if (config.files.templates && config.files.templates.extension) {
            componentGenerator(args, config);
          } else {
            log("error", messages.missingExtension);
          }
        } else if (config.engine && config.engine.name) {
          if (config.files.templates.extension) {
            log("info", messages.scanningFiles);
            init(config);
          } else {
            log("info", messages.tryingToGuessExtensionBasedOnEngine);

            const engineFromConfig = guessExtensionFromEngine(
              config.engine.name
            );

            if (engineFromConfig) {
              config.files.templates.extension = engineFromConfig.extension;
              log(
                "warn",
                messages.templateExtensionGuessedBasedOnTemplateEngine.replace(
                  "{{extension}}",
                  config.files.templates.extension
                )
              );
              log("info", messages.scanningFiles);
              init(config);
            } else {
              log("error", messages.guessingExtensionFailed);
              log("error", messages.missingExtension);
            }
          }
        } else if (config.files.templates.extension) {
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
            init(config);
          } else {
            log("error", messages.guessingEngineFailed);
            log("error", messages.missingEngine);
          }
        } else {
          log("info", messages.tryingToGuessEngineAndExtension);

          const guessedConf = await guessEngineAndExtensionFromFiles(config);
          log("info", messages.scanningFiles);

          if (guessedConf) {
            log(
              "warn",
              messages.engineAndExtensionGuessedBasedOnFiles
                .replace("{{engine}}", guessedConf.engine.name)
                .replace("{{extension}}", guessedConf.files.templates.extension)
            );
            init(deepMerge(config, guessedConf));
          } else {
            log("error", messages.guessingEngineAndExtensionFailed);
            log("error", messages.missingEngine);
          }
        }
      }
    } else {
      log("error", messages.commandNotFound);
    }
  })();
}

module.exports = new Miyagi();
