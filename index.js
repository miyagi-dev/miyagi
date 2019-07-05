const fs = require("fs");
const appConfig = require("./src/config.json");
const init = require("./src/init.js");
const logger = require("./src/logger.js");

function Roundup() {
  if (process.env.NODE_ENV) {
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
