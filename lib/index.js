/**
 * The headman module
 * @module index
 */

const path = require("path");
const deepMerge = require("deepmerge");
const { messages } = require("./config.json");
const init = require("./init");
const log = require("./logger.js");
const getMergedConfig = require("./init/config.js");
const yargs = require("./init/args.js");
const mockGenerator = require("./generator/mocks");
const componentGenerator = require("./generator/component");

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
 * Checks if headman was started with `mocks` command
 * @param {Object} args
 * @returns {Boolean}
 */
function argsIncludeMockGenerator(args) {
  return args._.includes("mocks");
}

/**
 * Checks if headman was started with `new` command
 * @param {Object} args
 * @returns {Boolean}
 */
function argsIncludeComponentGenerator(args) {
  return args._.includes("new");
}

/**
 * Checks if headman was started with `build` command
 * @param {Object} args
 * @returns {Boolean}
 */
function argsIncludeBuild(args) {
  return args._.includes("build");
}

/**
 * Checks if headman was started with `start` command
 * @param {Object} args
 * @returns {Boolean}
 */
function argsIncludeServer(args) {
  return args._.includes("start");
}

/**
 * Converts and removes unnecessary cli args
 * @param {Object} args
 * @returns {Object}
 */
function getCliArgs(args) {
  const cliArgs = { ...args };

  delete cliArgs._;
  delete cliArgs.$0;

  if (cliArgs.folder) {
    cliArgs.build = {
      folder: cliArgs.folder,
    };

    delete cliArgs.folder;
  }

  if (cliArgs.assets) {
    if (cliArgs.assets.es6Modules) {
      cliArgs.assets.es6Modules = cliArgs.assets.es6Modules !== "false";
    }
  }

  return cliArgs;
}

/**
 * Requires the user config and initializes and calls correct modules based on command
 */
function Headman() {
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
      log(
        "info",
        messages.serverStarting.replace("{{node_env}}", process.env.NODE_ENV)
      );
    }

    let userFile = {};

    try {
      userFile = require(path.resolve(process.cwd(), ".headman"));
    } catch (err) {
      log("error", err);
      log("warn", messages.userConfigUnparseable);
    }

    let userConfig = deepMerge(userFile, getCliArgs(args));

    userConfig.isBuild = isBuild;
    userConfig.isComponentGenerator = isComponentGenerator;

    delete userConfig._;

    const config = getMergedConfig(userConfig);

    if (isMockGenerator) {
      mockGenerator(args._.slice(1)[0], config.files);
    } else if (isComponentGenerator) {
      if (config.files.templates && config.files.templates.extension) {
        componentGenerator(args, config);
      } else {
        log("error", messages.missingExtension);
      }
    } else if (config.engine && config.engine.name) {
      if (
        config.files &&
        config.files.templates &&
        config.files.templates.extension
      ) {
        if (
          !userConfig.components ||
          (userConfig.components && userConfig.components.folder === undefined)
        ) {
          log("warn", messages.missingSrcFolder);
        }

        log("info", messages.scanningFiles);

        init(config);
      } else {
        log("error", messages.missingExtension);
      }
    } else {
      log("error", messages.missingEngine);
    }
  } else {
    log("error", messages.commandNotFound);
  }
}

module.exports = new Headman();
