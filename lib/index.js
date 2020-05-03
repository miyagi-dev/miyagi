"use strict";

const fs = require("fs");
const util = require("util");
const { messages, userConfigFile } = require("./config.json");
const init = require("./init");
const logger = require("./logger.js");
const helpers = require("./helpers.js");
const getMergedConfig = require("./init/config.js");
const args = require("minimist")(process.argv.slice(2));

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

function Headman() {
  const isBuild = helpers.isBuild(args);
  const isGenerator = helpers.isGenerator(args);

  if (process.env.NODE_ENV || isBuild || isGenerator) {
    if (isBuild) {
      process.env.NODE_ENV = "production";
      logger.log("info", messages.buildStarting);
    } else if (isGenerator) {
      logger.log("info", messages.generator.starting);
    } else {
      logger.log("info", messages.serverStarting);
    }

    fs.readFile(`./${userConfigFile}`, "utf8", (err, result) => {
      const cliArgs = {};
      let userConfig = {};

      if (!err) {
        try {
          userConfig = JSON.parse(result);
        } catch (e) {
          logger.log("error", messages.userConfigUnparseable);
        }
      }

      if (args.buildFolder) {
        cliArgs.buildFolder = args.buildFolder;
      }
      if (args.engine) {
        cliArgs.engine = args.engine;
      }
      if (args.es6Modules) {
        cliArgs.es6Modules = args.es6Modules == "false" ? false : true;
      }
      if (args.extension) {
        cliArgs.extension = args.extension;
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

      const config = Object.assign({}, userConfig, cliArgs);

      config.isBuild = isBuild;
      config.isGenerator = isGenerator;

      delete config._;

      if (isGenerator) {
        if (config.extension) {
          require("./generator")(args._.slice(1), getMergedConfig(config));
        } else {
          logger.log("error", messages.missingExtension);
        }
      } else {
        if (!config.extension || !config.engine) {
          if (!config.extension) logger.log("error", messages.missingExtension);
          if (!config.engine) logger.log("error", messages.missingEngine);
        } else {
          if (config.srcFolder === undefined) {
            logger.log("warn", messages.missingSrcFolder);
          }
          init(getMergedConfig(config));
        }
      }
    });
  } else {
    return logger.log("error", messages.nodeEnvNotDefined);
  }
}

module.exports = new Headman();
