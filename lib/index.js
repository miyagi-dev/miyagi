"use strict";

const fs = require("fs");
const { messages, userConfigFile } = require("./config.json");
const init = require("./init");
const logger = require("./logger.js");
const helpers = require("./helpers.js");
const getMergedConfig = require("./init/config.js");

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
  if (process.env.NODE_ENV || helpers.isBuild() || helpers.isGenerator()) {
    if (helpers.isBuild()) {
      process.env.NODE_ENV = "production";
      logger.log("info", messages.buildStarting);
    } else if (helpers.isGenerator()) {
      logger.log("info", messages.generator.starting);
    } else {
      logger.log("info", messages.serverStarting);
    }

    fs.readFile(`./${userConfigFile}`, "utf8", (err, result) => {
      if (result) {
        let userConfig = {};

        try {
          userConfig = JSON.parse(result);
        } catch (e) {
          return logger.log(
            "error",
            messages.serverStartedButUserConfigUnparseable
          );
        }

        if (userConfig.srcFolder === undefined) {
          logger.log("warn", messages.missingSrcFolder);
        }

        if (helpers.isGenerator()) {
          if (userConfig.extension) {
            require("./generator")(
              process.argv.slice(3),
              getMergedConfig(userConfig)
            );
          } else {
            logger.log("error", messages.missingExtension);
          }
        } else {
          if (!userConfig.extension) {
            logger.log("error", messages.missingExtension);
          } else if (!userConfig.engine) {
            logger.log("error", messages.missingEngine);
          } else {
            init(getMergedConfig(userConfig));
          }
        }
      } else {
        logger.log("error", messages.userConfigNotFound);
      }
    });
  } else {
    return logger.log("error", messages.nodeEnvNotDefined);
  }
}

module.exports = new Headman();
