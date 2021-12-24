/**
 * The miyagi module
 *
 * @module index
 */

import { messages } from "./miyagi-config.js";
import initRendering from "./init/rendering.js";
import log from "./logger.js";
import yargs from "./init/args.js";
import mockGenerator from "./generator/mocks.js";
import componentGenerator from "./generator/component.js";
import getConfig from "./config.js";
import { lint } from "./cli/index.js";
import {
  updateConfigForRendererIfNecessary,
  updateConfigWithGuessedExtensionBasedOnEngine,
  updateConfigWithGuessedEngineAndExtensionBasedOnFiles,
} from "./helpers.js";

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
 * @param {object} config
 */
async function initApi(config) {
  const { default: api } = await import("../api/app.js");

  config = await updateConfigForRendererIfNecessary(config);

  return await api(config);
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
 * Requires the user config and initializes and calls correct modules based on command
 */
export default async function Miyagi(cmd) {
  if (cmd === "api") {
    process.env.NODE_ENV = "development";

    const config = await getConfig();

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

      const config = await getConfig(args, isBuild, isComponentGenerator);

      if (isMockGenerator) {
        runMockGenerator(config, args);
      } else if (isComponentGenerator) {
        runComponentGenerator(config, args);
      } else {
        return await initRendering(config);
      }
    } else {
      log("error", messages.commandNotFound);
      process.exit(1);
    }
  }
}
