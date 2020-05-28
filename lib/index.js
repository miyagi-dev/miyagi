const path = require("path");
const deepMerge = require("deepmerge");
const { messages } = require("./config.json");
const init = require("./init");
const log = require("./logger.js");
const helpers = require("./helpers.js");
const getMergedConfig = require("./init/config.js");
const yargs = require("./init/args.js");
const dataGenerator = require("./data-generator");
const generator = require("./generator");

/* preload rendering modules */
require("./render/_helpers.js");
require("./render");
require("./render/tests.json");
require("./render/menu/_classes.js");
require("./render/menu/_helpers.js");
require("./render/menu/component.js");
require("./render/menu/directory.js");
require("./render/menu");
require("./render/menu/list-item.js");
require("./render/menu/list.js");
require("./render/menu/menu-item.js");
require("./render/menu/toggle.js");
require("./render/menu/variation-link.js");
require("./render/menu/variations.js");

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

function Headman() {
  const args = yargs.argv;
  const isServer = helpers.isServer(args);
  const isBuild = helpers.isBuild(args);
  const isGenerator = helpers.isGenerator(args);
  const isDataGenerator = helpers.isDataGenerator(args);

  if (isBuild || isGenerator || isServer || isDataGenerator) {
    if (isBuild) {
      process.env.NODE_ENV = "production";
      log("info", messages.buildStarting);
    } else if (isGenerator) {
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

    let userFile = {
      config: {},
    };

    try {
      userFile = require(path.resolve(process.cwd(), ".headman"));
    } catch (err) {
      log("warn", messages.userConfigUnparseable);
    }

    const config = deepMerge(userFile, getCliArgs(args));

    config.isBuild = isBuild;
    config.isGenerator = isGenerator;

    delete config._;

    if (isDataGenerator) {
      dataGenerator(args._.slice(1), getMergedConfig(config));
    } else if (isGenerator) {
      if (config.files.templates && config.files.templates.extension) {
        generator(args, getMergedConfig(config));
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
          !config.components ||
          (config.components && config.components.folder === undefined)
        ) {
          log("warn", messages.missingSrcFolder);
        }

        log("info", messages.scanningFiles);

        init(getMergedConfig(config));
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
