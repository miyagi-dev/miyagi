"use strict";

const path = require("path");
const fs = require("fs");
const util = require("util");
const deepMerge = require("deepmerge");
const { messages, userConfigFile } = require("./config.json");
const init = require("./init");
const logger = require("./logger.js");
const helpers = require("./helpers.js");
const getMergedConfig = require("./init/config.js");
const yargs = require("./init/args.js");

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
  const cliArgs = {};

  if (args.folder) {
    cliArgs.build = {
      folder: args.folder,
    };
  }
  if (args.assetFolder) {
    cliArgs.assetFolder = args.assetFolder.includes(",")
      ? args.assetFolder.split(",")
      : args.assetFolder;
  }
  if (args.cssFiles) {
    cliArgs.cssFiles = args.cssFiles.includes(",")
      ? args.cssFiles.split(",")
      : args.cssFiles;
  }
  if (args.files) {
    cliArgs.files = args.files;
  }
  if (args.es6Modules) {
    cliArgs.es6Modules = args.es6Modules == "false" ? false : true;
  }
  if (args.jsFiles) {
    cliArgs.jsFiles = args.jsFiles.includes(",")
      ? args.jsFiles.split(",")
      : args.jsFiles;
  }
  if (args.projectName) {
    cliArgs.projectName = args.projectName;
  }
  if (args.reload) {
    cliArgs.reload = args.reload == "false" ? false : true;
  }
  if (args.srcFolder) {
    cliArgs.srcFolder = args.srcFolder;
  }
  if (args.srcFolderIgnores) {
    cliArgs.srcFolderIgnores = args.srcFolderIgnores.split(",");
  }
  if (args.theme) {
    cliArgs.theme = args.theme;
  }
  if (args.validations) {
    cliArgs.validations = args.validations;
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
      logger.log("info", messages.buildStarting);
    } else if (isGenerator) {
      logger.log("info", messages.generator.starting);
    } else if (isServer) {
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = "development";
      }
      logger.log(
        "info",
        messages.serverStarting.replace("${node_env}", process.env.NODE_ENV)
      );
    }

    let userFile = {
      config: {},
    };

    try {
      userFile = require(path.resolve(process.cwd(), userConfigFile));
    } catch (err) {
      logger.log("warn", messages.userConfigUnparseable);
    }

    const config = deepMerge(userFile.config, getCliArgs(args));

    config.isBuild = isBuild;
    config.isGenerator = isGenerator;

    delete config._;

    if (isDataGenerator) {
      require("./data-generator")(args._.slice(1), getMergedConfig(config));
    } else if (isGenerator) {
      if (config.files.templates && config.files.templates.extension) {
        require("./generator")(args, getMergedConfig(config));
      } else {
        logger.log("error", messages.missingExtension);
      }
    } else if (config.files && config.files.templates) {
      if (!config.files.templates.extension || !config.files.templates.engine) {
        if (!config.files.templates.extension)
          logger.log("error", messages.missingExtension);
        if (!config.files.templates.engine)
          logger.log("error", messages.missingEngine);
      } else {
        if (config.srcFolder === undefined) {
          logger.log("warn", messages.missingSrcFolder);
        }

        logger.log("info", messages.scanningFiles);

        init(getMergedConfig(config), userFile.plugins);
      }
    } else {
      logger.log("error", messages.missingEngineAndExtension);
    }
  } else {
    logger.log("error", messages.commandNotFound);
  }
}

module.exports = new Headman();
