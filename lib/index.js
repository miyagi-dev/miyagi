"use strict";

const fs = require("fs");
const { messages, userConfigFile } = require("./config.json");
const init = require("./init");
const logger = require("./logger.js");

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
  if (process.env.NODE_ENV) {
    logger.log("info", messages.serverStarting);
    fs.readFile(`./${userConfigFile}`, "utf8", (err, result) => {
      if (result) {
        let userConfig;

        try {
          userConfig = JSON.parse(result);

          if (!userConfig.extension) {
            logger.log("error", messages.missingExtension);
          } else if (userConfig.srcFolder === undefined) {
            logger.log("error", messages.missingSrcFolder);
          } else if (!userConfig.engine) {
            logger.log("error", messages.missingEngine);
          } else {
            init(userConfig);
          }
        } catch (e) {
          return logger.log(
            "error",
            messages.serverStartedButUserConfigUnparseable
          );
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
