"use strict";

const fs = require("fs");
const appConfig = require("./config.json");
const init = require("./init/index.js");
const logger = require("./logger.js");

/* preload rendering modules */
require("./render/_helpers.js");
require("./render/index.js");
require("./render/tests.json");
require("./render/menu/_classes.js");
require("./render/menu/_helpers.js");
require("./render/menu/component.js");
require("./render/menu/directory.js");
require("./render/menu/index.js");
require("./render/menu/list-item.js");
require("./render/menu/list.js");
require("./render/menu/menu-item.js");
require("./render/menu/toggle.js");
require("./render/menu/variation-link.js");
require("./render/menu/variations.js");

function Roundup() {
  if (process.env.NODE_ENV) {
    logger.log("info", appConfig.messages.serverStarting);
    fs.readFile(`./${appConfig.userConfigFile}`, "utf8", (err, result) => {
      if (result) {
        let userConfig;

        try {
          userConfig = JSON.parse(result);

          if (!userConfig.extension) {
            logger.log("error", appConfig.messages.missingExtension);
          } else if (!userConfig.srcFolder) {
            logger.log("error", appConfig.messages.missingSrcFolder);
          } else if (!userConfig.engine) {
            logger.log("error", appConfig.messages.missingEngine);
          } else {
            init(appConfig, userConfig);
          }
        } catch (e) {
          return logger.log(
            "error",
            appConfig.messages.serverStartedButUserConfigUnparseable
          );
        }
      } else {
        logger.log("error", appConfig.messages.userConfigNotFound);
      }
    });
  } else {
    return logger.log("error", appConfig.messages.nodeEnvNotDefined);
  }
}

module.exports = new Roundup();
